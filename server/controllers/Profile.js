/// we have already created the fake profile with null values and we dont need ti create the profile again
//we will just update it


const User=require("../models/User");
const Profile=require("../models/Profile");


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
