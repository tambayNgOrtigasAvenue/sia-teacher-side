import { useEffect } from 'react';

const DarkModeProvider = ({ children }) => {
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return children;
};

export default DarkModeProvider;