/**
 * @author zwkang
 * @description 简单的上传文件夹
 */

const recursiveReddir = require('recursive-readdir');
const path = require('path');

const debug = require('debug')('uio:uploadFloderImageToOss');

const {
  logError,
  renderKVObjects,
  composefunc,
  compactUrl,
  getuuid,
} = require('./util');
const { get } = require('./config');
const Upload = require('./upload.base');

const upload = new Upload();

function resolvePath(rootPath, flodername) {
  return path.resolve(rootPath, flodername);
}

async function getAFloderAllFiles(rootPath, flodername) {
  const result = await recursiveReddir(resolvePath(rootPath, flodername));
  return result;
}

function calcRelativePath(localfileToBucketRelativePath, { rootPath }) {
  const resolvedPath = path.relative(rootPath, localfileToBucketRelativePath);
  return resolvedPath;
}

function flattenPath(localfileToBucketRelativePath, { flatten }) {
  debug(
    `localfileToBucketRelativePath: ${localfileToBucketRelativePath}`,
    `basename: ${path.basename(localfileToBucketRelativePath)}`
  );

  if (flatten) {
    const basename = path.basename(localfileToBucketRelativePath);
    return basename;
  }
  return localfileToBucketRelativePath;
}

function encryptoPath(localfileToBucketRelativePath, { encrypto }) {
  if (encrypto) {
    const filename = `${getuuid()}${path.extname(
      localfileToBucketRelativePath
    )}`;
    const dirname = path.dirname(localfileToBucketRelativePath);
    if (dirname === '.') {
      return filename;
    }
    return `${dirname}${path.sep}${filename}`;
  }

  return localfileToBucketRelativePath;
}

function prefixPath(localfileToBucketRelativePath, { ingore, prefix }) {
  return compactUrl(ingore, prefix, localfileToBucketRelativePath);
}

const handleFunctions = [
  calcRelativePath,
  flattenPath,
  encryptoPath,
  prefixPath,
];

const handleCompose = composefunc(...handleFunctions);

async function uploadAFloderToOss({
  encrypto = false,
  flatten = false,
  ignore = false,
  flodername,
  rootPath,
  client,
}) {
  console.log(encrypto, flatten, flodername);

  const allFloderFilePath = await getAFloderAllFiles(rootPath, flodername);
  // 只上传jpeg png jpg
  const filteredExtnameFiles = allFloderFilePath.filter((filePath) => {
    return (
      path.extname(filePath) === '.png' ||
      path.extname(filePath) === '.jpg' ||
      path.extname(filePath) === '.jpeg'
    );
  });

  let localfileToBucketRelativePaths = filteredExtnameFiles;

  const prefix = get('pp') || get('prefix');
  const urlPrefix = get('upp') || get('url_prefix');

  const renderIntoConsole = {};

  localfileToBucketRelativePaths = localfileToBucketRelativePaths.map(
    (localfileToBucketRelativePath) => {
      return handleCompose(localfileToBucketRelativePath, {
        prefix,
        ignore,
        encrypto,
        flatten,
        rootPath,
      });
    }
  );

  try {
    await Promise.all(
      filteredExtnameFiles.map(async (relativepath, _index) => {
        if (urlPrefix) {
          renderIntoConsole[relativepath] = compactUrl(
            ignore,
            urlPrefix,
            localfileToBucketRelativePaths[_index]
          );
        } else {
          renderIntoConsole[
            relativepath
          ] = `${localfileToBucketRelativePaths[_index]}`;
        }
        return await upload.upload(
          localfileToBucketRelativePaths[_index],
          client,
          relativepath
        );
      })
    );
  } catch (e) {
    logError(e.message);
    return;
  }

  renderKVObjects(renderIntoConsole, '上传的对照表');
}

module.exports = uploadAFloderToOss;
