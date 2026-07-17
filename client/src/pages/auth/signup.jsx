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

  // ─── Password Strength ───────────────────────────────────────────────
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: '#e0e0e0', tip: '' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: '#ef4444', bg: '#fee2e2', tip: 'Add uppercase, numbers & symbols' };
    if (score === 3) return { score, label: 'Fair', color: '#f97316', bg: '#ffedd5', tip: 'Getting better — add a symbol!' };
    if (score === 4) return { score, label: 'Good', color: '#eab308', bg: '#fef9c3', tip: 'Almost there!' };
    return { score, label: 'Strong', color: '#22c55e', bg: '#dcfce7', tip: 'Great password! 🎉' };
  };

  const strength = getPasswordStrength(formData.password);
  const isStrong = strength.label === 'Strong';

  // ─── Email Validation ────────────────────────────────────────────────
  // Allowed: Gmail, Outlook/Hotmail/Live, Yahoo (and common variants)
  const allowedDomains = [
    'gmail.com',
    'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
    'yahoo.com', 'yahoo.co.uk', 'yahoo.in', 'yahoo.com.au', 'yahoo.ca', 'yahoo.co.in',
  ];

  const isValidEmailDomain = (email) => {
    const domain = email.split('@')[1];
    return domain && allowedDomains.includes(domain.toLowerCase());
  };

  const emailEntered = formData.email.includes('@');
  const emailValid   = !emailEntered || isValidEmailDomain(formData.email);

  // ─── Submit ──────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmailDomain(formData.email)) {
      setError('Please use a Gmail, Outlook, or Yahoo email address.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!isStrong) {
      setError('Your password must be Strong to sign up. Add uppercase, numbers and a symbol.');
      return;
    }

    setLoading(true);
    try {
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
      if (!response.ok) throw new Error(data.message || 'Registration failed');

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

  // ─── Styles ──────────────────────────────────────────────────────────
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
      padding: '40px 32px 32px',
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
      fontSize: 30, 
      fontWeight: 800, 
      color: '#1E4D4B', 
      textDecoration: 'none', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: 10, 
      marginBottom: 6 
    },
    formGroup: { marginBottom: 18, textAlign: 'left' },
    label: { 
      display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#343A40' 
    },
    formControl: { 
      width: '100%', 
      padding: '11px 14px', 
      border: '2px solid #DEE2E6', 
      borderRadius: 10, 
      fontFamily: 'Inter, sans-serif', 
      fontSize: 14,
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    formControlError: {
      borderColor: '#ef4444'
    },
    btn: { 
      width: '100%', 
      padding: 13, 
      border: 'none', 
      borderRadius: 10, 
      fontSize: 15, 
      fontWeight: 700, 
      cursor: 'pointer', 
      backgroundColor: '#1E4D4B', 
      color: 'white',
      marginTop: 8,
      transition: 'all 0.3s ease'
    },
    btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
    error: {
      backgroundColor: '#fff3f3',
      color: '#dc3545',
      padding: '10px 14px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '13px',
      fontWeight: '500',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.signupContainer}>

        {/* Logo */}
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

        <p style={{ textAlign: 'center', color: '#6C757D', marginBottom: 24, fontSize: 14 }}>
          Join the reading revolution! 📚
        </p>

        {error && (
          <div style={styles.error}>
            <i className="fa-solid fa-circle-exclamation" style={{ marginTop: 1, flexShrink: 0 }}></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
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

          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              style={{
                ...styles.formControl,
                ...(emailEntered && !emailValid ? styles.formControlError : {})
              }}
              required 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@gmail.com"
            />
            {/* Inline email hint */}
            {emailEntered && !emailValid ? (
              <div style={{ marginTop: 6, fontSize: 12, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                <i className="fa-solid fa-triangle-exclamation"></i>
                Only Gmail, Outlook, or Yahoo emails are accepted.
              </div>
            ) : (
              <div style={{ marginTop: 6, fontSize: 11, color: '#9CA3AF', display: 'flex', gap: 8 }}>
                <span>✅ Gmail</span>
                <span>✅ Outlook</span>
                <span>✅ Yahoo</span>
              </div>
            )}
          </div>

          {/* Password */}
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
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#6C757D'
                }}
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>

            {/* Password Strength Meter */}
            {formData.password && (
              <div style={{ marginTop: 10 }}>
                {/* Bar track */}
                <div style={{ display: 'flex', gap: 4, height: 6, marginBottom: 6, borderRadius: 4, overflow: 'hidden' }}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      style={{
                        flex: 1,
                        backgroundColor: level <= strength.score ? strength.color : '#e9ecef',
                        borderRadius: 4,
                        transition: 'background-color 0.3s ease'
                      }}
                    />
                  ))}
                </div>
                {/* Label + tip */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 11,
                    color: strength.color,
                    background: strength.bg,
                    padding: '2px 8px',
                    borderRadius: 20,
                    fontWeight: 700
                  }}>
                    {strength.label}
                  </span>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>{strength.tip}</span>
                </div>
                {/* Checklist */}
                <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 12px' }}>
                  {[
                    { label: '8+ characters', ok: formData.password.length >= 8 },
                    { label: 'Uppercase (A-Z)', ok: /[A-Z]/.test(formData.password) },
                    { label: 'Lowercase (a-z)', ok: /[a-z]/.test(formData.password) },
                    { label: 'Number (0-9)', ok: /[0-9]/.test(formData.password) },
                    { label: 'Symbol (!@#…)', ok: /[^A-Za-z0-9]/.test(formData.password) },
                  ].map(({ label, ok }) => (
                    <div key={label} style={{ fontSize: 11, color: ok ? '#22c55e' : '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <i className={`fa-solid ${ok ? 'fa-circle-check' : 'fa-circle'}`} style={{ fontSize: 10 }}></i>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? "text" : "password"}
                style={{
                  ...styles.formControl,
                  ...(formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? styles.formControlError : {})
                }} 
                required 
                value={formData.confirmPassword} 
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#6C757D'
                }}
              >
                <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div style={{ marginTop: 5, fontSize: 12, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                <i className="fa-solid fa-triangle-exclamation"></i> Passwords don't match
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
          >
            {loading ? (
              <><i className="fa-solid fa-spinner fa-spin"></i> Creating Account...</>
            ) : (
              <><i className="fa-solid fa-user-plus"></i> Create Account</>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6C757D' }}>
          Already have an account?{' '}
          {isModal ? (
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