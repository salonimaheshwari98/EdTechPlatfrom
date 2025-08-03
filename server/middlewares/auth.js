const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");

//auth
exports.auth=async (req,res,next)=>{
           try{

            //extract token
            const token=req.cookies.token  
                         || req.body.token  
                         || req.header("Authorisation").replace("Bearer ","");

                         //if token is missing then return response
                         if(!token){
                            return res.status(401).json({
                                success:false,
                                message:"Token is missing",
                            });
                         }
                         //verify the token the token is verified on the basis of secret key

                         try{
                           const decode= jwt.verify(token,process.env.JWT_SECRET);
                           console.log(decode);
                           req.user=decode;//req k andar user obj mein decode daala

                         }catch(error){
                                //verfication issue
                                return res.status(401).json({
                                    success:false,
                                    message:"Token is invalid",
                                });
                         }
                         next();

//bearer token extraction has to be followed and extracting token from body should be avoided
           }
           catch(error){
            return res.status(401).json({
                success:false,
                message:"Something went wrong while validating the token",
            });

           }
}

//is Student

exports.isStudent=async (req,res,next)=>{
          try{
              //use payload 
              if(req.user.accountType!=="Student"){
                return res.status(401).json({
                    success:false,
                    message:"This is protected routes for students only",

                })
              }
              next();
                 
          }catch(error){
              return res.status(500).json({
                success:false,
                message:"User role cannot be verified, please try again",
              })
          }
}

// is Instructor

exports.isInstructor=async (req,res,next)=>{
    try{
        //use payload 
        if(req.user.accountType!=="Instructor"){
          return res.status(401).json({
              success:false,
              message:"This is protected routes for instructor only",

          })
        }
        next();
           
    }catch(error){
        return res.status(500).json({
          success:false,
          message:"User role cannot be verified, please try again",
        })
    }
}

//is Admin

exports.isAdmin=async (req,res,next)=>{
    try{
        //use payload 
        if(req.user.accountType!=="Admin"){
          return res.status(401).json({
              success:false,
              message:"This is protected routes for admin only",

          })
        } 
        next();
           
    }catch(error){
        return res.status(500).json({
          success:false,
          message:"User role cannot be verified, please try again",
        })
    }
}


