import React, { useState, useEffect } from 'react';
import './navbar.css';
import logoImg from '../../assets/logo.png';
import { Menu, X } from 'lucide-react';
import { NavButton, PrimaryButton } from '../../components/universalbuttonhovers';

export const Navbar = ({ user, onStartSecuring, onExploreDemo, onNavigateTeam, onNavigateHome, onNavigateFaq, isTeamPage, isFaqPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ctaText = user ? 'Dashboard' : 'Get Started';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  const handleNavClick = (id) => {
    setMobileOpen(false);
    if ((isTeamPage || isFaqPage) && onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        const element = document.querySelector(id);
        if (element) {
          if (window.lenis) {
            window.lenis.scrollTo(element, { offset: -20, duration: 1.0 });
          } else {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 150);
      return;
    }

    const element = document.querySelector(id);
    if (element) {
      if (window.lenis) {
        window.lenis.scrollTo(element, { offset: -20, duration: 1.0 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="proven-navbar-root" aria-label="Main Navigation">
      <div 
        className={`proven-nav-backdrop-blur ${mobileOpen ? 'mobile-blur' : ''}`} 
        onClick={() => setMobileOpen(false)} 
      />

      <header className={`proven-navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <a 
          href="/" 
          className="proven-nav-brand"
          onClick={(e) => {
            e.preventDefault();
            if ((isTeamPage || isFaqPage) && onNavigateHome) {
              onNavigateHome();
            } else {
              handleNavClick('#home');
            }
          }}
        >
          <img src={logoImg} alt="PROVEN Logo" className="proven-nav-logo" />
          <span className="proven-nav-title">PROVEN</span>
        </a>

        <div className="proven-nav-center">
          <ul className={`proven-nav-links ${mobileOpen ? 'open' : ''}`}>
            <li>
              <a 
                href="#how-it-works" 
                className="proven-nav-link" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#how-it-works');
                }}
              >
                Security
              </a>
            </li>
            <li>
              <a 
                href="#how-it-works" 
                className="proven-nav-link" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#how-it-works');
                }}
              >
                How It Works
              </a>
            </li>
            <li>
              <a 
                href="#how-it-works" 
                className="proven-nav-link" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#how-it-works');
                }}
              >
                Pricing
              </a>
            </li>
            <li>
              <a 
                href="/team" 
                className={`proven-nav-link ${isTeamPage ? 'active' : ''}`} 
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateTeam) {
                    onNavigateTeam();
                    setMobileOpen(false);
                  } else {
                    handleNavClick('#team');
                  }
                }}
              >
                Team
              </a>
            </li>
            <li>
              <a 
                href="/faq" 
                className={`proven-nav-link ${isFaqPage ? 'active' : ''}`} 
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateFaq) {
                    onNavigateFaq();
                    setMobileOpen(false);
                  } else {
                    handleNavClick('#faq');
                  }
                }}
              >
                FAQ
              </a>
            </li>
            <li className="proven-mobile-cta-item">
              <PrimaryButton 
                className="proven-mobile-menu-cta"
                onClick={() => {
                  if (onStartSecuring) {
                    onStartSecuring();
                  } else {
                    handleNavClick('#how-it-works');
                  }
                }}
              >
                {ctaText}
              </PrimaryButton>
            </li>
          </ul>
        </div>

        <div className="proven-nav-actions">
          <NavButton 
            onClick={onStartSecuring || (() => handleNavClick('#how-it-works'))}
          >
            {ctaText}
          </NavButton>

          <button 
            className="proven-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
    </nav>
  );
};

export default Navbar;
