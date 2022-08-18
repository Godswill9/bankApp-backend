const express=require('express')
const route=express.Router()
const {verifyToken}=require('../controllers/authenticate')
const database=require('../model/schema')
const {v4}=require('uuid')

route.post('/sendMoney', verifyToken)

route.post('/sendMoney/:id', (req, res)=>{
    // const transactionId=v4()
  const{amount, email, sender, senderEmail, transaction}=req.body
//   console.log(typeof sender)
    const{id}=req.params
    var newId=id.replace(':' , '')
    if(!amount || !email || !sender || !senderEmail){
        res.json({message:"pls fill in all spaces"})
        return
    }
    else{
   //addition  (reciever's id)
   var checkAccountToAdd='SELECT * FROM account WHERE myEmail = ?'
   database.query(checkAccountToAdd,[email], async(err, result)=>{
    try{
        if(result.length==0){
            console.log("user not found")
            res.json({message2:"user not found"})
            return;
        }
        else{
            const myIdd=result[0].myId
                var total=result[0].totalAmount //total amount from mysql
                var total_to_float=parseFloat(total)
                var amount_to_float=parseFloat(amount)
                var newAmount=total_to_float + amount_to_float

                var checkAccountToSubtract='SELECT * FROM account WHERE myId = ?'
               //subtraction (sender)
                database.query(checkAccountToSubtract,[newId], async(err, result1)=>{
                    
                    var total2=result1[0].totalAmount //total amount from mysql
                    var total2_to_float=parseFloat(total2)
                    if(total2_to_float< amount_to_float){
                     res.json({transaction:"false", message3:"insufficient funds"})
                    }else{
                        var newAmount2=total2_to_float - amount_to_float
                             console.log(newAmount2)
                             var updateMe=`UPDATE account SET totalAmount=${newAmount2},
                                          amount=${amount},
                                          person = '',
                                          personEmail = '',
                                          transactionMode= 'sent'
                                         WHERE myEmail= ?`
                             database.query(updateMe,[result1[0].myEmail], async(err, resul)=>{
                                 if(err) {console.log(err)}
                                 res.json({
                                     id:myIdd,
                                     amountSent:amount,
                                     mode:"recieved successfully"
                                 })
                                 console.log("updated successfully")
                                })
                    }
                })
                //add now!!
                var updateMe=`UPDATE account SET totalAmount=${newAmount},
                          amount=${amount}, 
                          person = '${sender}',
                          personEmail = '${senderEmail}',
                          transactionMode= 'recieved'
                         WHERE myEmail= ?`
            database.query(updateMe,[result[0].myEmail], async(err, resul)=>{
                if(err) {console.log(err)}
                res.json({
                    id:newId,
                    amountSent:amount,
                    mode:"sent successfully",
                    redirect:"true"
                })
                console.log("updated successfully")
            })


        }
    }catch(err){
         console.log(err)
    }
})
    }
})

module.exports=route