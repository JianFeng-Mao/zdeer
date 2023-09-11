#! /usr/bin/env node

const { Command } = require('commander');
const gradient = require('gradient-string');

const { packageInfo } = require('../lib/getPackageInfo.js');
const { createAppPrompts } = require('../lib/prompts.js');

const program = new Command();

program.name('create-deer').version(`v${packageInfo.version}`).usage('<command> [option]');

program.on('--help', () => {
  console.log(`\r\n${gradient.vice('Welcome deer-cli')}`);
})

const init = () => { createAppPrompts(); }

program
  .command('create [app-name]')
  .description('新建项目')
  .option('-f, --force', '如果当前目录下存在同名文件直接覆盖')
  .action((name, options) => {
    createAppPrompts(name, options);
  });

// TODO
/* 用于创建项目文件
 *  [type]：
 *       默认 View，新建同名 router文件、页面文件、store文件、api文件
 *   可选：
 *       router  仅创建路由文件，若当前未引用vue-router，自动安装依赖
 *       page    仅创建页面文件
 *       store  仅创建vuex文件，若当前项目未引用vuex，~
 *       api    仅创建api文件，若当前未引用axios，~
 *       component  创建组件
 *
 *  [path]:  新增文件的路径
 *  [name]:  新增的文件名
 */
program
  .command('mk [type]')
  .description('创建路由、页面、组件等文件')
  .option('-f, --force', '如果当前目录存在同名文件直接覆盖')
  .action((type, options) => {
    console.log(type);
    console.log(options);
  });

  // 判断用户输入的命令是否携带参数，无参数，process.argv默认带有两个参数 https://nodejs.cn/api/process.html#processargv
  if(process.argv.length === 2) {
    init();
  } else {
    // 解析命令行参数
    program.parse();
  }


