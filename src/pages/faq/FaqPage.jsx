import React, { useState, useMemo, useEffect } from 'react';
import './FaqPage.css';
import Navbar from '../navbar/navbar';
import GiantFooterSection from '../home/GiantFooterSection';
import UniversalButton, { BlueButton, PrimaryButton } from '../../components/universalbuttonhovers';
import { 
  Search, 
  ChevronDown, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Lock, 
  CheckCircle2, 
  HelpCircle,
  FileCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: 'groq-lpu',
    category: 'forensics',
    badge: 'Groq 120B AI',
    question: 'How does PROVEN utilize the Groq 120B LPU Neural Engine for document analysis?',
    answer: 'PROVEN connects directly to Groq high-speed Language Processing Units running the flagship 120-billion parameter neural model (openai/gpt-oss-120b). The engine ingests extracted character vectors, bounding-box geometry, and pixel contrast metrics to disentangle multilingual Indian typography (Devanagari vs English), eliminate government watermark noise, and catch synthetic placeholder tampering with sub-second inference latency.'
  },
  {
    id: 'cross-doc-dna',
    category: 'verification',
    badge: 'Cross-Document DNA',
    question: 'What is Cross-Document Identity DNA and why is single-document KYC obsolete?',
    answer: 'Single-document verification is vulnerable to isolated document tampering. PROVEN solves this by cross-analyzing two or three documents simultaneously (e.g. PAN + Aadhaar or PAN + Passport). Our cross-matching engine evaluates cultural name permutations via normalized token distance, reconciles date of birth formats, and detects synthetic identity collages where a fraudster pairs a stolen PAN with an unrelated Aadhaar.'
  },
  {
    id: 'browser-ocr',
    category: 'verification',
    badge: 'Client WebAssembly',
    question: 'Why does optical character recognition run inside the client browser?',
    answer: 'PROVEN executes high-fidelity OCR directly on your device using Tesseract.js compiled to WebAssembly with HTML5 canvas contrast enhancement. This delivers zero-latency text extraction, preserves user privacy by keeping pre-processed buffers local, and automatically tests multiple canvas orientations (0°, 270°, 90°) to handle portrait and tilted smartphone photos.'
  },
  {
    id: 'verhoeff-checksum',
    category: 'compliance',
    badge: 'Mathematical Validation',
    question: 'How are Aadhaar and PAN numbers mathematically verified against fraud?',
    answer: 'Aadhaar numbers are audited using the Dihedral Group D5 Verhoeff checksum algorithm, which catches 100% of single-digit transcription errors and 95.3% of adjacent transposition errors without requiring UIDAI database calls. PAN cards undergo strict CBDT syntactic regex verification, enforcing that the 4th character is P for individuals and the 5th character matches the surname initial of the verified cardholder.'
  },
  {
    id: 'specimen-forgery',
    category: 'forensics',
    badge: 'Specimen Detection',
    question: 'How does the engine catch dummy templates and specimen cards from Google Images?',
    answer: 'Fraudsters frequently use dummy PSD templates with placeholder strings. PROVEN employs zero-tolerance heuristic and neural classifiers that instantly flag textbook dummy names (such as SAMPLE NAME, JOHN DOE, or TEST CITIZEN) and dummy sequential numbers (like ABCDE1234F). These documents are immediately designated with status REJECTED, 98% tamper risk, and 4% authenticity.'
  },
  {
    id: 'data-privacy',
    category: 'security',
    badge: 'Zero-Trust Security',
    question: 'Does PROVEN store my physical identity card images or sensitive personal records?',
    answer: 'No. PROVEN enforces a zero-trust, ephemeral processing architecture. Uploaded document buffers are processed in temporary volatile memory and purged immediately after the neural audit completes. Only cryptographic SHA-256 canvas fingerprints, anonymized audit scores, and the immutable ledger record (#PRV-XXXX) are archived in the audit vault.'
  },
  {
    id: 'blurry-photos',
    category: 'verification',
    badge: 'Three-Way Decision',
    question: 'What happens if a user uploads a blurry, damaged, or low-resolution photo?',
    answer: 'Unlike naive binary classifiers that mark low-quality cards as fake, PROVEN utilizes a three-way decision engine: VERIFIED, REVIEW, or REJECTED. Low-contrast or heavily blurred images that fail confidence thresholds are routed to REVIEW with explanatory diagnostic reasons, preventing false-positive fraud flags against legitimate citizens.'
  },
  {
    id: 'realtime-telemetry',
    category: 'forensics',
    badge: 'Live SSE Stream',
    question: 'How does the Live Pipeline Stream work without simulated delays?',
    answer: 'PROVEN streams telemetry using Server-Sent Events (SSE) directly over HTTP chunked transfer. Each station on the five-station train track (Crypto Ingestion, Neural OCR Core, Biometric Vectors, Groq Cross-DNA, Vault Anchor) lights up the exact millisecond the server physically finishes that step, displaying real SHA-256 hashes and live API round-trip benchmarks.'
  },
  {
    id: 'api-integration',
    category: 'security',
    badge: 'Enterprise API',
    question: 'Can enterprises integrate PROVEN into existing banking or fintech onboarding pipelines?',
    answer: 'Yes. PROVEN provides high-throughput REST API endpoints (/api/agent/analyze-documents?stream=true) supporting multi-part form payloads, automated webhook callbacks, and triple-key Groq failover rotation. Code snippets for cURL, Python requests, and Node.js Axios are available directly in the dashboard API playground.'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'forensics', label: 'AI Forensics & Groq', icon: Cpu },
  { id: 'verification', label: 'Identity DNA & OCR', icon: Layers },
  { id: 'compliance', label: 'Mathematical Checksums', icon: ShieldCheck },
  { id: 'security', label: 'Zero-Trust Security', icon: Lock }
];

export const FaqPage = ({ user, onNavigateHome, onNavigateTeam, onNavigateFaq, onNavigateHow, onOpenAuth }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({ 'groq-lpu': true, 'cross-doc-dna': true });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    if (window.lenis) {
      try {
        window.lenis.scrollTo(0, { immediate: true });
      } catch (e) {}
    }
  }, []);

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return FAQ_ITEMS.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.badge.toLowerCase().includes(query)
      );
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="proven-faq-page-wrapper">
      <div className="proven-faq-grid-bg" />
      <div className="proven-faq-grid-glow" />
      <div className="proven-faq-grid-vignette" />

      <Navbar 
        user={user}
        onStartSecuring={onOpenAuth}
        onNavigateHome={onNavigateHome}
        onNavigateTeam={onNavigateTeam}
        onNavigateFaq={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (window.lenis) window.lenis.scrollTo(0, { duration: 1.0 });
        }}
        isFaqPage={true}
      />

      <main className="proven-faq-container">
        <section className="proven-faq-hero">
          <a 
            href="/how-it-works" 
            className="proven-hero-badge-link"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateHow) onNavigateHow();
            }}
          >
            <span className="proven-badge-tag">NEW</span>
            <span className="proven-badge-text">See How PROVEN AI Works</span>
            <span className="proven-badge-arrow">→</span>
          </a>

          <h1 className="proven-faq-title">
            <span>Frequently Asked Questions &</span>
            <span>Neural Identity Forensics.</span>
          </h1>

          <p className="proven-faq-description">
            Explore how PROVEN orchestrates client-side WebAssembly OCR, Groq 120B Language Processing Units, and Dihedral D5 mathematical checksums to eliminate synthetic identity fraud.
          </p>

          <div className="proven-faq-search-box">
            <Search size={18} className="proven-faq-search-icon" />
            <input 
              type="text"
              className="proven-faq-search-input"
              placeholder="Search algorithms, Groq LPU, Verhoeff checksum, or privacy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="proven-faq-search-clear"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>
        </section>

        <section className="proven-faq-tabs-section">
          <div className="proven-faq-tabs-list">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button 
                  key={cat.id}
                  type="button"
                  className={`proven-faq-tab-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <Icon size={15} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="proven-faq-accordion-section">
          <div className="proven-faq-count-badge">
            <CheckCircle2 size={13} />
            <span>Showing {filteredFaqs.length} of {FAQ_ITEMS.length} verified answers</span>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="proven-faq-empty">
              <HelpCircle size={32} className="proven-faq-empty-icon" />
              <h3 className="proven-faq-empty-title">No matching answers found</h3>
              <p className="proven-faq-empty-sub">Try searching for keywords like "Groq", "Aadhaar", "PAN", "OCR", or "Checksum".</p>
              <BlueButton onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
                Reset Filters
              </BlueButton>
            </div>
          ) : (
            <div className="proven-faq-list">
              {filteredFaqs.map((faq, index) => {
                const isOpen = Boolean(openItems[faq.id]);
                return (
                  <div 
                    key={faq.id} 
                    className={`proven-faq-card ${isOpen ? 'is-open' : ''}`}
                    style={{ animationDelay: `${0.04 * index}s` }}
                  >
                    <button 
                      type="button" 
                      className="proven-faq-question-btn"
                      onClick={() => toggleItem(faq.id)}
                      aria-expanded={isOpen}
                    >
                      <div className="proven-faq-q-left">
                        <span className="proven-faq-badge">{faq.badge}</span>
                        <h3 className="proven-faq-question-text">{faq.question}</h3>
                      </div>
                      <div className={`proven-faq-chevron-wrap ${isOpen ? 'is-expanded' : ''}`}>
                        <ChevronDown size={18} />
                      </div>
                    </button>

                    <div className={`proven-faq-answer-collapse ${isOpen ? 'is-expanded' : ''}`}>
                      <div className="proven-faq-answer-inner">
                        <p className="proven-faq-answer-text">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="proven-faq-cta-box">
          <div className="proven-faq-cta-glow" />
          <div className="proven-faq-cta-content">
            <span className="proven-badge-tag">READY TO AUDIT?</span>
            <h2 className="proven-faq-cta-title">Test Your Identity Documents in Real Time</h2>
            <p className="proven-faq-cta-sub">Run multi-document identity concordance, verify Verhoeff checksums, and stream live Groq 120B intelligence.</p>
            <div className="proven-faq-cta-actions">
              <PrimaryButton onClick={onOpenAuth}>
                Launch Verification Sandbox
                <ArrowRight size={15} />
              </PrimaryButton>
              <BlueButton onClick={onNavigateHome}>
                Explore Architecture
              </BlueButton>
            </div>
          </div>
        </section>
      </main>

      <GiantFooterSection 
        onNavigateTeam={onNavigateTeam}
        onNavigateFaq={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (window.lenis) window.lenis.scrollTo(0, { duration: 1.0 });
        }}
      />
    </div>
  );
};

export default FaqPage;
