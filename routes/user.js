const router=require("express").Router();
const User=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {authenticateToken}=require("./userAuth");
//sign-up
router.post("/sign-up",async(req,res)=>{
  try {
    const {username,email,password,address}=req.body;
    //check username length is more than 3
    if(username.length<=3){
      return res.status(400).json({message:"Username length should be greater than 3"});
    }
    //check username already exists or not
    const existingusername=await User.findOne({username:username});
    if(existingusername){
      return res.status(400).json({message:"Username already Exists"});
    }
    // check email already exists or not
    const existingemail=await User.findOne({email:email});
    if(existingemail){
      return res.status(400).json({message:"Email-Id already Exists"});
    }

    //check password length
    if(password.length<=5){
      return res.status(400).json({message:"Password length should be greater than 5"});
    }
    //hashing password
    const hashPass=await bcrypt.hash(password,10);
    //create user
    const newUser=new User({username:username,email:email,password:hashPass,address:address});

    await newUser.save();
    return res.status(200).json({message:"SignUp Scucessfull"})
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
});
//sign-in
router.post("/sign-in",async(req,res)=>{
  try {
    const {username,password}=req.body;
    const existingUser=await User.findOne({username});
    if(!existingUser){
      return res.status(400).json({message:"Invalid credential"});
    }
    await bcrypt.compare(password,existingUser.password,(err,data)=>{
      if(data){
        const authClaims=[
          {name:existingUser.username},
          {role:existingUser.role},
        ];
        const token =jwt.sign({authClaims},"bookstore123",{
          expiresIn:"30d",
        });
        return res.status(200).json({id:existingUser._id,role:existingUser.role,token:token});
      }
      else{
        return res.status(400).json({message:"Invalid credential"});
      }
    })
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
});
// get user-information
router.get("/get-user-information",authenticateToken,async(req,res)=>{
  try {
    const {id}=req.headers;
    const data=await User.findById(id).select("-password");
    return res.status(200).json(data);
    
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
});
//update address
router.put("/update-address",authenticateToken,async (req,res)=>{
  try {
    const {id}=req.headers;
    const {address}=req.body;
    await User.findByIdAndUpdate(id,{address:address})
    return res.status(200).json({message:"address updated sucessfully"});
    
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
})
module.exports=router;