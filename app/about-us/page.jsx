import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[450px] w-full">
        <Image
          src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/Shutterstock%2B350925269.jpg"
          alt="About JKARE Hero"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
        {/* White Box for 'About JKARE' on the bottom left */}
        <div className="absolute bottom-10 left-10 bg-white px-8 py-4 shadow-md">
          <h1 className="text-customBlue text-3xl font-bold">About JKARE</h1>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 px-8 text-center">
        <h2 className="text-customBlue text-4xl font-semibold">The Story of JKARE</h2>
        <p className="text-customPink text-lg mt-2">Written by Karen Alba</p>
        <p className="text-gray-600 font-medium">Vice President of JKARE Miami</p>

        <div className="mt-10 max-w-6xl mx-auto text-lg text-gray-700 leading-relaxed">
          <p>
            “Our son, Diego, was born in 2002. From an early age, he suffered from respiratory complications and spent a lot of time in the hospital
            with chronic asthma and pneumonia. It was not until May of 2007 that he was finally diagnosed with Cystic Fibrosis, a life-threatening
            genetic disease that affects the lungs and the digestive system. Diego started receiving respiratory therapy after his diagnosis. Diego's
            health completely turned around due to his daily regimen of respiratory therapy and medications. The care of his interdisciplinary team
            of healthcare professionals has enabled Diego to enjoy a better quality of life and enjoy life as a healthy and active teenager.”
          </p>
          <p className="mt-4">
            With this challenging experience came the realization that there was a great need for respiratory care providers in our community committed
            to the care and treatment of chronic respiratory illnesses. We decided to improve our community by helping families struggling to care for
            family members with respiratory conditions. We also wanted to help these family members achieve a good and stable quality of life. By reducing
            family tragedies and preventing unnecessary ER and hospital stays due to respiratory complications, we could help families stay together.
          </p>
          <p className="mt-4">
            We started our company in 2010, intending to provide respiratory services to pediatric patients. We quickly saw a significant need for respiratory
            therapists to treat patients of all ages. Consequently, we expanded our practice and began operating under our DBA name, JKARE Miami. We want to
            stand out excellently for respiratory care services and products."
          </p>
        </div>
      </div>

      {/* Mission Statement Section */}
      <div className="bg-customBlue py-6 flex justify-center items-center">
        <div className="bg-white max-w-[1400px] w-full mx-auto p-6 sm:p-8 md:p-12 shadow-lg" style={{ border: '6px solid #00AEEF', minHeight: '400px' }}>
          {/* Centered Title */}
          <div className="py-8 px-4 text-center">
            <div className="text-center mb-4">
              <h2 className="text-customBlue text-3xl sm:text-4xl font-semibold">Our Mission Statement</h2>
            </div>

            {/* Content with Flexbox for text and logo */}
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="md:w-2/3 text-left">
                <h3 className="text-customBlue text-xl sm:text-2xl font-semibold mb-4">To Offer High-Quality Services</h3>
                <p className="text-gray-700 text-sm sm:text-base leading-6 mb-4">
                  We strive to improve the health of our patients in a manner that
                  distinguishes us in our industry. Patient rights, responsibilities, dignity,
                  and confidentiality are our highest priorities in the delivery and
                  follow-up process.
                </p>
                <p className="text-gray-700 text-sm sm:text-base leading-6">
                  We constantly provide our staff members with updates on the latest
                  home healthcare technology through attendance at seminars,
                  participation in factory training programs, in-house education, and
                  other appropriate methods.
                </p>
              </div>

              <div className="md:w-1/3 mt-8 md:mt-0 flex justify-center">
                <Image
                  src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/certificado12.jpg"
                  alt="ACHC Logo"
                  width={200}
                  height={200}
                  className="block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision and Goal Section */}
      <div className="py-16 px-8 text-center">
        <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto">
          {/* Vision Section */}
          <div className="bg-white p-10 shadow-lg border border-customBlue flex-1">
            <h2 className="text-customBlue text-4xl font-semibold">Our Vision</h2>
            <h3 className="text-customBlue text-2xl mt-4">To Accommodate All of Our Patients</h3>
            <p className="text-gray-700 mt-6 text-lg">
              Our vision is to be a team with professional level and ethical values to
              offer the best respiratory care services and home medical equipment in
              Miami Dade and Broward Counties with steady growth at the forefront of
              scientific and technological advances and governed by the highest
              standards of compliance by the requirements of the law.
            </p>
          </div>

          {/* Goal Section */}
          <div className="bg-customPink p-10 shadow-lg text-white flex-1">
            <h2 className="text-white text-4xl font-semibold">Our Goal</h2>
            <h3 className="text-white text-2xl mt-4">To Meet Our Customers’ Needs</h3>
            <p className="text-white mt-6 text-lg">
              Our goal is to provide the highest quality clinical respiratory care
              services, supplies, and home/durable medical equipment with steady
              growth at the forefront of scientific and technological advances and
              governed by the highest standards of compliance by the requirements
              of the law.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
