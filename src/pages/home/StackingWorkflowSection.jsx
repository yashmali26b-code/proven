import React from 'react';
import './StackingWorkflowSection.css';
import workflowImg1 from '../../assets/generated/workflow1_railway_cloud.jpg';
import workflowImg2 from '../../assets/generated/workflow2_matrix_graph.jpg';
import workflowImg3 from '../../assets/generated/workflow3_dossier_kyc.jpg';
import { ArrowRight } from 'lucide-react';

export const StackingWorkflowSection = () => {
  const workflows = [
    {
      img: workflowImg1,
      title: 'High-Performance Cloud Infrastructure',
      desc: 'Hosted seamlessly on Railway with dedicated FastAPI microservices, asynchronous image processing queues, and high-throughput GPU model inference for sub-second forensic verification.',
      linkText: 'Explore Railway Architecture'
    },
    {
      img: workflowImg2,
      title: 'Cross-Document Anomaly Radar',
      desc: 'Constructs an interconnected mathematical identity graph across Aadhaar, PAN, College ID, and Passport. Instantly pinpoints 1-year DOB conflicts, phonetic name drift, and swapped photo embeddings.',
      linkText: 'View Identity Matrix Engine'
    },
    {
      img: workflowImg3,
      title: 'Explainable Forensic KYC Reports',
      desc: 'Generates bank-grade, blockchain-anchored compliance dossiers with an itemized 0–100% confidence breakdown, QR signature proofs, and one-click exportable PDF audit trails.',
      linkText: 'Generate Audit Report'
    }
  ];

  return (
    <section className="proven-stacking-section" id="how-it-works">
      <div className="proven-stacking-inner">
        <div className="proven-section-badge-center">
          <div className="proven-badge-dot" />
          <span className="proven-badge-text-tag">How PROVEN Works</span>
        </div>

        <h2 className="proven-stacking-title">
          One workflow for every
          <span>identity risk.</span>
        </h2>

        <div className="proven-stacking-cards-wrapper">
          {workflows.map((wf, idx) => (
            <div 
              key={idx} 
              className="proven-workflow-card"
              style={{ zIndex: 10 + idx }}
            >
              <div className="proven-workflow-img-box">
                <img src={wf.img} alt={wf.title} className="proven-workflow-img" />
              </div>
              <div className="proven-workflow-info">
                <h3 className="proven-workflow-title">{wf.title}</h3>
                <p className="proven-workflow-desc">{wf.desc}</p>
                <a 
                  href="#how-it-works" 
                  className="proven-workflow-link"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.querySelector('#how-it-works');
                    if (el && window.lenis) {
                      window.lenis.scrollTo(el, { offset: -30, duration: 1.0 });
                    }
                  }}
                >
                  <span>{wf.linkText}</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StackingWorkflowSection;
