import React from 'react'
import InternalServerError from "./../assets/InternalServerError.png";

const InternalServerErrorPage = () => {
  return (
    <div className="flex flex-col items-center bg-white rounded-lg  max-w-4xl w-full mx-4 sm:mx-0 py-8">
      <img
        src={InternalServerError}
        alt="Not Found"
        className="w-1/2 h-auto mb-20"
        style={{ maxWidth: "50%" }}
      />
      <p className="text-xl font-semibold text-gray-700 pb-20">
        Internal Server Error. Please try again later.
      </p>
    </div>
  );
}

export default InternalServerErrorPage  