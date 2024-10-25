'use client'
import Link from 'next/link'

const Category = ({ category }) => {
    const renderSkeletonProducts = () => (
        <div className='rightcontainer lg:h-fit lg:min-w-[90%] lg:p-1 lg:pt-0 grid gap-4 p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 animate-pulse'>
            {[...Array(8)].map((_, i) => (
                <div className='p-2 flex flex-col' key={i}>
                    <div className='border shadow-xl shadow-teal-200/20 border-teal-200 rounded-lg overflow-hidden h-full flex flex-col items-center justify-between'>
                        <div className='h-48 w-full bg-gray-300'></div>
                        <div className='p-4 flex-grow flex flex-col items-center justify-between bg-gray-50 w-full'>
                            <div className='h-6 bg-gray-300 w-3/4 mb-2 rounded'></div>
                        </div>
                    </div>
                </div>   
            ))}
        </div> 
    )
    return (
        <div className='text-black mt-24 lg:flex lg:justify-center lg:mx-20 font-montserrat'>
            {category.length == 0 ? (
                renderSkeletonProducts()
            ) : (
                <div className='rightcontainer lg:h-fit lg:w-[90%] lg:p-1 lg:pt-0 grid gap-4 p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
                    {category.length > 0 ? (
                        category.map(cat => (
                            <div className='p-2 flex flex-col' key={cat.name}>
                                <Link href={`/category/${cat.name}`}>
                                    <div className='border-2 shadow-xl shadow-customBlue/20 border-customBlue rounded-lg overflow-hidden flex flex-col items-center justify-between cursor-pointer transition-transform duration-200 transform hover:scale-105 '>
                                        <div className='h-48 w-full flex items-center justify-center bg-white'>
                                            <img
                                                className='max-h-full max-w-full object-contain p-4'
                                                src={cat.image}
                                                alt={cat.name}
                                            />
                                        </div>
                                        <div className='p-4 flex-grow flex flex-col items-center justify-between bg-customBlue w-full'>
                                            <h1 className='title-font text-md font-medium text-white text-center line-clamp-1'>
                                                {cat.name}
                                            </h1>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className='text-center'>No Item found</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Category
