const Section=require("../models/Section");
const Course=require("../models/Course");

exports.createSection=async(req,res)=>{
    try{
       //data fetch
       const{sectionName,courseId}=req.body;
       //data validation
       if(!sectionName||!courseId){
        return res.status(400).json({
            success:false,
            message:`Missing Properties`,
        });
       }
       //create section
       const newSection=await Section.create({sectionName});
       //update course with section id
       const updatedCourseDetails=await Course.findByIdAndUpdate(
                                                          courseId,
                                                        {
                                                            $push:{
                                                                courseContent:newSection._id,
                                                            }
                                                        },
                                                         {new:true}, 
                                                        );
                                                        //use populate to replace sec/subsec both in the updated course details
         return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails,
         })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create section , please try again",
            error:error.message,
        });
    }
}


exports.updateSection=async(req,res)=>{
    try{
        //data input

        const {sectionName,sectionId}=req.body;
        //data validation
          if(!sectionName||!sectionId){
          return res.status(400).json({
            success:false,
            message:`Missing Properties`,
        });
       }
        //update the data
        const section=await Section.findByIdAndUpdate(
                                                       sectionId,
                                                        {
                                                            sectionName
                                                        },
                                                        {new:true},
        );
        return res.status(200).json({
            success:true,
            message:`Section updated successfully`,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update section , please try again",
            error:error.message,
    });
}
};

exports.deleteSection=async (req,res)=>{
    try{
        //get id --- assuming that we are sending id in param

        const {sectionId}=req.params
        //use find by id and delete
        await Section.findByIdAndDelete(sectionId);
        //TODO:do we need to delete the entry from course schema?
        //return resposne
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully",
        })
    }
    catch(error){
          return res.status(500).json({
            success:false,
            message:"Unable to delete section , please try again",
            error:error.message,
    });
}
}