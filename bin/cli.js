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

commander.command('init').action(uio.initConfig);

commander.command('getConfig').action(uio.getConfig);

commander
  .command('upload')
  .option('-fld, --foldername <foldername>', 'mark a upload folder')
  .option('-c, --crypto')
  .option('-f, --flatten')
  .option('-oi, --onlyImage')
  .option('-vt, --convert')
  .action(({ foldername, crypto, flatten, onlyImage, convert }) => {
    return new uio({ foldername, crypto, flatten, onlyImage, convert });
  });

commander.command('set').action((...arg) => {
  const [, [key, value]] = arg;
  return uio.set(key, value);
});

commander.option('-h, --help').action(() => console.log(help_text));

commander.command('help').action((...arg) => console.log(help_text));

commander.parse(process.argv);
