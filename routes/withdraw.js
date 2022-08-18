const express=require('express')
const { trusted } = require('mongoose')
const route=express.Router()
const {verifyToken}=require('../controllers/authenticate')
const database=require('../model/schema')

route.post('/withdraw',verifyToken)

route.post('/withdraw/:id', (req, res)=>{
    const{amountToWithdraw, transaction, myName, myEmail,myAccNo, myBankName}=req.body
    const{id}=req.params
    var newId=id.replace(':' , '')
    if(!amountToWithdraw|| !transaction || !myAccNo || !myBankName){
        res.json({message:"fill in empty spaces", stats:false})
        return 
    }
    else{
        var requiredItem='SELECT * fROM account WHERE myId = ?'
        database.query(requiredItem,[newId], async(err, result)=>{
            try{ 
                console.log(result[0].myEmail)
                var total=result[0].totalAmount //total amount from mysql
                var total_to_float=parseFloat(total)
                var amount_to_float=parseFloat(amountToWithdraw)
                if(total_to_float < amount_to_float){
                    res.json({message2:"insufficient funds", stat2:false})
                }else{
                    var newAmount=total_to_float - amount_to_float
                    var updateMe=`UPDATE account SET totalAmount=${newAmount},
                                amount=${amountToWithdraw},
                                withdrawalAmount=${amountToWithdraw},
                                transactionMode="withdrawal",
                                person="",
                                personEmail="",
                                accountNumber=${myAccNo},
                                bankName='${myBankName}'
                                WHERE myEmail= ?`
                    database.query(updateMe,[result[0].myEmail], async(err, resul)=>{
                        if(err) {console.log(err)}
                        else{
                            console.log(`${amountToWithdraw} withdrawn successfully`);
                            res.json({redirect:"true"})
                        }
                 })
                }
            }catch(err){
                console.log(err)
            }
        
        })
    }

})


// route.post('/withdraw/checkUser/:id',async (req, res)=>{
//     const {id}=req.params
//     var newId=id.replace(':' , '')
//         const {amount}=req.body
//         if(!amount){
//             console.log("no body")
//            return;
//         }
//         else{var checkMoney = "SELECT * FROM account WHERE myId = ?";
//             database.query(checkMoney, [newId],(err, valu)=>{
//                const sendersAmount=valu[0].totalAmount
//                if(sendersAmount>=amount){
//                 //   res.send("im here")
//                 res.redirect(`http://localhost:3000/homepage:${valu[0].myId}`)
//                  return;
//                }else{
//                 res.json({ errorPrice:true })
//                }
           
//         })}
// })



module.exports=route 