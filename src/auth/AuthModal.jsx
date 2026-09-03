import React, { useState, useEffect } from 'react';
import './AuthModal.css';
import logoImg from '../assets/logo.png';
import { X, ShieldCheck, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { PrimaryButton } from '../components/universalbuttonhovers';
import authService from '../services/authService';

const GoogleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
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
  }, [isOpen]);

  const triggerClose = () => {
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
  };

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
  }, [shouldRender, isClosing]);

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
