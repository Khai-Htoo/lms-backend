import asyncHandler from "express-async-handler";
import { decodedToken } from "../utils/decodedToken.js";

export const checkAuth = asyncHandler(async (req,res,next) => {
      const user = await decodedToken(req,res);
      if(!user){
          res.status(400).json('Please login first')
      }
      next()
  })

export const isAdmin = asyncHandler(async(req,res,next)=>{
  const user = await decodedToken(req,res);
  if(!user){
    return  res.status(400).json('Please login first')
  }
  if(user.role != 'admin'){
    return  res.status(400).json('no permission')
  }
  next()
})