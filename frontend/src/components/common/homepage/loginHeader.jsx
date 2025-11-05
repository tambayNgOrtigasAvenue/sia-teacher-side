import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../../assets/img/gymnazu.png';
import GooeyNav from '../../ui/gooeyNav.jsx';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [isScrolledFromHome, setIsScrolledFromHome] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about-us', 'announcement', 'contact-us'];
      const scrollPosition = window.scrollY + 150;

      const homeSection = document.getElementById('home');
      if (homeSection) {
        const homeBottom = homeSection.offsetTop + homeSection.offsetHeight;
        setIsScrolledFromHome(window.scrollY > homeBottom - 100);
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveNavIndex(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navItems = [
    { label: "HOME", href: "#home" },
    { label: "ABOUT US", href: "#about-us" },
    { label: "ANNOUNCEMENT", href: "#announcement" },
    { label: "CONTACT US", href: "#contact-us" }
  ];

  const headerClasses = isScrolledFromHome
    ? 'bg-white dark:bg-gray-900 shadow-md'
    : 'bg-white dark:bg-gray-900 lg:bg-black/5 lg:dark:bg-gray-900/5 lg:backdrop-blur-sm';

  const navClasses = isScrolledFromHome
    ? 'bg-[#F4D77D] dark:bg-gray-800'
    : 'bg-[#F4D77D] dark:bg-gray-800 lg:bg-black/5 lg:dark:bg-gray-700/10 lg:backdrop-blur-s';

  const textColorClasses = isScrolledFromHome
    ? 'text-[#5B3E31] dark:text-amber-400'
    : 'text-[#5B3E31] dark:text-amber-400 lg:text-[#F4D77D]';

  const logoBorderClasses = isScrolledFromHome
    ? 'border-[#5B3E31] dark:border-amber-400'
    : 'border-[#5B3E31] dark:border-amber-400 lg:border-[#F4D77D]';

  const loginButtonClasses = isScrolledFromHome
    ? 'bg-[#F4D77D] hover:bg-[#F7C236] dark:bg-gray-800 dark:hover:bg-amber-400/30 border-[#5B3E31] dark:border-amber-400'
    : 'bg-[#F4D77D] hover:bg-[#F7C236] border-[#5B3E31] dark:bg-gray-700/20 dark:hover:bg-amber-400/30 dark:border-amber-400 lg:bg-white/20 lg:border-[#F4D77D] lg:hover:bg-[#F4D77D] lg:hover:text-[#5B3E31] lg:hover:border-[#5B3E31]';

  return (
    <header className={`w-full shadow-lg sticky top-0 z-50  border-white/10 dark:border-gray-700/10 transition-all duration-500 ${headerClasses}`}>
      <div className='flex justify-between items-center h-16 sm:h-20 px-4 sm:px-0 transition-colors duration-300'>
        <div className='flex items-center'>
          <a href="#home">
            <img
              src={Logo}
              alt='Gymnazo'
              className={`h-10 w-10 sm:h-14 sm:w-14 sm:ml-7 border-2 rounded-full transition-all duration-300 ${logoBorderClasses}`}
            />
          </a>
          <div className={`ml-2 sm:ml-4 transition-colors duration-300 ${textColorClasses}`}>
            <div className='font-bold text-xs sm:text-base'>GYMNAZO CHRISTIAN ACADEMY</div>
            <div className='text-[10px] sm:text-sm'>NOVALICHES</div>
          </div>
        </div>
        <div className='flex items-center gap-2 sm:gap-4'>
          <button
            onClick={toggleDarkMode}
            className="relative w-8 h-8 rounded-full bg-white/20 dark:bg-gray-700/20 lg:backdrop-blur-sm border border-white/30 dark:border-amber-400 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
            aria-label="Toggle dark mode"
          >
            <svg className={`absolute w-4 h-4 text-orange-500 transition-all duration-300 ${isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z" /></svg>
            <svg className={`absolute w-4 h-4 text-amber-400 transition-all duration-300 ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Zm.074-22a10.776,10.776,0,0,0-1.675.127,10.1,10.1,0,0,0-8.344,8.8A9.928,9.928,0,0,0,4.581,18.7a10.473,10.473,0,0,0,11.093,2.734.5.5,0,0,0,.138-.856h0C9.883,16.1,9.417,8.087,14.865,3.124a.459.459,0,0,0,.127-.465.491.491,0,0,0-.356-.362A10.68,10.68,0,0,0,12.083,2Z" /></svg>
          </button>
          <Link to="/login">
          <button className={`lg:backdrop-blur-sm ${textColorClasses} lg:mr-10 font-bold py-1.5 px-3 sm:py-2 sm:px-4 border-2 rounded-full shadow-lg text-xs sm:text-base transition-all duration-300 ${loginButtonClasses}`}>
            LOGIN
          </button>
          </Link>
          {/* pag smaller screen to */}
          <button onClick={toggleMenu} className='lg:hidden flex flex-col justify-center items-center w-8 h-8 sm:mr-4' aria-label="Toggle menu">
            <span className={`bg-[#5B3E31] dark:bg-amber-400 h-0.5 w-6 rounded transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`bg-[#5B3E31] dark:bg-amber-400 h-0.5 w-6 rounded mt-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`bg-[#5B3E31] dark:bg-amber-400 h-0.5 w-6 rounded mt-1 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </div>

      <nav className={`hidden lg:flex justify-center ${textColorClasses} py-3 text-sm font-bold transition-all duration-500  border-white/10 dark:border-gray-700/10 ${navClasses}`}>
        <div style={{ position: 'relative', height: '12px', display: 'flex', alignItems: 'center' }}>
          <GooeyNav
            items={navItems}
            particleCount={8}
            particleDistances={[60, 3]}
            particleR={70}
            activeIndex={activeNavIndex}
            animationTime={400}
            timeVariance={200}
            colors={[1, 2, 3]}
          />
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className={`lg:hidden ${textColorClasses} overflow-hidden transition-all duration-500 border-t border-white/10 dark:border-gray-700/10 ${navClasses} ${isMenuOpen ? 'max-h-64' : 'max-h-0'}`}>
        <div className='flex flex-col items-center py-4 gap-4 font-bold text-sm'>
          {navItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className={`
                        transition duration-150 w-full text-center py-2
                        ${activeNavIndex === index
                  ? 'text-[#5B3E31] dark:text-amber-400 bg-white/20 dark:bg-amber-400/20 lg:backdrop-blur-sm'
                  : 'hover:bg-white/10 dark:hover:bg-gray-700/10'
                }
                    `}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Header;