const Category=require("../models/Category");

//create tag ka handler function

exports.createCategory=async(req,res)=>{
    try{

        //data nikal liya req ki body mein seh
          const {name,description}=req.body

          //validation karna hai
          if(!name|| !description){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            })
          }

          //create entry in db
          const categoryDetails=await Category.create({
            name:name,
            description:description,//name aur des k andar daaldiya data
          });
          console.log(categoryDetails);

          return res.status(200).json({
            success:true,
            message:"Category reated successfully",
          })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

//getAlltags handler fucntion

exports.showAllCategory=async(req,res)=>{
    try{
        const allCategory=await Category.find({}, {name:true, description:true});
        // hum kisi criteria k basis peh find nhi karahe par joh bhi data fetch karahe usmein name and des hona chaiye
        res.status(200).json({
            success:true,
            message:"All tags returned successfully",
            allCategory,//saare tags ko successfully return kardiya 
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

//category page details
  exports.categoryPageDetails=async(req,res)=>{
    try{
       //get categoryid
       const {categoryId}=req.body;


       //category k coressponding jitne bhi courses h unko fetch karlo
        const selectedCategory=await Category.findById(categoryId)
                                         .populate("courses")
                                         .exec();


       //validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:'Data Not Found',
            });
        }

       //get courses for diffrent categories
       const differentCategories=await Category.find({
                                       _id:{$ne:categoryId},//ne means not equal
       })
       .populate("courses")
       .exec();

       //get top selling courses
       //HW-->write it on your own


       //return 

       return res.status(200).json({
          success:true,
          data:{
            selectedCategory,
            differentCategories,
          },
       })
    }catch(error){
         console.log(error);
         return res.status(500).json({
            success:false,
            message:error.message,
         })
    }
  }

