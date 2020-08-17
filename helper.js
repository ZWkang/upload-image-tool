const helper = `
Description
  upload file to your company oss server(aliyun server).

  Usage
  $ uio init
  $ uio getconfig
  $ uio set <key> <value>
  $ uio upload -fld <flodername> -encrypto -flatten

  <flodername> mean floder, absolute path or relative path.

  Commands
  init                init config
  getconfig           get all config
  set <key> <value>   set config key value
  upload              upload a floder image


  command upload Options
  -fld <flodername>   set up upload image floder
  -encrypto            encrypto filename 
  -flatten            ignore upload path (just file)

`;

module.exports = helper;
