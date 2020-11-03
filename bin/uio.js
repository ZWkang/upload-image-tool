#!/usr/bin/env node

const updateNotifier = require('update-notifier');
const commander = require('commander');

const pkg = require('../package.json');
const help_text = require('../lib/helper');
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

commander.command('getConfig').action(() => {
  return uio.getConfig();
});

commander
  .command('upload')
  .option('-fld, --foldername <foldername>', 'mark a upload folder')
  .option('-c, --crypto')
  .option('-f, --flatten')
  .option('-oi, --onlyImage')
  .action(({ foldername, crypto, flatten, onlyImage }) => {
    return new uio({ foldername, crypto, flatten, onlyImage });
  });

commander.command('set').action((...arg) => {
  const [, [key, value]] = arg;
  return uio.set(key, value);
});

commander.option('-h, --help').action(() => console.log(help_text));

commander.command('help').action((...arg) => {
  return console.log(help_text);
});

commander.parse(process.argv);
