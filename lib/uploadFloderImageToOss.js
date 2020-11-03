/**
 * @author zwkang
 * @description 简单的上传文件夹
 */

const recursiveReaddir = require('recursive-readdir');
const path = require('path');

const debug = require('debug')('uio:uploadFolderImageToOss');

const {
  logError,
  renderKVObjects,
  composeAction,
  compactUrl,
  getUuid,
} = require('./util');
const { get } = require('./config');
const Upload = require('./upload.base');

const upload = new Upload();

function resolvePath(rootPath, foldername) {
  return path.resolve(rootPath, foldername);
}

async function getAFolderAllFiles(rootPath, foldername) {
  const result = await recursiveReaddir(resolvePath(rootPath, foldername));
  return result;
}

function calcRelativePath(localFileToBucketRelativePath, { rootPath }) {
  const resolvedPath = path.relative(rootPath, localFileToBucketRelativePath);
  return resolvedPath;
}

function flattenPath(localFileToBucketRelativePath, { flatten }) {
  debug(
    `localFileToBucketRelativePath: ${localFileToBucketRelativePath}`,
    `basename: ${path.basename(localFileToBucketRelativePath)}`
  );

  if (flatten) {
    const basename = path.basename(localFileToBucketRelativePath);
    return basename;
  }
  return localFileToBucketRelativePath;
}

function cryptoPath(localFileToBucketRelativePath, { enCrypto }) {
  if (enCrypto) {
    const filename = `${getUuid()}${path.extname(
      localFileToBucketRelativePath
    )}`;
    const dirname = path.dirname(localFileToBucketRelativePath);
    if (dirname === '.') {
      return filename;
    }
    return `${dirname}${path.sep}${filename}`;
  }

  return localFileToBucketRelativePath;
}

function prefixPath(localFileToBucketRelativePath, { ignore, prefix }) {
  return compactUrl(ignore, prefix, localFileToBucketRelativePath);
}

const handleFunctions = [calcRelativePath, flattenPath, cryptoPath, prefixPath];

const handleCompose = composeAction(...handleFunctions);

async function uploadAFolderToOss({
  enCrypto = false,
  flatten = false,
  ignore = false,
  foldername,
  rootPath,
  client,
  onlyImage,
}) {
  console.log(enCrypto, flatten, foldername);

  const allFolderFilePath = await getAFolderAllFiles(rootPath, foldername);
  // 只上传jpeg png jpg
  let filteredExtnameFiles = allFolderFilePath;
  if (onlyImage) {
    filteredExtnameFiles = allFolderFilePath.filter((filePath) => {
      return (
        path.extname(filePath) === '.png' ||
        path.extname(filePath) === '.jpg' ||
        path.extname(filePath) === '.jpeg'
      );
    });
  }

  let localFileToBucketRelativePaths = filteredExtnameFiles;

  const prefix = get('pp') || get('prefix');
  const urlPrefix = get('upp') || get('url_prefix');

  const renderIntoConsole = {};

  localFileToBucketRelativePaths = localFileToBucketRelativePaths.map(
    (localFileToBucketRelativePath) => {
      return handleCompose(localFileToBucketRelativePath, {
        prefix,
        ignore,
        encrypto: enCrypto,
        flatten,
        rootPath,
      });
    }
  );

  try {
    await Promise.all(
      filteredExtnameFiles.map(async (relativePath, _index) => {
        if (urlPrefix) {
          renderIntoConsole[relativePath] = compactUrl(
            ignore,
            urlPrefix,
            localFileToBucketRelativePaths[_index]
          );
        } else {
          renderIntoConsole[
            relativePath
          ] = `${localFileToBucketRelativePaths[_index]}`;
        }
        return await upload.upload(
          localFileToBucketRelativePaths[_index],
          client,
          relativePath
        );
      })
    );
  } catch (e) {
    logError(e.message);
    return;
  }

  renderKVObjects(renderIntoConsole, '上传的对照表');
}

module.exports = uploadAFolderToOss;
