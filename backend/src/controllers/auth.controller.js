import { generateToken } from '../lib/utils.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'
export const signup=async (req,res)=>{
  const {fullName,email,password}=req.body
  try{
    if(!fullName||!email||!password){
      return res.status(400).json({message:"All fields are required"})
    }
if(password.length<6){
  return res.status(400).json({message:"Password must be atleast 6 characters"})
}
const user=await User.findOne({email})
if (user) return  res.status(400).json({messages:"Email alreadyy exists"})
const salt=await bcrypt.genSalt(10)
const hashedPassword=await bcrypt.hash(password,salt)
const newUser=new User({
  fullName,
  email,
  password:hashedPassword
})
if(newUser){
generateToken(newUser._id,res)
await newUser.save()
res.status(201).json({
  _id:newUser._id,
  fullName:newUser.fullName,
  email:newUser.email,
  profilePic:newUser.profilePic
})
}else{
  res.status(400).json({message:"Invalid User"})
}
  }catch(error){
console.log("Error in signup controller",error.message)
res.status(500).json({message:"Internal Server message"})
  }
}
export const login=async (req,res)=>{
  const {email,password}=req.body
  try{
    // FIX 1: Retrieve the hashed password
    const user = await User.findOne({email}).select('+password'); 
    
    if(!user){
      return res.status(400).json({message:"Invalid credentials"})
    }
    
    // Check if the retrieved user has a password field before comparing (safety check)
    if (!user.password) {
        return res.status(500).json({message:"Server error: User data corrupted."})
    }

    const isPasswordCorrect=await bcrypt.compare(password,user.password)
    
    if(!isPasswordCorrect){
      return res.status(400).json({message:"Invalid credentials"})  
    }
    
    // FIX 2: Remove the password field from the object BEFORE generating the token
    user.password = undefined; // Prevents sending the hash to the client or token
    
    // Assuming generateToken is defined elsewhere
    generateToken(user._id,res)

    res.status(200).json({
      _id:user._id,
      fullName:user.fullName,
      email:user.email,
      profilePic:user.profilePic
    })
  }catch(error){
    // This logs the generic error message. Look at the backend terminal for the specific stack trace!
    console.log("Error in login ",error.message) 
    res.status(500).json({message:"Internal Server Error"})
  }
}
export const logout=(req,res)=>{
  try{
res.cookie("jwt","",{maxAge:0})
res.status(200).json({message:"Logged out successfully"})
  }catch(error){
console.log("Error in logout ",error.message)
  }
}
export const updateProfile=async (req,res)=>{
  try{
    const {profilePic}=req.body
   const userId= req.user._id
   if(!profilePic){
    return res.status(400).json({message:"Profile pic is required"})
   }
   const uploadResponse=await cloudinary.uploader.upload(profilePic)
   const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
   res.status(200).json(updatedUser)
  }catch(error){
console.log("error in update profile: ",error)
  }
}
export const checkAuth=async (req,res)=>{
  try{
    res.status(200).json(req.user)
  }catch(error){
    console.log("Error in checkAuth controller:", error)
    res.status(500).json({message:"Internal Server Error in checkAuth"})
  }
}