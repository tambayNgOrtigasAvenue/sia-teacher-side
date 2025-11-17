import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserPermissions, ROLES } from '../../utils/permissions';

/**
 * RoleDebugger Component
 * Temporary component to debug role-based permissions
 * Add this to any page to see role information
 */
export default function RoleDebugger() {
  const { user } = useAuth();
  const permissions = getUserPermissions(user);

  useEffect(() => {
    console.log('=== ROLE DEBUGGER ===');
    console.log('User object:', user);
    console.log('Permissions:', permissions);
    console.log('Role Constants:', ROLES);
  }, [user, permissions]);

  if (!user) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
        <h3 className="font-bold mb-2">⚠️ No User Logged In</h3>
        <p className="text-sm">User object is null or undefined</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md z-50 text-xs">
      <h3 className="font-bold mb-2 text-sm">🔍 Role Debug Info</h3>
      <div className="space-y-1">
        <p><strong>User ID:</strong> {user.userId}</p>
        <p><strong>Full Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.emailAddress}</p>
        <p><strong>Role ID:</strong> {user.roleId || user.RoleID || 'NOT SET'}</p>
        <p><strong>Role Name:</strong> {user.roleName || user.RoleName || 'NOT SET'}</p>
        <hr className="my-2 border-gray-700" />
        <p className="font-semibold">Permissions:</p>
        <p>• Super Teacher: {permissions.isSuperTeacher ? '✅' : '❌'}</p>
        <p>• Regular Teacher: {permissions.isRegularTeacher ? '✅' : '❌'}</p>
        <p>• Can Manage All Schedules: {permissions.canManageAllSchedules ? '✅' : '❌'}</p>
        <p>• Can Manage Grade Levels: {permissions.canManageGradeLevelsAndSections ? '✅' : '❌'}</p>
      </div>
      <button
        onClick={() => console.log('Full user object:', user)}
        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
      >
        Log Full User Object
      </button>
    </div>
  );
}
