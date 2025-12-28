import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Sun, Moon, Bell, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS, API_URL } from '../../config/api';

const Tooltip = ({ text }) => (
    <span className="
        absolute top-full left-1/2 -translate-x-1/2 mt-2
        bg-gray-900 text-white text-xs font-bold 
        rounded-md px-2 py-1 
        opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 
        transition-all duration-300 ease-in-out
        whitespace-nowrap z-50
    ">
        {text}
    </span>
);

const DashboardHeader = ({ setMobileOpen }) => {
        const { user } = useAuth();
        const [currentTime, setCurrentTime] = useState(new Date());
        const [openDropdown, setOpenDropdown] = useState(null);
        const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
        const [notifications, setNotifications] = useState([]);
        const [unreadCount, setUnreadCount] = useState(0);
        const [imageTimestamp, setImageTimestamp] = useState(Date.now());
        
        const [isDarkMode, setIsDarkMode] = useState(() => {
                if (typeof window !== 'undefined') {
                        return localStorage.theme === 'dark' || 
                                     (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
                }
                return false;
        });

        const notificationRef = useRef(null);
        const profileRef = useRef(null);
        
        useEffect(() => {
                const timer = setInterval(() => setCurrentTime(new Date()), 1000);
                return () => clearInterval(timer);
        }, []);

        // Fetch notifications
        useEffect(() => {
                const fetchNotifications = async () => {
                        try {
                                const response = await axios.get(
                                        `${API_ENDPOINTS.GET_NOTIFICATIONS}?limit=10`,
                                        { withCredentials: true }
                                );
                                
                                if (response.data.success) {
                                        const notifs = response.data.data;
                                        setNotifications(notifs);
                                        // Count unread notifications
                                        const unread = notifs.filter(n => n.isRead === '0' || n.isRead === 0).length;
                                        setUnreadCount(unread);
                                }
                        } catch (err) {
                                console.error('Error fetching notifications:', err);
                        }
                };

                // Fetch immediately and then every 30 seconds
                fetchNotifications();
                const interval = setInterval(fetchNotifications, 30000);
                
                return () => clearInterval(interval);
        }, []);

        useEffect(() => {
                if (isDarkMode) {
                        document.documentElement.classList.add('dark');
                        localStorage.theme = 'dark';
                } else {
                        document.documentElement.classList.remove('dark');
                        localStorage.theme = 'light';
                }
        }, [isDarkMode]);

        // Update image timestamp when user profile picture changes
        useEffect(() => {
                if (user?.profilePictureURL) {
                        setImageTimestamp(Date.now());
                }
        }, [user?.profilePictureURL]);

        useEffect(() => {
                const handleClickOutside = (event) => {
                        if (openDropdown === 'notifications' && notificationRef.current && !notificationRef.current.contains(event.target)) {
                                setOpenDropdown(null);
                        }
                        if (openDropdown === 'profile' && profileRef.current && !profileRef.current.contains(event.target)) {
                                setOpenDropdown(null);
                        }
                };
                document.addEventListener('mousedown', handleClickOutside);
                return () => document.removeEventListener('mousedown', handleClickOutside);
        }, [openDropdown]);

        const toggleDropdown = (dropdown) => {
                setOpenDropdown(openDropdown === dropdown ? null : dropdown);
        };

        const formattedDate = currentTime.toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
        });

        const formattedTime = currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
        });

        return (
                <header className='sticky top-0 z-30 w-full bg-[#F9F9F9] dark:bg-slate-900 dark:border-b dark:border-slate-700 py-4 flex items-center justify-between'>
                        
                        {/*Mobile Search View */}
                        {isMobileSearchOpen && (
                                <div className="absolute inset-0 bg-[#F9F9F9] dark:bg-slate-900 w-full flex items-center px-4 z-40 sm:hidden">
                                        <button onClick={() => setIsMobileSearchOpen(false)} className="mr-2 text-gray-500 dark:text-gray-400">
                                                <ArrowLeft size={24} />
                                        </button>
                                        <div className='relative flex-1'>
                                                <input
                                                        type='text'
                                                        placeholder='Search...'
                                                        className='w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F3D67D]'
                                                        autoFocus
                                                />
                                                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300' />
                                        </div>
                                </div>
                        )}

                        <div className="flex items-center flex-1">
                                <div className="relative group pl-6 md:hidden">
                                        <button
                                                onClick={() => setMobileOpen(true)}
                                                className="text-gray-500 dark:text-gray-400"
                                                aria-label="Open sidebar"
                                        >
                                                <Menu size={24} />
                                        </button>
                                        <Tooltip text="Open menu" />
                                </div>

                                <div className='hidden sm:block flex-1 max-w-sm md:pl-6'>
                                        <div className='relative'>
                                                <input
                                                        type='text'
                                                        placeholder='Search...'
                                                        className='w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F3D67D]'
                                                />
                                                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300' />
                                        </div>
                                </div>
                        </div>

                        <div className='flex items-center gap-4 ml-4 pr-6'>
                                <div className='hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                                        <span>{formattedDate}</span>
                                        <span>-</span>
                                        <span>{formattedTime}</span>
                                </div>

                                <div className="relative group sm:hidden">
                                        <button onClick={() => setIsMobileSearchOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                                                <Search className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                                        </button>
                                        <Tooltip text="Search" />
                                </div>

                                <div className="relative group">
                                        <button onClick={() => setIsDarkMode(!isDarkMode)} className='p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors'>
                                                {isDarkMode ? <Sun className='w-5 h-5 text-yellow-400' /> : <Moon className='w-5 h-5 text-gray-600' />}
                                        </button>
                                        <Tooltip text={isDarkMode ? 'Light Mode' : 'Dark Mode'} />
                                </div>

                                <div className="relative group" ref={notificationRef}>
                                        <button onClick={() => toggleDropdown('notifications')} className='relative p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors'>
                                                <Bell className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                                                {unreadCount > 0 && (
                                                        <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full'></span>
                                                )}
                                        </button>
                                        <Tooltip text="Notifications" />
                                        {openDropdown === 'notifications' && (
                                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-700 rounded-lg shadow-xl border dark:border-slate-600 animate-fade-in-down">
                                                        <div className="p-4 border-b dark:border-slate-600 flex justify-between items-center">
                                                                <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                                                                {unreadCount > 0 && (
                                                                        <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                                                                {unreadCount} new
                                                                        </span>
                                                                )}
                                                        </div>
                                                        {notifications.length === 0 ? (
                                                                <div className="p-8 text-center">
                                                                        <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                                                                </div>
                                                        ) : (
                                                                <ul className="py-2 max-h-64 overflow-y-auto">
                                                                        {notifications.map(notif => (
                                                                                <li 
                                                                                        key={notif.id} 
                                                                                        className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer border-l-2 ${
                                                                                                notif.isRead === '0' || notif.isRead === 0 
                                                                                                        ? 'border-red-500 bg-red-50 dark:bg-slate-800' 
                                                                                                        : 'border-transparent'
                                                                                        }`}
                                                                                >
                                                                                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{notif.sender}</p>
                                                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{notif.message}</p>
                                                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        )}
                                                </div>
                                        )}
                                </div>

                                <div className="relative group" ref={profileRef}>
                                        <button onClick={() => toggleDropdown('profile')} className='flex items-center gap-2 cursor-pointer'>
                                                {user?.profilePictureURL ? (
                                                        <div className='w-10 h-10 rounded-full bg-gray-300 overflow-hidden'>
                                                                <img 
                                                                        src={
                                                                                user.profilePictureURL.startsWith('data:') || user.profilePictureURL.startsWith('http')
                                                                                        ? user.profilePictureURL 
                                                                                        : `${API_URL}/${user.profilePictureURL}?t=${imageTimestamp}`
                                                                        }
                                                                        alt='Profile' 
                                                                        className='w-full h-full object-cover'
                                                                        onError={(e) => {
                                                                                e.target.style.display = 'none';
                                                                                e.target.parentElement.innerHTML = `<div class='w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 flex items-center justify-center'><span class='text-white font-semibold text-sm'>${user?.firstName?.[0]?.toUpperCase() || 'T'}${user?.lastName?.[0]?.toUpperCase() || ''}</span></div>`;
                                                                        }}
                                                                />
                                                        </div>
                                                ) : (
                                                        <div className='w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 flex items-center justify-center'>
                                                                <span className='text-white font-semibold text-sm'>
                                                                        {user?.firstName?.[0]?.toUpperCase() || 'T'}
                                                                        {user?.lastName?.[0]?.toUpperCase() || ''}
                                                                </span>
                                                        </div>
                                                )}
                                                <div className='hidden md:block'>
                                                        <p className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{user?.fullName || 'Teacher'}</p>
                                                        <p className='text-xs text-gray-500 dark:text-gray-400'>{user?.employeeNumber || user?.studentNumber || ''}</p>
                                                </div>
                                        </button>
                                        <Tooltip text="Profile Settings" />
                                        {openDropdown === 'profile' && (
                                                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-lg shadow-xl border dark:border-slate-600 animate-fade-in-down">
                                                     <ul className="py-2">
                                                             <li>
                                                                     <Link
                                                                         to="/teacher-dashboard/settings"
                                                                         state={{ openMyAccount: true }}
                                                                         onClick={() => setOpenDropdown(null)}
                                                                         className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer flex items-center gap-3"
                                                                     >
                                                                         <User size={16} className="text-gray-600 dark:text-gray-400" />
                                                                         <span className="text-sm text-gray-700 dark:text-gray-300">My Account</span>
                                                                     </Link>
                                                             </li>

                                                     </ul>
                                                 </div>
                                        )}
                                </div>
                        </div>
                </header>
        );
};

export default DashboardHeader;