// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/gymnazo-christian-academy-teacher-side/backend';

// Helper function to build API URLs
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Export the base URL for direct usage
export const API_URL = API_BASE_URL;

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: getApiUrl('api/auth/login.php'),
  LOGOUT: getApiUrl('api/auth/logout.php'),
  GET_CURRENT_USER: getApiUrl('api/auth/get-current-user.php'),
  REGISTER_TEACHER: getApiUrl('api/auth/register-teacher.php'),
  
  // Teachers
  GET_TEACHER_CLASSES: getApiUrl('api/teachers/get-teacher-classes.php'),
  GET_STUDENTS_BY_SECTION: getApiUrl('api/teachers/get-students-by-section.php'),
  
  // Support
  SUPPORT_BASE: getApiUrl('api/support'),
  
  // Notifications
  GET_NOTIFICATIONS: getApiUrl('api/notifications/get-notifications.php'),
  
  // Attendance
  GET_ATTENDANCE_REPORT: getApiUrl('api/attendance/get-report.php'),
};

export default {
  API_BASE_URL,
  getApiUrl,
  API_ENDPOINTS,
};
