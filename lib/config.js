const configstore = require('configstore');
const pkg = require('../package.json');

const config = new configstore(pkg.name);

module.exports = {
  get,
  set,
};

function get(key) {
  return config.get(key);
}

function set(key, value) {
  return config.set(key, value);
}
