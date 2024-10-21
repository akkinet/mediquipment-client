import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-customDarkGray text-white body-font lg:flex 
    lg:flex-col-reverse mt-6 max-w-sm: flex max-w-sm: flex-col-reverse ">
      <div className="bg-customBaseBlue text-black">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-white-500 text-sm text-center sm:text-left">© 2024 All Rights are reserved  —
            <Link href="https://twitter.com/medsupply" className="ml-1" target="_blank" rel="noopener noreferrer">@medsupply</Link>
          </p>
          <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-white-500 text-sm">Design and Developed by :  <b>Akash Sharma</b> , <b>Shivam Awasthi</b> , <b>Akshay Bairwa </b></span>
        </div>
      </div>
      <div className="container px-5  mx-auto  ">
        <div className="flex flex-wrap justify-around md:text-left text-center -mb-10 -mx-4">
          <div className="lg:w-1/6 md:w-1/2 w-full px-4 leading-8 ">
            <div className=" flex lg:justify-start max-w-sm: justify-center">
              <img className='lg:w-[50%] max-w-sm: w-[20%]' src="https://images.squarespace-cdn.com/content/v1/60aefe75c1a8f258e529fbac/1622081456984-G5MG4OZZJFVIM3R01YN7/jkare-2.png?format=1500w" alt="" />
            </div>
            <nav className="list-none mb-10">
              <li className="text-white hover:text-pink-500 cursor-pointer">
                Call Us: 305-266-6701
              </li>
              <li className="text-white hover:text-pink-500 cursor-pointer">
                Toll Free: 855-717-7378
              </li>
              <li className="text-white hover:text-pink-500 cursor-pointer">
                info@hexerve.com
              </li>
            </nav>
          </div>
          <div className="lg:w-1/6 md:w-1/2 w-full px-4 leading-8">
            <h2 className="title-font font-large  text-white-900 tracking-widest text-lg mb-3">Information</h2>
            <nav className="list-none mb-10">
              <li>
                <Link href={"#"} className="text-white hover:text-pink-500 cursor-pointer">About Us</Link>
              </li>
              <li>
                <Link href={"#"} className="text-white hover:text-pink-500 cursor-pointer">Store Location</Link>
              </li>
              <li>
                <Link href={"#"} className="text-white hover:text-pink-500 cursor-pointer">Site Map</Link>
              </li>
              <li>
                <Link href={"#"} className="text-white hover:text-pink-500 cursor-pointer">Orders and Returns</Link>
              </li>
              <li>
                <Link href={"#"} className="text-white hover:text-pink-500 cursor-pointer">Contact Us</Link>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/6 md:w-1/2 w-full px-4 leading-8">
            <h2 className="title-font font-large  text-white-900 tracking-widest text-lg mb-3">Products</h2>
            <nav className="list-none mb-10">
              <li>
                <Link href={"/category/66a4b84c1734bf6be9656016"} className="text-white hover:text-pink-500 cursor-pointer">Diagnostics</Link>
              </li>
              <li>
                <Link href={"/category/66a4b8501734bf6be965601e"} className="text-white hover:text-pink-500 cursor-pointer">Respiratory</Link>
              </li>
              <li>
                <Link href={"/category/66a4b85d1734bf6be9656029"} className="text-white hover:text-pink-500 cursor-pointer">Mobility Aids</Link>
              </li>
              <li>
                <Link href={"/category/66a4b8641734bf6be9656031"} className="text-white hover:text-pink-500 cursor-pointer">Hospital Furniture</Link>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/6 md:w-1/2 w-full px-4 leading-8">
            <h2 className="title-font font-large  text-white-900 tracking-widest text-lg mb-3">Additional Resources</h2>
            <nav className="list-none mb-14">
              <li>
                <Link href={"#"} className="text-white hover:text-pink-500 cursor-pointer">Upload RX</Link>
              </li>
              <li>
                <Link href={"#"} className="text-white hover:text-pink-500 cursor-pointer">RX Form</Link>
              </li>
              <li>
                <Link href={"#"} className="text-white hover:text-pink-500 cursor-pointer">Travel Tips</Link>
              </li>
              <li>
                <Link href={"#"} className="text-white hover:text-pink-500 cursor-pointer">What is Sleep Apnea</Link>
              </li>
              <li>
                <Link href={"#"} className="text-white hover:text-pink-500 cursor-pointer">Prescription Policy</Link>
              </li>
              <li>
                <Link href={"#"} className="text-white hover:text-pink-500 cursor-pointer">Terms and Conditions</Link>
              </li>
              <li>
                <Link href={"#"} className="text-white hover:text-pink-500 cursor-pointer">Secure Shopping</Link>
              </li>
              <li>
                <Link href={"#"} className="text-white hover:text-pink-500 cursor-pointer">Track My Order</Link>
              </li>
            </nav>
          </div>

        </div>
      </div>
      <div className=" mt-10 flex items-center justify-evenly lg:flex-row max-w-sm: flex-col ">
        <div className=" upper-footer">
          <p className='lg:text-4xl  max-w-sm: text-2xl text-center font-bold text-white'>Stay in the loop with exclusive discounts!</p>
        </div>
        <div className="lg:px-5 max-w-sm: px-10 py-8 lg:w-auto max-w-sm: w-full">
          <div className=" w-full lg:flex lg:flex-row  flex-wrap justify-center items-center md:justify-start max-w-sm: flex max-w-sm: flex-col ">
            <div className=" relative   sm:mr-4 mr-2 ">
              <input type="mail" id="footer-field" name="footer-field" placeholder='Your Email Address' className="w-full  rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-customPink focus:border-customPink text-base outline-none text-black  py-1 px-3 leading-8 bg-white" />
            </div>
            <button className="inline-flex text-white bg-customPink border-0 py-2 px-6 focus:outline-none hover:bg-customBlue rounded lg:mt-0 max-w-sm: mt-4">Subscribe</button>
          </div>

        </div>
      </div>

    </footer>
  )
}

export default Footer