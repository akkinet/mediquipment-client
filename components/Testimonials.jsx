"use client"
import React, { useState, useEffect } from 'react'
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const testimonials = [
  {
    rating: 4.5,
    text: 'This website made buying medical equipment effortless. The process was incredibly smooth, with a fast and simple checkout. Excellent service and high-quality.',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/testimonials/shivamchokha.jpg',
    name: 'SHIVAM AWASTHI',
    role: 'Front end developer'
  },
  {
    rating: 4.9,
    text: 'Shopping for medical equipment here was fantastic! The site is easy to navigate, the checkout process was quick, and I received my order in no time. The quality of the products is exceptional.',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/testimonials/akash.jpg',
    name: 'AKASH SHARMA',
    role: 'Lead Developer'
  },
  {
    rating: 4.8,
    text: 'I had a fantastic experience with this website. The user-friendly design ensured a hassle-free shopping experience, and the quick delivery exceeded my expectations.',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/testimonials/kashish.jpg',
    name: 'KASHISH SAINI',
    role: 'WordPress Developer'
  },
  {
    rating: 4.1,
    text: 'Shopping for medical equipment here was fantastic! The site is easy to navigate, the checkout process was quick, and I received my order in no time. The quality of the products is exceptional.',
    imgSrc: 'https://s3.ap-south-1.amazonaws.com/medicom.hexerve/testimonials/akshay.jpg',
    name: 'AKSHAY BAIRWA',
    role: 'UI/UX Designer'
  }
]

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }

    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 640)
      window.addEventListener('resize', handleResize)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - (isMobile ? 1 : 3) : prevIndex - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= testimonials.length - (isMobile ? 1 : 3) ? 0 : prevIndex + 1
    )
  }

  const currentTestimonials = testimonials.slice(currentIndex, currentIndex + (isMobile ? 1 : 3))

  return (
    <section className='py-8'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <h1 className='lg:text-5xl sm: text-3xl font-bold mb-3 text-center font-montserrat tracking-tighter'>
            Customer Testimonials
          </h1>
          <p className='text-center mb-3 lg:text-xl sm:text-md'>
            Discover how our top-quality medical equipment has transformed lives. Hear firsthand experiences from our satisfied customers who trust us for their healthcare needs and unparalleled support.
          </p>
        </div>

        <div className='flex justify-center items-center'>
          <button onClick={handlePrev} className='p-2'>
            <FaChevronLeft size={24} />
          </button>
          <div className='flex gap-4'>
            {currentTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className='group bg-white border-2 hover:border-customPink rounded-xl p-6 transition-all duration-500 w-full max-w-md cursor-pointer'
              >
                <div>
                  <div className='flex items-center mb-7 gap-2 text-amber-500 transition-all duration-500'>
                    <FaStar />
                    <span className='text-base font-semibold text-customBlue'>
                      {testimonial.rating}
                    </span>
                  </div>
                  <p className='text-base text-gray-600 leading-6 transition-all duration-500 pb-8 group-hover:text-gray-800 line-clamp-5'>
                    {testimonial.text}
                  </p>
                </div>
                <div className='flex items-center gap-5 border-t border-solid border-customPink/80 pt-5'>
                  <img
                    className='rounded-full h-10 w-10'
                    src={testimonial.imgSrc}
                    alt='avatar'
                  />
                  <div>
                    <h5 className='text-gray-900 font-medium transition-all duration-500 mb-1'>
                      {testimonial.name}
                    </h5>
                    <span className='text-sm leading-4 text-gray-500'>
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleNext} className='p-2'>
            <FaChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
