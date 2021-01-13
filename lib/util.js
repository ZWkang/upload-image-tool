const uuid = require('uuid');
const chalk = require('chalk');
const path = require('path');

function log(...arg) {
  console.log(...arg);
}

const util = {
  isRelativePath: (path) => {
    return /\.|\.\./.test(path);
  },

  getUuid: () => {
    return uuid.v4().replace(/-/g, '');
  },

  logError: (...arg) => {
    console.log(chalk.red(...arg));
  },

  getRootPath: (path) => {},

  renderKVObjects: (obj, title = 'all is Here !!!\n') => {
    const keys = Object.keys(obj);
    let str = [chalk.magenta(title), '\n'];

    let maxKeyLen = 0;
    keys.forEach((key) => {
      maxKeyLen =
        Math.max(key.length, maxKeyLen) === maxKeyLen ? maxKeyLen : key.length;
    });

    keys.forEach((key) => {
      let resolveKey = key;
      if (key.length < maxKeyLen) {
        resolveKey = `${key}${' '.repeat(maxKeyLen - key.length)}`;
      }
      str.push(chalk.cyan(resolveKey));
      str.push(chalk.grey('   ====>   '));
      str.push(chalk.cyan(obj[key]));
      str.push(chalk.grey('\n'));
    });
    if (str.length === 2) {
      str.push(chalk.green(`   is empty upload job!!!`));
    }

    str.push('');

    log(str.join(''));
    return '';
  },

  compactUrl: (ignore, ...arg) => {
    if (ignore) {
      return arg.join(path.sep);
    }
    return arg.reduce((prev, next) => {
      return /^\//.test(next) ? `${prev}${next}` : `${prev}${path.sep}${next}`;
    });
  },

  composeAction: (...arg) => {
    return (source, ...args) =>
      arg.reduce((prev, next) => {
        return next(prev, ...args);
      }, source);
  },

  cleanupFalselyKey: (obj) => {
    if (Array.isArray(obj)) {
      return obj.filter(Boolean);
    }
    const result = {};

    Object.keys(obj).forEach((key) => {
      if (obj[key]) {
        result[key] = obj[key];
      }
    });
    return result;
  },
};

/**
 * module exports
 */
module.exports = util;
