import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

const TimePicker = ({ value, onChange, placeholder = "Select time" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('08');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');
  const dropdownRef = useRef(null);

  // Parse existing value if provided
  useEffect(() => {
    if (value) {
      const timeMatch = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (timeMatch) {
        setSelectedHour(timeMatch[1].padStart(2, '0'));
        setSelectedMinute(timeMatch[2]);
        setSelectedPeriod(timeMatch[3].toUpperCase());
      }
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  const handleSelect = () => {
    const formattedTime = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
    onChange(formattedTime);
    setIsOpen(false);
  };

  const displayValue = value || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 h-[38px] text-xs text-white bg-[#342825] border border-white/20 rounded outline-none focus:border-[#f4d77d] hover:border-[#f4d77d]/50 text-left flex items-center justify-between transition-colors"
      >
        <span className={!value ? "text-white/40" : "text-white"}>{displayValue}</span>
        <Clock className="w-4 h-4 text-[#f4d77d]" />
      </button>

      {isOpen && (
        <div className="absolute z-[9999] mt-1 bg-[#2a2220] border border-[#f4d77d]/30 rounded-lg shadow-2xl p-4 w-64 left-0">
          <div className="flex gap-2 mb-3">
            {/* Hour Selector */}
            <div className="flex-1">
              <label className="block text-xs text-[#f4d77d] mb-1">Hour</label>
              <select
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
                className="w-full px-2 py-1.5 text-xs text-white bg-[#342825] border border-white/20 rounded outline-none focus:border-[#f4d77d] cursor-pointer"
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>

            {/* Minute Selector */}
            <div className="flex-1">
              <label className="block text-xs text-[#f4d77d] mb-1">Minute</label>
              <select
                value={selectedMinute}
                onChange={(e) => setSelectedMinute(e.target.value)}
                className="w-full px-2 py-1.5 text-xs text-white bg-[#342825] border border-white/20 rounded outline-none focus:border-[#f4d77d] cursor-pointer"
              >
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>

            {/* AM/PM Selector */}
            <div className="flex-1">
              <label className="block text-xs text-[#f4d77d] mb-1">Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-2 py-1.5 text-xs text-white bg-[#342825] border border-white/20 rounded outline-none focus:border-[#f4d77d] cursor-pointer"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSelect}
            className="w-full px-3 py-1.5 bg-[#f4d77d] text-[#342825] rounded text-xs font-medium hover:bg-[#f4d77d]/90 transition-colors"
          >
            Select Time
          </button>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
