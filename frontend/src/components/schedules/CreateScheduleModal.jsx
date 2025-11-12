import React from 'react';
import { X, ChevronDown } from 'lucide-react';

const CreateScheduleModal = ({ 
  isOpen, 
  formData, 
  teachers, 
  subjects,
  onClose, 
  onSubmit, 
  onTeacherChange,
  onSubjectChange,
  onRoomChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#342825] rounded-[35px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="px-7 pt-11 pb-6">
          <h2 className="text-5xl font-bold text-white" style={{ textShadow: '0px 2.033px 2.033px rgba(0,0,0,0.5)', fontFamily: 'League Spartan, sans-serif' }}>
            Create Schedule
          </h2>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white hover:text-gray-300 transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-7 pb-8">
          {/* Select Teacher */}
          <div className="mb-4">
            <label className="block text-sm text-white mb-2">Select Teacher:</label>
            <div className="relative">
              <select
                value={formData.teacher}
                onChange={(e) => onTeacherChange(e.target.value)}
                className="w-[167px] h-[25px] px-3 text-[10px] rounded-xl border border-[#f4d77d] bg-transparent text-[#f4d77d] focus:ring-2 focus:ring-[#f4d77d] focus:border-transparent outline-none appearance-none cursor-pointer"
                required
              >
                <option value="" className="bg-[#342825]">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option 
                    key={teacher.id} 
                    value={teacher.id} 
                    className="bg-[#342825]"
                  >
                    {teacher.fullName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#f4d77d] pointer-events-none" />
            </div>
          </div>

          {/* Grade and Section */}
          <div className="mb-4">
            <label className="inline-block text-sm text-white mr-2">Grade and Section:</label>
            <span className="text-sm text-white">
              {formData.gradeSection || 'No section assigned'}
            </span>
          </div>

          {/* Room */}
          <div className="mb-4">
            <label className="inline-block text-sm text-white mr-2">Room:</label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => onRoomChange(e.target.value)}
              placeholder="103"
              className="inline-block w-20 px-2 py-1 text-sm text-white bg-transparent border-b border-white/20 outline-none focus:border-[#f4d77d]"
            />
          </div>

          {/* Day */}
          <div className="mb-6">
            <label className="inline-block text-sm text-white mr-2">Day:</label>
            <span className="text-sm text-white">{formData.day}</span>
          </div>

          {/* Schedule Table */}
          <div className="bg-transparent rounded-3xl mb-6">
            {/* Table Header */}
            <div className="grid grid-cols-2 border-b border-white pb-3 mb-4">
              <div className="text-center text-sm font-bold text-white">Time</div>
              <div className="text-center text-sm font-bold text-white">Subject</div>
            </div>

            {/* Time Slots */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {formData.schedule.map((slot, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 items-center">
                  <div className="text-sm text-white text-left pl-2">{slot.time}</div>
                  <div className="relative">
                    <select
                      value={slot.subject}
                      onChange={(e) => onSubjectChange(index, e.target.value)}
                      className="w-full h-[30px] px-3 text-sm rounded-lg border border-[#9d9d9d] bg-transparent text-white focus:ring-2 focus:ring-[#f4d77d] focus:border-transparent outline-none appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#342825]">Select Subject</option>
                      {subjects.map((subject) => (
                        <option 
                          key={subject.id} 
                          value={subject.id} 
                          className="bg-[#342825]"
                        >
                          {subject.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="px-12 py-2.5 bg-[#f4d77d] text-[#1a1004] rounded-[20px] font-medium hover:bg-[#f4d77d]/90 transition-colors text-sm"
            >
              Submit Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScheduleModal;
