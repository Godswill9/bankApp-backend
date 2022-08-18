const express=require('express')
const route=express.Router()
const {login}=require('../controllers/authenticate')

route.post('/login' , login)


module.exports=route