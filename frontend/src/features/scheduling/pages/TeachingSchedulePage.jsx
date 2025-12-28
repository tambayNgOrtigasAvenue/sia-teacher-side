import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/common/Breadcrumb';
import MySchedule from '../components/MySchedule';
import TeacherSchedules from '../components/TeacherSchedules';
import EditScheduleModal from '../components/EditScheduleModal';
import CreateScheduleModal from '../components/CreateScheduleModal';
import AddClassModal from '../components/AddClassModal';
import SuccessModal from '../../../components/common/SuccessModal';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { canManageAllSchedules } from '../../../utils/permissions';
import { API_ENDPOINTS } from '../../../config/api';

const TeachingSchedulePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userCanManageAllSchedules = canManageAllSchedules(user);

  const [activeTab, setActiveTab] = useState('my-schedule');
  const [searchQuery, setSearchQuery] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [teacherSchedules, setTeacherSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
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
    teacherId: '',
    gradeLevelId: '',
    sectionId: '',
    teachers: []
  });

  const [teacherSections, setTeacherSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [createFormData, setCreateFormData] = useState({
    teacher: '',
    gradeSection: '',
    day: 'Monday to Friday',
    schedule: []
  });

  // initial fetch
  useEffect(() => {
    fetchOptions();
  }, []);

  // fetch schedules when tab changes
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // keep addClassFormData teachers updated
  useEffect(() => {
    setAddClassFormData(prev => ({ ...prev, teachers }));
  }, [teachers]);

  const fetchOptions = async () => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.GET_OPTIONS,
        { withCredentials: true }
      );

      if (response.data?.success) {
        setGradeLevels(response.data.data.gradeLevels || []);
        setSubjects(response.data.data.subjects || []);
        setActiveSchoolYear(response.data.data.activeSchoolYear || null);
        setTeachers(response.data.data.teachers || []);
      } else {
        toast.error('Failed to load form options');
      }
    } catch (err) {
      console.error('Error fetching options:', err?.response || err);
      toast.error('Error loading grade levels and subjects');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'my-schedule') {
        const response = await axios.get(
          API_ENDPOINTS.GET_MY_SCHEDULE,
          { withCredentials: true }
        );
        if (response.data?.success) {
          setSchedules(response.data.data || []);
        } else {
          setError(response.data?.message || 'Failed to load schedules');
          toast.error(response.data?.message || 'Failed to load schedules');
        }
      } else {
        const response = await axios.get(
          API_ENDPOINTS.GET_ALL_SCHEDULES,
          { withCredentials: true }
        );
        if (response.data?.success) {
          setTeacherSchedules(response.data.data || []);
        } else {
          setError(response.data?.message || 'Failed to load schedules');
          toast.error(response.data?.message || 'Failed to load schedules');
        }
      }
    } catch (err) {
      console.error('Error fetching schedules:', err?.response || err);
      const errorMessage = err?.response?.data?.message || 'Failed to load schedules. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionsForGrade = async (gradeLevelId) => {
    if (!gradeLevelId) {
      setSectionsData([]);
      return;
    }

    try {
      const response = await axios.get(
        `${API_ENDPOINTS.GET_SECTIONS_WITH_STUDENTS}?gradeLevelId=${gradeLevelId}`,
        { withCredentials: true }
      );

      if (response.data?.success) {
        const sections = response.data.data[0]?.sections || [];
        setSectionsData(sections);
      } else {
        setSectionsData([]);
        toast.error(response.data?.message || 'Failed to load sections');
      }
    } catch (err) {
      console.error('Error fetching sections:', err?.response || err);
      setSectionsData([]);
      toast.error(err?.response?.data?.message || 'Failed to load sections');
    }
  };

  const fetchTeacherSections = async (teacherId) => {
    if (!teacherId) {
      setTeacherSections([]);
      setSelectedSection(null);
      return;
    }

    try {
      const response = await axios.get(
        `${API_ENDPOINTS.GET_TEACHER_SECTIONS}?teacherId=${teacherId}`,
        { withCredentials: true }
      );

      if (response.data?.success) {
        setTeacherSections(response.data.data || []);
        if ((response.data.data || []).length > 0) {
          setSelectedSection(response.data.data[0]);
        }
      } else {
        setTeacherSections([]);
        toast.error(response.data?.message || 'Failed to load teacher sections');
      }
    } catch (err) {
      console.error('Error fetching teacher sections:', err?.response || err);
      toast.error('Failed to load teacher sections');
      setTeacherSections([]);
    }
  };

  const toggleFavorite = (scheduleId, sectionId) => {
    setSchedules(prev =>
      prev.map(schedule =>
        schedule.id === scheduleId
          ? {
            ...schedule,
            sections: schedule.sections.map(section =>
              section.id === sectionId ? { ...section, isFavorite: !section.isFavorite } : section
            )
          }
          : schedule
      )
    );
  };

  const handleSectionClick = (grade, section, action = 'schedule') => {
    if (action === 'emergency') {
      navigate('/teacher-dashboard/emergency-dismissal', {
        state: {
          schedule: {
            scheduleId: section.id,
            sectionId: section.id,
            gradeLevel: grade.grade.replace('Grade ', ''),
            section: section.name.replace('Section ', ''),
            subject: 'All Classes',
            teacher: user?.firstName + ' ' + user?.lastName,
            day: 'Monday',
            startTime: '8:00 AM',
            endTime: '5:00 PM',
            room: section.room
          }
        }
      });
      return;
    }

    setSelectedSection(section);
    setCreateFormData({
      teacher: user?.teacherProfileId || '',
      gradeSection: section.id,
      sectionName: section.name,
      gradeName: grade.grade,
      day: 'Monday to Friday',
      schedule: []
    });
    setIsCreateModalOpen(true);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/teacher-dashboard' },
    { label: 'Teaching Schedule' }
  ];

  const filteredSchedules = schedules.filter(schedule =>
    (schedule.grade || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (schedule.adviser || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (schedule.sections || []).some(section =>
      (section.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (section.room || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredTeacherSchedules = teacherSchedules.filter(schedule =>
    (schedule.teacher || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (schedule.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (schedule.day || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (schedule.room || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setEditFormData({
      teacherProfileId: schedule.TeacherProfileID || '',
      subjectId: schedule.SubjectID || '',
      day: schedule.day || '',
      startTime: schedule.rawStartTime || '',
      endTime: schedule.rawEndTime || '',
      room: schedule.room || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editFormData.teacherProfileId || !editFormData.subjectId || !editFormData.day || !editFormData.startTime || !editFormData.endTime || !editFormData.room) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post(
        API_ENDPOINTS.UPDATE_SCHEDULE,
        {
          scheduleId: editingSchedule.id,
          ...editFormData
        },
        { withCredentials: true }
      );

      if (response.data?.success) {
        toast.success('Schedule updated successfully');
        setIsEditModalOpen(false);
        setEditingSchedule(null);
        setEditFormData({ teacherProfileId: '', subjectId: '', day: '', startTime: '', endTime: '', room: '' });
        fetchData(); // Refresh data
      } else {
        toast.error(response.data?.message || 'Failed to update schedule');
      }
    } catch (err) {
      console.error('Error updating schedule:', err);
      toast.error(err?.response?.data?.message || 'Error updating schedule');
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingSchedule(null);
    setEditFormData({ teacherProfileId: '', subjectId: '', day: '', startTime: '', endTime: '', room: '' });
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      const response = await axios.post(
        API_ENDPOINTS.DELETE_SCHEDULE,
        { scheduleId },
        { withCredentials: true }
      );

      if (response.data?.success) {
        setSuccessMessage('Schedule deleted successfully!');
        setIsSuccessModalOpen(true);
        fetchData();
      } else {
        toast.error(response.data?.message || 'Failed to delete schedule');
      }
    } catch (err) {
      console.error('Error deleting schedule:', err?.response || err);
      toast.error(err?.response?.data?.message || 'Error deleting schedule. Please try again.');
    }
  };

  const handleAddClass = () => {
    setAddClassFormData(prev => ({ ...prev, teachers: teachers || [] }));
    setIsAddClassModalOpen(true);
  };

  const handleCancelAddClass = () => {
    setIsAddClassModalOpen(false);
    setAddClassFormData({ teacherId: '', gradeLevelId: '', sectionId: '', teachers: teachers || [] });
    setSectionsData([]);
  };

  const handleSubmitAddClass = async (e) => {
    e.preventDefault();

    if (!addClassFormData.teacherId) {
      toast.error('Please select a teacher');
      return;
    }

    if (!addClassFormData.sectionId) {
      toast.error('Please select a section');
      return;
    }

    try {
      const response = await axios.post(
        API_ENDPOINTS.ASSIGN_TEACHER_TO_SECTION,
        {
          teacherId: addClassFormData.teacherId,
          sectionId: addClassFormData.sectionId
        },
        { withCredentials: true }
      );

      if (response.data?.success) {
        toast.success(response.data.message || 'Assigned successfully');
        handleCancelAddClass();
        fetchData();
      } else {
        toast.error(response.data?.message || 'Failed to assign section');
      }
    } catch (err) {
      console.error('Error assigning section:', err?.response || err);
      toast.error(err?.response?.data?.message || 'Error assigning section. Please try again.');
    }
  };

  const handleCreateSectionsForGrade = async (gradeLevelId) => {
    if (!gradeLevelId) {
      toast.error('Please select a grade level first');
      return;
    }

    if (!activeSchoolYear?.id) {
      toast.error('No active school year found. Please contact administrator.');
      return;
    }

    const theme = getSectionTheme(parseInt(gradeLevelId, 10));
    const themeText = `${theme.name} (${theme.sections})`;

    if (!window.confirm(`This will create 5 sections with theme: ${themeText}. Continue?`)) return;

    try {
      const response = await axios.post(
        API_ENDPOINTS.CREATE_SECTIONS,
        { gradeLevelId, schoolYearId: activeSchoolYear.id },
        { withCredentials: true }
      );

      if (response.data?.success) {
        toast.success(response.data.message || 'Sections created');
        fetchSectionsForGrade(gradeLevelId);
      } else {
        toast.error(response.data?.message || 'Failed to create sections');
      }
    } catch (err) {
      console.error('Error creating sections:', err?.response || err);
      toast.error(err?.response?.data?.message || 'Error creating sections. Please try again.');
    }
  };

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

  const handleCreateSchedule = () => setIsCreateModalOpen(true);

  const handleTeacherChange = async (teacherId) => {
    setCreateFormData(prev => ({ ...prev, teacher: teacherId, gradeSection: '', sectionId: '', schedule: [] }));
    await fetchTeacherSections(teacherId);
  };

  const handleSectionChange = async (sectionId, sectionData = null) => {
    console.log('🔵 handleSectionChange called:', { sectionId, sectionData });
    
    let selectedSectionData = sectionData;

    // If sectionData is not passed (e.g. from teacherSections), try to find it in teacherSections
    if (!selectedSectionData) {
      selectedSectionData = teacherSections.find(s => s.id === parseInt(sectionId, 10));
      console.log('🟡 Found in teacherSections:', selectedSectionData);
    }

    if (!selectedSectionData) {
      // If still not found (shouldn't happen with the new modal logic, but good for safety)
      // Try to find the grade level name from gradeLevels state if we have the gradeLevelId in formData
      const gradeLevel = gradeLevels.find(g => g.id == createFormData.gradeLevelId);
      const gradeName = gradeLevel ? gradeLevel.name : 'Grade Level';

      // Fetch schedule anyway
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.GET_SECTION_SCHEDULE}?sectionId=${sectionId}`,
          { withCredentials: true }
        );

        if (response.data?.success) {
          console.log('Fetched existing schedule (no section data):', response.data.data);
          setCreateFormData(prev => ({
            ...prev,
            sectionId: sectionId,
            gradeSection: response.data.data.gradeSection || '',
            schedule: response.data.data.schedule || []
          }));
        } else {
          console.log('No existing schedule found');
          setCreateFormData(prev => ({
            ...prev,
            sectionId: sectionId,
            gradeSection: '',
            schedule: []
          }));
        }
      } catch (err) {
        console.error('Error fetching section schedule:', err?.response || err);
        setCreateFormData(prev => ({
          ...prev,
          sectionId: sectionId,
          gradeSection: '',
          schedule: []
        }));
      }
    } else {
      // We have section data.
      // Check if it has gradeLevel name. The object from get-sections-by-grade.php does NOT have gradeLevel name.
      // It has: id, sectionName, advisorName, advisorId.
      // So we need to get grade level name from createFormData.gradeLevelId

      let gradeName = selectedSectionData.gradeLevel; // From teacherSections it has gradeLevel
      if (!gradeName && createFormData.gradeLevelId) {
        const gradeLevel = gradeLevels.find(g => g.id == createFormData.gradeLevelId);
        gradeName = gradeLevel ? gradeLevel.name : '';
      }

      const sectionName = selectedSectionData.sectionName || selectedSectionData.name; // Handle different property names

      // Fetch schedule first, then update formData with both section info and schedule
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.GET_SECTION_SCHEDULE}?sectionId=${sectionId}`,
          { withCredentials: true }
        );

        console.log('=== SECTION SCHEDULE FETCH ===');
        console.log('Section ID:', sectionId);
        console.log('Response success:', response.data?.success);
        console.log('Number of schedules fetched:', response.data?.data?.schedule?.length || 0);
        console.log('Fetched schedules:', response.data?.data?.schedule);
        console.log('==============================');

        if (response.data?.success) {
          console.log('Fetched existing schedule:', response.data.data);
          setCreateFormData(prev => ({
            ...prev,
            sectionId: sectionId,
            gradeSection: `${gradeName} - Section ${sectionName}`,
            schedule: response.data.data.schedule || []
          }));
        } else {
          console.log('No existing schedule found for section');
          setCreateFormData(prev => ({
            ...prev,
            sectionId: sectionId,
            gradeSection: `${gradeName} - Section ${sectionName}`,
            schedule: []
          }));
        }
      } catch (err) {
        console.error('Error fetching section schedule:', err?.response || err);
        setCreateFormData(prev => ({
          ...prev,
          sectionId: sectionId,
          gradeSection: `${gradeName} - Section ${sectionName}`,
          schedule: []
        }));
      }
    }
  };

  const fetchTeacherScheduleDetail = async (teacherId) => {
    if (!teacherId) return;
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.GET_TEACHER_SCHEDULE_DETAIL}?teacherId=${teacherId}`,
        { withCredentials: true }
      );

      if (response.data?.success) {
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
    } catch (err) {
      console.error('Error fetching teacher schedule detail:', err?.response || err);
    }
  };

  const handleCancelCreate = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({ teacher: '', gradeSection: '', day: 'Monday to Friday', schedule: [] });
    setTeacherSections([]);
    setSelectedSection(null);
  };

  const handleSubjectChange = (index, subjectId) => {
    const newSchedule = [...createFormData.schedule];
    newSchedule[index] = { ...newSchedule[index], subject: subjectId };
    setCreateFormData({ ...createFormData, schedule: newSchedule });
  };

  const handleAddTimeSlot = () => {
    setCreateFormData(prev => ({ ...prev, schedule: [...prev.schedule, { day: 'Monday', startTime: '', endTime: '', subject: '', teacherId: '', room: '' }] }));
  };

  const handleRemoveTimeSlot = (index) => {
    const newSchedule = createFormData.schedule.filter((_, i) => i !== index);
    setCreateFormData({ ...createFormData, schedule: newSchedule });
  };

  const handleTimeChange = (index, field, time) => {
    const newSchedule = [...createFormData.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: time };
    setCreateFormData({ ...createFormData, schedule: newSchedule });
  };

  const handleGradeLevelChange = async (gradeLevelId) => {
    setCreateFormData(prev => ({ ...prev, gradeLevelId, sectionId: '', gradeSection: '', schedule: [] }));
    await fetchSectionsForGrade(gradeLevelId);
  };

  const handleSlotTeacherChange = (index, teacherId) => {
    const newSchedule = [...createFormData.schedule];
    newSchedule[index] = { ...newSchedule[index], teacherId };
    setCreateFormData({ ...createFormData, schedule: newSchedule });
  };

  const handleSubmitSchedule = async (e) => {
    e.preventDefault();

    if (!createFormData.sectionId) {
      toast.error('Please select a section first.');
      return;
    }

    if (createFormData.schedule.length === 0) {
      toast.error('Please add at least one time slot');
      return;
    }

    const incompleteSlot = createFormData.schedule.find(slot => !slot.startTime || !slot.endTime || !slot.subject);
    if (incompleteSlot) {
      toast.error('Please fill in start time, end time, and subject for all time slots');
      return;
    }

    console.log('=== SUBMITTING SCHEDULE ===');
    console.log('Section ID:', createFormData.sectionId);
    console.log('Total schedules being sent:', createFormData.schedule.length);
    console.log('Schedule data:', createFormData.schedule);
    console.log('===========================');

    try {
      const response = await axios.post(
        API_ENDPOINTS.SUBMIT_SCHEDULE,
        {
          teacherProfileId: createFormData.teacherProfileId,
          sectionId: createFormData.sectionId,
          day: createFormData.day,
          schedule: createFormData.schedule
        },
        { withCredentials: true }
      );

      if (response.data?.success) {
        toast.success(response.data.message || 'Schedule saved');
        handleCancelCreate();
        fetchData();
      } else {
        toast.error(response.data?.message || 'Failed to save schedule');
      }
    } catch (err) {
      console.error('Error submitting schedule:', err?.response || err);
      toast.error(err?.response?.data?.message || 'Error saving schedule. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 w-full">
      <Toaster position="top-right" />

      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {activeTab === 'my-schedule' ? 'Teaching Schedule' : 'Teacher Schedules'}
        </h1>
        {activeTab === 'my-schedule' && <p className="text-lg text-orange-600">Overview</p>}
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => {
              setActiveTab('my-schedule');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'my-schedule' ? 'bg-amber-300 text-gray-900' : 'bg-transparent text-gray-900 dark:text-white border'
              }`}
          >
            My Class Schedule
          </button>

          {userCanManageAllSchedules && (
            <button
              onClick={() => {
                setActiveTab('teacher-schedules');
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'teacher-schedules' ? 'bg-amber-300 text-gray-900' : 'bg-transparent text-gray-900 dark:text-white border'
                }`}
            >
              Teacher Schedules
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row items-center">
          <div className="flex items-center gap-2">
            {activeTab === 'my-schedule' && (
              <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border">
                <span className="text-xs md:text-sm font-medium">Add filter</span>
                <Filter className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border">
            <Search className="w-4 h-4" />
            <input
              type="text"
              placeholder={activeTab === 'my-schedule' ? 'Search...' : 'Search teacher, subject...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} title="Clear search">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {activeTab === 'my-schedule' && userCanManageAllSchedules && (
              <button onClick={handleAddClass} className="px-4 py-2 bg-amber-300 rounded-xl font-medium">
                + Add New Class
              </button>
            )}

            {activeTab === 'teacher-schedules' && userCanManageAllSchedules && (
              <button onClick={handleCreateSchedule} className="px-4 py-2 bg-amber-300 rounded-xl font-medium">
                Create Schedule
              </button>
            )}
          </div>
        </div>

        {searchQuery && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {activeTab === 'my-schedule'
              ? `Found ${filteredSchedules.length} schedule(s) matching "${searchQuery}"`
              : `Found ${filteredTeacherSchedules.length} schedule(s) matching "${searchQuery}"`}
          </div>
        )}
      </div>

      <div>
        {activeTab === 'my-schedule' ? (
          <MySchedule
            schedules={filteredSchedules}
            loading={loading}
            onToggleFavorite={toggleFavorite}
            onSectionClick={handleSectionClick}
          />
        ) : (
          <TeacherSchedules
            schedules={filteredTeacherSchedules}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <EditScheduleModal
        isOpen={isEditModalOpen}
        schedule={editingSchedule}
        formData={editFormData}
        teachers={teachers}
        subjects={subjects}
        onClose={handleCancelEdit}
        onSave={handleSaveEdit}
        onChange={setEditFormData}
      />

      <AddClassModal
        isOpen={isAddClassModalOpen}
        formData={addClassFormData}
        gradeLevels={gradeLevels}
        sectionsData={sectionsData}
        activeSchoolYear={activeSchoolYear}
        onClose={handleCancelAddClass}
        onSubmit={handleSubmitAddClass}
        onChange={setAddClassFormData}
        onGradeLevelChange={(gradeLevelId) => {
          setAddClassFormData(prev => ({ ...prev, gradeLevelId }));
          fetchSectionsForGrade(gradeLevelId);
        }}
        onCreateSections={handleCreateSectionsForGrade}
        getSectionTheme={getSectionTheme}
      />

      <CreateScheduleModal
        isOpen={isCreateModalOpen}
        formData={createFormData}
        teachers={teachers}
        subjects={subjects}
        gradeLevels={gradeLevels}
        teacherSections={teacherSections}
        onClose={handleCancelCreate}
        onSubmit={handleSubmitSchedule}
        onTeacherChange={handleTeacherChange}
        onSectionChange={handleSectionChange}
        onSubjectChange={handleSubjectChange}
        onAddTimeSlot={handleAddTimeSlot}
        onRemoveTimeSlot={handleRemoveTimeSlot}
        onTimeChange={handleTimeChange}
        onGradeLevelChange={handleGradeLevelChange}
        onSlotTeacherChange={handleSlotTeacherChange}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        message={successMessage}
        onClose={() => setIsSuccessModalOpen(false)}
        duration={2000}
      />
    </div>
  );
};

export default TeachingSchedulePage;
