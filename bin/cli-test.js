// https://blog.csdn.net/qq_26733915/article/details/80461257/  学习的文档地址chalk

const inquirer = require('inquirer') //交互
const program = require('commander') //命令解析
const org = require('ora')
const fs = require('fs') //文件处理
const chalk = require('chalk') //
const { Console } = require('console')

const downLoad = require('download-git-repo')

program.usage('<project-name> [template-name]')
program.parse(process.argv)
console.log('cli-test')
if (program.args.length < 1) return program.help()
let params = {}

params.projectName = program.args[0]
params.templateName = program.args[1]

console.log(chalk.red(JSON.stringify(params)))
console.log(chalk.blue.bgWhite.bold(JSON.stringify(params)))

let spanner = org('正在下载模板当中...').start()

downLoad(
  'direct:https://github.com/echofly/simple-tpl.git',
  params.projectName,
  { clone: true },
  (err) => {
    if (err) {
      spanner.fail()
      return console.log(chalk.red('下载失败的原因：' + JSON.stringify(err)))
    }
    //下载到那个路径
    else {
      spanner.succeed()
      return console.log(chalk.green('项目创建成功'))
    }
  }
)
const options = [
  {
    type: 'input',
    message: '设置一个名字',
    name: 'name',
    validate: function (val) {
      if (!val) {
        return '名字不能为空'
      }
      return true
    },
  },
  {
    type: 'input',
    message: '请输入电话号码',
    name: 'phone',
    validate: function (val) {
      if (!val) {
        return '请输入电话号码'
      } else if (val.length !== 11) {
        return '请输入11位的电话号码'
      }
      return true
    },
  },
  {
    type: 'confirm',
    message: '是否使用微信支付',
    name: 'payway',
    prefix: '前缀',
  },
  {
    type: 'confirm',
    message: '是否进行支付宝支付',
    name: 'zhifubao',
    suffix: '后缀',
  },

  {
    type: 'list',
    message: '请选择一种水果',
    name: 'fruit',
    choices: ['apple', 'orange', 'babana'],
    filter: function (val) {
      return val.toLowerCase()
    },
  },

  {
    type: 'rawlist',
    message: '请选择一种水果',
    name: 'color',
    choices: ['green', 'orange', 'black'],
  },

  {
    type: 'expand',
    name: 'color1',
    message: '请选择一种颜色',
    choices: [
      { key: 'A', name: 'apple', value: 'apple' },
      { key: 'O', name: 'orange', value: 'orange' },
      { key: 'p', name: 'per', value: 'per' },
    ],
  },

  {
    type: 'checkbox',
    name: 'color2',
    choices: [
      { name: 'red' },
      new inquirer.Separator(),
      {
        name: 'blur',
        checked: true,
      },
      {
        name: 'green',
      },
      new inquirer.Separator(),
      {
        name: 'orange',
      },
      {
        name: 'black',
        checked: true,
      },
    ],
  },

  {
    type: 'checkbox',
    message: '选择颜色',
    name: 'color3',
    choices: ['red', 'black', 'orange', 'yollow'],
    pageSize: 3,
  },

  {
    type: 'password',
    name: 'password',
    message: '请输入密码',
    validate: function (val) {
      if (!val) {
        return '请输入密码'
      }
      return true
    },
  },

  {
    type: 'editor',
    message: '请输入备注',
    name: 'editor',
  },
]

inquirer.prompt(options).then((res) => {
  console.log(res)
})
