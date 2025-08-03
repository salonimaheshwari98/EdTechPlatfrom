const Course=require("../models/Course");
const Category=require("../models/Category");
const User=require("../models/User");
const {uploadImageToCloudinary}=require("../utils/imageUploader");

//create Course handler function

exports.createCourse=async(req,res)=>{
    try{
        //fetch all the data 
        const {courseName, courseDescription, whatYouWillLearn,price,tag,category}=req.body;

        //get thumbnail
        const thumbnail=req.files.thumbnailImage;

        //validation
        if(!courseName||!courseDescription||!whatYouWillLearn||!price||!tag){
            return res.status(400).json({
                success:false,
                message:`All fields are required `,
            });
        }
        //check for instructor

        const userId=req.user.id;
        const instructorDetails=await User.findById(userId);
        console.log("Instructor Details :",instructorDetails);

        if(!instructorDetails){
            res.status(404).json({
                success:false,
                message:`Instructor Details not found`,
            });
        }

        //check given tag is valid or not
        //the tag receieved here from bbody is an object id
        const categoryDetails=await Category.findById(category);
        if(!categoryDetails){
            res.status(404).json({
                success:false,
                message:`Tag Details not found`,

        })}

        //upload image to cloudinary
        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse=await Course.create ({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            category: categoryDetails._id,
            tag,
            thumbnail:thumbnailImage.secure_url,

        })    
        
        //add the new course to the user schema of instructor

        await User.findByIdAndUpdate(
            {
                _id: instructorDetails._id
            },
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true},
        );

        //update the tag ka schema

        //return response
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Failed to create Course",
            error:error.message,
        })
    }

}


//get all courses handler fucntion

exports.getAllCourses=async (req,res)=>{
    try{
        const allCourses=await Course.find({}, {courseName:true,
                                                 price:true,
                                                 thumbnail:true,
                                                 instructor:true,
                                                 ratingAndReviews:true,
                                                 studentsEnrolled:true,
                                                }) .populate("instructor")   
                                                .exec()  ;
                                                
    return res.status(200).json({
        success:true,
        message:`Data for all courses fetched successfully`,
        data:allCourses,
       })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:`Cannot fetch course data `,
            error:error.message,
        })
    }
}

//get Course Details
exports.getCourseDetails=async (req,res)=>{
  try{

    //fetch course id
    const {courseId}=req.body;
    //find course details
    const courseDetails=await Course.findById(
        {_id:courseId})
        .populate(
            {
                path:"instructor",
                populate:{
                    path:"additionalDetails",
                },
            }
        )
        .populate("category")
        // .populate("ratingandreviews")
        .populate(
            {
                path:"courseContent",
                populate:{
                    path:"subSection",
                },
            }
        ).exec();


        //validation
        if(!courseDetails){
            res.status(400).json({
                success:false,
                message:`Could not find the course with ${courseId}`,
            });
        }

        //return response
        return res.status(200).json({
            success:true,
            message:"Course Details Fetched Successfully",
            data:courseDetails,

        })

  }catch(error){
             console.log(error);
             return res.status(500).json({
                success:false,
                message:error.message,
             });
     }
}

