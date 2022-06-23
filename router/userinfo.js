const express = require('express')
const router = express.Router()
//导入验证数据的中间件
const expressjoi = require('@escook/express-joi')
//导入需要的验证规则对象
const {update_userInfo_schema} = require('../schema/user')
const{ update_password_schema } = require('../schema/user')
const{update_avatar_schema} = require('../schema/user')

const userinfo_handler = require('../router_handler/userinfo')
router.get('/userinfo',userinfo_handler.getUserInfo)
router.post('/updateUserinfo',expressjoi(update_userInfo_schema),userinfo_handler.updateUserInfo)
router.post('/updatepwd',expressjoi(update_password_schema),userinfo_handler.updatePassword)
router.post('/update/avatar',expressjoi(update_avatar_schema),userinfo_handler.updateAvatar)
module.exports = router