import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-customDarkGray text-white body-font lg:flex lg:flex-col-reverse mt-6">
      <div className="bg-customBaseBlue text-black">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-white-500 text-sm text-center sm:text-left">© 2024 All Rights are reserved  — @medsupply</p>
          <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-white-500 text-sm">Design and Developed by: <b>Akash Sharma</b>, <b>Shivam Awasthi</b>, <b>Akshay Bairwa</b></span>
        </div>
      </div>
      <div className="container px-5 mx-auto mb-16">
        <div className="flex flex-wrap justify-around md:text-left text-center -mb-10 -mx-4">
          <div className="lg:w-1/6 md:w-1/2 w-full px-4 leading-8">
            <div className="flex lg:justify-start justify-center">
              <img className="lg:w-[50%] w-[20%]" src="https://images.squarespace-cdn.com/content/v1/60aefe75c1a8f258e529fbac/1622081456984-G5MG4OZZJFVIM3R01YN7/jkare-2.png?format=1500w" alt="" />
            </div>
            <nav className="list-none mb-10">
              <li className="text-white cursor-pointer">Call Us: 305-266-6701</li>
              <li className="text-white cursor-pointer">Toll Free: 855-717-7378</li>
              <li className="text-white cursor-pointer">info@hexerve.com</li>
            </nav>
          </div>

          <div className="lg:w-1/6 md:w-1/2 w-full px-4 leading-8">
            <h2 className="title-font font-large text-white-900 tracking-widest text-lg mb-3">Information</h2>
            <nav className="list-none mb-10">
              <li>
                <Link href="/about-us" className="text-white hover:text-pink-500 cursor-pointer">About Us</Link>
              </li>
              <li>
                <Link href="/blog" className="text-white hover:text-pink-500 cursor-pointer">Blog</Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-white hover:text-pink-500 cursor-pointer">Contact Us</Link>
              </li>
              <li>
                <Link href="/" className="text-white hover:text-pink-500 cursor-pointer">Home</Link>
              </li>
            </nav>
          </div>

          <div className="lg:w-1/6 md:w-1/2 w-full px-4 leading-8">
            <h2 className="title-font font-large text-white-900 tracking-widest text-lg mb-3">Products</h2>
            <nav className="list-none mb-10">
              <li>
                <Link href="/category/Oxygen Therapy Devices" className="text-white hover:text-pink-500 cursor-pointer">Oxygen Therapy Devices</Link>
              </li>
              <li>
                <Link href="/category/Pap Devices" className="text-white hover:text-pink-500 cursor-pointer">Pap Devices</Link>
              </li>
              <li>
                <Link href="/category/Oxygen Concentrators" className="text-white hover:text-pink-500 cursor-pointer">Oxygen Concentrators</Link>
              </li>
              <li>
                <Link href="/category/CPAP Masks" className="text-white hover:text-pink-500 cursor-pointer">CPAP Masks</Link>
              </li>
            </nav>
          </div>

          <div className="lg:w-1/5 md:w-1/2 w-full px-4 leading-8">
            <h2 className="title-font font-large text-white-900 tracking-widest text-lg mb-3">Additional Resources</h2>
            <nav className="list-none mb-10">
              <li>
                <Link href="#" className="text-white hover:text-pink-500 cursor-pointer">Medical Equipment and Supplies</Link>
              </li>
              <li>
                <Link href="#" className="text-white hover:text-pink-500 cursor-pointer">Medical oxygen and Supplies</Link>
              </li>
              <li>
                <Link href="#" className="text-white hover:text-pink-500 cursor-pointer">Healthcare Services and Staffing</Link>
              </li>
            </nav>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-evenly lg:flex-row flex-col">
        <div className="upper-footer">
          <p className="lg:text-4xl text-2xl text-center font-bold text-white mb-16">Stay in the loop with exclusive discounts!</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;