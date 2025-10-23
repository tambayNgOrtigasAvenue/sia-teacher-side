import React, { useState, useEffect } from 'react';

// --- LOGOUT MODAL COMPONENT ---
// Note: This component relies on the global styles provided in App.jsx.
const LogoutModal = ({ show, onClose }) => {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  
  // This effect resets the modal to its initial state whenever it's opened.
  useEffect(() => { 
    if (show) {
      setIsLoggedOut(false); 
    }
  }, [show]);

  if (!show) {
    return null;
  }

  const handleConfirmLogout = () => setIsLoggedOut(true);
  const handleDone = () => onClose();

  return (
    <div className="modal-overlay">
      {!isLoggedOut ? (
        // Confirmation screen
        <div className="modal-content">
          <p>Are you sure you want to logout?</p>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>NO</button>
            <button className="btn btn-primary" onClick={handleConfirmLogout}>YES</button>
          </div>
        </div>
      ) : (
        // Success screen
        <div className="modal-content">
          <p className="logged-out-title">Logged Out</p>
          <p className="logged-out-subtitle">Succesfully</p>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={handleDone}>DONE</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoutModal;

