const path = require('path');
const fsPromise = require('fs/promises');
const inquirer = require('inquirer');
const { overWriteQuestion, createAppTemplateQuestion, adminTemplateQuestion } = require('./questions');
const { isExistPath } = require('@zdeer/utils/is');
const Generator = require('./Generator');
async function createApp({ name }, options) {
  // 当前命令行路径
  const cwd = process.cwd();

  const targetPath = path.resolve(cwd, name);

  const rmOpts = {
    force: true, // 当为 true 时，如果 path 不存在，则异常将被忽略
    recursive: true
  };

  if (options.force) {
    // 强制创建目录，先移除（如果存在的话）
    await fsPromise.rm(targetPath, rmOpts);
  } else {
    // 非强制，先判断目录是否存在
    const pathExist = await isExistPath(targetPath);

    if (pathExist) { // 目录已存在，提示用户，根据用户输入决定执行结果
      const { action } = await inquirer.prompt(overWriteQuestion);
      if (action === 'overwrite') { // 覆盖
        await fsPromise.rm(targetPath, rmOpts);
      } else {
        process.exit(1);
      }
    }
  }

  // 选择项目模板
  const { template } = await inquirer.prompt(createAppTemplateQuestion);
  //TODO
  if(template !== 'admin') { // 自定义配置
    
  }
  
  // 创建项目 ==================
  const grnerator = new Generator(name, template, targetPath);

  grnerator.createApp();
}

module.exports = {
  createApp
};
