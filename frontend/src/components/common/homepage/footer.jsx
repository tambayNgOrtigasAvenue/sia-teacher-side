import React from 'react';
import Logo from '../../../assets/img/gymnazu.png'; 

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about-us' },
    { name: 'Announcement', href: '#announcement' },
    { name: 'Contact Us', href: '#contact-us' },
  ];
  
  return (
    <footer className="bg-[#F4D77D] dark:bg-gray-800 w-full transition-colors duration-300">
      <div className="container mx-auto px-6 py-12 text-[#333333] dark:text-gray-300 transition-colors duration-300">
        
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          
          <div className="w-full md:w-5/12 space-y-4 pr-8"> 
            <div className="flex items-center space-x-3">
              <img src={Logo} alt="Gymnazo Logo" className="h-12 w-12" />
              <div className="font-bold text-lg leading-tight text-[#333333] dark:text-gray-100 transition-colors duration-300">
                GYMNAZO CHRISTIAN ACADEMY
                <div className="text-sm font-normal text-gray-700 dark:text-gray-400 transition-colors duration-300">NOVALICHES</div>
              </div>
            </div>
            
            <p className="text-sm">
              The Gymnazo Christian Academy is committed in the formation of values and 
              education among their learners by following these philosophical foundations
            </p>
            
            <div className="pt-4 text-sm">
              268 Zabala St. Cor. Luahati St. Tondo,
              <br />
              Manila, Manila, Philippines
            </div>
          </div>
          
          <div className="w-full md:w-3/12 space-y-3">
            <h4 className="font-bold text-lg mb-4 text-[#444444] dark:text-gray-100 transition-colors duration-300">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-[#F7C236] dark:hover:text-amber-400 transition duration-150">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="w-full md:w-3/12 space-y-3">
            <h4 className="font-bold text-lg mb-4 text-[#444444] dark:text-gray-100 transition-colors duration-300">Connect With Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <span className="text-xl"><i className="fab fa-facebook-f"></i></span>
                <span>Gymnazo Christian Academy</span>
              </li>
              
              <li className="flex items-center space-x-2">
                <span className="text-xl"><i className="far fa-envelope"></i></span> 
                <span>gymnazochristianacademy@gmail.com</span>
              </li>
              
              <li className="flex items-center space-x-2">
                <span className="text-xl"><i className="fas fa-phone"></i></span> 
                <span>282472450</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-400/50 dark:border-gray-600/50 py-4 text-xs text-[#333333] dark:text-gray-300 transition-colors duration-300">
        <div className="container mx-auto flex justify-between items-center px-6">
          <div className="text-sm">
            © 2025 Gymnazo Christian Academy Novaliches. All rights reserved.
          </div>
          <div className="space-x-4">
            <a href="#" className="hover:text-[#F7C236] dark:hover:text-amber-400 transition duration-150">Privacy Policy</a>
            <a href="#" className="hover:text-[#F7C236] dark:hover:text-amber-400 transition duration-150">Terms of Service</a>
            <a href="#" className="hover:text-[#F7C236] dark:hover:text-amber-400 transition duration-150">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;