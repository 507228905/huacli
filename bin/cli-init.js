#! /usr/bin/env node
//命令处理
const program = require('commander')
//字体处理
const chalk = require('chalk')
//动画效果
const ora = require('ora')
//显示提示图标
const symbols = require('symbols')

//合并pack.json
const handlebars = require('handlebars')
//处理脚本
var shell = require('shelljs')
//下载模板的
const download = require('download-git-repo')

//文件读取
const fs = require('fs')

//交互
const inquirer = require('inquirer')

//读取模板的数据
let tplObj = require(`${__dirname}/../template.json`)

program.usage('<project-name>')
program.parse(process.argv)

//没有输入的时候给一个提醒
if (program.args.length < 1) return program.help()
let projectName = program.args[0]

//小小验证一下

if (fs.existsSync(projectName)) {
  console.log(chalk.red('project name does exist'))
  return
}

if (!projectName) {
  console.log(chalk.red('\n Project should not be empty! \n '))
  return
}

let options = [
  {
    name: 'author',
    message: '请输入作者名字',
    type: 'input',
  },
  {
    name: 'description',
    message: '请输入描述...',
    type: 'input',
  },
]

const spinner = ora('downloading...')
console.log(projectName)
console.log(tplObj)
let keys = Object.keys(tplObj)
console.log(keys)

let templateOptions = [
  {
    name: 'templateName',
    type: 'list',
    message: '请选择你创建项目的模板：',
    choices: keys,
  },
]
//模板下载的地址
let url = ''
//获取模板
inquirer.prompt(templateOptions).then((answer) => {
  url = tplObj[answer.templateName]

  inquirer.prompt(options).then((res) => {
    console.log(res)
    spinner.start()
    download(`direct:${url}`, projectName, { clone: true }, (err) => {
      if (err) {
        spinner.fail()
        console.log(chalk.red(`Generation failed. ${err}`))
        return
      } else {
        spinner.succeed()

        //组装package.json的文件路径
        let fileName = `${projectName}/package.json`
        const meta = {
          name: projectName,
          ...res,
        }
        console.log('package.json')
        if (fs.existsSync(fileName)) {
          console.log('package.json1111')
          //读取package.json的内容
          const content = fs.readFileSync(fileName).toString()

          // console.log(content)
          //合并结果
          const reslut = handlebars.compile(content)(meta)
          console.log(content)
          fs.writeFileSync(fileName, reslut)
        }

        console.log(symbols.success, chalk.green('模板下载成功'))

        inquirer
          .prompt([
            {
              type: 'confirm',
              name: 'install',
              message: '是否下载依赖',
              default: true,
            },
          ])
          .then((answer) => {
            if (answer.install) {
              inquirer
                .prompt([
                  {
                    type: 'list',
                    message: '请选择下载依赖的工具',
                    name: 'installWay',
                    choices: ['npm', 'cnpm', 'yarn'],
                  },
                ])
                .then((answer) => {
                  if (answer.installWay === 'npm') {
                    let spinner = ora('installing...').start()

                    shell.exec(
                      `cd ${projectName}&& ${answer.installWay} i`,
                      (err, stdout, stderr) => {
                        if (err) {
                          spinner.fail()
                          console.log(symbols.error, chalk.red(err))
                        } else {
                          spinner.succeed()
                          console.log(
                            symbols.success,
                            chalk.green('项目加载依赖成请你启动项目')
                          )
                          console.log('\n To get started')
                          console.log(`\n    cd ${projectName} \n`)
                        }
                      }
                    )
                  }
                })
            } else {
              console.log(
                symbols.success,
                chalk.green('You should install the dependence by yourself!')
              )
            }
          })
      }
    })
  })
})
