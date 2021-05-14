#! /usr/bin/env node


const program  =require('commander')
const chalk  =require('chalk')
const ora = require('ora')
const download = require('download-git-repo')
const tplObj=require(`${__dirname}/../template.json`)



program
      .usage('<template-name> [project-name]')
program.parse(process.argv)

//没有输入的时候给一个提醒
if(program.args.length<1) return program.help()

let templateName = program.args[0]
let projectName = program.args[1]

//小小验证一下

if(!tplObj[templateName]){
    console.log(chalk.red('\n template does not exist'))
    return;
}


if (!projectName) {
    console.log(chalk.red('\n Project should not be empty! \n '))
    return
  }


  url = tplObj[templateName]

  const spinner = ora("downloading...")

  console.log(url)
  console.log(projectName)

  spinner.start();

  download(`direct:${url}`,projectName, { clone: true },err=>{
      if(err) {
          spinner.fail();
          console.log(chalk.red(`Generation failed. ${err}`))
          return;
      }

      spinner.succeed();
    console.log(chalk.green('\n Generation completed!'))
    console.log('\n To get started')
    console.log(`\n    cd ${projectName} \n`)

  })




