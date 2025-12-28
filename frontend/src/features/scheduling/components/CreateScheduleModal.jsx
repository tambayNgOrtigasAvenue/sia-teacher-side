import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Plus, Trash2 } from 'lucide-react';
import TimePicker from '../../../components/common/TimePicker';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../config/api';

const CreateScheduleModal = ({
  isOpen,
  formData,
  subjects,
  gradeLevels,
  onClose,
  onSubmit,
  onGradeLevelChange,
  onSectionChange,
  onSubjectChange,
  onAddTimeSlot,
  onRemoveTimeSlot,
  onTimeChange,
  onSlotTeacherChange
}) => {
  const [sections, setSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(false);
  const [teachersBySubject, setTeachersBySubject] = useState({});
  const [loadingTeachers, setLoadingTeachers] = useState({});

  // Fetch sections when grade level changes
  useEffect(() => {
    if (formData.gradeLevelId) {
      fetchSections(formData.gradeLevelId);
    } else {
      setSections([]);
    }
  }, [formData.gradeLevelId]);

  // Fetch teachers for existing schedule slots or when subject changes/slots shift
  useEffect(() => {
    if (formData.schedule) {
      formData.schedule.forEach((slot, index) => {
        if (slot.subject) {
          const cached = teachersBySubject[index];
          // Fetch if not cached, or if cached subject doesn't match current slot subject
          // And not currently loading
          if ((!cached || cached.subjectId != slot.subject) && !loadingTeachers[index]) {
            fetchTeachersBySubject(slot.subject, index);
          }
        }
      });
    }
  }, [formData.schedule, teachersBySubject, loadingTeachers]);

  const fetchSections = async (gradeLevelId) => {
    setLoadingSections(true);
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.GET_SECTIONS_BY_GRADE}?gradeLevelId=${gradeLevelId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setSections(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      setSections([]);
    } finally {
      setLoadingSections(false);
    }
  };

  const fetchTeachersBySubject = async (subjectId, slotIndex) => {
    if (!subjectId) return;

    setLoadingTeachers(prev => ({ ...prev, [slotIndex]: true }));

    try {
      const response = await axios.get(
        `${API_ENDPOINTS.GET_TEACHERS_BY_SUBJECT}?subjectId=${subjectId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setTeachersBySubject(prev => ({
          ...prev,
          [slotIndex]: {
            subjectId: subjectId,
            data: response.data.data
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachersBySubject(prev => ({
        ...prev,
        [slotIndex]: { subjectId: subjectId, data: [] }
      }));
    } finally {
      setLoadingTeachers(prev => ({ ...prev, [slotIndex]: false }));
    }
  };

  const handleSubjectChangeWithTeachers = (index, subjectId) => {
    onSubjectChange(index, subjectId);
    if (subjectId) {
      fetchTeachersBySubject(subjectId, index);
    } else {
      setTeachersBySubject(prev => ({ ...prev, [index]: null }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#342825] rounded-[25px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-full max-w-3xl max-h-[85vh] overflow-y-auto relative scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 sticky top-0 bg-[#342825] z-10 rounded-t-[25px]">
          <h2 className="text-3xl font-bold text-white" style={{ textShadow: '0px 2.033px 2.033px rgba(0,0,0,0.5)', fontFamily: 'League Spartan, sans-serif' }}>
            Create Schedule
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 pb-6">
          {/* Select Grade Level */}
          <div className="mb-3">
            <label className="block text-xs text-white mb-1.5">Select Grade Level:</label>
            <div className="relative">
              <select
                value={formData.gradeLevelId || ''}
                onChange={(e) => onGradeLevelChange(e.target.value)}
                className="w-full h-[32px] px-3 text-sm rounded-lg border border-[#f4d77d] bg-transparent text-[#f4d77d] focus:ring-2 focus:ring-[#f4d77d] focus:border-transparent outline-none appearance-none cursor-pointer"
                required
              >
                <option value="" className="bg-[#342825]">Select Grade Level</option>
                {gradeLevels && gradeLevels.length > 0 ? gradeLevels.map((grade) => (
                  <option
                    key={grade.id}
                    value={grade.id}
                    className="bg-[#342825]"
                  >
                    {grade.name}
                  </option>
                )) : (
                  <option value="" className="bg-[#342825]" disabled>Loading grade levels...</option>
                )}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f4d77d] pointer-events-none" />
            </div>
          </div>

          {/* Select Section */}
          {formData.gradeLevelId && (
            <div className="mb-3">
              <label className="block text-xs text-white mb-1.5">Select Section:</label>
              <div className="relative">
                <select
                  value={formData.sectionId || ''}
                  onChange={(e) => {
                    const selectedSection = sections.find(s => s.id == e.target.value);
                    onSectionChange(e.target.value, selectedSection);
                  }}
                  className="w-full h-[32px] px-3 text-sm rounded-lg border border-[#f4d77d] bg-transparent text-[#f4d77d] focus:ring-2 focus:ring-[#f4d77d] focus:border-transparent outline-none appearance-none cursor-pointer disabled:opacity-50"
                  disabled={loadingSections}
                  required
                >
                  <option value="" className="bg-[#342825]">
                    {loadingSections ? 'Loading sections...' : 'Select Section'}
                  </option>
                  {sections.map((section) => (
                    <option
                      key={section.id}
                      value={section.id}
                      className="bg-[#342825]"
                    >
                      Section {section.sectionName} {section.advisorName ? `(Adviser: ${section.advisorName})` : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f4d77d] pointer-events-none" />
              </div>
            </div>
          )}

          {/* Display Selected Section */}
          {formData.gradeSection && (
            <div className="mb-3 bg-white/5 rounded-lg p-3 border border-[#f4d77d]/30">
              <label className="block text-xs text-[#f4d77d] mb-1 uppercase tracking-wide">Selected Section:</label>
              <div className="text-base font-semibold text-white">
                {formData.gradeSection}
              </div>
            </div>
          )}

          {/* Schedule Table */}
          <div className="bg-transparent rounded-2xl mb-4">
            {/* Table Header */}
            <div className="flex items-center justify-between border-b border-white pb-2 mb-3">
              <div className="text-sm font-bold text-white">
                Time Slots & Subjects
                {formData.schedule.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-[#f4d77d]">
                    ({formData.schedule.length} existing schedule{formData.schedule.length !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onAddTimeSlot}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#f4d77d] text-[#342825] rounded-lg text-xs font-medium hover:bg-[#f4d77d]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formData.sectionId}
                title={formData.schedule.length > 0 ? "Add another time slot to existing schedule" : "Add a new time slot"}
              >
                <Plus className="w-3 h-3" />
                Add Time Slot
              </button>
            </div>

            {/* Time Slots */}
            <div className="space-y-3">
              {formData.schedule.length === 0 ? (
                <div className="text-center py-6 text-white/50 text-sm">
                  {!formData.gradeLevelId
                    ? 'Please select a grade level first.'
                    : !formData.sectionId
                      ? 'Please select a section first.'
                      : 'No time slots added. Click "Add Time Slot" to create a schedule.'}
                </div>
              ) : (
                formData.schedule.map((slot, index) => {
                  // Debug: Log the slot data to console
                  if (index === 0) {
                    console.log('Rendering schedule slot:', slot);
                  }
                  
                  return (
                  <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="grid grid-cols-[auto_1fr_1fr_2fr_1.5fr_1fr_auto] gap-2 items-end">
                      {/* Day */}
                      <div className="">
                        <label className="block text-xs text-[#f4d77d] mb-1.5 font-medium">Day</label>
                        <div className="relative">
                          <select
                            value={slot.day || 'Monday'}
                            onChange={(e) => onTimeChange(index, 'day', e.target.value)}
                            className="w-full h-[34px] px-2.5 text-xs rounded border border-white/20 bg-[#342825] text-white focus:ring-2 focus:ring-[#f4d77d] focus:border-transparent outline-none appearance-none cursor-pointer hover:border-[#f4d77d]/50 transition-colors"
                          >
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                              <option key={day} value={day} className="bg-[#342825]">{day}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#f4d77d] pointer-events-none" />
                        </div>
                      </div>

                      {/* Start Time */}
                      <div className="">
                        <label className="block text-xs text-[#f4d77d] mb-1.5 font-medium">Start Time</label>
                        <TimePicker
                          value={slot.startTime}
                          onChange={(time) => onTimeChange(index, 'startTime', time)}
                          placeholder="Start"
                        />
                      </div>

                      {/* End Time */}
                      <div className="">
                        <label className="block text-xs text-[#f4d77d] mb-1.5 font-medium">End Time</label>
                        <TimePicker
                          value={slot.endTime}
                          onChange={(time) => onTimeChange(index, 'endTime', time)}
                          placeholder="End"
                        />
                      </div>

                      {/* Subject */}
                      <div className="">
                        <label className="block text-xs text-[#f4d77d] mb-1.5 font-medium">Subject</label>
                        <div className="relative">
                          <select
                            value={slot.subject}
                            onChange={(e) => handleSubjectChangeWithTeachers(index, e.target.value)}
                            className="w-full h-[34px] px-2.5 text-xs rounded border border-white/20 bg-[#342825] text-white focus:ring-2 focus:ring-[#f4d77d] focus:border-transparent outline-none appearance-none cursor-pointer hover:border-[#f4d77d]/50 transition-colors"
                            required
                          >
                            <option value="" className="bg-[#342825]">Select Subject</option>
                            {subjects && subjects.length > 0 ? subjects.map((subject) => (
                              <option
                                key={subject.id}
                                value={subject.id}
                                className="bg-[#342825]"
                              >
                                {subject.name}
                              </option>
                            )) : (
                              <option value="" className="bg-[#342825]" disabled>Loading subjects...</option>
                            )}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#f4d77d] pointer-events-none" />
                        </div>
                      </div>

                      {/* Teacher */}
                      <div className="">
                        <label className="block text-xs text-[#f4d77d] mb-1.5 font-medium">Teacher</label>
                        <div className="relative">
                          <select
                            value={slot.teacherId || ''}
                            onChange={(e) => onSlotTeacherChange(index, e.target.value)}
                            className="w-full h-[34px] px-2.5 text-xs rounded border border-white/20 bg-[#342825] text-white focus:ring-2 focus:ring-[#f4d77d] focus:border-transparent outline-none appearance-none cursor-pointer hover:border-[#f4d77d]/50 transition-colors disabled:opacity-50"
                            disabled={!slot.subject || loadingTeachers[index]}
                            required={!!slot.subject}
                          >
                            <option value="" className="bg-[#342825]">
                              {loadingTeachers[index] ? 'Loading...' : 'Select Teacher'}
                            </option>
                            {teachersBySubject[index]?.subjectId == slot.subject && teachersBySubject[index]?.data?.map((teacher) => (
                              <option
                                key={teacher.id}
                                value={teacher.id}
                                className="bg-[#342825]"
                              >
                                {teacher.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#f4d77d] pointer-events-none" />
                        </div>
                      </div>

                      {/* Room Number */}
                      <div className="">
                        <label className="block text-xs text-[#f4d77d] mb-1.5 font-medium">Room</label>
                        <input
                          type="text"
                          value={slot.room || ''}
                          onChange={(e) => onTimeChange(index, 'room', e.target.value)}
                          placeholder="e.g., 101"
                          className="w-full h-[34px] px-2.5 text-xs rounded border border-white/20 bg-[#342825] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#f4d77d] focus:border-transparent outline-none hover:border-[#f4d77d]/50 transition-colors"
                        />
                      </div>

                      {/* Delete Button */}
                      <div className="flex items-end justify-center">
                        <button
                          type="button"
                          onClick={() => onRemoveTimeSlot(index)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors mb-0.5"
                          title="Remove time slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  );  
                })
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center gap-3 mt-5 sticky bottom-0 bg-[#342825] pt-3 pb-1 rounded-b-[25px]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-transparent border border-white/30 text-white rounded-[15px] font-medium hover:bg-white/5 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-[#f4d77d] text-[#1a1004] rounded-[15px] font-medium hover:bg-[#f4d77d]/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!formData.sectionId || formData.schedule.length === 0}
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
