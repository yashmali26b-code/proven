import React, { useState, useEffect, useCallback, useRef } from 'react';
import Home from './pages/home/home';
import TeamPage from './teampage/TeamPage';
import FaqPage from './pages/faq/FaqPage';
import HowItWorksPage from './pages/howitworks/HowItWorksPage';
import Dashboard from './dashboard/Dashboard';
import AuthModal from './auth/AuthModal';
import authService from './services/authService';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './App.css';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (hash) {
      window.history.replaceState(null, '', path === '/team' || hash === '#team' ? '/team' : (path === '/faq' || hash === '#faq' ? '/faq' : (path === '/how-it-works' ? '/how-it-works' : (path === '/dashboard' || hash === '#dashboard' ? '/dashboard' : '/'))));
    }

    if (path === '/team' || hash === '#team') return 'team';
    if (path === '/faq' || hash === '#faq') return 'faq';
    if (path === '/how-it-works') return 'how';
    if (path === '/dashboard' || hash === '#dashboard') {
      if (!authService.isAuthenticated()) {
        window.history.replaceState(null, '', '/');
        return 'home';
      }
      return 'dashboard';
    }
    return 'home';
  });

  const scrollToTopGlobal = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
    if (window.lenis) {
      try {
        window.lenis.scrollTo(0, { immediate: true });
      } catch (e) {}
    }
  }, []);

  const navigateTo = useCallback((view) => {
    if (view === 'dashboard' && !currentUserRef.current && !authService.isAuthenticated()) {
      setIsAuthOpen(true);
      return;
    }
    setCurrentView(view);
    const pathMap = { team: '/team', faq: '/faq', how: '/how-it-works', dashboard: '/dashboard' };
    const newPath = pathMap[view] || '/';
    if (window.location.pathname !== newPath || window.location.hash) {
      window.history.pushState({ view }, '', newPath);
    }
    scrollToTopGlobal();
  }, [scrollToTopGlobal]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const path = window.location.pathname.toLowerCase();
    if (path === '/dashboard' && !authService.isAuthenticated()) {
      setIsAuthOpen(true);
    }

    authService.verifySession().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/team') {
        setCurrentView('team');
      } else if (path === '/faq') {
        setCurrentView('faq');
      } else if (path === '/how-it-works') {
        setCurrentView('how');
      } else if (path === '/dashboard') {
        if (!currentUserRef.current && !authService.isAuthenticated()) {
          setCurrentView('home');
          setIsAuthOpen(true);
          window.history.replaceState(null, '', '/');
        } else {
          setCurrentView('dashboard');
        }
      } else {
        setCurrentView('home');
      }
      scrollToTopGlobal();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [scrollToTopGlobal]);

  useEffect(() => {
    const isMobile = window.innerWidth < 869;
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.5,
      infinite: false
    });

    window.lenis = lenis;

    let rafId;
    function raf(time) {
      if (window.lenis) {
        window.lenis.raf(time);
      }
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (window.lenis && typeof window.lenis.destroy === 'function') {
        window.lenis.destroy();
      }
      delete window.lenis;
    };
  }, []);

  useEffect(() => {
    if (window.lenis) {
      if (currentView === 'dashboard') {
        if (typeof window.lenis.stop === 'function') window.lenis.stop();
      } else {
        if (typeof window.lenis.start === 'function') window.lenis.start();
      }
    }
  }, [currentView]);

  useEffect(() => {
    const handleAnchorClick = (e) => {
      if (e.defaultPrevented) return;

      const target = e.target.closest('a[href^="#"], a[href^="/"]');
      if (!target) return;

      if (target.target === '_blank' || target.getAttribute('rel')?.includes('external')) return;

      const href = target.getAttribute('href');
      if (!href) return;

      if (href === '#team' || href === '/team') {
        e.preventDefault();
        navigateTo('team');
        return;
      }
      if (href === '#faq' || href === '/faq') {
        e.preventDefault();
        navigateTo('faq');
        return;
      }
      if (href === '/how-it-works') {
        e.preventDefault();
        navigateTo('how');
        return;
      }
      if (href === '#home' || href === '/') {
        e.preventDefault();
        if (currentView === 'team' || currentView === 'faq' || currentView === 'how') {
          navigateTo('home');
        } else if (window.lenis) {
          window.lenis.scrollTo(0, { duration: 1.0 });
        } else {
          scrollToTopGlobal();
        }
        return;
      }
      if (href.startsWith('#') && href.length > 1) {
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          if (window.lenis) {
            window.lenis.scrollTo(element, { offset: -30, duration: 1.0 });
          } else {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [currentView, navigateTo, scrollToTopGlobal]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Logout error:', e);
    }
    setCurrentUser(null);
    setIsAuthOpen(false);
    navigateTo('home');
  };

  const handleOpenAuth = () => {
    if (currentUser && authService.getToken()) {
      navigateTo('dashboard');
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="App">
      {currentView === 'dashboard' ? (
        <Dashboard 
          user={currentUser}
          onLogout={handleLogout}
          onNavigateHome={() => navigateTo('home')} 
          onNavigateTeam={() => navigateTo('team')} 
        />
      ) : currentView === 'team' ? (
        <TeamPage 
          user={currentUser}
          onNavigateHome={() => navigateTo('home')} 
          onNavigateTeam={() => navigateTo('team')}
          onNavigateFaq={() => navigateTo('faq')}
          onNavigateHow={() => navigateTo('how')}
          onOpenAuth={handleOpenAuth}
        />
      ) : currentView === 'faq' ? (
        <FaqPage 
          user={currentUser}
          onNavigateHome={() => navigateTo('home')} 
          onNavigateTeam={() => navigateTo('team')}
          onNavigateHow={() => navigateTo('how')}
          onOpenAuth={handleOpenAuth}
        />
      ) : currentView === 'how' ? (
        <HowItWorksPage 
          user={currentUser}
          onNavigateHome={() => navigateTo('home')} 
          onNavigateTeam={() => navigateTo('team')}
          onNavigateFaq={() => navigateTo('faq')}
          onOpenAuth={handleOpenAuth}
        />
      ) : (
        <Home 
          user={currentUser}
          onNavigateTeam={() => navigateTo('team')} 
          onNavigateFaq={() => navigateTo('faq')}
          onNavigateHow={() => navigateTo('how')}
          onOpenAuth={handleOpenAuth}
        />
      )}

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={(authenticatedUser) => {
          if (authenticatedUser) {
            setCurrentUser(authenticatedUser);
          }
          setIsAuthOpen(false);
          navigateTo('dashboard');
        }}
      />
    </div>
  );
}

export default App;
