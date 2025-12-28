/**
 * Role-based Permission Utilities
 * Handles permission checks for different teacher roles
 */

// Role IDs as defined in the database
export const ROLES = {
  SUPER_ADMIN: 1,          // Super Admin
  REGISTRAR: 2,            // Registrar
  FINANCE: 3,              // Finance Officer
  TEACHER: 4,              // Regular Teacher
  STUDENT: 5,              // Student
  SUPER_TEACHER: 6         // Head Teacher (Super Teacher)
};

// Role Names
export const ROLE_NAMES = {
  1: 'Super Admin',
  2: 'Registrar',
  3: 'Finance Officer',
  4: 'Teacher',
  5: 'Student',
  6: 'Head Teacher'
};

/**
 * Get user's role ID (handles different casing and string/number conversion)
 * @param {Object} user - User object from AuthContext
 * @returns {number|null}
 */
const getUserRoleId = (user) => {
  if (!user) return null;
  // Handle both roleId and RoleID for backwards compatibility
  const roleId = user.roleId || user.RoleID || null;
  // Convert to number if it's a string (database might return as string)
  return roleId !== null ? parseInt(roleId, 10) : null;
};

/**
 * Check if user is a Super Teacher (Head Teacher)
 * @param {Object} user - User object from AuthContext
 * @returns {boolean}
 */
export const isSuperTeacher = (user) => {
  if (!user) return false;

  // Check by Role ID
  const roleId = getUserRoleId(user);
  if (roleId === ROLES.SUPER_TEACHER) return true;

  // Check by User Type (fallback)
  if (user.userType === 'Head Teacher') return true;

  // Check by Role Name (fallback)
  if (user.roleName === 'Head Teacher' || user.RoleName === 'Head Teacher') return true;

  return false;
};

/**
 * Check if user is a regular Teacher
 * @param {Object} user - User object from AuthContext
 * @returns {boolean}
 */
export const isRegularTeacher = (user) => {
  const roleId = getUserRoleId(user);
  return roleId === ROLES.TEACHER;
};

/**
 * Check if user is an Assistant Teacher
 * @param {Object} user - User object from AuthContext
 * @returns {boolean}
 */
export const isAssistantTeacher = (user) => {
  const roleId = getUserRoleId(user);
  return roleId === ROLES.ASSISTANT_TEACHER;
};

/**
 * Check if user can create/edit schedules for all teachers
 * Only Super Teachers can do this
 * @param {Object} user - User object from AuthContext
 * @returns {boolean}
 */
export const canManageAllSchedules = (user) => {
  return isSuperTeacher(user);
};

/**
 * Check if user can add/edit grade levels and sections
 * Only Super Teachers can do this
 * @param {Object} user - User object from AuthContext
 * @returns {boolean}
 */
export const canManageGradeLevelsAndSections = (user) => {
  return isSuperTeacher(user);
};

/**
 * Check if user can submit grades
 * Both Regular Teachers and Super Teachers can submit grades
 * @param {Object} user - User object from AuthContext
 * @returns {boolean}
 */
export const canSubmitGrades = (user) => {
  return isRegularTeacher(user) || isSuperTeacher(user);
};

/**
 * Check if user can view students
 * All teacher types can view students
 * @param {Object} user - User object from AuthContext
 * @returns {boolean}
 */
export const canViewStudents = (user) => {
  return getUserRoleId(user) !== null;
};

/**
 * Check if user can update their own profile
 * All teachers can update their profile (except role)
 * @param {Object} user - User object from AuthContext
 * @returns {boolean}
 */
export const canUpdateOwnProfile = (user) => {
  return getUserRoleId(user) !== null;
};

/**
 * Check if user can create new class schedules for any teacher
 * Only Super Teachers have this permission
 * @param {Object} user - User object from AuthContext
 * @returns {boolean}
 */
export const canCreateClassSchedules = (user) => {
  return isSuperTeacher(user);
};

/**
 * Check if user can view their own teaching schedule
 * All teachers can view their own schedule
 * @param {Object} user - User object from AuthContext
 * @returns {boolean}
 */
export const canViewOwnSchedule = (user) => {
  return getUserRoleId(user) !== null;
};

/**
 * Check if user can manage announcements
 * Both Regular and Super Teachers can manage announcements
 * @param {Object} user - User object from AuthContext
 * @returns {boolean}
 */
export const canManageAnnouncements = (user) => {
  return isRegularTeacher(user) || isSuperTeacher(user);
};

/**
 * Get user role display name
 * @param {Object} user - User object from AuthContext
 * @returns {string}
 */
export const getUserRoleName = (user) => {
  const roleId = getUserRoleId(user);
  return user?.roleName || user?.RoleName || ROLE_NAMES[roleId] || 'Teacher';
};

/**
 * Get all permissions for a user
 * @param {Object} user - User object from AuthContext
 * @returns {Object} Object with all permission flags
 */
export const getUserPermissions = (user) => {
  return {
    isSuperTeacher: isSuperTeacher(user),
    isRegularTeacher: isRegularTeacher(user),
    isAssistantTeacher: isAssistantTeacher(user),
    canManageAllSchedules: canManageAllSchedules(user),
    canManageGradeLevelsAndSections: canManageGradeLevelsAndSections(user),
    canSubmitGrades: canSubmitGrades(user),
    canViewStudents: canViewStudents(user),
    canUpdateOwnProfile: canUpdateOwnProfile(user),
    canCreateClassSchedules: canCreateClassSchedules(user),
    canViewOwnSchedule: canViewOwnSchedule(user),
    canManageAnnouncements: canManageAnnouncements(user),
    roleName: getUserRoleName(user)
  };
};
