import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/common/homepage/loginHeader';
import Bg from '../../../assets/img/bg.png';
import Logo from '../../../assets/img/gymnazu.png';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../config/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        API_ENDPOINTS.FORGOT_PASSWORD,
        { email }
      );

      if (response.data.success) {
        setSubmitted(true);
        setMessage(response.data.message);
      } else {
        setError(response.data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="relative h-[85.4vh] w-full flex items-center justify-center pb-6">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${Bg})` }}
          >
            <div className="absolute inset-0 bg-stone-900/60 dark:bg-black/70 z-0 transition-colors duration-300"></div>
          </div>

          <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl shadow-xl bg-stone-800/60 dark:bg-gray-900/70 border border-stone-700 dark:border-gray-600 backdrop-blur-sm transition-colors duration-300">
            
            <div className="flex flex-col items-center mb-6">
              <img 
                src={Logo} 
                alt="School Logo" 
                className="w-20 h-20 mb-4 object-contain"
              />
              <h2 className="text-xl font-bold uppercase text-white tracking-wider">
                {submitted ? 'Check Your Email' : 'Forgot Password'}
              </h2>
            </div>

            {!submitted ? (
              <>
                <p className="text-gray-300 text-sm text-center mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm text-center">
                    {error}
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-amber-500 transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm text-sm disabled:opacity-50"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                  </div>

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
                        <span>Sending...</span>
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <Link 
                    to="/login" 
                    className="text-sm text-amber-400 hover:text-amber-300 transition duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Login
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 text-center">
                  <svg className="w-16 h-16 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-200 text-sm">{message}</p>
                </div>

                <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                  <p className="text-blue-200 text-xs text-center">
                    <strong>📧 Didn't receive the email?</strong><br/>
                    Check your spam folder or try again in a few minutes.
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <button 
                    onClick={() => {
                      setSubmitted(false);
                      setEmail('');
                      setMessage('');
                    }}
                    className="text-sm text-amber-400 hover:text-amber-300 transition duration-300"
                  >
                    Try different email
                  </button>
                  
                  <div>
                    <Link 
                      to="/login" 
                      className="text-sm text-gray-300 hover:text-white transition duration-300"
                    >
                      Back to Login
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mt-6 text-xs text-gray-300">
              Need help? Contact the <Link to="/#contact-us" className="font-semibold text-amber-400 hover:underline">School Office</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ForgotPasswordPage;
