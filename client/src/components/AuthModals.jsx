import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/signup';

const AuthModals = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const authType = searchParams.get('auth'); // 'login' or 'signup'

  if (!authType) return null;

  const handleClose = () => {
    // Remove 'auth' from search params
    const params = new URLSearchParams(location.search);
    params.delete('auth');
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleSwitch = (type) => {
    const params = new URLSearchParams(location.search);
    params.set('auth', type);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 500, padding: 20 }}>
        {/* Close Button */}
        <button 
          onClick={handleClose}
          style={{
            position: 'absolute', top: 30, right: 30,
            background: 'none', border: 'none', fontSize: 24,
            cursor: 'pointer', zIndex: 10, color: '#333'
          }}
        >
          &times;
        </button>
        
        {authType === 'login' ? (
           <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden' }}>
             <Login isModal={true} onSwitch={() => handleSwitch('signup')} onSuccess={handleClose} />
           </div>
        ) : (
           <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden' }}>
             <Signup isModal={true} onSwitch={() => handleSwitch('login')} onSuccess={() => handleSwitch('login')} />
           </div>
        )}
      </div>
    </div>
  );
};

export default AuthModals;
