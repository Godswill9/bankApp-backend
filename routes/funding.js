const express=require('express')
const route=express.Router()
const {verifyToken}=require('../controllers/authenticate')
const database=require('../model/schema')

route.post('/funding', verifyToken) //verification jwt

route.post('/addFunds/:id', (req, res)=>{  //route for handling Adding funds
   const {id}=req.params
   const {amount, transactionMode}=req.body
   var newId=id.replace(':' , '')
   //getting the item with the id from mysql
   var requiredItem='SELECT * fROM account WHERE myId = ?'
    database.query(requiredItem,[newId], async(err, result)=>{
        try{ 
            console.log(result[0].myEmail)
            var total=result[0].totalAmount //total amount from mysql
            var total_to_float=parseFloat(total)
            var amount_to_float=parseFloat(amount)
            var newAmount=total_to_float + amount_to_float
            var updateMe=`UPDATE account SET totalAmount=${newAmount},
                          amount=${amount},
                        transactionMode="funded",
                        person="",
                        personEmail=""
                        WHERE myEmail= ?` 
            database.query(updateMe,[result[0].myEmail], async(err, resul)=>{
                if(err) {console.log(err)}
                console.log("updated successfully")
         })
        }catch(err){
            console.log(err)
        }
       
    })
  
})

module.exports=route