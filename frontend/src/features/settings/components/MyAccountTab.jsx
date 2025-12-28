import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Calendar, Upload, Edit2, Save, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { API_ENDPOINTS, API_URL } from '../../../config/api';

/**
 * MyAccountTab Component
 * Displays and allows editing of teacher profile information
 */
export default function MyAccountTab() {
  const { refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    age: '',
    birthday: '',
    phoneNumber: '',
    accountType: '',
    religion: '',
    motherTongue: '',
    profilePicture: null,
  });
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    fetchTeacherProfile();
  }, []);

  // Fetch teacher profile from API
  const fetchTeacherProfile = async () => {
    try {
      setLoading(true);
      console.log('Fetching teacher profile...');
      
      const response = await axios.get(
        API_ENDPOINTS.GET_TEACHER_PROFILE,
        { withCredentials: true }
      );

      console.log('Profile response:', response.data);

      if (response.data.success) {
        const data = response.data.data;
        const formattedData = {
          firstName: data.firstName || '',
          middleName: data.middleName || '',
          lastName: data.lastName || '',
          fullName: `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.trim(),
          email: data.email || '',
          age: data.age || '',
          birthday: data.birthday || '',
          phoneNumber: data.phoneNumber || '',
          accountType: data.accountType || 'Teacher',
          religion: data.religion || '',
          motherTongue: data.motherTongue || '',
          profilePicture: data.profilePicture || null,
        };
        console.log('Formatted profile data:', formattedData);
        setProfileData(formattedData);
        setOriginalData(formattedData);
        setProfilePicturePreview(null);
        setImageTimestamp(Date.now());
      } else {
        console.error('Profile fetch failed:', response.data.message);
        toast.error(response.data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error loading profile. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle save
  const handleSave = async () => {
    const loadingToast = toast.loading('Saving profile changes...');
    
    try {
      setSaving(true);
      
      // Log what we're sending
      console.log('Sending profile data:', profileData);
      
      const response = await axios.post(
        API_ENDPOINTS.UPDATE_TEACHER_PROFILE,
        profileData,
        { withCredentials: true }
      );

      console.log('Update response:', response.data);

      if (response.data.success) {
        toast.success('Profile updated successfully!', { id: loadingToast });
        setOriginalData(profileData);
        setProfilePicturePreview(null);
        setIsEditing(false);
        
        // Update image timestamp to force reload
        setImageTimestamp(Date.now());
        
        // Refresh user data in AuthContext to update header
        try {
          await refreshUser();
        } catch (refreshError) {
          console.warn('Could not refresh user context:', refreshError);
        }
        
        // Refetch profile to ensure UI is in sync with database
        await fetchTeacherProfile();
      } else {
        toast.error(response.data.message || 'Failed to update profile', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Error updating profile. Please try again.', { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setProfileData(originalData);
    setProfilePicturePreview(null);
    setIsEditing(false);
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
        handleChange('profilePicture', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-[35px] p-12 text-center border border-gray-200 dark:border-gray-700">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white dark:bg-gray-800 rounded-[35px] border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header Section */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Account</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Edit2 size={18} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-white rounded-full hover:bg-amber-500 transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Profile Header with Gradient */}
          <div className="bg-gradient-to-r from-white to-amber-300 dark:from-gray-700 dark:to-amber-600 rounded-t-[25px] p-12 -mx-8 relative">
          </div>

          {/* Profile Picture and Name */}
          <div className="px-8 -mt-24 mb-6">
            <div className="flex flex-col gap-4">
              {/* Profile Picture */}
              <div className="relative w-[200px] h-[200px]">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700">
                  {(profilePicturePreview || profileData.profilePicture) ? (
                    <img
                      src={
                        profilePicturePreview 
                          ? profilePicturePreview
                          : profileData.profilePicture.startsWith('data:') 
                            ? profileData.profilePicture 
                            : `${API_URL}/${profileData.profilePicture}?t=${imageTimestamp}`
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={80} className="text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>
                
                {/* Upload Button - Bottom Right of Circle */}
                {isEditing && (
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-2 right-2 backdrop-blur-sm bg-amber-500 hover:bg-amber-600 p-3 rounded-full cursor-pointer transition-colors shadow-lg border-2 border-white dark:border-gray-800"
                  >
                    <Upload size={20} className="text-white" />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                )}
              </div>

              {/* Name and Email */}
              <div className="flex flex-col gap-2">
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">
                    {profileData.lastName ? profileData.lastName : ''}
                    {profileData.firstName ? `, ${profileData.firstName}` : ''}
                    {profileData.middleName ? ` ${profileData.middleName}` : ''}
                </h3>
                <a
                  href={`mailto:${profileData.email}`}
                  className="text-lg font-medium text-slate-600 dark:text-slate-400 hover:underline"
                >
                  {profileData.email || 'teacher@gmail.com'}
                </a>
              </div>
            </div>
          </div>

          {/* Personal Info Section */}
          <div className="px-8 mb-6">
            <div className="flex flex-col gap-2 mb-6">
              <p className="font-bold text-base text-slate-800 dark:text-white">Personal Info</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                You can change your personal information settings here.
              </p>
            </div>

            {/* Form Fields */}
            <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-6">
              <div className="flex flex-col gap-6">
                {/* Row 1: Full Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-slate-800 dark:text-white">
                      Last Name
                    </label>
                    <div className="bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-3 flex items-center gap-3">
                      <User size={20} className="text-slate-500 dark:text-slate-400" />
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className="flex-1 bg-transparent text-slate-600 dark:text-slate-300 font-medium outline-none disabled:cursor-not-allowed"
                        placeholder="eg. Dela Cruz"
                      />
                    </div>
                  </div>

                  {/* First Name */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-slate-800 dark:text-white">
                      First Name
                    </label>
                    <div className="bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-3 flex items-center gap-3">
                      <Mail size={20} className="text-slate-500 dark:text-slate-400" />
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className="flex-1 bg-transparent text-slate-600 dark:text-slate-300 font-medium outline-none disabled:cursor-not-allowed"
                        placeholder="eg. Juan"
                      />
                    </div>
                  </div>

                    {/* Middle Name */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-slate-800 dark:text-white">
                      Middle Name
                    </label>
                    <div className="bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-3 flex items-center gap-3">
                      <Mail size={20} className="text-slate-500 dark:text-slate-400" />
                      <input
                        type="text"
                        value={profileData.middleName}
                        onChange={(e) => handleChange('middleName', e.target.value)}
                        disabled={!isEditing}
                        className="flex-1 bg-transparent text-slate-600 dark:text-slate-300 font-medium outline-none disabled:cursor-not-allowed"
                        placeholder="eg. Huanito"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-slate-800 dark:text-white">
                      Email
                    </label>
                    <div className="bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-3 flex items-center gap-3">
                        <Mail size={20} className="text-slate-500 dark:text-slate-400" />
                        <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            disabled={!isEditing}
                            className="flex-1 bg-transparent text-slate-600 dark:text-slate-300 font-medium outline-none disabled:cursor-not-allowed"
                            placeholder="eg. juan.delacruz@example.com"
                        />
                    </div>
                </div>

                {/* Row 2: Age and Birthday */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-slate-800 dark:text-white">Age</label>
                    <div className="bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-3 flex items-center gap-3">
                      <input
                        type="number"
                        value={profileData.age}
                        onChange={(e) => handleChange('age', e.target.value)}
                        disabled={!isEditing}
                        className="flex-1 bg-transparent text-slate-600 dark:text-slate-300 font-medium outline-none disabled:cursor-not-allowed"
                        placeholder="Enter age"
                      />
                    </div>
                  </div>

                  {/* Birthday */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-slate-800 dark:text-white">
                      Birthday
                    </label>
                    <div className="bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-3 flex items-center gap-3">
                      <input
                        type="date"
                        value={profileData.birthday}
                        onChange={(e) => handleChange('birthday', e.target.value)}
                        disabled={!isEditing}
                        className="flex-1 bg-transparent text-slate-600 dark:text-slate-300 font-medium outline-none disabled:cursor-not-allowed"
                        placeholder="Select birthday"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Phone Number and Account Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-slate-800 dark:text-white">
                      Phone Number
                    </label>
                    <div className="bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-full overflow-hidden flex items-center">
                      <div className="bg-slate-50 dark:bg-slate-700 border-r border-slate-300 dark:border-slate-600 px-3 py-3 flex items-center gap-2">
                        <span className="text-xs">🇵🇭</span>
                      </div>
                      <input
                        type="tel"
                        value={profileData.phoneNumber}
                        onChange={(e) => handleChange('phoneNumber', e.target.value)}
                        disabled={!isEditing}
                        className="flex-1 bg-transparent text-slate-600 dark:text-slate-300 font-medium outline-none px-4 disabled:cursor-not-allowed"
                        placeholder="+63 (123) 456-7890"
                      />
                    </div>
                  </div>

                  {/* Account Type */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-slate-800 dark:text-white">
                      Account Type
                    </label>
                    <div className="bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-3 flex items-center gap-3">
                      <input
                        type="text"
                        value={profileData.accountType}
                        disabled
                        className="flex-1 bg-transparent text-slate-600 dark:text-slate-300 font-medium outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Religion and Mother Tongue */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Religion */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-slate-800 dark:text-white">
                      Religion
                    </label>
                    <div className="bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-3 flex items-center gap-3">
                      <input
                        type="text"
                        value={profileData.religion}
                        onChange={(e) => handleChange('religion', e.target.value)}
                        disabled={!isEditing}
                        className="flex-1 bg-transparent text-slate-600 dark:text-slate-300 font-medium outline-none disabled:cursor-not-allowed"
                        placeholder="Enter religion"
                      />
                    </div>
                  </div>

                  {/* Mother Tongue */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-slate-800 dark:text-white">
                      Mother Tongue
                    </label>
                    <div className="bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-3 flex items-center gap-3">
                      <input
                        type="text"
                        value={profileData.motherTongue}
                        onChange={(e) => handleChange('motherTongue', e.target.value)}
                        disabled={!isEditing}
                        className="flex-1 bg-transparent text-slate-600 dark:text-slate-300 font-medium outline-none disabled:cursor-not-allowed"
                        placeholder="Enter mother tongue"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
