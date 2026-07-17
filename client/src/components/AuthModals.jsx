import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/signup';

const AuthModals = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const authType = searchParams.get('auth'); // 'login' or 'signup'

  // Lock body scroll when modal is open
  useEffect(() => {
    if (authType) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [authType]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') handleClose(); };
    if (authType) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [authType]);

  if (!authType) return null;

  const handleClose = () => {
    const params = new URLSearchParams(location.search);
    params.delete('auth');
    const qs = params.toString();
    navigate(`${location.pathname}${qs ? '?' + qs : ''}`, { replace: true });
  };

  const handleSwitch = (type) => {
    const params = new URLSearchParams(location.search);
    params.set('auth', type);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  return (
    <>
      {/* Inject keyframe animation */}
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .auth-modal-panel {
          animation: modalFadeIn 0.25s cubic-bezier(0.34,1.2,0.64,1) both;
        }
        .auth-modal-backdrop {
          animation: backdropIn 0.2s ease both;
        }
      `}</style>

      {/* Backdrop — click to close */}
      <div
        className="auth-modal-backdrop"
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 99998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          overflowY: 'auto',
        }}
      >
        {/* Panel — stop propagation so clicking inside doesn't close */}
        <div
          className="auth-modal-panel"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: authType === 'signup' ? 520 : 480,
            background: 'white',
            borderRadius: 20,
            boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
            overflow: 'hidden',
            maxHeight: '90vh',
            overflowY: 'auto',
            margin: 'auto',
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            title="Close"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.07)',
              border: 'none',
              fontSize: 20,
              lineHeight: '36px',
              textAlign: 'center',
              cursor: 'pointer',
              zIndex: 10,
              color: '#555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.07)'}
          >
            ✕
          </button>

          {authType === 'login' ? (
            <Login
              isModal={true}
              onSwitch={() => handleSwitch('signup')}
              onSuccess={handleClose}
            />
          ) : (
            <Signup
              isModal={true}
              onSwitch={() => handleSwitch('login')}
              onSuccess={() => handleSwitch('login')}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AuthModals;
