/**
 * 获取package.json 文件信息
 * @returns Object
 */
function getPackageInfo() {
  return require('../package.json');
}

const packageInfo = getPackageInfo();

module.exports = {
  packageInfo
};
