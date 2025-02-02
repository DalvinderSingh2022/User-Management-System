import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center m-auto">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
};

export default LoadingSpinner;
