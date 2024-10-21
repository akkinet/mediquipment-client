import React from 'react'

export const generateMetadata = () => {
  return {
    title: "Blog"
  }
}

function page() {
  return (
    <div className="mt-24 py-[8%]">
        <h1 className="font-bold text-3xl ml-10  text-center">Blog</h1>
    </div>
  )
}

export default page
