import React, { useState } from 'react';

// --- CSS Styles ---
// In this environment, we include the CSS directly in the component file.
const SidebarStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

    body {
      font-family: 'Montserrat', sans-serif;
      background-color: #DEDEE6; /* Updated background color */
      margin: 0;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: flex-start; /* Align to the top */
      min-height: 100vh;
      box-sizing: border-box;
    }

    .sidebar-container {
      display: flex;
      flex-direction: column;
      gap: 20px; /* Space between the main sidebar and the footer */
      width: 280px;
      transition: width 0.3s ease-in-out;
    }

    .sidebar, .sidebar-footer {
      background-color: #3A302F;
      color: #FFFFFF;
      border-radius: 25px;
      padding: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease-in-out;
      overflow: hidden;
    }
    
    .sidebar {
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      margin-bottom: 20px;
    }

    .menu-btn {
      background: none;
      border: none;
      color: #FFFFFF;
      cursor: pointer;
      padding: 5px;
    }

    .menu-btn svg {
        width: 28px;
        height: 28px;
    }

    .academy-profile {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 30px;
    }

    .academy-logo {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 15px;
      border: 3px solid #F3DFA2;
      transition: width 0.3s ease-in-out, height 0.3s ease-in-out;
    }

    .academy-name {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.5px;
      line-height: 1.4;
      margin: 0;
      white-space: nowrap;
    }

    .sidebar-nav {
      flex-grow: 1;
    }

    .sidebar-nav ul, .sidebar-footer ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .sidebar-nav li, .sidebar-footer li {
      margin-bottom: 10px;
    }
     .sidebar-footer li:last-child {
      margin-bottom: 0;
    }

    .nav-link {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      border-radius: 12px;
      text-decoration: none;
      color: #E0E0E0;
      font-weight: 500;
      transition: background-color 0.3s, color 0.3s;
      white-space: nowrap;
    }

    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-link svg {
      margin-right: 15px;
      width: 22px;
      height: 22px;
      flex-shrink: 0;
      transition: margin-right 0.3s ease-in-out;
    }

    .nav-link.active {
      background-color: #F3DFA2;
      color: #3A302F;
      font-weight: 600;
    }

    .nav-link.active svg {
      stroke: #3A302F;
    }

    .divider {
      border: none;
      height: 1px;
      background-color: #5a504f;
      margin: 20px 0;
      transition: opacity 0.3s ease-in-out;
    }

    /* --- Collapsed State --- */
    .sidebar-container.collapsed {
        width: 96px;
    }

    .sidebar-container.collapsed .academy-name,
    .sidebar-container.collapsed .nav-link span {
        display: none;
    }

    .sidebar-container.collapsed .divider {
        opacity: 0;
    }
    
    .sidebar-container.collapsed .nav-link {
        justify-content: center;
    }

    .sidebar-container.collapsed .nav-link svg {
        margin-right: 0;
    }
    
    .sidebar-container.collapsed .academy-logo {
        width: 50px;
        height: 50px;
    }

  `}</style>
);


// --- SVG Icon Components ---
const DashboardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>);
const MyClassesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>);
const ScheduleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>);
const NotificationsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>);
const AnnouncementsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>);
const SettingsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>);
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
const HelpSupportIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);
const LogoutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>);

// --- Main Sidebar Component ---
const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'My Classes', icon: <MyClassesIcon /> },
    { name: 'Teaching Schedule', icon: <ScheduleIcon /> },
  ];

  const secondaryNavItems = [
    { name: 'Notifications', icon: <NotificationsIcon /> },
    { name: 'Announcements', icon: <AnnouncementsIcon /> },
  ];
  
  const settingsItem = { name: 'Settings', icon: <SettingsIcon /> };

  const footerItems = [
    { name: 'Help Support', icon: <HelpSupportIcon /> },
    { name: 'Logout', icon: <LogoutIcon /> },
  ];

  return (
    <>
      <SidebarStyles />
      <div className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar">
          <div className="sidebar-header">
            <button className="menu-btn" onClick={toggleSidebar}>
              <MenuIcon />
            </button>
          </div>

          <div className="academy-profile">
            <img 
              src="https://placehold.co/100x100/f3dfa2/3a302f?text=Logo" 
              alt="Gymnazo Christian Academy Logo" 
              className="academy-logo"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/f3dfa2/3a302f?text=Logo+Error'; }}
            />
            <h1 className="academy-name">GYMNAZO CHRISTIAN ACADEMY</h1>
          </div>

          <nav className="sidebar-nav">
            <ul>{navItems.map((item) => (<li key={item.name}><a href="#" className={`nav-link ${activeItem === item.name ? 'active' : ''}`} onClick={() => setActiveItem(item.name)}>{item.icon}<span>{item.name}</span></a></li>))}</ul>
            <hr className="divider" />
            <ul>{secondaryNavItems.map((item) => (<li key={item.name}><a href="#" className={`nav-link ${activeItem === item.name ? 'active' : ''}`} onClick={() => setActiveItem(item.name)}>{item.icon}<span>{item.name}</span></a></li>))}</ul>
            <hr className="divider" />
            <ul><li><a href="#" className={`nav-link ${activeItem === settingsItem.name ? 'active' : ''}`} onClick={() => setActiveItem(settingsItem.name)}>{settingsItem.icon}<span>{settingsItem.name}</span></a></li></ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          <ul>
            {footerItems.map((item) => (
              <li key={item.name}>
                <a
                  href="#"
                  className={`nav-link ${activeItem === item.name ? 'active' : ''}`}
                  onClick={() => setActiveItem(item.name)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

