import Link from 'next/link';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      className="relative text-white body-font"
      style={{
        backgroundImage:
          'url(https://s3.ap-south-1.amazonaws.com/medicom.hexerve/footer+base+image+1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity:0.9,

      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(255, 255, 240, 0.9), rgba(135, 62, 133, 0.9), rgba(171, 177, 255, 0.9))',
        }}
      ></div>

      <div className="relative z-10 container mx-auto py-8 px-5 flex flex-col items-center">
        {/* Main Content Section */}
        <div className="flex flex-wrap justify-between items-start w-full max-w-6xl border-b-2 border-customPink">
          {/* Logo Section */}

          <div className="flex flex-col items-start lg:w-1/3 mb-6 ">
            <img
              src="https://images.squarespace-cdn.com/content/v1/60aefe75c1a8f258e529fbac/1622081456984-G5MG4OZZJFVIM3R01YN7/jkare-2.png?format=1500w"
              alt="JKARE Logo"
              className="w-40 lg:w-48 mb-4"
            />
            <p className="text-lg text-black italic">
              "Oxygen for Life, Care for You" reflects JKARE’s mission to provide vital oxygen
              services with compassionate, personalized care.
            </p>
            <div className="mt-4">
              <p className="font-semibold mb-2 text-black text-xl">Social Media</p>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-14 h-14 border border-black text-black hover:border-customPink rounded-full hover:bg-customPink hover:text-white transition"
                >
                  <FaInstagram size={34} />
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-14 h-14 border border-black text-black hover:border-customPink rounded-full hover:bg-customPink hover:text-white transition"
                >
                  <FaFacebook size={34} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-14 h-14 border border-black text-black hover:border-customPink rounded-full hover:bg-customPink hover:text-white transition"
                >
                  <FaTwitter size={34} />
                </a>
              </div>
            </div>
          </div>



          {/* Quick Links Section */}
          <div className="flex flex-col  ">
              <h2 className="text-xl font-semibold mb-3 ">Quick Links</h2>
            <div className='flex'>
            <div className="mr-10 ">
              <ul className="space-y-2 text-sm lg:text-base">
                <li>
                  <Link href="/" className="hover:text-black">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about-us" className="hover:text-black">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-black">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-black">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/employment" className="hover:text-black">
                    Employment
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-black">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div className=' '>
              <ul className="space-y-2 text-sm lg:text-base">
                <li>
                  <Link href="/shop" className="hover:text-black">
                    Shop All Products
                  </Link>
                </li>
                <li>
                  <Link href="/partnership" className="hover:text-black">
                    Online Partnership
                  </Link>
                </li>
                <li>
                  <Link href="/return-policy" className="hover:text-black">
                    Return Policy
                  </Link>
                </li>
                <li>
                  <Link href="/submit-prescription" className="hover:text-black">
                    Submit Prescription
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="hover:text-black">
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link href="/patient-resources" className="hover:text-black">
                    Patient Resources
                  </Link>
                </li>
              </ul>
            </div>
            </div>
          </div>

          {/* JKARE Services Section */}
          <div className="flex flex-col lg:w-1/3 mb-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">JKARE Services</h2>
              <ul className="space-y-2 text-sm lg:text-base">
                <li>
                  <Link href="#" className="hover:text-black">
                    In-home Clinical Respiratory Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black">
                    Medical Equipment and Supplies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black">
                    Medical Oxygen and Supplies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black">
                    Healthcare Recruitment Staffing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Signup for Newsletter</h2>
              <form className=" flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-2 rounded-md text-black focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="submit"
                  className=" ml-8 w-[50%] bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-md"
                >
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-4  text-md text-black flex  justify-between ">
          <p>
            Copyright © 2024 JKARE All Rights Reserved. 
          </p>
          <p>
          |{' '}
            <Link href="/privacy-policy" className="hover:text-black">
              Privacy Policy
            </Link>{' '}
            |{' '}
            <Link href="/cookie-policy" className="hover:text-black">
              Cookie Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
