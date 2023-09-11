const path = require('path');

const TEMPLATE_MAP = {};
// 模板路径
const TEMPLATE_Path = path.join(__dirname, '../template');

function getFullTempltePath(template) {
  return path.join(TEMPLATE_Path, TEMPLATE_MAP[template]);
}

module.exports = {
  getFullTempltePath
};
