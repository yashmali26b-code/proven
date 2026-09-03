import React, { useState } from 'react';
import './TeamPage.css';
import Navbar from '../pages/navbar/navbar';
import GiantFooterSection from '../pages/home/GiantFooterSection';
import { Mail, ArrowUpRight, Copy, Check, Crown } from 'lucide-react';

const GithubIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const TeamPage = ({ user, onNavigateHome, onNavigateTeam, onNavigateFaq, onOpenAuth }) => {
  const [copiedEmail, setCopiedEmail] = useState(null);

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => {
      setCopiedEmail(null);
    }, 2000);
  };

  const teamLeader = {
    name: 'Yash Bharat Mali',
    role: 'Team Leader',
    initials: 'YM',
    email: 'yashmali26b@gmail.com',
    github: 'yashmali26b-code',
    githubUrl: 'https://github.com/yashmali26b-code',
    bio: 'Directing full-stack architecture, identity forensics pipeline engineering, high-throughput microservices, and end-to-end security workflows.'
  };

  const teammates = [
    {
      name: 'Yash Bharat Desale',
      initials: 'YD',
      email: 'yashdesale982@gmail.com'
    },
    {
      name: 'Neha Shantaram Bhamare',
      initials: 'NB',
      email: 'nehabhamare65@gmail.com'
    },
    {
      name: 'Dhanashri Ajay Patil',
      initials: 'DP',
      email: 'patildhanshri2008@gmail.com'
    },
    {
      name: 'Nikhil Nitin Sonawane',
      initials: 'NS',
      email: 'nikhilson306@gmail.com'
    },
    {
      name: 'Sejal Gopal Girase',
      initials: 'SG',
      email: 'sejalg992@gmail.com'
    }
  ];

  return (
    <div className="proven-teampage-wrapper">
      <div className="proven-team-grid-bg" />
      <div className="proven-team-grid-glow" />
      <div className="proven-team-grid-vignette" />

      <Navbar 
        user={user}
        onStartSecuring={onOpenAuth}
        onNavigateHome={onNavigateHome}
        onNavigateTeam={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (window.lenis) window.lenis.scrollTo(0, { duration: 1.0 });
        }}
        onNavigateFaq={onNavigateFaq}
        isTeamPage={true}
      />

      <main className="proven-team-neat-container">
        <section className="proven-team-neat-hero">
          <div className="proven-hero-badge-link">
            <span className="proven-badge-tag">TEAM</span>
            <span className="proven-badge-text">Tech Smashers</span>
          </div>

          <h1 className="proven-hero-title">
            <span>The minds behind</span>
            <span>Tech Smashers & PROVEN.</span>
          </h1>

          <p className="proven-hero-description">
            Meet the engineers, security researchers, and systems architects powering modern multi-document identity forensics.
          </p>
        </section>

        <section className="proven-neat-leader-section">
          <div className="proven-neat-box proven-neat-leader-box proven-leader-royal-gold">
            <div className="proven-neat-leader-header">
              <div className="proven-neat-avatar-box leader-avatar royal-gold-avatar">
                <span>{teamLeader.initials}</span>
              </div>
              <div className="proven-neat-leader-meta">
                <div className="proven-neat-role-pill royal-gold-pill">
                  <Crown size={12} className="royal-crown-icon" />
                  <span className="proven-role-text">{teamLeader.role}</span>
                </div>
                <h2 className="proven-neat-leader-name royal-gold-name">{teamLeader.name}</h2>
              </div>
            </div>

            <p className="proven-neat-leader-bio">{teamLeader.bio}</p>

            <div className="proven-neat-leader-actions">
              <a 
                href={teamLeader.githubUrl} 
                target="_blank" 
                rel="noreferrer"
                className="proven-neat-action-btn"
              >
                <GithubIcon size={15} />
                <span>github/{teamLeader.github}</span>
                <ArrowUpRight size={13} className="proven-action-arrow" />
              </a>

              <div className="proven-neat-email-btn-group">
                <a 
                  href={`mailto:${teamLeader.email}`}
                  className="proven-neat-email-main-btn"
                >
                  <Mail size={15} />
                  <span>{teamLeader.email}</span>
                </a>
                <button 
                  onClick={() => handleCopyEmail(teamLeader.email)}
                  className="proven-neat-copy-btn"
                  title="Copy email"
                  aria-label="Copy email"
                >
                  {copiedEmail === teamLeader.email ? (
                    <Check size={13} className="copied-icon" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="proven-neat-teammates-section">
          <div className="proven-neat-teammates-grid">
            {teammates.map((member, idx) => (
              <div key={idx} className="proven-neat-box proven-neat-member-box">
                <div className="proven-neat-member-top">
                  <div className="proven-neat-avatar-box">
                    <span>{member.initials}</span>
                  </div>
                  <div className="proven-neat-member-meta">
                    <h3 className="proven-neat-member-name">{member.name}</h3>
                  </div>
                </div>

                <div className="proven-neat-member-bottom">
                  <div className="proven-neat-email-row">
                    <a 
                      href={`mailto:${member.email}`} 
                      className="proven-neat-member-email-link"
                    >
                      <Mail size={13} />
                      <span>{member.email}</span>
                    </a>
                    <button 
                      onClick={() => handleCopyEmail(member.email)}
                      className="proven-neat-copy-btn"
                      title="Copy email"
                      aria-label="Copy email"
                    >
                      {copiedEmail === member.email ? (
                        <Check size={12} className="copied-icon" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <GiantFooterSection 
        onNavigateHome={onNavigateHome}
        onNavigateTeam={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (window.lenis) window.lenis.scrollTo(0, { duration: 1.0 });
        }}
        onNavigateFaq={onNavigateFaq}
      />
    </div>
  );
};

export default TeamPage;
