const express = require('express')
//解决跨域请求
const cors = require('cors')
//新版本更换为joi  数据验证
const joi = require('joi')
//解析token  npm i express-jwt@5.3.3


const app = express()
app.use(cors())
app.use(express.urlencoded({extended: false}))
// 响应数据的中间件
app.use(function(req,res,next){
    // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
    res.cc=function(err,status=1){
        res.send({
                status,
                message:err instanceof Error? err.message:err
        })
    }
    next()
})
//解析token中间件  除去/api开头的其他请求都要进行身份验证
const expressJwt = require('express-jwt')
const config = require('./config')
app.use(expressJwt({secret: config.jwtSecretKey}).unless({path:[/^\/api\//]}))

const userRouter = require('./router/user')
app.use('/api',userRouter)

const userinfoRouter = require('./router/userinfo')
app.use('/my',userinfoRouter)
const artCateRouter = require('./router/article')
app.use('/my/article',artCateRouter)

// 错误中间件
app.use((err,req,res,next)=>{
    //joi验证失败
    if(err instanceof joi.ValidationError) return res.cc(err)
    // 捕获身份认证失败的错误
    //验证身份 响应发送token   当访问有权限的请求时 验证请求头Authorization是否为token值
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    res.cc(err)
})
app.listen(3003,()=>{
    console.log('start at: http://127.0.0.1:3003')
    
})