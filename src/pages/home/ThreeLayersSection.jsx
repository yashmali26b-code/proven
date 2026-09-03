import React from 'react';
import './ThreeLayersSection.css';
import railwayIcon from '../../assets/icons/railway.png';
import cloudflareIcon from '../../assets/icons/cloudflare.png';
import gcpIcon from '../../assets/icons/gcp.png';
import vercelIcon from '../../assets/icons/vercel.png';

export const ThreeLayersSection = () => {
  const infraItems = [
    {
      icon: railwayIcon,
      name: 'Railway Cloud',
      role: 'Frontend & Backend Hosting',
      desc: 'Hosts our production React SPA and scalable Python FastAPI microservice clusters with asynchronous model inference queues and automated continuous deployment.'
    },
    {
      icon: cloudflareIcon,
      name: 'Cloudflare Enterprise',
      role: 'Bot Detection & API Security',
      desc: 'Guards our verification APIs against automated credential-stuffing bots, provides DDoS mitigation, rate-limiting, and deep traffic inspection at the global edge.'
    },
    {
      icon: vercelIcon,
      name: 'Vercel Edge Network',
      role: 'API Shield & Edge Protector',
      desc: 'Acts as our global edge reverse proxy and SSL security layer, providing edge caching, request scrubbing, and sub-millisecond route optimization.'
    },
    {
      icon: gcpIcon,
      name: 'Google Cloud Platform',
      role: 'Bot Deployment & Cloud Intelligence',
      desc: 'Powers bot deployment, cloud telemetry verification, and high-availability enterprise services across global distributed compute regions.'
    }
  ];

  return (
    <section className="proven-infra-section" id="features">
      <div className="proven-infra-inner">
        <div className="proven-section-badge-center">
          <div className="proven-badge-dot" />
          <span className="proven-badge-text-tag">Infrastructure & Security Stack</span>
        </div>

        <h2 className="proven-infra-title">
          Production infrastructure.
          <span>Enterprise-grade security.</span>
        </h2>

        <div className="proven-infra-cards-grid">
          {infraItems.map((item, idx) => (
            <div key={idx} className="proven-infra-card">
              <div className="proven-infra-header">
                <div className="proven-infra-icon-box">
                  <img src={item.icon} alt={item.name} className="proven-infra-icon-img" />
                </div>
              </div>

              <div className="proven-infra-info">
                <span className="proven-infra-role">{item.role}</span>
                <h3 className="proven-infra-name">{item.name}</h3>
                <p className="proven-infra-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeLayersSection;
