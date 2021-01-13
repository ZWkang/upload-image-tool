const helper = `
Description
  upload file to your company oss server(aliyun server).

  Usage
  $ uio init
  $ uio getConfig
  $ uio set <key> <value>
  $ uio upload -fld <foldername> -crypto -flatten

  <foldername> mean folder, absolute path or relative path.

  Commands
  init                init config
  getConfig           get all config
  set <key> <value>   set config key value
  upload              upload a folder image


  command upload Options
  --fld <foldername>   set up upload image folder
  --crypto             crypto filename 
  --flatten            ignore upload path (just file)
  --convert            convert image file
`;

module.exports = helper;
