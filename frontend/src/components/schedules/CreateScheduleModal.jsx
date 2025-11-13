import React, { useState } from 'react';
import { X, ChevronDown, Plus, Trash2 } from 'lucide-react';
import TimePicker from '../common/TimePicker';

const CreateScheduleModal = ({ 
  isOpen, 
  formData, 
  teachers, 
  subjects,
  onClose, 
  onSubmit, 
  onTeacherChange,
  onSubjectChange,
  onAddTimeSlot,
  onRemoveTimeSlot,
  onTimeChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#342825] rounded-[35px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-full max-w-2xl my-8 relative">
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

        <form onSubmit={onSubmit} className="px-7 pb-12">
          {/* Select Teacher */}
          <div className="mb-4">
            <label className="block text-sm text-white mb-2">Select Teacher:</label>
            <div className="relative">
              <select
                value={formData.teacher}
                onChange={(e) => onTeacherChange(e.target.value)}
                className="w-full h-[35px] px-3 text-sm rounded-xl border border-[#f4d77d] bg-transparent text-[#f4d77d] focus:ring-2 focus:ring-[#f4d77d] focus:border-transparent outline-none appearance-none cursor-pointer"
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
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f4d77d] pointer-events-none" />
            </div>
          </div>

          {/* Grade and Section - More prominent display */}
          <div className="mb-6 bg-white/5 rounded-lg p-4 border border-[#f4d77d]/30">
            <label className="block text-xs text-[#f4d77d] mb-1 uppercase tracking-wide">Assigned Section:</label>
            <div className="text-lg font-semibold text-white">
              {formData.gradeSection || (
                <span className="text-white/50 text-sm font-normal">No section assigned to this teacher</span>
              )}
            </div>
          </div>

          {/* Day */}
          <div className="mb-6">
            <label className="inline-block text-sm text-white mr-2">Day:</label>
            <span className="text-sm text-[#f4d77d] font-medium">{formData.day}</span>
          </div>

          {/* Schedule Table */}
          <div className="bg-transparent rounded-3xl mb-6">
            {/* Table Header */}
            <div className="flex items-center justify-between border-b border-white pb-3 mb-4">
              <div className="text-sm font-bold text-white">Time Slots & Subjects</div>
              <button
                type="button"
                onClick={onAddTimeSlot}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#f4d77d] text-[#342825] rounded-lg text-xs font-medium hover:bg-[#f4d77d]/90 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Time Slot
              </button>
            </div>

            {/* Time Slots */}
            <div className="space-y-4">
              {formData.schedule.length === 0 ? (
                <div className="text-center py-8 text-white/50">
                  No time slots added. Click "Add Time Slot" to create a schedule.
                </div>
              ) : (
                formData.schedule.map((slot, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex gap-3 items-start">
                      {/* Start Time */}
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs text-[#f4d77d] mb-2 font-medium">Start Time</label>
                        <TimePicker
                          value={slot.startTime}
                          onChange={(time) => onTimeChange(index, 'startTime', time)}
                          placeholder="Start time"
                        />
                      </div>

                      {/* End Time */}
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs text-[#f4d77d] mb-2 font-medium">End Time</label>
                        <TimePicker
                          value={slot.endTime}
                          onChange={(time) => onTimeChange(index, 'endTime', time)}
                          placeholder="End time"
                        />
                      </div>

                      {/* Subject */}
                      <div className="flex-[1.5] min-w-0">
                        <label className="block text-xs text-[#f4d77d] mb-2 font-medium">Subject</label>
                        <div className="relative">
                          <select
                            value={slot.subject}
                            onChange={(e) => onSubjectChange(index, e.target.value)}
                            className="w-full h-[38px] px-3 text-xs rounded border border-white/20 bg-[#342825] text-white focus:ring-2 focus:ring-[#f4d77d] focus:border-transparent outline-none appearance-none cursor-pointer hover:border-[#f4d77d]/50 transition-colors"
                            required
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
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f4d77d] pointer-events-none" />
                        </div>
                      </div>

                      {/* Delete Button */}
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => onRemoveTimeSlot(index)}
                          className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors mb-0.5"
                          title="Remove time slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2.5 bg-transparent border border-white/30 text-white rounded-[20px] font-medium hover:bg-white/5 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-12 py-2.5 bg-[#f4d77d] text-[#1a1004] rounded-[20px] font-medium hover:bg-[#f4d77d]/90 transition-colors text-sm"
              disabled={!formData.teacher || !formData.gradeSection || formData.schedule.length === 0}
            >
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScheduleModal;
