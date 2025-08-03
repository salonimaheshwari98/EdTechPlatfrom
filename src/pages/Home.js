import React from 'react'
import "../App.css"
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from "../components/core/HomePage/Button"
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import TimeLineSection from "../components/core/HomePage/TimeLineSection"
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import InstructorSection from '../components/core/HomePage/InstructorSection'
import Footer from "../components/common/Footer"
import ExploreMore from '../components/core/HomePage/ExploreMore'


const Home = () => {
  return (
    <div>
      {/* Section One */}
      <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent text-white items-center justify-between'>
        <Link to={"/signup"}>
        <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200ms hover:scale-95 w-fit'>
            <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200ms group-hover:bg-richblack-900'>
                <p>Become an Instructor</p>
                <FaArrowRight/>
            </div>
        </div>
        </Link>

        <div className='text-center text-4xl font-semibold mt-8'>
          Ignite Your Future with 
          <HighlightText text={"Programming Power"}/> 
        </div>
        <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
       Whether you're just starting out or looking to advance your skills, our coding programs are designed to equip you with the tools, confidence, and real-world experience needed to thrive in today’s tech-driven world.
        </div>
          <div className='flex flex-row gap-7 mt-8'>
            <CTAButton active={true} linkto={"/signup"}>
              Learn More
            </CTAButton>

            <CTAButton active={true} linkto={"/login"}>
              Book a Demo
            </CTAButton>

          </div>
          <div className='mx-3 my-12 shadow-[10px_-5px_50px_-5px] shadow-blue-200'>
            <video className='shadow-[20px_20px_rgba(255,255,255)]' 
            muted loop autoPlay >
           <source src={Banner} type='video/mp4'/>
            </video>
          </div>
         {/*Code Section 2 */}
         <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className='text-4xl font-semibold'>
                Unloc Your
                <HighlightText text={"coding potential"}/>
                with our online courses
                </div>
            }
            subheading={
              "Browse a wide range of professionally designed courses across categories like technology, business, design, personal development, and more. Each course is crafted by experienced instructors and designed to deliver real-world value."
            }
            ctabtn1={
              {
                btnText:"Try It Yourself",
                linkto:"/signup",
                active:true,
              }
            }
           ctabtn2={
              {
                btnText:"Learn More",
                linkto:"/signup",
                active:false,
              }
            }
             codeColor={"text-yellow-25"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
               backgroundGradient={<div className="codeblock1 absolute"></div>}

          />
          </div> 

           <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className='w-[100%] text-4xl font-semibold lg:w-[50%]'>
                Start 
                <HighlightText text={"Coding in Seconds"}/>
                
                </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={
              {
                btnText:"Continue Lesson",
                linkto:"/signup",
                active:true,
              }
            }
           ctabtn2={
              {
                btnText:"Learn More",
                linkto:"/signup",
                active:false,
              }
            }
            codeColor={"text-yellow-25"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock2 absolute"></div>}

          />
          </div>        
    
         <ExploreMore/>

      </div>

       {/* Section Two */}

       <div className='bg-pure-greys-5 text-richblack-700'>

      <div className='homepage_bg h-[333px]'>
         <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
         <div className='h-[150px]'></div>
          <div className='flex flex-row gap-7 text-white'>
             <CTAButton active={true} linkto={"/signup"}>
             <div className='flex gap-3 items-center' >
              Explore Full Catalog
              <FaArrowRight/>
             </div>
             </CTAButton>
             <CTAButton active={false} linkto={"/signup"}>
             Learn More
             </CTAButton>
          </div>
         </div>


      </div>
      <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
      <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
        <div className='text-4xl font-semibold w-[45%]' >
          Get The Skills You Need For A
          <HighlightText text={"Job That Is In Demand"}/>
        </div>


         <div className='flex flex-col gap-10 w-[40%] items-start'>
         <div className='text-[16px]'>
          The modern Eduvate is the dictates its own terms. Today, to
          be a competitive specialist requires more than professional
          skills.
         </div>
         <CTAButton active={true} linkto={"/signup"}>
           <div>
            Learn More
           </div>
         </CTAButton>
       </div>
      </div>
       <TimeLineSection/>

       <LearningLanguageSection/>
      </div>
       </div>

      


       {/* Section Three */}


      <div className='w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>
               <InstructorSection/>
               <h2 className='text-center text-4xl font-semibold mt-10'>Reviews From Other Learners </h2>

               {/* Reviews Slider here */}


      </div>
    






        {/* Footer */}
        <Footer/>


    </div>
  )
}

export default Home
