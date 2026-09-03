import React, { useEffect, useRef } from 'react';
import './home.css';
import Navbar from '../navbar/navbar';
import HeroSection from './HeroSection';
import StackingWorkflowSection from './StackingWorkflowSection';
import ThreeLayersSection from './ThreeLayersSection';
import CtaBannerSection from './CtaBannerSection';
import GiantFooterSection from './GiantFooterSection';

export const Home = ({ user, onNavigateTeam, onNavigateFaq, onOpenAuth }) => {
  const heroRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 869) {
      if (heroRef.current) {
        heroRef.current.style.transform = 'none';
        heroRef.current.style.opacity = '1';
      }
      return;
    }

    let ticking = false;

    const updateHeroParallax = () => {
      if (!heroRef.current || window.innerWidth < 869) return;
      const scrollY = window.scrollY;
      const vh = window.innerHeight || 800;
      const progress = Math.min(Math.max(scrollY / (vh * 0.9), 0), 1);
      
      const scale = 1 - progress * 0.06;
      const opacity = 1 - progress * 0.6;
      const translateY = -progress * 45;

      heroRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      heroRef.current.style.opacity = `${opacity}`;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeroParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const target = document.querySelector(id);
    if (!target) return;
    if (window.lenis) {
      window.lenis.scrollTo(target, { offset: -20, duration: 1.1 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="proven-home-container" id="home">
      <Navbar 
        user={user}
        onStartSecuring={onOpenAuth || (() => scrollToSection('#how-it-works'))}
        onExploreDemo={() => scrollToSection('#features')}
        onNavigateTeam={onNavigateTeam}
        onNavigateFaq={onNavigateFaq}
      />

      <HeroSection 
        ref={heroRef}
        onExplore={() => scrollToSection('#how-it-works')}
        onNavigateFaq={onNavigateFaq}
        onStartSecuring={onOpenAuth || (() => scrollToSection('#pricing'))}
        onAboutTeam={onNavigateTeam}
      />

      <div className="proven-body-content-overlay">
        <StackingWorkflowSection />
        <ThreeLayersSection />
        <CtaBannerSection onGetStarted={onOpenAuth || (() => scrollToSection('#how-it-works'))} />
        <GiantFooterSection onNavigateTeam={onNavigateTeam} onNavigateFaq={onNavigateFaq} />
      </div>
    </div>
  );
};

export default Home;
