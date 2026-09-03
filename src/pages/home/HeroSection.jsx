import React, { forwardRef } from 'react';
import './HeroSection.css';
import { PrimaryButton, GlassButton } from '../../components/universalbuttonhovers';

export const HeroSection = forwardRef(({ onExplore, onStartSecuring, onAboutTeam }, ref) => {
  return (
    <div className="proven-hero-sticky-container" ref={ref}>
      <div className="proven-hero-bg-wrapper">
        <div className="proven-hero-base-bg" />
        
        <div className="proven-hero-cloud-masked-viewport">
          <div className="proven-hero-lens-layer" />
          <div className="proven-hero-mask-moving-shadow" />
          <div className="proven-hero-lens-glow" />
        </div>

        <div className="proven-hero-vignette" />
      </div>

      <main className="proven-hero-content">
        <a 
          href="#how-it-works" 
          className="proven-hero-badge-link"
          onClick={(e) => {
            e.preventDefault();
            onExplore && onExplore();
          }}
        >
          <span className="proven-badge-tag">NEW</span>
          <span className="proven-badge-text">See How PROVEN AI Works</span>
          <span className="proven-badge-arrow">→</span>
        </a>

        <h1 className="proven-hero-title">
          <span>Security without the</span>
          <span>blind spots.</span>
        </h1>

        <p className="proven-hero-description">
          One platform to discover vulnerabilities, detect threats, and verify multi-document Identity DNA with AI-powered forensic precision.
        </p>

        <div className="proven-hero-actions">
          <PrimaryButton onClick={onStartSecuring || onExplore}>
            Get Started
          </PrimaryButton>
          <GlassButton onClick={onAboutTeam || onExplore}>
            About Team
          </GlassButton>
        </div>
      </main>
    </div>
  );
});

export default HeroSection;
