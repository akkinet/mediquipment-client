'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const transition = {
  type: 'spring',
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001
}

export const MenuItem = ({ setActive, active, item, children }) => {
  return (
    <div onMouseEnter={() => setActive(item)} className='relative '>
      <motion.p
        transition={{ duration: 0.3 }}
        // Navbar styling Properties
        className='cursor-pointer text-white hover:text-customPink lg:text-lg lg:font-normal md:font-light'
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && children && (
            <div className='absolute top-[calc(100%_+_0.5rem)] left-1/2 transform -translate-x-1/2 pt-4'>
              <motion.div
                transition={transition}
                // layoutId ensures smooth animation
                layoutId='active'
                className=' bg-white  backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl'
              >
                <motion.div
                  // layout ensures smooth animation
                  layout
                  className='w-max h-full p-4 '
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export const Menu = ({ setActive, children }) => {
  return (
    <nav
      // resets the state
      onMouseLeave={() => setActive(null)}
      className='relative w-full
      shadow-input flex justify-center space-x-8 px-8 py-2  '
    >
      {children}
    </nav>
  )
}

export const ProductItem = ({ title, description, href, src }) => {
  return (
    <Link href={href} className='flex space-x-2'>
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className='flex-shrink-0 rounded-md shadow-2xl'
      />
      <div>
        <h4 className='text-xl font-bold mb-1 text-black  dark:text-white'>
          {title}
        </h4>
        <p className='text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300'>
          {description}
        </p>
      </div>
    </Link>
  )
}

export const HoveredLink = ({ children, ...rest }) => {
  return (
    <Link {...rest} className='text-black  hover:text-customPink'>
      {children}
    </Link>
  )
}
