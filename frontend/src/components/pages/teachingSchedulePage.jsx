import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Edit2, Trash2, X, Save, ChevronDown } from 'lucide-react';
import Breadcrumb from '../common/Breadcrumb';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const TeachingSchedulePage = () => {
  const [activeTab, setActiveTab] = useState('my-schedule');
  const [searchQuery, setSearchQuery] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [teacherSchedules, setTeacherSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sectionsData, setSectionsData] = useState([]);
  const [activeSchoolYear, setActiveSchoolYear] = useState(null);
  const [editFormData, setEditFormData] = useState({
    teacher: '',
    subject: '',
    day: '',
    time: '',
    room: ''
  });
  const [addClassFormData, setAddClassFormData] = useState({
    gradeLevelId: '',
    sectionId: '',
    subjectId: '',
    dayOfWeek: 'Monday',
    startTime: '08:00',
    endTime: '09:00',
    roomNumber: ''
  });
  const [createFormData, setCreateFormData] = useState({
    teacher: '',
    gradeSection: 'Grade 1 - Section A',
    room: '103',
    day: 'Monday to Friday',
    timeSlots: [
      { time: '6:30 AM - 7:30 AM', subject: '' },
      { time: '7:30 AM - 8:30 AM', subject: '' },
      { time: '8:30 AM - 9:30 AM', subject: '' },
      { time: '10:00 AM - 11:00 AM', subject: '' },
      { time: '11:00 AM - 12:00 PM', subject: '' },
      { time: '12:00 PM - 1:00 PM', subject: '' },
      { time: '1:00 PM - 2:00 PM', subject: '' },
      { time: '3:00 PM - 4:00 PM', subject: '' },
      { time: '4:00 PM - 5:00 PM', subject: '' }
    ]
  });

  // Fetch initial options on mount
  useEffect(() => {
    fetchOptions();
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchOptions = async () => {
    try {
      const response = await axios.get(
        'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/schedules/get-options.php',
        { withCredentials: true }
      );

      if (response.data.success) {
        setGradeLevels(response.data.data.gradeLevels || []);
        setSubjects(response.data.data.subjects || []);
        setActiveSchoolYear(response.data.data.activeSchoolYear);
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'my-schedule') {
        // Fetch My Schedule (teacher's assigned classes)
        const response = await axios.get(
          'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/schedules/get-my-schedule.php',
          { withCredentials: true }
        );

        if (response.data.success) {
          setSchedules(response.data.data);
        } else {
          setError(response.data.message);
          toast.error(response.data.message);
        }
      } else {
        // Fetch All Teacher Schedules
        const response = await axios.get(
          'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/schedules/get-all-schedules.php',
          { withCredentials: true }
        );

        if (response.data.success) {
          setTeacherSchedules(response.data.data);
        } else {
          setError(response.data.message);
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load schedules. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite status for a section
  const toggleFavorite = (scheduleId, sectionId) => {
    setSchedules(prevSchedules =>
      prevSchedules.map(schedule =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              sections: schedule.sections.map(section =>
                section.id === sectionId
                  ? { ...section, isFavorite: !section.isFavorite }
                  : section
              )
            }
          : schedule
      )
    );
    
    // Optional: Show a toast notification
    // You can add a toast library or use a simple alert
    // toast.success('Favorite updated');
  };

  const breadcrumbItems = [
    { label: 'Teaching Schedule', path: '/teacher-dashboard/teaching-schedule' }
  ];

  const filteredSchedules = schedules.filter(schedule => 
    schedule.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    schedule.adviser.toLowerCase().includes(searchQuery.toLowerCase()) ||
    schedule.sections.some(section => 
      section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.room.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredTeacherSchedules = teacherSchedules.filter(schedule =>
    schedule.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
    schedule.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    schedule.day.toLowerCase().includes(searchQuery.toLowerCase()) ||
    schedule.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setEditFormData({
      teacher: schedule.teacher,
      subject: schedule.subject,
      day: schedule.day,
      time: schedule.time,
      room: schedule.room
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editFormData.teacher || !editFormData.subject || !editFormData.day || !editFormData.time || !editFormData.room) {
      alert('Please fill in all fields');
      return;
    }

    setTeacherSchedules(prev =>
      prev.map(schedule =>
        schedule.id === editingSchedule.id
          ? { ...schedule, ...editFormData }
          : schedule
      )
    );

    setIsEditModalOpen(false);
    setEditingSchedule(null);
    setEditFormData({
      teacher: '',
      subject: '',
      day: '',
      time: '',
      room: ''
    });
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingSchedule(null);
    setEditFormData({
      teacher: '',
      subject: '',
      day: '',
      time: '',
      room: ''
    });
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/schedules/delete-schedule.php',
        { scheduleId },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Schedule deleted successfully!');
        // Refresh the schedules list
        fetchData();
      } else {
        toast.error(response.data.message || 'Failed to delete schedule');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error(error.response?.data?.message || 'Error deleting schedule. Please try again.');
    }
  };

  const handleAddNewClass = () => {
    setIsAddClassModalOpen(true);
  };

  const handleCancelAddClass = () => {
    setIsAddClassModalOpen(false);
    setAddClassFormData({
      gradeLevelId: '',
      sectionId: '',
      subjectId: '',
      dayOfWeek: 'Monday',
      startTime: '08:00',
      endTime: '09:00',
      roomNumber: ''
    });
    setSectionsData([]);
  };

  const fetchSectionsForGrade = async (gradeLevelId) => {
    if (!gradeLevelId) {
      setSectionsData([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost/gymnazo-christian-academy-teacher-side/backend/api/schedules/get-sections-with-students.php?gradeLevelId=${gradeLevelId}`,
        { withCredentials: true }
      );

      console.log('Sections response for grade', gradeLevelId, ':', response.data);

      if (response.data.success) {
        if (response.data.data.length > 0) {
          const sections = response.data.data[0].sections || [];
          console.log('Setting sections:', sections);
          setSectionsData(sections);
        } else {
          // No sections found - this is OK, just show the "create sections" message
          setSectionsData([]);
          console.log('No sections found for grade level:', gradeLevelId);
        }
      } else {
        setSectionsData([]);
        toast.error(response.data.message || 'Failed to load sections');
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      console.error('Error response:', error.response?.data);
      setSectionsData([]);
      
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load sections';
      toast.error(errorMsg);
    }
  };

  const handleGradeLevelChange = (gradeLevelId) => {
    // Clear sections first to show loading state
    setSectionsData([]);
    
    setAddClassFormData({
      ...addClassFormData,
      gradeLevelId,
      sectionId: ''
    });
    
    // Fetch sections for the new grade level
    if (gradeLevelId) {
      fetchSectionsForGrade(gradeLevelId);
    }
  };

  const handleSubmitAddClass = async (e) => {
    e.preventDefault();

    if (!addClassFormData.sectionId || !addClassFormData.subjectId) {
      toast.error('Please select both section and subject');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/schedules/create-class.php',
        {
          sectionId: addClassFormData.sectionId,
          subjectId: addClassFormData.subjectId,
          dayOfWeek: addClassFormData.dayOfWeek,
          startTime: addClassFormData.startTime + ':00',
          endTime: addClassFormData.endTime + ':00',
          roomNumber: addClassFormData.roomNumber || 'TBD'
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Class created successfully!');
        handleCancelAddClass();
        fetchData(); // Refresh the schedules
      } else {
        toast.error(response.data.message || 'Failed to create class');
      }
    } catch (error) {
      console.error('Error creating class:', error);
      toast.error(error.response?.data?.message || 'Error creating class. Please try again.');
    }
  };

  // Helper function to get section theme for a grade
  const getSectionTheme = (gradeLevelId) => {
    const themes = {
      1: { name: 'Flowers', sections: 'Rose, Lily, Tulip, Daisy, Sunflower' },
      2: { name: 'Philippine Animals', sections: 'Tarsier, Carabao, Tamaraw, Philippine Eagle, Pawikan' },
      3: { name: 'Philippine National Heroes', sections: 'Rizal, Bonifacio, Mabini, Del Pilar, Luna' },
      4: { name: 'Rocks and Stones', sections: 'Granite, Marble, Limestone, Sandstone, Basalt' },
      5: { name: 'Different Clouds', sections: 'Cumulus, Stratus, Cirrus, Nimbus, Altostratus' },
      6: { name: 'Elements in Periodic Table', sections: 'Oxygen, Hydrogen, Carbon, Nitrogen, Helium' }
    };
    return themes[gradeLevelId] || themes[1];
  };

  const handleCreateSectionsForGrade = async (gradeLevelId) => {
    if (!gradeLevelId) {
      toast.error('Please select a grade level first');
      return;
    }

    if (!activeSchoolYear || !activeSchoolYear.id) {
      toast.error('No active school year found. Please contact administrator.');
      console.error('Active school year:', activeSchoolYear);
      return;
    }

    const theme = getSectionTheme(parseInt(gradeLevelId));
    const themeText = `${theme.name} (${theme.sections})`;
    
    if (!window.confirm(`This will create 5 sections with theme: ${themeText}. Continue?`)) {
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/schedules/create-sections.php',
        {
          gradeLevelId,
          schoolYearId: activeSchoolYear.id
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchSectionsForGrade(gradeLevelId); // Refresh sections
      } else {
        toast.error(response.data.message || 'Failed to create sections');
        console.error('Server response:', response.data);
      }
    } catch (error) {
      console.error('Error creating sections:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Error creating sections. Please try again.');
    }
  };

  const handleCreateSchedule = () => {
    setIsCreateModalOpen(true);
  };

  const handleCancelCreate = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({
      teacher: '',
      gradeSection: 'Grade 1 - Section A',
      room: '103',
      day: 'Monday to Friday',
      timeSlots: [
        { time: '6:30 AM - 7:30 AM', subject: '' },
        { time: '7:30 AM - 8:30 AM', subject: '' },
        { time: '8:30 AM - 9:30 AM', subject: '' },
        { time: '10:00 AM - 11:00 AM', subject: '' },
        { time: '11:00 AM - 12:00 PM', subject: '' },
        { time: '12:00 PM - 1:00 PM', subject: '' },
        { time: '1:00 PM - 2:00 PM', subject: '' },
        { time: '3:00 PM - 4:00 PM', subject: '' },
        { time: '4:00 PM - 5:00 PM', subject: '' }
      ]
    });
  };

  const handleSubjectChange = (index, subject) => {
    const updatedTimeSlots = [...createFormData.timeSlots];
    updatedTimeSlots[index].subject = subject;
    setCreateFormData({ ...createFormData, timeSlots: updatedTimeSlots });
  };

  const handleSubmitSchedule = (e) => {
    e.preventDefault();
    // Validate form
    if (!createFormData.teacher) {
      alert('Please select a teacher');
      return;
    }
    
    console.log('Submitting schedule:', createFormData);
    // TODO: API call to save schedule
    
    // Show success message
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = 'Schedule created successfully!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
    
    // Close modal and reset form
    handleCancelCreate();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <Toaster position="top-right" />
      
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-5xl font-bold text-gray-800">
          {activeTab === 'my-schedule' ? 'Teaching Schedule' : 'Teacher Schedules'}
        </h1>
        {activeTab === 'my-schedule' && (
          <p className="text-xl text-orange-600">
            Overview
          </p>
        )}
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Tabs */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setActiveTab('my-schedule');
              setSearchQuery(''); // Clear search when switching tabs
            }}
            className={`px-6 py-3 rounded-2xl font-medium transition-all ${
              activeTab === 'my-schedule'
                ? 'bg-amber-300 text-gray-900 border border-gray-900/20'
                : 'bg-transparent text-gray-900 dark:text-white border border-gray-900/20 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            My Schedule
          </button>
          <button
            onClick={() => {
              setActiveTab('teacher-schedules');
              setSearchQuery(''); // Clear search when switching tabs
            }}
            className={`px-6 py-3 rounded-2xl font-medium transition-all ${
              activeTab === 'teacher-schedules'
                ? 'bg-amber-300 text-gray-900 border border-gray-900/20'
                : 'bg-transparent text-gray-900 dark:text-white border border-gray-900/20 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Teacher Schedules
          </button>
        </div>

        {/* Search and Create Button */}
        <div className="flex gap-2 w-full md:w-auto">
          {activeTab === 'my-schedule' && (
            <button className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-sm font-medium">Add filter</span>
              <Filter className="w-3 h-3" />
            </button>
          )}
          <div className="flex-1 md:w-96 flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'my-schedule' ? "Search schedules..." : "Search by teacher, subject, day, or room..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-600 dark:text-gray-300 placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {activeTab === 'my-schedule' && (
            <button
              onClick={handleAddNewClass}
              className="px-6 py-3 bg-amber-300 text-gray-900 rounded-xl font-medium hover:bg-amber-400 transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <span>+ Add New Class</span>
            </button>
          )}
          {activeTab === 'teacher-schedules' && (
            <button
              onClick={handleCreateSchedule}
              className="px-6 py-3 bg-amber-300 text-gray-900 rounded-xl font-medium hover:bg-amber-400 transition-colors whitespace-nowrap"
            >
              Create Schedule
            </button>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {activeTab === 'my-schedule' 
            ? `Found ${filteredSchedules.length} schedule(s) matching "${searchQuery}"`
            : `Found ${filteredTeacherSchedules.length} schedule(s) matching "${searchQuery}"`
          }
        </div>
      )}

      {/* Content - Conditional based on active tab */}
      {activeTab === 'my-schedule' ? (
        /* My Schedule Tables */
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No schedules found
              </p>
            </div>
          ) : (
            filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden"
              >
                {/* Table Header */}
                <div className="bg-amber-300 px-8 py-5 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {schedule.grade}
                  </h3>
                  <p className="text-lg font-medium text-gray-900">
                    Adviser: {schedule.adviser}
                  </p>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-300 dark:divide-gray-600">
                  {schedule.sections.map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center justify-between px-8 py-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {/* Star Icon */}
                      <div className="flex items-center gap-6 flex-1">
                        <button
                          onClick={() => toggleFavorite(schedule.id, section.id)}
                          className={`transition-all transform hover:scale-110 active:scale-95 ${
                            section.isFavorite
                              ? 'text-amber-500'
                              : 'text-gray-300 dark:text-gray-600 hover:text-amber-400'
                          }`}
                          title={section.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                          aria-label={section.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star 
                            className="w-5 h-5" 
                            fill={section.isFavorite ? 'currentColor' : 'none'}
                            strokeWidth={2}
                          />
                        </button>

                        {/* Section Name */}
                        <div className="w-56 text-center">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {section.name}
                          </p>
                        </div>

                        {/* Room */}
                        <div className="w-56 text-center">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {section.room}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div className="w-56 text-center">
                          <span className="inline-block px-6 py-2 bg-amber-300/50 text-gray-600 dark:text-gray-700 rounded-xl font-medium">
                            {section.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Teacher Schedules Table */
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-amber-300 px-6 py-4">
                <div className="grid grid-cols-6 gap-4 text-center font-semibold text-gray-900">
                  <div>Teacher Name</div>
                  <div>Subject</div>
                  <div>Day</div>
                  <div>Time</div>
                  <div>Room</div>
                  <div>Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTeacherSchedules.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      No teacher schedules found
                    </p>
                  </div>
                ) : (
                  filteredTeacherSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="grid grid-cols-6 gap-4 px-6 py-5 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-center">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {schedule.teacher}
                        </p>
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="text-gray-900 dark:text-white">
                          {schedule.subject}
                        </p>
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="text-gray-900 dark:text-white">
                          {schedule.day}
                        </p>
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="text-gray-900 dark:text-white">
                          {schedule.time}
                        </p>
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="text-gray-900 dark:text-white">
                          {schedule.room}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="text-amber-500 hover:text-amber-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="text-red-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Schedule
              </h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
              {/* Teacher Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Teacher Name
                </label>
                <input
                  type="text"
                  value={editFormData.teacher}
                  onChange={(e) => setEditFormData({ ...editFormData, teacher: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter teacher name"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={editFormData.subject}
                  onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter subject"
                  required
                />
              </div>

              {/* Day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Day
                </label>
                <select
                  value={editFormData.day}
                  onChange={(e) => setEditFormData({ ...editFormData, day: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors"
                  required
                >
                  <option value="">Select day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="text"
                  value={editFormData.time}
                  onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors"
                  placeholder="e.g., 8:00 AM - 9:00 AM"
                  required
                />
              </div>

              {/* Room */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room
                </label>
                <input
                  type="text"
                  value={editFormData.room}
                  onChange={(e) => setEditFormData({ ...editFormData, room: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter room number"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-amber-300 text-gray-900 rounded-lg hover:bg-amber-400 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Class Modal */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Class
              </h2>
              <button
                onClick={handleCancelAddClass}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAddClass} className="space-y-4">
              {/* Grade Level Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Grade Level *
                </label>
                <select
                  value={addClassFormData.gradeLevelId}
                  onChange={(e) => handleGradeLevelChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors"
                  required
                >
                  <option value="">Select Grade Level</option>
                  {gradeLevels.filter(grade => grade.id <= 6).map(grade => (
                    <option key={grade.id} value={grade.id}>Grade {grade.name}</option>
                  ))}
                </select>
              </div>

              {/* Section Selection with Student Count */}
              {addClassFormData.gradeLevelId && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Section ({addClassFormData.gradeLevelId ? getSectionTheme(parseInt(addClassFormData.gradeLevelId)).name : 'Theme Names'}) *
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCreateSectionsForGrade(addClassFormData.gradeLevelId)}
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                      disabled={!addClassFormData.gradeLevelId}
                    >
                      + Create Sections
                    </button>
                  </div>
                  {sectionsData.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {sectionsData.map(section => (
                        <label
                          key={section.sectionId}
                          className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                            addClassFormData.sectionId === section.sectionId.toString()
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="section"
                              value={section.sectionId}
                              checked={addClassFormData.sectionId === section.sectionId.toString()}
                              onChange={(e) => setAddClassFormData({...addClassFormData, sectionId: e.target.value})}
                              className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                            />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                Section {section.sectionName}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {section.studentCount}/{section.maxCapacity} students
                                {section.studentCount >= section.maxCapacity && (
                                  <span className="ml-2 text-red-500 font-medium">• FULL</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            section.status === 'Full' ? 'bg-red-100 text-red-700' :
                            section.status === 'Almost Full' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {section.status}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <p>No sections found for this grade.</p>
                      <p className="text-xs mt-1">Theme: <span className="font-medium text-amber-600">{getSectionTheme(parseInt(addClassFormData.gradeLevelId)).name}</span></p>
                      <button
                        type="button"
                        onClick={() => handleCreateSectionsForGrade(addClassFormData.gradeLevelId)}
                        className="mt-2 text-amber-600 hover:text-amber-700 font-medium text-sm"
                      >
                        Click here to create sections
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Subject Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  value={addClassFormData.subjectId}
                  onChange={(e) => setAddClassFormData({...addClassFormData, subjectId: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>

              {/* Day of Week */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Day of Week *
                </label>
                <select
                  value={addClassFormData.dayOfWeek}
                  onChange={(e) => setAddClassFormData({...addClassFormData, dayOfWeek: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors"
                  required
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={addClassFormData.startTime}
                    onChange={(e) => setAddClassFormData({...addClassFormData, startTime: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={addClassFormData.endTime}
                    onChange={(e) => setAddClassFormData({...addClassFormData, endTime: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Room Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Number
                </label>
                <input
                  type="text"
                  value={addClassFormData.roomNumber}
                  onChange={(e) => setAddClassFormData({...addClassFormData, roomNumber: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors"
                  placeholder="e.g., Room 101 (optional)"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> Each section can hold a maximum of 15 students. 
                  When a section is full, new students will be automatically assigned to the next available section.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancelAddClass}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-amber-300 text-gray-900 rounded-lg hover:bg-amber-400 transition-colors font-medium"
                >
                  Add Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Schedule Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#342825] rounded-[35px] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ textShadow: '0px 2px 2px rgba(0,0,0,0.5)' }}>
                Create Schedule
              </h2>
              <button
                onClick={handleCancelCreate}
                className="absolute top-5 right-5 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitSchedule} className="space-y-4">
              {/* Select Teacher */}
              <div>
                <label className="block text-sm text-white mb-2">Select Teacher:</label>
                <div className="relative">
                  <select
                    value={createFormData.teacher}
                    onChange={(e) => setCreateFormData({ ...createFormData, teacher: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#f4d77d] bg-transparent text-[#f4d77d] text-sm focus:ring-2 focus:ring-[#f4d77d] focus:border-transparent outline-none appearance-none cursor-pointer"
                    required
                  >
                    <option value="" className="bg-[#342825]">Select Teacher</option>
                    <option value="Mr. Santos" className="bg-[#342825]">Mr. Santos</option>
                    <option value="Ms. Cruz" className="bg-[#342825]">Ms. Cruz</option>
                    <option value="Mr. Reyes" className="bg-[#342825]">Mr. Reyes</option>
                    <option value="Ms. Lopez" className="bg-[#342825]">Ms. Lopez</option>
                    <option value="Mr. Garcia" className="bg-[#342825]">Mr. Garcia</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f4d77d] pointer-events-none" />
                </div>
              </div>

              {/* Grade and Section */}
              <div>
                <label className="block text-sm text-white mb-1">Grade and Section:</label>
                <p className="text-sm text-white">{createFormData.gradeSection}</p>
              </div>

              {/* Room */}
              <div>
                <label className="block text-sm text-white mb-1">Room:</label>
                <p className="text-sm text-white">{createFormData.room}</p>
              </div>

              {/* Day */}
              <div>
                <label className="block text-sm text-white mb-1">Day:</label>
                <p className="text-sm text-white">{createFormData.day}</p>
              </div>

              {/* Schedule Table */}
              <div className="mt-6 rounded-3xl overflow-hidden">
                {/* Table Header */}
                <div className="border-b border-white">
                  <div className="grid grid-cols-2 py-3">
                    <p className="text-sm font-bold text-white text-center">Time</p>
                    <p className="text-sm font-bold text-white text-center">Subject</p>
                  </div>
                </div>

                {/* Time Slots */}
                <div className="space-y-3 mt-3">
                  {createFormData.timeSlots.map((slot, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 items-center">
                      {/* Time */}
                      <p className="text-sm text-white pl-2">{slot.time}</p>
                      
                      {/* Subject Dropdown */}
                      <div className="relative">
                        <select
                          value={slot.subject}
                          onChange={(e) => handleSubjectChange(index, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-[#9d9d9d] bg-transparent text-white text-sm focus:ring-2 focus:ring-[#f4d77d] focus:border-transparent outline-none appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#342825]">Select Subject</option>
                          <option value="English" className="bg-[#342825]">English</option>
                          <option value="Math" className="bg-[#342825]">Math</option>
                          <option value="Science" className="bg-[#342825]">Science</option>
                          <option value="Filipino" className="bg-[#342825]">Filipino</option>
                          <option value="TLE" className="bg-[#342825]">TLE</option>
                          <option value="PE" className="bg-[#342825]">PE</option>
                          <option value="Arts" className="bg-[#342825]">Arts</option>
                          <option value="Music" className="bg-[#342825]">Music</option>
                          <option value="Computer" className="bg-[#342825]">Computer</option>
                          <option value="Values Education" className="bg-[#342825]">Values Education</option>
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
                  className="px-8 py-3 bg-[#f4d77d] text-[#1a1004] rounded-[20px] font-medium hover:bg-[#f4d77d]/90 transition-colors text-sm"
                >
                  Submit Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachingSchedulePage;