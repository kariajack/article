const db = require('../db/index')
const bcryptjs = require('bcryptjs')

exports.getUserInfo = (req,res)=>{
    const sql = 'select * from evi_user where username=?'
    db.query(sql,req.user.username,(err, results)=>{
        if(err) return res.cc(err)
        if(results.length!==1) return res.cc('获取用户信息失败')
        res.send({
            status:0,
            message:"获取用户信息成功",
            data:results[0],
        })
    })
}

exports.updateUserInfo = (req,res)=>{
    const sql = `update evi_user set ? where id=?`
    db.query(sql,[req.body,req.body.id],(err, results)=>{
        if(err) return res.cc(err)    
        if(results.affectedRows!==1) return res.cc('修改用户信息失败')
        res.cc('修改用户信息成功',0)
    })
}

exports.updatePassword = (req,res)=>{
    //登陆时把id等属性封装在token里传到这里
    
    const sql = `select * from evi_user where id=?`
    db.query(sql,req.user.id,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length!==1) return res.cc('用户不存在')
        const compareResult = bcryptjs.compareSync(req.body.oldPwd,results[0].password)
        if(!compareResult) return res.cc('原密码错误')
        
        const sql = `update evi_user set password=? where id=?`
        const newPass = bcryptjs.hashSync(req.body.newPwd,10)
        db.query(sql,[newPass,req.user.id],(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows!==1) return res.cc('更新密码失败')
            res.cc('更新密码成功',0)
        })
    })
}
exports.updateAvatar = (req,res)=>{
    console.log(req.body)
    console.log(req.user.id)
    const sql = `update evi_user set user_pic=? where id=?`
    db.query(sql,[req.body.avatar,req.user.id],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows!==1) return res.cc('更新头像失败')
        res.cc('更新头像成功',0)
    })
}