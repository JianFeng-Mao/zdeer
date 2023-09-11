const fs = require('fs/promises');
const FileType = require('file-type');

/**
 * 判断数据是否为空，可校验 数组、对象、undefined、null、''
 * @param {Array | Object | undefined | Null | String} data
 * @returns {Boolean}
 */
function isEmpty(data) {
  if (Array.isArray(data)) {
    return data.length === 0;
  }
  if (data !== null && typeof data === 'object') {
    return Object.keys(data).length === 0;
  }

  return [undefined, null, ''].includes(data);
}

/**
 * 判断文件/目录是否存在
 * @param {String} path
 * @returns {Boolean}
 */
function isExistPath(path) {
  return new Promise((resolve, reject) => {
    fs.access(path)
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        // TODO: 显示错误信息 e
        resolve(false);
      });
  });
}

const isImage = async (filePath) => {
  const fileInfo = await FileType.fromFile(filePath);
  return fileInfo && /^image\//g.test(fileInfo.mime);
}

module.exports = {
  isExistPath,
  isImage,
  isEmpty
};
