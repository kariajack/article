const db = require('../db/index')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.reguser=(req,res)=>{
    const userinfo = req.body
    //console.log(userinfo)
    
    // if(!userinfo.username || !userinfo.password){
    //     return res.send({
    //         status:1,
    //         message:'不能为空'
    //     })
    // } 
    const sqlstr = "select id, username, nickname, email, user_pic from evi_user where username=?"
    db.query(sqlstr,userinfo.username,(err,results,fileds)=>{
        if(err) return res.cc(err)
        //if(results.length>0) return res.send({status:1,message:"用户名占用"})
        if(results.length>0) return res.cc("用户名占用")
        //todo .......加密密码
        userinfo.password = bcryptjs.hashSync(userinfo.password,10)
        const sql = "insert into evi_user set?"
        db.query(sql,userinfo,(err,results)=>{
            if (err)  return res.cc(err)
            if(results.affectedRows!==1) return res.cc("注册失败")
            //res.send( {status:0,message:"注册成功"} )
            res.cc("注册成功",0)
        })
    })
    //res.send('zhuce成功') 
}
exports.login=(req,res)=>{
    const userInfo = req.body
    const sql = 'select * from evi_user where username=?'
    db.query(sql,userInfo.username,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length!==1) return res.cc('登录失败')
        //对比密码是否一致
        const compareResult = bcryptjs.compareSync(userInfo.password,results[0].password)
        //console.log(compareResult)
        if (!compareResult)  return res.cc('密码错误')
        //生成taken字符串
        //es6写法  ...展开对象，清空password(不传输敏感信息)
        const user = { ...results[0],password:'',user_pic: ''}
        //安装生成token字符串的包npm i jsonwebtoken@8.5.1
        //加密  （内容，密钥，有效时间）
        console.log(user)
        
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{ expiresIn:config.expiresIn })
        res.send({
            status:0,
            message:'登录成功',
            token:'Bearer ' + tokenStr,
            
        })
    })
    //res.send('denglu')
}