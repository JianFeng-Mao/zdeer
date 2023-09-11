const fsPromise = require('fs/promises');
const path = require('path');
const ejs = require('ejs');
const downloadGitRepo = require('download-git-repo');
const util = require('util');
const { isImage, isEmpty } = require('@zdeer/utils/is');
const { getFullTempltePath } = require('./template');
const { getRepoList, getTagList } = require('./request');
const inquirer = require('inquirer');
const Spinner = require('./loading');
const gradient = require('gradient-string');

class Generator {
  constructor(name, template, targetPath) {
    this.name = name;
    this.template = template;
    this.path = targetPath;
    this.spinner = Spinner();
  }

  /**
   * 创建文件夹
   * @param {String} targetPath 目标路径
   * @param {String} filename 文件夹名字
   * @param {Object} options 配置项
   * @returns 
   */
  async mkDirectory(targetPath, filename, options) {
    try {
      this.spinner.start('创建目录');

      options = { recursive: true, ...options };

      const resPath = await fsPromise.mkdir(path.join(targetPath, filename), options); 
      
      this.spinner.succeed(`目录【${resPath}】创建成功`);

      return resPath;
    } catch (error) {
      this.spinner.fail(error);
    }
  }

  /**
   * 循环复制源文件夹目录及其子文件夹下的所有文件（包括文件夹）
   * @param {*} sourcePath 文件源路径
   * @param {*} targetPath 需要生成的目标路径
   */
  async copyFile(sourcePath, targetPath) {
    // 读取模板文件内容
    const files = await fsPromise.readdir(sourcePath);
    files.forEach(async (file) => {
      // 源文件完整路径
      const srcPath = path.join(sourcePath, file);
      // 获取文件信息
      const stats = await fsPromise.stat(srcPath);
      if(stats.isDirectory()) { // 是文件夹，递归该文件夹下的所有子文件
        // 在目标路径下创建同名文件夹
        const tempPath = await this.mkDirectory(targetPath, file);
        // 递归复制文件
        this.copyFile(path.join(sourcePath, file), tempPath);
      } else if(stats.isFile()) { // 文件，直接渲染
        let contents = '';
        if(isImage(srcPath)) {
          contents = await fsPromise.readFile(srcPath);
        } else {
          // 使用ejs渲染对应的模版文件
          // renderFile(模版文件地址，传入渲染数据),返回文件内容字符串
          contents = await ejs.renderFile(
            path.join(sourcePath, file),
            { name: this.name }
          );
        }

        // 将源文件内容写入目标文件（复制）
        await fsPromise.writeFile(path.join(targetPath, file), contents);
      }
      
    });
  }

  /**
   * 拉取远程模板仓库列表
   * @returns 
   */
  async fetchGitRepo() {
    try {
      this.spinner.start('拉取远程模板列表');

      const repoList = await getRepoList();

      this.spinner.succeed();

      const repos = repoList.map(r => r.name);

      const { repo } = await inquirer.prompt({
        name: 'repo',
        type: 'list',
        choices: repos,
        message: '选择默认模板'
      })

      return repo;
    } catch (error) {
      this.spinner.fail(error);
    }
  }
  /**
   * 拉取指定代码仓库的tag
   * @param {*} repo 
   * @returns 
   */
  async fetchRepoTag(repo) {
    try {
      this.spinner.start(`拉取【${repo}】模板仓库的tag列表`);

      const tags = await getTagList(repo);

      this.spinner.succeed();

      const { tag } = await inquirer.prompt({
        name: 'tag',
        type: 'list',
        choices: tags.map(tag => tag.name),
        message: '选择版本'
      })

      return tag;
    } catch (error) {
      this.spinner.fail(error);
    }
  }
  /**
   * 根据template选项创建初始项目
   */
  async createApp() {
    // 控制台所在目录
    const cwdUrl = process.cwd();
    const greenGradient = gradient('green', 'green')

    if(this.template === 'admin') {
      const repo = await this.fetchGitRepo();
      const tag = await this.fetchRepoTag(repo);
      const repoUrl = `zdeer-repos/${repo}${tag ? '#' + tag : ''}`;
      // 下载git仓库方法，promise化
      const downloadGitRepoPromisify = util.promisify(downloadGitRepo);

      this.spinner.start(`初始化模板【${repo}-${tag}】`);
      await downloadGitRepoPromisify(repoUrl, path.join(cwdUrl, this.name));
      this.spinner.succeed(`${greenGradient(this.name)} 创建成功，路径：${greenGradient(this.path)}`);
    } else {
      // 获取模板文件所在路径
      const templateUrl = getFullTempltePath(this.template);

      // 创建目录并返回创建的第一个目录路径（recursive: true）
      const targetPath = await this.mkDirectory(cwdUrl, this.name);

      this.copyFile(templateUrl, targetPath);
    }
    
  }
}

module.exports = Generator;
