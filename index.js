const inquirer = require('inquirer');
const OSS = require('ali-oss');
const debug = require('debug')('uio:index');

const { get, set } = require('./lib/config');
const uploadAFolderToOss = require('./lib/uploadFloderImageToOss');
const { init_questions } = require('./lib/inquirer');
const { logError, renderKVObjects, cleanupFalselyKey } = require('./lib/util');

/**
 * module.exports
 */
module.exports = uio;

const defaultOpts = {
  // configPath: null,
  rootPath: process.cwd(),
  foldername: get('foldername'),
  prefix: get('pp') || get('prefix'),
  urlPrefix: get('upp') || get('url_prefix'),
  flatten: false,
  crypto: false,
  onlyImage: false,
};

/**
 *
 * @param {config} data
 */
function uio(opts) {
  this.init();

  const mixinOpts = {
    ...defaultOpts,
    ...cleanupFalselyKey(opts),
  };

  const {
    filename,
    foldername,
    crypto,
    flatten,
    rootPath,
    onlyImage,
  } = mixinOpts;
  debug(`mixinOptions: ${mixinOpts}

    filename: ${filename},
    foldername: ${foldername},
    crypto: ${crypto},
    flatten: ${flatten}
  `);
  const { oss } = this;

  if (!filename && !foldername) {
    logError(`
filename or foldername must be exist !!!
`);
    return;
  }

  if (foldername) {
    return uploadAFolderToOss({
      crypto,
      flatten,
      foldername,
      rootPath,
      client: oss,
      onlyImage,
    });
  }

  if (filename) {
    logError('还没接入呢');
    return;
  }
}

uio.prototype.init = function () {
  const ossOpts = {
    region: this.getConfig('rr') || this.getConfig('region'),
    accessKeyId: this.getConfig('aki') || this.getConfig('accessKeyId'),
    accessKeySecret: this.getConfig('aks') || this.getConfig('accessKeySecret'),
    bucket: this.getConfig('bt') || this.getConfig('bucket'),
  };
  this.oss = new OSS(ossOpts);
};

uio.prototype.setConfig = function (key, value) {
  return set(key, value);
};

uio.prototype.getConfig = function (key) {
  return get(key);
};

uio.initConfig = function () {
  return inquirer
    .prompt(init_questions)
    .then((answers) => {
      Object.keys(answers).forEach((answer) => {
        set(answer, answers[answer]);
      });
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        logError(`Prompt couldn't be rendered in the current environment`);
      } else {
        // Something else when wrong
        logError(error);
      }
    });
};

uio.getConfig = function () {
  return renderKVObjects(
    init_questions
      .map((item) => item.name)
      .reduce((prev, next) => {
        prev[next] = get(next);
        return prev;
      }, {}),

    '所有配置的config \n'
  );
};

uio.set = set;
uio.get = get;
