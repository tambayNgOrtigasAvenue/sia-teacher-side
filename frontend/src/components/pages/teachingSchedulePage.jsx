import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Breadcrumb from '../common/Breadcrumb';
import MySchedule from '../schedules/MySchedule';
import TeacherSchedules from '../schedules/TeacherSchedules';
import EditScheduleModal from '../schedules/EditScheduleModal';
import CreateScheduleModal from '../schedules/CreateScheduleModal';
import AddClassModal from '../schedules/AddClassModal';
import RoleDebugger from '../debug/RoleDebugger';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { canManageAllSchedules } from '../../utils/permissions';

const TeachingSchedulePage = () => {
  const { user } = useAuth();
  const userCanManageAllSchedules = canManageAllSchedules(user);
  
  // Debug logging
  useEffect(() => {
    console.log('TeachingSchedulePage - User:', user);
    console.log('TeachingSchedulePage - Can Manage All Schedules:', userCanManageAllSchedules);
  }, [user, userCanManageAllSchedules]);
  
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
  const [teachers, setTeachers] = useState([]);
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
    roomNumber: ''
  });
  const [teacherSections, setTeacherSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [createFormData, setCreateFormData] = useState({
    teacher: '',
    gradeSection: '',
    day: 'Monday to Friday',
    schedule: []
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
      console.log('Fetching options (grade levels, subjects, teachers)...');
      const response = await axios.get(
        'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/schedules/get-options.php',
        { withCredentials: true }
      );

      console.log('Options response:', response.data);

      if (response.data.success) {
        const gradeLevelsData = response.data.data.gradeLevels || [];
        const subjectsData = response.data.data.subjects || [];
        const teachersData = response.data.data.teachers || [];
        
        console.log('Grade Levels:', gradeLevelsData);
        console.log('Subjects:', subjectsData);
        console.log('Teachers:', teachersData);
        
        setGradeLevels(gradeLevelsData);
        setSubjects(subjectsData);
        setActiveSchoolYear(response.data.data.activeSchoolYear);
        setTeachers(teachersData);
      } else {
        console.error('Failed to fetch options:', response.data.message);
        toast.error('Failed to load form options');
      }
    } catch (error) {
      console.error('Error fetching options:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Error loading grade levels and subjects');
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

  // Fetch teacher's assigned sections
  const fetchTeacherSections = async (teacherId) => {
    if (!teacherId) {
      setTeacherSections([]);
      setSelectedSection(null);
      return;
    }

    try {
      console.log('Fetching sections for teacher:', teacherId);
      const response = await axios.get(
        `http://localhost/gymnazo-christian-academy-teacher-side/backend/api/schedules/get-teacher-sections.php?teacherId=${teacherId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        console.log('Teacher sections:', response.data.data);
        setTeacherSections(response.data.data);
        // Auto-select first section if available
        if (response.data.data.length > 0) {
          setSelectedSection(response.data.data[0]);
        }
      } else {
        toast.error(response.data.message);
        setTeacherSections([]);
      }
    } catch (error) {
      console.error('Error fetching teacher sections:', error);
      toast.error('Failed to load teacher sections');
      setTeacherSections([]);
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

    if (!addClassFormData.sectionId) {
      toast.error('Please select a section');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/schedules/assign-teacher-to-section.php',
        {
          sectionId: addClassFormData.sectionId,
          roomNumber: addClassFormData.roomNumber || 'TBD'
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        handleCancelAddClass();
        fetchData(); // Refresh the schedules
      } else {
        toast.error(response.data.message || 'Failed to assign section');
      }
    } catch (error) {
      console.error('Error assigning section:', error);
      toast.error(error.response?.data?.message || 'Error assigning section. Please try again.');
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

  const handleTeacherChange = async (teacherId) => {
    setCreateFormData({ 
      teacher: teacherId,
      gradeSection: '',
      day: 'Monday to Friday',
      schedule: []
    });
    
    await fetchTeacherSections(teacherId);
    await fetchTeacherScheduleDetail(teacherId);
  };

  const fetchTeacherScheduleDetail = async (teacherId) => {
    if (!teacherId) return;

    try {
      const response = await axios.get(
        `http://localhost/gymnazo-christian-academy-teacher-side/backend/api/schedules/get-teacher-schedule-detail.php?teacherId=${teacherId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const scheduleData = response.data.data;
        setCreateFormData(prev => ({
          ...prev,
          gradeSection: scheduleData.gradeSection,
          day: scheduleData.day,
          schedule: scheduleData.schedule,
          teacherProfileId: scheduleData.teacherProfileId,
          sectionId: scheduleData.sectionId
        }));
      }
    } catch (error) {
      console.error('Error fetching teacher schedule detail:', error);
      // Don't show error toast here as it's okay if there's no schedule yet
    }
  };

  const handleCancelCreate = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({
      teacher: '',
      gradeSection: '',
      day: 'Monday to Friday',
      schedule: []
    });
    setTeacherSections([]);
    setSelectedSection(null);
  };

  const handleSubjectChange = (index, subjectId) => {
    const newSchedule = [...createFormData.schedule];
    newSchedule[index].subject = subjectId;
    setCreateFormData({ ...createFormData, schedule: newSchedule });
  };

  const handleAddTimeSlot = () => {
    setCreateFormData({
      ...createFormData,
      schedule: [...createFormData.schedule, { startTime: '', endTime: '', subject: '' }]
    });
  };

  const handleRemoveTimeSlot = (index) => {
    const newSchedule = createFormData.schedule.filter((_, i) => i !== index);
    setCreateFormData({ ...createFormData, schedule: newSchedule });
  };

  const handleTimeChange = (index, field, time) => {
    const newSchedule = [...createFormData.schedule];
    newSchedule[index][field] = time;
    setCreateFormData({ ...createFormData, schedule: newSchedule });
  };

  const handleSubmitSchedule = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!createFormData.teacher) {
      toast.error('Please select a teacher');
      return;
    }
    
    if (!createFormData.teacherProfileId || !createFormData.sectionId) {
      toast.error('Teacher has no assigned section. Please assign a section first.');
      return;
    }

    // Check if at least one time slot is added
    if (createFormData.schedule.length === 0) {
      toast.error('Please add at least one time slot');
      return;
    }

    // Check if all time slots have start time, end time, and subject filled
    const incompleteSlot = createFormData.schedule.find(slot => !slot.startTime || !slot.endTime || !slot.subject);
    if (incompleteSlot) {
      toast.error('Please fill in start time, end time, and subject for all time slots');
      return;
    }
    
    try {
      const response = await axios.post(
        'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/schedules/submit-schedule.php',
        {
          teacherProfileId: createFormData.teacherProfileId,
          sectionId: createFormData.sectionId,
          day: createFormData.day,
          schedule: createFormData.schedule
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        handleCancelCreate();
        fetchData(); // Refresh the schedules list
      } else {
        toast.error(response.data.message || 'Failed to save schedule');
      }
    } catch (error) {
      console.error('Error submitting schedule:', error);
      toast.error(error.response?.data?.message || 'Error saving schedule. Please try again.');
    }
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
            className={`px-7 py-3 rounded-2xl font-medium transition-all ${
              activeTab === 'my-schedule'
                ? 'bg-amber-300 text-gray-900 border border-gray-900/20'
                : 'bg-transparent text-gray-900 dark:text-white border border-gray-900/20 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            My Class Schedule
          </button>
          {/* Only Super Teachers can view/manage all teacher schedules */}
          {userCanManageAllSchedules && (
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
          )}
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
          {activeTab === 'my-schedule' && userCanManageAllSchedules && (
            <button
              onClick={handleAddNewClass}
              className="px-6 py-3 bg-amber-300 text-gray-900 rounded-xl font-medium hover:bg-amber-400 transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <span>+ Add New Class</span>
            </button>
          )}
          {activeTab === 'teacher-schedules' && userCanManageAllSchedules && (
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
        <MySchedule 
          schedules={filteredSchedules}
          loading={loading}
          onToggleFavorite={toggleFavorite}
        />
      ) : (
        <TeacherSchedules 
          schedules={filteredTeacherSchedules}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Edit Modal */}
      <EditScheduleModal
        isOpen={isEditModalOpen}
        schedule={editingSchedule}
        formData={editFormData}
        onClose={handleCancelEdit}
        onSave={handleSaveEdit}
        onChange={setEditFormData}
      />

      {/* Add New Class Modal */}
      <AddClassModal
        isOpen={isAddClassModalOpen}
        formData={addClassFormData}
        gradeLevels={gradeLevels}
        sectionsData={sectionsData}
        activeSchoolYear={activeSchoolYear}
        onClose={handleCancelAddClass}
        onSubmit={handleSubmitAddClass}
        onChange={setAddClassFormData}
        onGradeLevelChange={handleGradeLevelChange}
        onCreateSections={handleCreateSectionsForGrade}
        getSectionTheme={getSectionTheme}
      />

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        isOpen={isCreateModalOpen}
        formData={createFormData}
        teachers={teachers}
        subjects={subjects}
        onClose={handleCancelCreate}
        onSubmit={handleSubmitSchedule}
        onTeacherChange={handleTeacherChange}
        onSubjectChange={handleSubjectChange}
        onAddTimeSlot={handleAddTimeSlot}
        onRemoveTimeSlot={handleRemoveTimeSlot}
        onTimeChange={handleTimeChange}
      />

      {/* Temporary Role Debugger - Remove after testing */}
      <RoleDebugger />
    </div>
  );
};

export default TeachingSchedulePage;