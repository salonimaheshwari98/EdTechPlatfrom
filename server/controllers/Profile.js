/// we have already created the fake profile with null values and we dont need ti create the profile again
//we will just update it

const CourseProgress = require("../models/CourseProgress")
const User=require("../models/User");
const Profile=require("../models/Profile");
const Course = require("../models/Course")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../utils/secToDuration")


exports.updateProfile=async (req,res)=>{
    try{
      //get the required data
      const{gender,dateofBirth="",about="",contactNumber=""}= req.body;

      //fetch the user data
      const id=req.user.id;//auth middleware me decode karte waqt humne payloade ko user mein bheja hain so hum id leliye waha seh
      //validate the data
      if(!contactNumber||!gender||!id){
        return res.status(400).json({
            success:false,
            message:`All fields are required`,
        })
      }
      //find the profile and 
      const userDetails=await User.findById(id);
      const profileId= userDetails.additionalDetails;
      const profileDetails=await Profile.findById(profileId);

      //update it
      profileDetails.dateOfBirth=dateofBirth;
      profileDetails.about=about;
      profileDetails.gender=gender;
      profileDetails.contactNumber=contactNumber;//obj bna pda h so abh sidhe save func use hoga
      await profileDetails.save();

      //return response
      return res.status(200).json({
        success:true,
        message:`Profile updated successfully`,
        profileDetails,
      });

    }
    catch(error){
     return res.status(500).json({
        success:false,
        error:error.message,
     })
    }
}

//delete account

exports.deleteAccount=async(req,res)=>{
    try{
        //get id
      const id=req.user.id;

        //validation
      const userDetails=await User.findById(id);
      if(!userDetails){
        return res.status(404).json({
            success:false,
            message:`User not found`,
        });
      }

        //delete the profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
          //to do hw---> unenrolled user from all enrolled courses
        //delete the user
        await User.findByIdAndDelete({_id:id});

      
        //return response
        return res.status(200).json({
            success:true,
            message:`User Deleted Successfully`,
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:`User cannot be deleted successfully`,
        });
    }
}

exports.getAllUserDetails=async(req,res)=>{
    try{

        //get id
        const id=req.user.id;

        //validation and get user deatils
        const userDetails=await User.findById(id).populate("additionalDetails").exec();

        //return response
        return res.status(200).json({
            success:true,
            message:`User Data Fetched Successfully`,
            userDetails,
        });


      
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
            userDetails,
        });
    }
}
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()
    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}