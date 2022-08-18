require('dotenv').config();
const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const cookieParser= require("cookie-parser")
const login=require('./routes/login')
const signup=require('./routes/signup')
const home=require('./routes/homepage')
const funding=require('./routes/funding') 
const withdraw=require('./routes/withdraw')
const sendMoney=require('./routes/sendMoney')
const mySql = require("mysql2")
const database=require('./model/schema')
const cors=require('cors')
 

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(cors({
    origin:["http://localhost:3000"],
    methods:["GET", "POST", "PUT", "DELETE"],
    credentials:true
}))
app.use(cookieParser())

app.use('/api', home)
app.use('/api', funding)
app.use('/api', sendMoney)
app.use('/api', withdraw)
app.use('/api', login)
app.use('/api', signup)

app.listen(process.env.PORT || 3001, ()=>{
    console.log("app is listening")
})