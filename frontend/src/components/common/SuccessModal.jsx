import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

const SuccessModal = ({ isOpen, message, onClose, duration = 2000 }) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-[#342825]/85 rounded-[35px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[262px] h-[246px] flex flex-col items-center justify-center">
        {/* Green Checkmark Icon */}
        <div className="mb-6">
          <div className="w-[115px] h-[115px] flex items-center justify-center">
            <Check className="w-24 h-24 text-green-400 stroke-[3]" />
          </div>
        </div>

        {/* Success Message */}
        <p className="text-white text-center font-['League_Spartan',sans-serif] text-[24px] font-normal leading-normal px-4">
          {message}
        </p>
      </div>
    </div>
  );
};

export default SuccessModal;
