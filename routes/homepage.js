const express=require('express')
const route=express.Router()
const {verifyToken}=require('../controllers/authenticate')
const database=require('../model/schema')

route.post('/home', verifyToken) //authentication and jwt

route.get('/home/totalAmount/:id', async (req, res)=>{//just fetch me my info from id
     try{ 
        const {id}= req.params
        var newId=id.replace(':' , '')
        var checkAccount='SELECT * FROM account WHERE myId = ?'
            database.query(checkAccount,[newId], async(err, result)=>{
                    var amount= await result[0].totalAmount
                    res.json({amount:amount})
                })
        }catch(err){
            console.log(err)
            }})





module.exports=route