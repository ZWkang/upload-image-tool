# upload-image-tool

> 上传图片工具

> zui alias for zupload-image

---

## reason

当我需要上传图片到 oss 时，我总是需要借助一些辅助工具进行拖拽上传。

而且当设计给的是中文时，有时候还需要对图片进行重新命名上传。

萌芽出一个概念，单个项目开展的时候，设立好项目基点，则很容易完成比较快捷的上传操作（ 对多项目切换也许不是那么好用 ）

## usage

```js
npm install -g upload-image-tool
// or
npx zui
// or
npx zupload-image
```

- zui --help | zui -h

  获取命令信息

- zui init

  初始化工具配置

  包括一些阿里云 oss 链接初始化配置，还有一些项目初始化位置。

- zui getconfig

  获取所有配置信息

- zui set <key> <value>

  设置配置信息

- zui upload [--foldername folderPath] [--crypto] [--convert]

  foldername 指定一个文件夹目录上传

  crypto 是否重命名上传文件

  convert 是否使用熊猫稍微压缩一下

## changelog

[CHANGELOG](./CHANGELOG.md)

## MIT

[LICENSE](./LICENSE)
