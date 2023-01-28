const express = require('express');
const mongoose = require('mongoose');

require('dotenv/config');

const {connection}=require("./config/db")

const {BMIModel}=require("./models/BMIModel")

const {UserModel}=require("./models/UserModel")

const {authentication }=require("./middlewares/authentication")

const bcrypt =require("bcrypt")

const jwt =require("jsonwebtoken")

const cors=require("cors")

const app = express();
app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello")
})

app.post("/signup", async (req, res) => {
    const {name, email, password} = req.body

    const isUser = await UserModel.findOne({email})
    if(isUser){
        res.send({"msg" : "User already exists"})
    }
    else {
        bcrypt.hash(password, 4, async function(err, hash) {
        if(err){
            res.send("Something went wrong")
        }
        const new_user = new UserModel({
            name,
            email,
            password : hash
        })
        try{
            await new_user.save()
            res.send({"msg" : "Sign up successfull"})
        }
        catch(err){
            res.send({"msg" : "Something went wrong"})
        }
    });
}
})


app.post("/login", async (req, res) =>
 {
    const {email, password} = req.body
    const user = await UserModel.findOne({email})
    const hashed_password = user.password;
    const user_id = user._id;
    

    bcrypt.compare(password, hashed_password, function(err, result) {
          if(err){
            res.send({"msg" : "Somet try again later"})
            console.log(err)
          }
          if(result){
            const token = jwt.sign({user_id}, process.env.SECRET_KEY);  
            res.send({message : "Login successfull", token})
          }
          else{
            res.send({"msg" : "Login failed"})
          }
    });
})

app.get("/logout", authentication,async (req,res) => {
    res.send("logout user")
})

    app.get("/getProfile", authentication, async (req, res) => {
        const {user_id} = req.body
        const user =await  UserModel.findOne({_id : user_id})
        const {name, email} = user
        res.send({name, email})
    })

    app.post("/calculateBMI", authentication, async (req, res) => {
        const {height, weight, user_id} = req.body;
     const heightOne = Number(height)*0.3048
     const BMI = Number(weight)/(heightOne)**2
     
     res.send({BMI})
   })


   app.get("/getCalculation", authentication, async (req, res) => {

    const {user_id} = req.body;

    const lodhfh = await BMIModel.find({user_id : user_id})

    res.send({history : lodhfh})
})



const PORT = process.env.PORT || 8000

app.listen(8000, async () => {

    try {
        await connection
        console.log('Connected to mongoDB');
    } catch {
        console.log('Failed to connect to mongoDB');
    }

    console.log("PORT running on" + PORT)
})