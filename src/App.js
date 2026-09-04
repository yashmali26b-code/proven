import React, { useState, useEffect } from 'react';
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

  const scrollToTopGlobal = () => {
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
  };

  const navigateTo = (view) => {
    if (view === 'dashboard' && !currentUser && !authService.isAuthenticated()) {
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
  };

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    scrollToTopGlobal();
    const timer = setTimeout(scrollToTopGlobal, 50);

    const path = window.location.pathname.toLowerCase();
    if (path === '/dashboard' && !currentUser && !authService.isAuthenticated()) {
      setIsAuthOpen(true);
    }

    authService.verifySession().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });

    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/team') {
        setCurrentView('team');
      } else if (path === '/faq') {
        setCurrentView('faq');
      } else if (path === '/how-it-works') {
        setCurrentView('how');
      } else if (path === '/dashboard') {
        if (!currentUser && !authService.isAuthenticated()) {
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

    let lenis = null;
    let rafId = null;
    const isMobile = window.innerWidth < 869;

    if (!isMobile && currentView !== 'dashboard') {
      lenis = new Lenis({
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

      function raf(time) {
        if (lenis) {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        }
      }

      rafId = requestAnimationFrame(raf);
    } else {
      window.lenis = null;
    }

    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"], a[href^="/"]');
      if (target) {
        const href = target.getAttribute('href');
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
          } else if (lenis) {
            lenis.scrollTo(0, { duration: 1.0 });
          } else {
            scrollToTopGlobal();
          }
          return;
        }
        if (href && href.startsWith('#') && href.length > 1) {
          const element = document.querySelector(href);
          if (element) {
            e.preventDefault();
            if (lenis) {
              lenis.scrollTo(element, { offset: -30, duration: 1.0 });
            } else {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleAnchorClick);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (lenis) {
        lenis.destroy();
        delete window.lenis;
      }
    };
  }, [currentView]);

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
