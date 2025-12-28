import { useState, useEffect, useCallback, useMemo } from 'react'; 
import { useAuth } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Bg from '../../../assets/img/bg.png';
import Logo from '../../../assets/img/gymnazu.png';
import SuccessModal from "../../modals/SuccessModal";
import { BookOpen, GraduationCap } from 'lucide-react';

const Roles = {
  Teacher: {
    id: 1,
    urlPath: '/teacher-dashboard',
    icon: BookOpen,
    label: 'Teacher'
  },
  
  Student: {
    id: 2,
    urlPath: '/student-portal',
    icon: GraduationCap,
    label: 'Student'
  },
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('Teacher');
  const navigate = useNavigate();
  const { user, loading: authLoading, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStudentRedirect = useCallback(() => {
    navigate(Roles.Student.urlPath);
  }, [navigate]);

  const handleRoleChange = useCallback((role) => {
    setSelectedRole(role);
  }, []);

  useEffect(() => {
    if (!authLoading && user && !isSubmitting) {
      const hasToken = localStorage.getItem('authToken') || sessionStorage.getItem('teacherSession');
      if (hasToken) {
        navigate(Roles[selectedRole].urlPath, { replace: true });
      }
    }
  }, [user, authLoading, isSubmitting, navigate, selectedRole]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setIsSubmitting(true);

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    try { 
      const result = await login(username, password, selectedRole);
      
      if (result.success) {
        setLoggedInUser(result.user.fullName);
        setShowSuccessModal(true);
        
        localStorage.setItem('userRole', selectedRole);
        
        if (result.token) {
          localStorage.setItem('authToken', result.token);
        } else {
          sessionStorage.setItem('teacherSession', 'true');
        }
        
        setTimeout(() => {
          navigate(Roles[selectedRole].urlPath);
        }, 2000);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  }, [username, password, selectedRole, login, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <>
      <SuccessModal 
        isOpen={showSuccessModal} 
        username={loggedInUser}
      />

      {/* Remove h-[85.4vh] to prevent scrolling */}
      <div className="relative w-full flex items-center justify-center py-8">
        
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${Bg})` }}
        >
          <div className="absolute inset-0 bg-stone-900/60 dark:bg-black/70 z-0 transition-colors duration-300"></div>
        </div>

        {/* Smaller container */}
        <div className="relative z-10 w-full max-w-xs mx-4 p-6 rounded-xl shadow-lg bg-stone-800/60 dark:bg-gray-900/70 border border-stone-700 dark:border-gray-600 backdrop-blur-sm transition-colors duration-300">
          
          {/* Smaller logo and title */}
          <div className="flex flex-col items-center mb-4">
            <img 
              src={Logo} 
              alt="School Logo" 
              className="w-16 h-16 mb-2 object-contain"
            />
            <h2 className="text-lg font-bold uppercase text-white tracking-wider">Login</h2>
          </div>

          {error && (
            <div className="mb-3 p-2 bg-red-500/20 border border-red-500 rounded text-red-200 text-xs text-center">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
              Select Role
            </label>
            <div className="flex flex-row justify-center gap-1">
              {Object.entries(Roles).map(([key, role]) => {
                const Icon = role.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleRoleChange(key)}
                    className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg border min-w-[70px] transition text-xs ${
                      selectedRole === key
                        ? 'bg-amber-400 text-gray-900 border-amber-400'
                        : 'bg-white/10 text-gray-300 border-gray-600 hover:border-amber-400'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="font-medium">{role.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Show either login form or student redirect notice */}
          {selectedRole === 'Student' ? (
            <div className="mt-4 p-4 border border-amber-400/40 rounded-lg bg-amber-400/5">
              <div className="flex flex-col items-center text-center">
                <GraduationCap size={32} className="text-amber-400 mb-2" />
                <h3 className="text-lg font-bold text-white mb-1">Student Portal</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Students should access their portal directly.
                </p>
                <button
                  onClick={handleStudentRedirect}
                  className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-semibold rounded-full transition duration-300 shadow text-sm flex items-center gap-1"
                >
                  <GraduationCap size={16} />
                  Go to Student Portal
                </button>
                <button
                  onClick={() => handleRoleChange('Teacher')}
                  className="mt-3 text-amber-400 hover:text-amber-300 text-xs"
                >
                  ← Back to Teacher Login
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Teacher ID / Email"
                  value={username}
                  autoComplete="username"
                  disabled={loading}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </span>
              </div>

              <div>
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    autoComplete="current-password"
                    disabled={loading}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a3 3 0 106 0v-3a3 3 0 00-6 0v3z"></path></svg>
                  </span>
                </div>
                <div className="text-right mt-1">
                  <Link to="/forgot-password" className="text-xs text-gray-300 hover:text-amber-400 transition duration-300">Forgot Password?</Link>
                </div>
              </div>

              <div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-2 text-gray-900 font-semibold rounded-full bg-amber-400 hover:bg-amber-300 transition duration-300 shadow text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    'Login as Teacher'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Smaller footer */}
          <div className="text-center mt-4 text-xs text-gray-300">
            Need help? Contact the <Link to="/#contact-us" className="font-semibold text-amber-400 hover:underline">School Office</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;