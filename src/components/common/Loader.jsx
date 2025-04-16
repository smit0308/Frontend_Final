import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
import { useState, useEffect } from "react";

export const Loader = ({ message = "Processing...", isCompleted = false, completedMessage = "Completed!" }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      setShowCheck(true);
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 1500); // Keep showing for 1.5s after completion
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  if (!showLoader && isCompleted) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 loader-overlay">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
        {!showCheck ? (
          <AiOutlineLoading3Quarters className="text-green text-4xl animate-spin" />
        ) : (
          <div className="transform scale-110 transition-transform duration-300">
            <BsCheckCircleFill className="text-green text-4xl animate-success" />
          </div>
        )}
        <p className="mt-4 text-gray-600 font-medium">
          {showCheck ? completedMessage : message}
        </p>
      </div>
    </div>
  );
};
