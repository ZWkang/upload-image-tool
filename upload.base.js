const { join } = require('path');

const testFloder = '/test/floder';

const { getuuid } = require('./util');

class Upload {
  constructor() {
    // super();
    this.entryPoint = process.cwd();
  }

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

  checkUpload(filename, client) {
    return new Promise(async (resolve, reject) => {
      try {
        const uid = getuuid();
        await this.upload(join(testFloder, `${uid}${filename}`));
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

// export default Upload;
module.exports = Upload;
