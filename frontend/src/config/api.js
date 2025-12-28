// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/SMS-GCA-3H/Teacher/backend';

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
  FORGOT_PASSWORD: getApiUrl('api/auth/forgot-password.php'),
  RESET_PASSWORD: getApiUrl('api/auth/reset-password.php'),

  // Teachers
  GET_TEACHER_CLASSES: getApiUrl('api/teachers/get-teacher-classes.php'),
  GET_STUDENTS_BY_SECTION: getApiUrl('api/teachers/get-students-by-section.php'),
  GET_TEACHER_PROFILE: getApiUrl('api/teachers/get-teacher-profile.php'),
  UPDATE_TEACHER_PROFILE: getApiUrl('api/teachers/update-teacher-profile.php'),
  GET_ADVISORY_CLASSES: getApiUrl('api/teachers/get-advisory-classes.php'),

  // Students
  UPDATE_STUDENT_PROFILE: getApiUrl('api/students/update-student-profile.php'),

  // Support
  SUPPORT_BASE: getApiUrl('api/support'),

  // Notifications
  GET_NOTIFICATIONS: getApiUrl('api/notifications/get-notifications.php'),
  GET_SECTION_STUDENTS_WITH_GUARDIANS: getApiUrl('api/notifications/get-section-students-with-guardians.php'),
  SEND_DISMISSAL_NOTIFICATION: getApiUrl('api/notifications/send-dismissal-notification.php'),

  // Attendance
  GET_ATTENDANCE_REPORT: getApiUrl('api/attendance/get-attendance-report.php'),
  GET_SECTION_ATTENDANCE: getApiUrl('api/attendance/get-section-attendance.php'),
  UPDATE_ATTENDANCE: getApiUrl('api/attendance/update-attendance.php'),
  AUTO_MARK_ABSENT: getApiUrl('api/attendance/auto-mark-absent.php'),

  // Announcements
  GET_ANNOUNCEMENTS: getApiUrl('api/announcements/get-announcements.php'),

  // Schedules
  GET_OPTIONS: getApiUrl('api/schedules/get-options.php'),
  GET_MY_SCHEDULE: getApiUrl('api/schedules/get-my-schedule.php'),
  GET_ALL_SCHEDULES: getApiUrl('api/schedules/get-all-schedules.php'),
  GET_SECTIONS_WITH_STUDENTS: getApiUrl('api/schedules/get-sections-with-students.php'),
  GET_TEACHER_SECTIONS: getApiUrl('api/schedules/get-teacher-sections.php'),
  UPDATE_SCHEDULE: getApiUrl('api/schedules/update-schedule.php'),
  DELETE_SCHEDULE: getApiUrl('api/schedules/delete-schedule.php'),
  ASSIGN_TEACHER_TO_SECTION: getApiUrl('api/schedules/assign-teacher-to-section.php'),
  CREATE_SECTIONS: getApiUrl('api/schedules/create-sections.php'),
  GET_SECTION_SCHEDULE: getApiUrl('api/schedules/get-section-schedule.php'),
  GET_TEACHER_SCHEDULE_DETAIL: getApiUrl('api/schedules/get-teacher-schedule-detail.php'),
  SUBMIT_SCHEDULE: getApiUrl('api/schedules/submit-schedule.php'),
  GET_SECTIONS_BY_GRADE: getApiUrl('api/schedules/get-sections-by-grade.php'),
  GET_TEACHERS_BY_SUBJECT: getApiUrl('api/schedules/get-teachers-by-subject.php'),
  GET_TEACHER_SCHEDULE: getApiUrl('api/schedules/get-teacher-schedule.php'),

  // Subjects
  GET_SUBJECTS_BY_GRADE: getApiUrl('api/subjects/get-subjects-by-grade.php'),

  // Grades
  GET_SECTION_GRADES: getApiUrl('api/grades/get-section-grades.php'),
  GET_SECTION_QUARTERLY_GRADES: getApiUrl('api/grades/get-section-quarterly-grades.php'),
  SAVE_QUARTERLY_GRADE: getApiUrl('api/grades/save-quarterly-grade.php'),
  GET_STUDENT_GRADES_ALL_SUBJECTS: getApiUrl('api/grades/get-student-grades-all-subjects.php'),
  GET_SUBMISSION_STATUS: getApiUrl('api/grades/get-submission-status.php'),
  SUBMIT_GRADES_TO_REGISTRAR: getApiUrl('api/grades/submit-grades-to-registrar.php'),
  CHECK_GRADE_SUBMISSION_DEADLINE: getApiUrl('api/grades/check-grade-submission-deadline.php'),

  // Settings
  GET_APPEARANCE_SETTINGS: getApiUrl('api/teachers/get-appearance-settings.php'),
  UPDATE_APPEARANCE_SETTINGS: getApiUrl('api/teachers/update-appearance-settings.php'),
  
  // Grades
  CHECK_GRADING_DEADLINE: getApiUrl('api/grades/check-grading-deadline.php'),
  SUBMIT_GRADES_TO_REGISTRAR: getApiUrl('api/grades/submit-grades-to-registrar.php'),
  
  // Base URL for custom endpoints
  BASE_URL: API_BASE_URL,
};

export default {
  API_BASE_URL,
  getApiUrl,
  API_ENDPOINTS,
};
