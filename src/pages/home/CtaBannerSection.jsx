import React from 'react';
import './CtaBannerSection.css';
import { PrimaryButton } from '../../components/universalbuttonhovers';

export const CtaBannerSection = ({ onGetStarted }) => {
  return (
    <section className="proven-cta-section" id="pricing">
      <div className="proven-cta-inner">
        <div className="proven-cta-card">
          <div className="proven-cta-lens-bg" />

          <div className="proven-cta-content">
            <h2 className="proven-cta-title">
              Verification work never stops.
              <span>Neither does PROVEN.</span>
            </h2>

            <p className="proven-cta-desc">
              Get continuous visibility into cross-document identity consistency and act on critical risks before they escalate.
            </p>

            <div className="proven-cta-actions">
              <PrimaryButton onClick={onGetStarted}>
                Get Started
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBannerSection;
