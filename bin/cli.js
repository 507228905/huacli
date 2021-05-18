#!/usr/bin/env node

const program = require('commander')
//定义软件的版本
//定义使用方法
//定义四个指令

program
  .version(require('../package.json').version)
  .usage('<command> [optins]')
  .command('add', 'add a new template')
  .command('delete', 'delete a template')
  .command('list', 'list all the template')
  .command('init', 'generate a new project')
  .command('test', 'test a new project')
//解析命令行参数
program.parse(process.argv)
