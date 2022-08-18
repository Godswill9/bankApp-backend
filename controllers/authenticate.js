require("dotenv").config();
const express = require("express");
const router = express.Router();
const database = require("../model/schema");
const { v4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//registration
const signup=async(req, res, next)=>{
  const transactionIdd=v4()
  var date=new Date()
  var id = v4();
  const { firstName, lastName, email, password } = req.body;
  var salt = await bcrypt.genSalt(10);
  var hashed = await bcrypt.hash(password, salt);
  console.log(hashed);

  var check = "SELECT * FROM mymonicustomers WHERE email = ?";
  database.query(check, [email], (err, result) => {
    if (result.length !== 0) {
      console.log("user already exists");
      res.json({ message: "user already exists" , redirect:"true"});
      return;
    } else {
      var sql = `INSERT INTO myMoniCustomers (firstName,lastName, email, password, id) VALUES?`;
      var values = [[firstName, lastName, email, hashed, id]];
      database.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        res.json({ message: "user already exists" , redirect:"false"});
      });

      //account database
      var sql = `INSERT INTO account (totalAmount, 
         amount, 
         person, 
         personEmail,
         date,
         transactionMode,
         TransactionId,
         myName,
         myEmail,
         myId,
         withdrawalAmount,
         accountNumber,
         bankName
         ) VALUES?`;
        var values = [[0, 0, "", "", date,"",transactionIdd, firstName, email, id, 0, 0, ""]];
        database.query(sql, [values], function (err, result) {
          if (err) throw err;
          console.log("Number of records inserted: " + result.affectedRows);
        });
    }
  });
} 
  


//login route 
const login=async(req, res, next)=>{
  const { email, password } = req.body;
  var check = "SELECT * FROM mymonicustomers WHERE email = ?";
  database.query(check, [email], async (err, result) => {
    if (result.length == 0) {
      res.json({ message: "user not found" , bool:"true"});
    }
     else {
      console.log(result[0].password);
      await bcrypt.compare(password, result[0].password)
     .then((resultt) => {
        if (!resultt) res.json({ message: "incorrect password", bool:"true" })
        if(resultt){
          const accessToken = jwt.sign(
            {
              username: result[0].email,
              id: result[0].id,
              firstName: result[0].firstName,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" }
          )
          res.cookie("jwt", accessToken, {
            withCredentials:true,
            httpOnly: true,
            maxAge: 3600 * 1000 * 24 * 365 * 100,
            // secure: true
        })
              const allObj = {
                ...result[0],
                accessToken: accessToken,
                status: "success",
                bool:"false", 
                redirect:"true"
              };
              res.json(allObj);
            var checkAccount=`Select * from account WHERE email=?`
            database.query(checkAccount,[email], async(err, result)=>{
            })
  
        }
      })


    //   // }
    }
  });
}



//VERIFY TOKEN
const verifyToken=(req, res, next)=>{
  const cookieToken=req.cookies.jwt
  // console.log(req.cookies)
  if(!cookieToken) return res.send(401)
    jwt.verify(cookieToken, process.env.ACCESS_TOKEN_SECRET, async(err, decoded)=>{
      if(err) {console.log(err)
      res.json({status:false})
  }else{
    var check = "SELECT * FROM mymonicustomers WHERE email = ?";
    database.query(check, [decoded.username], (err, result) => {
      if (result.length>0) {
        // console.log(result)
      {res.json({status:true, id: result[0].id, firstName: result[0].firstName, email: result[0].email}) 
      }}})
  }
    })
    
}
module.exports = {signup, login, verifyToken};
