import React from 'react'
import { Button } from "./ui/moving-border"
import Link from 'next/link'

const TagLine = () => {
  return (

    <div className=" text-white lg:my-10 max-w-md: my-0 h-96 flex justify-center items-center relative overflow-hidden object-cover object-center" >
      <img className='w-full absolute lg:h-auto max-w-md: h-[100%]' src="https://res.cloudinary.com/dduiqwdtr/image/upload/f_auto,q_auto/v1/assets/TagLine.jpg" alt="TagLine" />
      <div className="black-layer  absolute h-96 w-full  bg-black opacity-25"></div>
      <div className="content lg:w-[82%] lg:h-[85%] max-w-sm: h-[100%] absolute text-center flex flex-col justify-evenly items-center lg:px-0 max-w-sm: px-4">
        <h1 className=' lg:text-6xl max-w-sm: text-3xl  font-bold'>One Stop Destination For All Type Medical Need.</h1>
        <p className=' lg:text-2xl  max-w-sm: text-md max-w-md:text-xl' >High-Quality Tools for Every Healthcare Need - Advanced Diagnostic Devices, Surgical Instruments, Patient Care Solutions, and Innovative Medical Technology for Hospitals, Clinics, and Home Healthcare Settings</p>
        <div className="button">
          <Link href={"/product"}>
            <Button
              borderRadius="1rem"
              className=" text-white bg-black-800/30  font-semibold text-lg "
            >
              Browse
            </Button>
          </Link>
        </div>
      </div>
    </div>
 

  )
}

export default TagLine