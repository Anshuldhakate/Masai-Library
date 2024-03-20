const express= require("express")
const bcrypt= require("bcrypt")
const {UserModel}= require("../models/user.model")
const jwt= require("jsonwebtoken")

const userRouter= express.Router()


userRouter.post("/register", async(req, res)=>{
    // const {name, email, gender, password, age, city}= req.body

    try {
      const { name, email, password, isAdmin } = req.body;
  
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists, please login' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        isAdmin,
      });
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    }
    catch(err){
        res.status(400).json({error:err})
    }
})

userRouter.post("/login", async(req, res)=>{
    const {email, pass}= req.body
    try{
       const user= await UserModel.findOne({email})
       bcrypt.compare(pass, user.pass, (err, result)=>{
        if(result){
            const token= jwt.sign({userId: user._id, user:user.username}, "masai")
            res.status(200).json({msg:"Logged In!", token})
        }
        else{
            res.status(200).json({error:err})
        }
       })
    }
    catch(error){
        res.status(400).json({error:err})
    }
})

module.exports={
    userRouter
}