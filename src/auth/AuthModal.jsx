import React, { useState, useEffect, useCallback } from 'react';
import './AuthModal.css';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  ArrowRight
} from 'lucide-react';
import { PrimaryButton } from '../components/universalbuttonhovers';
import authService from '../services/authService';
import logoImg from '../assets/logo.png';

const GoogleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
      fill="#4285F4" 
    />
    <path 
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
      fill="#34A853" 
    />
    <path 
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" 
      fill="#FBBC05" 
    />
    <path 
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" 
      fill="#EA4335" 
    />
  </svg>
);

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  const triggerClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      setLoading(false);
      setAuthSuccess(false);
      setAuthError(null);
      document.body.style.overflow = '';
      if (onClose) onClose();
    }, 320);
  }, [isClosing, onClose]);

  useEffect(() => {
    let timer;
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      setAuthError(null);
      document.body.style.overflow = 'hidden';
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 30);
    } else if (shouldRender && !isClosing) {
      triggerClose();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, shouldRender, isClosing, triggerClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && shouldRender && !isClosing) {
        triggerClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldRender, isClosing, triggerClose]);

  if (!shouldRender) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authService.loginWithGoogle();
      if (result.success) {
        setActiveUser(result.user.name || 'Hackathon Reviewer');
        setAuthSuccess(true);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(result.user);
          triggerClose();
        }, 1200);
      }
    } catch (err) {
      setAuthError(err.message || 'Google Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantAccess = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authService.loginInstantAccess();
      if (result.success) {
        setActiveUser(result.user.name || 'Hackathon Reviewer');
        setAuthSuccess(true);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(result.user);
          triggerClose();
        }, 1200);
      }
    } catch (err) {
      setAuthError(err.message || 'Sandbox authorization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`proven-auth-overlay ${isVisible ? 'is-visible' : ''} ${isClosing ? 'is-closing' : ''}`} 
      onClick={triggerClose} 
      role="dialog" 
      aria-modal="true"
    >
      <div className="proven-auth-backdrop" />

      <div 
        className="proven-auth-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="proven-ios-drag-handle" />

        <div className="proven-auth-wallpaper-bg">
          <div className="proven-auth-cloud-mask" />
          <div className="proven-auth-lens-glow" />
        </div>

        <button 
          className="proven-auth-close-btn" 
          onClick={triggerClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {authSuccess ? (
          <div className="proven-auth-success-state">
            <div className="proven-auth-success-icon-box">
              <CheckCircle2 size={44} className="proven-success-check" />
              <div className="proven-success-ring" />
            </div>

            <h2 className="proven-auth-success-title">Access Granted</h2>
            <p className="proven-auth-success-desc">
              Welcome, <span className="proven-auth-highlight">{activeUser}</span>. Full unrestricted Smart India Hackathon (SIH 2026) access has been activated.
            </p>

            <div className="proven-auth-verified-badge">
              <ShieldCheck size={16} />
              <span>Identity Verified • Zero-Trust Mode Active</span>
            </div>
          </div>
        ) : (
          <div className="proven-auth-body">
            <div className="proven-auth-header">
              <img src={logoImg} alt="PROVEN Logo" className="proven-auth-direct-logo" />

              <h2 className="proven-auth-title">
                Enter the Platform
              </h2>
              <p className="proven-auth-subtitle">
                AI-powered multi-document Identity DNA verification with sub-second forensic precision.
              </p>
            </div>

            <div className="proven-auth-actions">
              {authError && (
                <div style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', marginBottom: '8px' }}>
                  {authError}
                </div>
              )}
              <button 
                type="button" 
                className="proven-google-auth-btn"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 size={18} className="proven-btn-spinner" />
                ) : (
                  <GoogleIcon size={18} />
                )}
                <span className="proven-google-btn-text">
                  {loading ? 'Connecting with Google...' : 'Continue with Google'}
                </span>
              </button>

              <div className="proven-auth-divider">
                <span className="proven-divider-line" />
                <span className="proven-divider-text">OR DIRECT ACCESS</span>
                <span className="proven-divider-line" />
              </div>

              <PrimaryButton 
                onClick={handleInstantAccess}
                className="proven-instant-access-btn"
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                disabled={loading}
              >
                Launch Live Demo Access
              </PrimaryButton>
            </div>

            <div className="proven-auth-hackathon-notice">
              <div className="proven-hackathon-notice-header">
                <ShieldCheck size={14} className="proven-shield-icon" />
                <span className="proven-hackathon-badge-title">SMART INDIA HACKATHON (SIH)</span>
              </div>
              <p className="proven-hackathon-notice-desc">
                This project is deployed for the <strong>Smart India Hackathon (SIH 2026)</strong>. 
                Full unrestricted enterprise access has been unlocked for all evaluators and participants.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
