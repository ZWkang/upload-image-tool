const fs = require('fs');
const { join } = require('path');

const pandaConvert = require('./pandaConvert');
const { getUuid } = require('./util');

const testFolder = '/test/folder';

class Upload {
  constructor() {
    this.entryPoint = process.cwd();
  }
  /**
   * @description 上传
   * @param {*} filename 文件名字
   * @param {*} client oss client实例
   * @param {*} filepath 文件路径
   * @returns
   */
  upload(filename, client, filepath) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await client.put(
          filename,
          filepath || join(this.entryPoint, filename)
        );
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * @description 转换后上传
   * @param {*} filename 文件名字
   * @param {*} client oss client实例
   * @param {*} filepath 文件路径
   * @returns
   */
  uploadWithConvert(filename, client, filepath) {
    return new Promise(async (resolve, reject) => {
      const sourcePath = filepath || join(this.entryPoint, filename);
      const buffer = fs.readFileSync(sourcePath);
      try {
        const convertBuffer = await pandaConvert(buffer);
        const res = client.put(filename, convertBuffer);
        resolve(res);
      } catch (e) {
        reject(e);
      }
    });
  }
  /**
   * @description 检测上传是否失败
   * @param {*} filename 文件名
   * @param {*} client oss 客户端实例
   * @returns
   */
  checkUpload(filename, client) {
    return new Promise(async (resolve, reject) => {
      try {
        const uid = getUuid();
        await this.upload(join(testFolder, `${uid}${filename}`));
        const { status } = client.head(`${uid}${filename}`);
        if (status !== 200) {
          reject(new Error('上传失败'));
        }
        resolve(status);
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = Upload;
