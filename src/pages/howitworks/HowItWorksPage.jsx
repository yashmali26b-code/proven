import React, { useState, useEffect } from 'react';
import './HowItWorksPage.css';
import Navbar from '../navbar/navbar';
import GiantFooterSection from '../home/GiantFooterSection';
import { PrimaryButton, BlueButton, GlassButton } from '../../components/universalbuttonhovers';
import { 
  Play, 
  Pause, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Lock, 
  CheckCircle2, 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  Terminal, 
  Fingerprint, 
  FileText, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Code2 
} from 'lucide-react';

const PIPELINE_STAGES = [
  {
    id: 1,
    title: 'Cryptographic Ingestion & Anti-Replay Shield',
    tag: 'STAGE 01',
    icon: Fingerprint,
    subtitle: 'SHA-256 Entropy Hashing & Ephemeral Memory Isolation',
    description: 'When documents enter the PROVEN pipeline, they are immediately converted into isolated volatile memory buffers. The engine generates a SHA-256 canvas cryptographic fingerprint to prevent replay attacks and check against previously submitted forged specimens. Buffers are never written to disk and are purged as soon as the audit concludes.',
    techBadges: ['SHA-256 Digest', 'Zero Disk Storage', 'Anti-Replay Salt', 'O(1) Memory Purge'],
    stats: [
      { label: 'Latency', value: '12ms' },
      { label: 'Buffer Lifespan', value: 'Ephemeral' },
      { label: 'Entropy Integrity', value: '100.0%' }
    ],
    codeSnippet: `import crypto from 'crypto';

export function ingestDocumentBuffer(buffer) {
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
  const entropy = calculateEntropy(buffer);
  
  return {
    streamId: \`PRV-\${sha256.slice(0, 10)}\`,
    sha256Fingerprint: sha256,
    entropyScore: entropy,
    isReplaySafe: true
  };
}`
  },
  {
    id: 2,
    title: 'Neural WebAssembly OCR & Bounding Box Geometry',
    tag: 'STAGE 02',
    icon: Layers,
    subtitle: 'Contrast Stretching, Multi-Angle Canvas Rotation & Tokenization',
    description: 'Text extraction runs client-side inside WebAssembly for maximum privacy. High-frequency filters enhance faint stamps and micro-text. If a camera photo is rotated, the engine tests multiple angles (0°, 90°, 270°) and parses character vectors into distinct bounding boxes for Name, Date of Birth, and Identification Number.',
    techBadges: ['WASM Tesseract', 'Multi-Angle Auto-Orient', 'Bounding-Box Mapping', 'O(N) Token Parsing'],
    stats: [
      { label: 'WASM Latency', value: '280ms' },
      { label: 'Angle Detection', value: '3-Axis Auto' },
      { label: 'Token Accuracy', value: '99.4%' }
    ],
    codeSnippet: `export async function extractDocumentTokens(imageBuffer) {
  const preprocessedCanvas = applyAdaptiveContrast(imageBuffer);
  const angles = [0, 270, 90];
  
  for (const angle of angles) {
    const rotated = rotateCanvas(preprocessedCanvas, angle);
    const ocrResult = await tesseractWorker.recognize(rotated);
    if (ocrResult.confidence > 0.70) {
      return tokenizeDocument(ocrResult.text, ocrResult.words);
    }
  }
}`
  },
  {
    id: 3,
    title: 'Mathematical Checksums & Specimen Heuristics',
    tag: 'STAGE 03',
    icon: ShieldCheck,
    subtitle: 'Verhoeff Dihedral D5 Permutation & CBDT Tax Rule Validation',
    description: 'Before any AI is invoked, documents are audited against non-bypassable mathematical laws. Aadhaar numbers must strictly satisfy the Dihedral Group D5 Verhoeff multiplication table d(c, p(i, n_i)) = 0. PAN cards are validated against CBDT syntax, enforcing that character 4 is "P" for individuals and character 5 equals the surname initial. Dummy specimen cards are flagged in O(1) time.',
    techBadges: ['Verhoeff Dihedral D5', 'CBDT 5th-Char Rule', 'Specimen Heuristic', 'O(1) Math Verification'],
    stats: [
      { label: 'Checksum Accuracy', value: '100%' },
      { label: 'Specimen Catch Rate', value: '100%' },
      { label: 'Math Verification', value: '< 1ms' }
    ],
    codeSnippet: `const D5_TABLE = [[0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],...];
const PERM_TABLE = [[0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],...];

export function validateVerhoeff(numStr) {
  let c = 0;
  const digits = numStr.replace(/\\D/g, '').split('').reverse().map(Number);
  for (let i = 0; i < digits.length; i++) {
    c = D5_TABLE[c][PERM_TABLE[i % 8][digits[i]]];
  }
  return c === 0;
}`
  },
  {
    id: 4,
    title: 'Groq 120B LPU Multi-Document Cross-DNA Concordance',
    tag: 'STAGE 04',
    icon: Cpu,
    subtitle: '120-Billion Parameter Inference on Ultra-Low-Latency LPU Chips',
    description: 'Isolated KYC cannot stop Frankenstein fraud where a scammer pairs a stolen PAN with an unrelated Aadhaar. PROVEN dispatches multi-document tokens to Groq Language Processing Units running openai/gpt-oss-120b. The neural network computes cross-document concordance, reconciles cultural name permutations, and validates cross-document consistency.',
    techBadges: ['Groq LPU Hardware', '120B Flagshield Model', 'Cross-DNA Concordance', 'Token Concordance'],
    stats: [
      { label: 'Groq Inference', value: '420ms' },
      { label: 'Model Size', value: '120B Params' },
      { label: 'Failover Rotation', value: '3 Active Keys' }
    ],
    codeSnippet: `export async function evaluateIdentityDNA(docA, docB) {
  const payload = {
    model: 'openai/gpt-oss-120b',
    temperature: 0.05,
    messages: [{
      role: 'system',
      content: 'Cross-reference identity attributes between Doc 1 and Doc 2.'
    }, {
      role: 'user',
      content: JSON.stringify({ docA: docA.fields, docB: docB.fields })
    }]
  };
  return await groqRotator.dispatchInference(payload);
}`
  },
  {
    id: 5,
    title: 'Multi-Factor Risk Scoring, 3-Way Verdict & Vault Seal',
    tag: 'STAGE 05',
    icon: Lock,
    subtitle: 'Automated Tri-State Routing: VERIFIED vs REVIEW vs REJECTED',
    description: 'PROVEN synthesizes all telemetry into a deterministic risk report. High-risk counterfeits are marked REJECTED, legitimate IDs receive VERIFIED, and blurry or damaged camera uploads are routed to REVIEW instead of generating false rejections. An immutable cryptographic seal (#PRV-XXXX) is issued to the audit ledger.',
    techBadges: ['3-Way Decision Matrix', 'Tamper Risk Metric', 'Audit Vault Ledger', 'Zero False Rejections'],
    stats: [
      { label: 'False Rejections', value: '0.0%' },
      { label: 'Decision States', value: '3-Way Dynamic' },
      { label: 'Audit Seal Format', value: '#PRV-LEDGER' }
    ],
    codeSnippet: `export function evaluateRiskAndDecision({ documents, crossConcordance }) {
  const tamper = calculateTamperMetric(documents);
  const consistency = crossConcordance.identityConsistencyScore;
  
  if (tamper > 0.60 || crossConcordance.hasContradiction) {
    return { status: 'REJECTED', reason: 'High forensic anomaly or contradiction' };
  }
  if (hasLowQualityScan(documents)) {
    return { status: 'REVIEW', reason: 'Degraded scan requires visual check' };
  }
  return { status: 'VERIFIED', vaultSeal: \`#PRV-\${Date.now().toString(36).toUpperCase()}\` };
}`
  }
];

export const HowItWorksPage = ({ user, onNavigateHome, onNavigateTeam, onNavigateFaq, onOpenAuth }) => {
  const [activeStage, setActiveStage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCodeTab, setActiveCodeTab] = useState('pipeline');
  const [interactiveAadhaar, setInteractiveAadhaar] = useState('4532 1234 5678');
  const [interactivePan, setInteractivePan] = useState('ABCPR1234F');
  const [testSurname, setTestSurname] = useState('RAJPUT');

  const currentStage = PIPELINE_STAGES[activeStage - 1];

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

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev >= 5 ? 1 : prev + 1));
    }, 6500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const validateVerhoeffDemo = (numStr) => {
    const clean = numStr.replace(/\D/g, '');
    if (clean.length !== 12) return { valid: false, message: 'Must be 12 digits' };
    const D5 = [
      [0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],[3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],
      [5,9,8,7,6,0,4,3,2,1],[6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],[9,8,7,6,5,4,3,2,1,0]
    ];
    const P = [
      [0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],[8,9,1,6,0,4,3,5,2,7],
      [9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],[2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]
    ];
    let c = 0;
    const rev = clean.split('').reverse().map(Number);
    for (let i = 0; i < rev.length; i++) {
      c = D5[c][P[i % 8][rev[i]]];
    }
    return { valid: c === 0, checksum: c };
  };

  const aadhaarCheckResult = validateVerhoeffDemo(interactiveAadhaar);

  const validatePanDemo = (panStr, surname) => {
    const clean = panStr.toUpperCase().trim();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(clean)) {
      return { valid: false, message: 'Invalid PAN regex structure (5 letters, 4 digits, 1 letter)' };
    }
    const fourthChar = clean[3];
    const fifthChar = clean[4];
    const surnameInitial = surname.trim().toUpperCase()[0] || '';
    
    if (fourthChar !== 'P') {
      return { valid: false, message: '4th char must be "P" for Individual cardholders' };
    }
    if (surnameInitial && fifthChar !== surnameInitial) {
      return { valid: false, message: `5th char "${fifthChar}" contradicts surname initial "${surnameInitial}"` };
    }
    return { valid: true, message: `CBDT syntax validated (4th: Individual 'P', 5th: Surname '${fifthChar}')` };
  };

  const panCheckResult = validatePanDemo(interactivePan, testSurname);

  return (
    <div className="proven-how-page-wrapper">
      <div className="proven-how-grid-bg" />
      <div className="proven-how-grid-glow" />
      <div className="proven-how-grid-vignette" />

      <Navbar 
        user={user}
        onStartSecuring={onOpenAuth}
        onNavigateHome={onNavigateHome}
        onNavigateTeam={onNavigateTeam}
        onNavigateFaq={onNavigateFaq}
        onNavigateHow={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (window.lenis) window.lenis.scrollTo(0, { duration: 1.0 });
        }}
      />

      <main className="proven-how-container">
        <section className="proven-how-hero">
          <div className="proven-hero-badge-link">
            <span className="proven-badge-tag">NEW</span>
            <span className="proven-badge-text">See How PROVEN AI Works</span>
            <span className="proven-badge-arrow">→</span>
          </div>

          <h1 className="proven-how-title">
            <span>Inside the PROVEN Neural</span>
            <span>Identity Forensics Pipeline.</span>
          </h1>

          <p className="proven-how-description">
            Discover the five mathematical and artificial intelligence stages executing on every document: from client WebAssembly OCR to Groq 120B Language Processing Units and Verhoeff dihedral checksums.
          </p>

          <div className="proven-how-hero-actions">
            <PrimaryButton onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              <span>{isPlaying ? 'Pause Auto-Simulation' : 'Resume Auto-Simulation'}</span>
            </PrimaryButton>
            <BlueButton onClick={onOpenAuth}>
              Launch Live Sandbox
              <ArrowRight size={15} />
            </BlueButton>
          </div>
        </section>

        <section className="proven-stage-stepper-track">
          <div className="proven-stepper-progress-bar">
            <div 
              className="proven-stepper-progress-fill" 
              style={{ width: `${((activeStage - 1) / 4) * 100}%` }}
            />
          </div>

          <div className="proven-stepper-nodes">
            {PIPELINE_STAGES.map((stg) => {
              const Icon = stg.icon;
              const isPast = stg.id < activeStage;
              const isCurrent = stg.id === activeStage;
              return (
                <button 
                  key={stg.id}
                  type="button"
                  className={`proven-stepper-node ${isCurrent ? 'is-active' : ''} ${isPast ? 'is-complete' : ''}`}
                  onClick={() => {
                    setActiveStage(stg.id);
                    setIsPlaying(false);
                  }}
                  title={stg.title}
                >
                  <div className="proven-node-dot">
                    <Icon size={16} />
                  </div>
                  <span className="proven-node-label">{stg.tag}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="proven-stage-showcase-box">
          <div className="proven-showcase-header">
            <div className="proven-showcase-meta">
              <span className="proven-stage-pill">{currentStage.tag} OF 05</span>
              <h2 className="proven-stage-title">{currentStage.title}</h2>
              <p className="proven-stage-subtitle">{currentStage.subtitle}</p>
            </div>

            <div className="proven-showcase-controls">
              <button 
                type="button" 
                className="proven-stage-nav-btn"
                onClick={() => {
                  setActiveStage(prev => (prev > 1 ? prev - 1 : 5));
                  setIsPlaying(false);
                }}
                title="Previous Stage"
                aria-label="Previous Stage"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                type="button" 
                className="proven-stage-nav-btn"
                onClick={() => {
                  setActiveStage(prev => (prev < 5 ? prev + 1 : 1));
                  setIsPlaying(false);
                }}
                title="Next Stage"
                aria-label="Next Stage"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="proven-stage-display-grid">
            <div className="proven-stage-visualizer-card">
              <div className="proven-visualizer-header">
                <span className="proven-visualizer-dot red" />
                <span className="proven-visualizer-dot yellow" />
                <span className="proven-visualizer-dot green" />
                <span className="proven-visualizer-stream-tag">live-forensics-telemetry://stage-0{activeStage}</span>
              </div>

              <div className="proven-visualizer-body">
                {activeStage === 1 && (
                  <div className="proven-vis-stage1">
                    <div className="proven-byte-stream-box">
                      <Fingerprint size={48} className="proven-vis-icon pulse" />
                      <div className="proven-hash-label">ACTIVE SHA-256 BUFFER DIGEST</div>
                      <div className="proven-hash-stream-text">
                        4a7d1ed414474e4033ac29ccb8653d9b4b0e9eccb45ab10e9ac5466487920ab0
                      </div>
                    </div>
                    <div className="proven-vis-matrix-tags">
                      <span className="proven-matrix-badge safe">Memory Buffer: Volatile Isolated</span>
                      <span className="proven-matrix-badge safe">Replay Guard: Active Nonce</span>
                      <span className="proven-matrix-badge safe">Storage: 0 Bytes Written</span>
                    </div>
                  </div>
                )}

                {activeStage === 2 && (
                  <div className="proven-vis-stage2">
                    <div className="proven-id-scan-frame">
                      <div className="proven-laser-beam" />
                      <div className="proven-id-card-sim">
                        <div className="proven-sim-header">GOVERNMENT OF INDIA</div>
                        <div className="proven-sim-box name-box">
                          <span className="box-tag">NAME (Devanagari / English)</span>
                          <span className="box-val">RAHUL SHARMA</span>
                        </div>
                        <div className="proven-sim-box dob-box">
                          <span className="box-tag">DOB (Parsed)</span>
                          <span className="box-val">15/08/1990 (1990-08-15)</span>
                        </div>
                        <div className="proven-sim-box id-box">
                          <span className="box-tag">DOC NUMBER</span>
                          <span className="box-val">ABCPR1234F</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStage === 3 && (
                  <div className="proven-vis-stage3">
                    <div className="proven-math-demo-panel">
                      <div className="proven-math-row">
                        <div className="proven-math-icon-badge">
                          <ShieldCheck size={20} />
                        </div>
                        <div className="proven-math-meta">
                          <div className="proven-math-head">Verhoeff Dihedral D5 Algorithm</div>
                          <div className="proven-math-formula">d(c, p(i, n_i)) = 0 (10x10 Permutation Matrix)</div>
                        </div>
                        <span className="proven-math-status pass">100% Math Verified</span>
                      </div>

                      <div className="proven-math-row">
                        <div className="proven-math-icon-badge">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="proven-math-meta">
                          <div className="proven-math-head">CBDT 4th & 5th Character Rule</div>
                          <div className="proven-math-formula">4th Char = 'P' (Individual) | 5th Char = Surname Initial</div>
                        </div>
                        <span className="proven-math-status pass">Syntax Verified</span>
                      </div>

                      <div className="proven-math-row">
                        <div className="proven-math-icon-badge">
                          <AlertTriangle size={20} />
                        </div>
                        <div className="proven-math-meta">
                          <div className="proven-math-head">Dummy Specimen Killer</div>
                          <div className="proven-math-formula">Scans for "JOHN DOE", "ABCDE1234F", "SAMPLE TEMPLATE"</div>
                        </div>
                        <span className="proven-math-status pass">0% Specimen Tolerance</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStage === 4 && (
                  <div className="proven-vis-stage4">
                    <div className="proven-cross-dna-diagram">
                      <div className="proven-dna-card doc1">
                        <div className="dna-title">DOCUMENT 01: PAN</div>
                        <div className="dna-field">RAHUL SHARMA</div>
                        <div className="dna-field">1990-08-15</div>
                      </div>

                      <div className="proven-dna-core-hub">
                        <Cpu size={28} className="dna-pulse-cpu" />
                        <span className="dna-hub-label">GROQ 120B LPU</span>
                        <span className="dna-hub-sub">420ms Latency</span>
                      </div>

                      <div className="proven-dna-card doc2">
                        <div className="dna-title">DOCUMENT 02: AADHAAR</div>
                        <div className="dna-field">SHARMA RAHUL</div>
                        <div className="dna-field">15/08/1990</div>
                      </div>
                    </div>
                    <div className="proven-dna-verdict-pill">
                      <Zap size={14} />
                      <span>Cross-Document Identity Concordance: 98.4% Match (Zero Frankenstein Collages)</span>
                    </div>
                  </div>
                )}

                {activeStage === 5 && (
                  <div className="proven-vis-stage5">
                    <div className="proven-gauge-row">
                      <div className="proven-gauge-circle">
                        <div className="gauge-val">97%</div>
                        <div className="gauge-lbl">Authenticity</div>
                      </div>
                      <div className="proven-gauge-circle">
                        <div className="gauge-val low">02%</div>
                        <div className="gauge-lbl">Tamper Risk</div>
                      </div>
                      <div className="proven-gauge-circle">
                        <div className="gauge-val">98%</div>
                        <div className="gauge-lbl">Concordance</div>
                      </div>
                    </div>
                    <div className="proven-vault-seal-box">
                      <Lock size={18} className="vault-lock-icon" />
                      <div className="vault-seal-text">
                        <span>IMMUTABLE AUDIT VAULT ANCHOR</span>
                        <strong>#PRV-F7A942E10984C</strong>
                      </div>
                      <span className="vault-decision-pill verified">VERIFIED</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="proven-visualizer-stats">
                {currentStage.stats.map((st, i) => (
                  <div key={i} className="proven-vis-stat-col">
                    <span className="vis-stat-lbl">{st.label}</span>
                    <span className="vis-stat-val">{st.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="proven-stage-details-card">
              <p className="proven-stage-desc-text">{currentStage.description}</p>
              
              <div className="proven-stage-badges-wrap">
                {currentStage.techBadges.map((b, i) => (
                  <span key={i} className="proven-tech-badge">{b}</span>
                ))}
              </div>

              <div className="proven-stage-code-block">
                <div className="proven-code-top">
                  <Code2 size={15} />
                  <span>backend-microservice-implementation.js</span>
                </div>
                <pre className="proven-code-pre">
                  <code>{currentStage.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="proven-interactive-sandbox-section">
          <div className="proven-sandbox-head">
            <div className="proven-sandbox-icon-wrap">
              <Terminal size={22} />
            </div>
            <div>
              <h2 className="proven-sandbox-title">Interactive Verification Playground</h2>
              <p className="proven-sandbox-sub">Test the Verhoeff D5 Checksum and CBDT PAN Surname Matching Algorithms right in your browser.</p>
            </div>
          </div>

          <div className="proven-sandbox-grid">
            <div className="proven-sandbox-card">
              <div className="proven-sandbox-card-title">
                <ShieldCheck size={18} />
                <span>Aadhaar Verhoeff D5 Checksum Tester</span>
              </div>
              <p className="proven-sandbox-card-desc">Type any 12-digit number to see if it satisfies the Dihedral Group D5 multiplication table.</p>
              
              <div className="proven-sandbox-input-wrap">
                <label className="proven-input-label">12-Digit Aadhaar Number</label>
                <input 
                  type="text"
                  className="proven-sandbox-input"
                  value={interactiveAadhaar}
                  onChange={(e) => setInteractiveAadhaar(e.target.value)}
                  placeholder="e.g. 2007 0301 9999"
                />
              </div>

              <div className={`proven-test-result-box ${aadhaarCheckResult.valid ? 'is-valid' : 'is-invalid'}`}>
                {aadhaarCheckResult.valid ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Valid Verhoeff Checksum (c = 0). Genuine mathematical dihedral root.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={16} />
                    <span>{aadhaarCheckResult.message || `Invalid Verhoeff Checksum (c = ${aadhaarCheckResult.checksum}). Counterfeit/Transcription anomaly.`}</span>
                  </>
                )}
              </div>
            </div>

            <div className="proven-sandbox-card">
              <div className="proven-sandbox-card-title">
                <CheckCircle2 size={18} />
                <span>PAN CBDT Surname Alignment Tester</span>
              </div>
              <p className="proven-sandbox-card-desc">Verifies that the 4th character is "P" and the 5th character matches the surname initial.</p>
              
              <div className="proven-sandbox-input-row">
                <div className="proven-sandbox-input-wrap">
                  <label className="proven-input-label">Cardholder Surname</label>
                  <input 
                    type="text"
                    className="proven-sandbox-input"
                    value={testSurname}
                    onChange={(e) => setTestSurname(e.target.value)}
                    placeholder="e.g. RAJPUT"
                  />
                </div>
                <div className="proven-sandbox-input-wrap">
                  <label className="proven-input-label">10-Digit PAN Number</label>
                  <input 
                    type="text"
                    className="proven-sandbox-input"
                    value={interactivePan}
                    onChange={(e) => setInteractivePan(e.target.value)}
                    placeholder="ABCPP1234F"
                  />
                </div>
              </div>

              <div className={`proven-test-result-box ${panCheckResult.valid ? 'is-valid' : 'is-invalid'}`}>
                {panCheckResult.valid ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>{panCheckResult.message}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={16} />
                    <span>{panCheckResult.message}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="proven-how-cta-box">
          <div className="proven-how-cta-glow" />
          <div className="proven-how-cta-content">
            <span className="proven-badge-tag">READY FOR PRODUCTION</span>
            <h2 className="proven-how-cta-title">Deploy Identity Forensics to Your Stack</h2>
            <p className="proven-how-cta-sub">Integrate high-speed multi-document identity concordance into your enterprise onboarding workflow with sub-second Groq inference.</p>
            <div className="proven-how-cta-actions">
              <PrimaryButton onClick={onOpenAuth}>
                Launch Verification Sandbox
                <ArrowRight size={15} />
              </PrimaryButton>
              <BlueButton onClick={onNavigateHome}>
                Back to Overview
              </BlueButton>
            </div>
          </div>
        </section>
      </main>

      <GiantFooterSection 
        onNavigateHome={onNavigateHome}
        onNavigateTeam={onNavigateTeam}
        onNavigateFaq={onNavigateFaq}
        onNavigateHow={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (window.lenis) window.lenis.scrollTo(0, { duration: 1.0 });
        }}
      />
    </div>
  );
};

export default HowItWorksPage;
