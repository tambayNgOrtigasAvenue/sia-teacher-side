import { useState, useEffect } from 'react'; 
import { useAuth } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Bg from '../../../assets/img/bg.png';
import Logo from '../../../assets/img/gymnazu.png';
import SuccessModal from "../../modals/SuccessModal";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate();
  const { user, loading: authLoading, login } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only redirect if user is logged in AND we're not in the middle of submitting
  // This prevents flickering when logging out
  useEffect(() => {
    if (!authLoading && user && !isSubmitting) {
      // Additional check: only redirect if we have a valid token
      const hasToken = localStorage.getItem('authToken') || sessionStorage.getItem('teacherSession');
      if (hasToken) {
        navigate('/teacher-dashboard', { replace: true });
      }
    }
  }, [user, authLoading, isSubmitting, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setIsSubmitting(true);

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      setIsSubmitting(false)
      return;
    }

    try {
      const result = await login(username, password);
      
      if (result.success) {
        setLoggedInUser(result.user.fullName);
        setShowSuccessModal(true);
        
        // Store authentication token for ProtectedRoute
        if (result.token) {
          localStorage.setItem('authToken', result.token);
        } else {
          // Fallback if no token is returned
          sessionStorage.setItem('teacherSession', 'true');
        }
        
        console.log('Login successful');
        setTimeout(() => {
          navigate('/teacher-dashboard');
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
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <>
      <SuccessModal 
        isOpen={showSuccessModal} 
        username={loggedInUser}
      />

      <div className="relative h-[85.4vh] w-full flex items-center justify-center pb-6">
        
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${Bg})` }}
        >
          <div className="absolute inset-0 bg-stone-900/60 dark:bg-black/70 z-0 transition-colors duration-300"></div>
        </div>

        <div className="relative z-10 w-full max-w-sm mx-4 p-8 rounded-2xl shadow-xl bg-stone-800/60 dark:bg-gray-900/70 border border-stone-700 dark:border-gray-600 backdrop-blur-sm transition-colors duration-300">
          
          <div className="flex flex-col items-center mb-6">
            <img 
              src={Logo} 
              alt="School Logo" 
              className="w-20 h-20 mb-4 object-contain"
            />
            <h2 className="text-xl font-bold uppercase text-white tracking-wider">Teacher Login</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Teacher ID / Email" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-amber-500 transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm text-sm disabled:opacity-50"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </span>
            </div>

            <div>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-amber-500 transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm text-sm disabled:opacity-50"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a3 3 0 106 0v-3a3 3 0 00-6 0v3z"></path></svg>
                </span>
              </div>
              <div className="text-right mt-2">
                <a href="#" className="text-xs text-gray-300 hover:text-amber-400 transition duration-300">Forgot Password?</a>
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 text-gray-900 font-semibold rounded-full bg-amber-400 hover:bg-amber-300 transition duration-300 shadow-lg text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Logging in...</span>
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-6 text-xs text-gray-300">
            Need help? Contact the <Link to="/#contact-us" className="font-semibold text-amber-400 hover:underline">School Office</Link>
          </div>

          {/* Registration Link for Admins */}
          <div className="text-center mt-4 text-xs text-gray-300">
            { /*
                Admin: <Link to="/register-teacher" className="font-semibold text-amber-400 hover:underline">Register New Teacher</Link>
             */}
          </div>
        </div>
      </div>
      
    </>
  );
}

export default Login;