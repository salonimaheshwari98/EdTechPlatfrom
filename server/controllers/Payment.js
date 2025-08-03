const mongoose = require('mongoose');
const {instance}=require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");



//capture the payment and initate the razorpay order
exports.capturePayment=async(req,res)=>{
    //get courseid and user id
    const{course_id}=req.body;
    const userId=req.user.id;
     //validation 
     //valid course id 
     if(!course_id){
        return res.json({
            status:false,
            message:"Please provide valid course ID",
        })
     }
     //valid course detaiks
     let course;
     try{
        course=await Course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:"Could not find the course",
            });
        }
        //user already paid for the same course

        if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
            const uid = new mongoose.Types.ObjectId(userId);//conversion of userid string type into object id
                 } else {
             throw new Error("Invalid ObjectId format");
           };
           if(course.studentsEnrolled.includes(uid)){
              return res.status(200).json({
                success:false,
                message:"Student is already enrolled",
              });
           }

     }catch(error){
          console.error(error);
          return res.status(500).json({
            success:false,
            message:error.message,
          })
     }
     
     //create order 
     const amount=course.price;
     const currency="INR";

     const options={
        amount: amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId,
        }
     };
     try{
         //initatte the payment using razorpay
         const paymentResponse=await instance.orders.create(options);//i have created the order
         console.log(paymentResponse);
           //return response
         return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
         });

     }catch(error){
          console.log(error);
          res.json({
            success:false,
            message:"Could not initatethe order",
          })
     }
    
};

//verify signature of razorpay and server 
  exports.verifySignature=async(req,res)=>{
    const webhookSecret="12345678";


    const signature=req.header("x-razorpay-signature");//razor pay seh aaya hain secret

    const shasum = crypto.createHmac("sha256",webhookSecret);

    shasum.update(JSON.stringify(req.body));

    const digest=shasum.digest("hex");
    //webhook secret ko convert kiya digest k andar

    //match webhook secret and signature

    if(signature===digest){
      console.log("Payment is authorised");
    

    //user aur course id abhki baar req seh nhi aayegi kyu ki req frontend seh nhi aayi h razor pay se aayi h
    //so notes ka istemaal karenge bcoz notes mein humne daala hai
     const {courseId,userId}=req.body.payload.payment.entity.notes;

     try{
         //fullfill the action

         //find the course and enroll the student in it
         const enrolledCourse=await Course.findOneAndUpdate(
          {_id:courseId},
          {$push:{studentsEnrolled:userId}},
          {new:true},
         );

         if(!enrolledCourse){
          return res.status(500).json({
            success:false,
            message:`Course not found`,
          });
         }

         console.log(enrolledCourse);
          
         //find the student and add the course to their list of enrolled courses
         const enrolledStudent=await User.findOneAndUpdate({_id:userId},
          {$push:{course:courseId}},
          {new:true},
         );

         console.log(enrolledStudent);

         ////WILL SEND THE MAIL FOR ENROLLMENT!
         const emailResponse=await mailSender(
                                         enrolledStudent.email,
                                         "Congratulations from Codehelp",
                                         "Congratulaions, u are enboarded into new course",
         );

         console.log(emailResponse);

         return res.status(200).json({
          success:true,
          message:"Signature Verified and Course Added",
         });


     }catch(error){
       console.log(error);
       return res.status(500).json({
        success:false,
        message:error.message,
       });
     }
}
else{
  return res.status(400).json({
    success:false,
    message:"Invalid Request",
  });
}
 };
