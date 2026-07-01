import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = ({ isModal, onSwitch, onSuccess }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: '#e0e0e0' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: '#ff4d4f' };
    if (score === 3 || score === 4) return { score, label: 'Fair', color: '#faad14' };
    return { score, label: 'Strong', color: '#52c41a' };
  };

  const strength = getPasswordStrength(formData.password);
  const isStrong = strength.label === 'Strong';

  const isValidEmailDomain = (email) => {
    const allowedDomains = [
      'gmail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.in', 
      'outlook.com', 'hotmail.com', 'live.com', 
      'icloud.com', 'me.com', 'mac.com',
      'aol.com', 'protonmail.com', 'zoho.com'
    ];
    const domain = email.split('@')[1];
    return domain && allowedDomains.includes(domain.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email domain
    if (!isValidEmailDomain(formData.email)) {
      setError('Please use a valid email provider (e.g. Gmail, Outlook, Yahoo).');
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isStrong) {
      setError('Password must be strong to sign up.');
      return;
    }

    setLoading(true);

    try {
      // Register with END_USER role
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name, 
          email: formData.email, 
          password: formData.password, 
          role: 'END_USER' 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      alert('Registration successful! Please log in.');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    body: isModal ? {
      margin: 0, padding: 0, width: '100%', fontFamily: 'Inter, sans-serif'
    } : { 
      fontFamily: 'Inter, sans-serif', 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '40px 20px', 
      margin: 0 
    },
    signupContainer: isModal ? {
      width: '100%',
      padding: '30px 20px',
      textAlign: 'center',
      boxSizing: 'border-box'
    } : { 
      width: '100%', 
      maxWidth: 500, 
      background: 'white', 
      padding: 40, 
      borderRadius: 16, 
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)' 
    },
    logo: { 
      fontFamily: 'Playfair Display, serif', 
      fontSize: 32, 
      fontWeight: 800, 
      color: '#1E4D4B', 
      textDecoration: 'none', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: 10, 
      marginBottom: 10 
    },
    formGroup: { 
      marginBottom: 20 
    },
    label: { 
      display: 'block', 
      fontSize: 14, 
      fontWeight: 600, 
      marginBottom: 8, 
      color: '#343A40' 
    },
    formControl: { 
      width: '100%', 
      padding: '12px 16px', 
      border: '2px solid #DEE2E6', 
      borderRadius: 12, 
      fontFamily: 'Inter, sans-serif', 
      fontSize: 15,
      boxSizing: 'border-box'
    },
    btn: { 
      width: '100%', 
      padding: 14, 
      border: 'none', 
      borderRadius: 12, 
      fontSize: 16, 
      fontWeight: 700, 
      cursor: 'pointer', 
      backgroundColor: '#1E4D4B', 
      color: 'white',
      marginTop: 10,
      transition: 'all 0.3s ease'
    },
    btnDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    error: {
      backgroundColor: '#fff3f3',
      color: '#dc3545',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.signupContainer}>
        {!isModal && (
          <Link to="/" style={styles.logo}>
            <i className="fa-solid fa-book-open"></i> ShareShelf
          </Link>
        )}
        {isModal && (
          <div style={styles.logo}>
            <i className="fa-solid fa-book-open"></i> ShareShelf
          </div>
        )}
        <p style={{ textAlign: 'center', color: '#6C757D', marginBottom: 30 }}>
          Join the reading revolution!
        </p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              style={styles.formControl} 
              required 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              style={styles.formControl} 
              required 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"}
                style={styles.formControl} 
                required 
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a secure password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6C757D'
                }}
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {formData.password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, height: 4, marginBottom: 4 }}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div key={level} style={{
                      flex: 1,
                      backgroundColor: level <= strength.score ? strength.color : '#e9ecef',
                      borderRadius: 2
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 12, color: strength.color, fontWeight: 600, textAlign: 'right' }}>
                  {strength.label}
                </div>
              </div>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? "text" : "password"}
                style={styles.formControl} 
                required 
                value={formData.confirmPassword} 
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6C757D'
                }}
              >
                <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.btn,
              ...(loading ? styles.btnDisabled : {})
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: 25, fontSize: 14 }}>
          Already have an account? {isModal ? (
            <span onClick={onSwitch} style={{ color: '#E76F51', cursor: 'pointer', fontWeight: 700 }}>Log in</span>
          ) : (
            <Link to="/login" style={{ color: '#E76F51', textDecoration: 'none', fontWeight: 700 }}>Log in</Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default Signup;