#! /usr/bin/env node

//交互命令行
const inquirer = require('inquirer')
//node 内置文件模块
const fs = require('fs')
//修改控制台字符串的样式
const chalk = require('chalk')
//读取根目录下的template.json
const tplObj = require(`${__dirname}/../template`)

//自定义交互式命令行的问题及简单的校验

let question = [{
    name:"name",
    type:"input",
    message:"请输入模板名称",
    validate(val){
        if(val==='') {
            return "name is required"
        }else if(tplObj[val]) {
            return "teplate has already existed"
        }else {
            return true
        }
    }

},
 {
     name:'url',
     type:'input',
     message:"请输入模板名称",

     validate(val) {
         if(val==='') {
             return "url is required"
         }return true
     }
 }
]


inquirer 
    .prompt(question).then(answer=>{
        // answers 就是用户输入的内容，是个对象
        let {name,url} = answer;

        tplObj[name] =url.replace(/[\u0000-\u0019]/g, '')
   
        //把模板信息写入template.json文件中
        fs.writeFile(`${__dirname}/../template.json`,JSON.stringify(tplObj),'utf-8',
        err=>{
            if (err) console.log(err)
            console.log('\n')
            console.log(chalk.green('Added successfully!\n'))
            console.log(chalk.grey('The latest template list is: \n'))
            console.log(tplObj)
            console.log('\n')
         }
        )
    })