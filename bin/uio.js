#!/usr/bin/env node

const pkg = require('../package.json');
const updateNotifier = require('update-notifier');
const commander = require('commander');
const help_text = require('../helper');

const uio = require('..');

updateNotifier({ pkg }).notify();

process.on('uncaughtException', (e) => {
  console.log(`error: `);
  console.log(e);
});

commander.version(pkg.version);

// 是否展开保留文件夹结构

commander.option('-i, --init', 'init project setting').action(() => {
  return uio.initConfig();
});

commander.command('getconfig').action(() => {
  return uio.getConfig();
});

commander
  .command('upload')
  .option('-fld, --flodername <flodername>', 'mark a upload floder')
  .option('-e, --encrypto')
  .option('-f, --flatten')
  // .option('-rp, --rootpath <rootpath>', 'mark a rootPath')
  .action(({ flodername, encrypto, flatten }) => {
    return new uio({ flodername, encrypto, flatten });
  });

commander.command('set').action((...arg) => {
  const [, [key, value]] = arg;
  return uio.set(key, value);
});

commander.help(() => {
  return help_text;
});

commander.command('help').action((...arg) => {
  return console.log(help_text);
});

commander.parse(process.argv);
