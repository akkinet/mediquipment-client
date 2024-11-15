import React from 'react';

const CenteredBox = () => {
  return (
    <div className="relative flex items-center justify-center h-80 w-full font-montserrat">
      {/* Background Image with Reduced Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: 'url(https://s3.ap-south-1.amazonaws.com/medicom.hexerve/footer+base+image.png)',
        }}
      ></div>

      {/* Content Box */}
      <div className="relative bg-white rounded-3xl border-2 border-customBlue p-6 text-center shadow-md w-[80%] py-12">
        <p className="text-5xl font-semibold mb-4">Thinking about getting Checked up ?</p>
        <p className="text-4xl font-medium">Call us 800-123-4567</p>
      </div>
    </div>
  );
};

export default CenteredBox;
