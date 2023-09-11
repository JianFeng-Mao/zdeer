const inquirer = require('inquirer');
const { isEmpty } = require('@zdeer/utils/is');

const { createAppNameQuestion } = require('./questions');
const { createApp } = require('./create');

function createAppPrompts(name, options = {}) {
  if (isEmpty(name)) { // create 命令未设置项目名
    inquirer.prompt(createAppNameQuestion).then((answer) => {
      answer.name = name || answer.name;
      createApp(answer, options);
    });
  } else {
    createApp({ name }, options);
  }
}

module.exports = {
  createAppPrompts
};
