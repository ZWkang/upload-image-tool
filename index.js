const inquirer = require('inquirer');
const OSS = require('ali-oss');
const debug = require('debug')('uio:index');

const { get, set } = require('./config');
const pkg = require('./package.json');
const uploadAFloderToOss = require('./uploadFloderImageToOss');
const { init_questions } = require('./inquirer.question');
const { logError, renderKVObjects, cleanupFalselyKey } = require('./util');

/**
 * module.exports
 */
module.exports = uio;

const defaultOpts = {
  // configPath: null,
  rootPath: process.cwd(),
  flodername: get('flodername'),
  prefix: get('pp') || get('prefix'),
  urlPrefix: get('upp') || get('url_prefix'),
  flatten: false,
  encrypto: false,
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

  const { filename, flodername, encrypto, flatten, rootPath } = mixinOpts;
  debug(`mixinOptions: `, mixinOpts);

  debug(`
  filename: ${filename},
  flodername: ${flodername},
  encrypto: ${encrypto},
  flatten: ${flatten}s
  `);
  const { oss } = this;

  if (!filename && !flodername) {
    logError(`
filename or flodername must be exist !!!
`);
    return;
  }

  if (flodername) {
    return uploadAFloderToOss({
      encrypto,
      flatten,
      flodername,
      rootPath,
      client: oss,
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
