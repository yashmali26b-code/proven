import React, { useState, useEffect } from 'react';
import Home from './pages/home/home';
import TeamPage from './teampage/TeamPage';
import FaqPage from './pages/faq/FaqPage';
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
      window.history.replaceState(null, '', path === '/team' || hash === '#team' ? '/team' : (path === '/faq' || hash === '#faq' ? '/faq' : (path === '/dashboard' || hash === '#dashboard' ? '/dashboard' : '/')));
    }

    if (path === '/team' || hash === '#team') {
      return 'team';
    }
    if (path === '/faq' || hash === '#faq') {
      return 'faq';
    }
    if (path === '/dashboard' || hash === '#dashboard') {
      if (!authService.isAuthenticated()) {
        window.history.replaceState(null, '', '/');
        return 'home';
      }
      return 'dashboard';
    }
    return 'home';
  });

  const navigateTo = (view) => {
    if (view === 'dashboard' && !currentUser && !authService.isAuthenticated()) {
      setIsAuthOpen(true);
      return;
    }
    setCurrentView(view);
    const newPath = view === 'team' ? '/team' : (view === 'faq' ? '/faq' : (view === 'dashboard' ? '/dashboard' : '/'));
    if (window.location.pathname !== newPath || window.location.hash) {
      window.history.pushState({ view }, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
  };

  useEffect(() => {
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
    };

    window.addEventListener('popstate', handlePopState);

    let lenis = null;
    const isMobile = window.innerWidth < 869;

    if (!isMobile) {
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
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
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
        if (href === '#home' || href === '/') {
          e.preventDefault();
          if (currentView === 'team' || currentView === 'faq') {
            navigateTo('home');
          } else if (lenis) {
            lenis.scrollTo(0, { duration: 1.0 });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleAnchorClick);
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
          onOpenAuth={handleOpenAuth}
        />
      ) : currentView === 'faq' ? (
        <FaqPage 
          user={currentUser}
          onNavigateHome={() => navigateTo('home')} 
          onNavigateTeam={() => navigateTo('team')}
          onOpenAuth={handleOpenAuth}
        />
      ) : (
        <Home 
          user={currentUser}
          onNavigateTeam={() => navigateTo('team')} 
          onNavigateFaq={() => navigateTo('faq')}
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
