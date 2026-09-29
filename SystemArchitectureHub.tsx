import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Lock,
  Layers,
  FileText,
  Search,
  Users,
  Database,
  Link2,
  ArrowRight,
  Play,
  Check,
  RefreshCw,
  Zap,
  Radio,
  FileCheck,
  Sparkles,
  Scale,
  DollarSign,
  Clock,
  ExternalLink,
  X
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { toast } from '../common/ToastContainer';
import { storageService } from '../../services/storageService';
import { auditService } from '../../services/auditService';

interface SystemArchitectureHubProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string, params?: any) => void;
}

export function SystemArchitectureHub({ isOpen, onClose, onNavigate }: SystemArchitectureHubProps) {
  const [activeTab, setActiveTab] = useState<'problem-solution' | 'workflow-simulator' | 'benefits' | 'tech-stack'>('problem-solution');

  // Interactive Simulator State
  const [selectedDocType, setSelectedDocType] = useState('border-memo');
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [generatedHash, setGeneratedHash] = useState('');
  const [generatedBlock, setGeneratedBlock] = useState(489320);

  if (!isOpen) return null;

  const sampleDocuments = [
    {
      id: 'border-memo',
      title: 'Sector 7 Border Surveillance Infiltration Intercept Memo',
      source: '7th Border Surveillance Battalion',
      classification: 'Top Secret // SAP',
      contentSample: 'Acoustic tripwire triggered at 02:44 hrs UTC. FLIR thermal pod #04 locked onto low-RCS quadcopter UAV dropping encrypted satellite transceivers.'
    },
    {
      id: 'fir-complaint',
      title: 'First Information Report (FIR): Corporate Extortion & Fraud',
      source: 'Metropolitan Police Dept - Special Crime Branch',
      classification: 'Restricted',
      contentSample: 'Complainant Shri R. K. Singhania alleges suspect Arjun Mehta fabricated board authorizations to siphon USD 1.4M into offshore shadow accounts.'
    },
    {
      id: 'sigint-transcript',
      title: 'Decrypted SIGINT Satellite Transmission Transcript',
      source: 'Joint Defence Intelligence & Cyber Agency',
      classification: 'Top Secret',
      contentSample: 'Intercepted Mil-Band 8.412 GHz downlink. Decrypted payload details coordinated clandestine supply drop at coordinates 34.1829° N, 74.8312° E.'
    },
    {
      id: 'forensic-scada',
      title: 'Forensic RAM Acquisition & SCADA Malware Disassembly',
      source: 'Central Forensic Science Laboratory',
      classification: 'Highly Restricted',
      contentSample: 'Industrial controller memory dump reveals zero-day ransomware payload weaponized against regional electrical grid telemetry loop.'
    }
  ];

  const workflowStages = [
    {
      step: 1,
      name: 'Document Upload / Scan',
      tech: 'Optical Scanning / High-Res Ingest',
      desc: 'Physical paper documents scanned with calibrated optical character capture; digital PDF/TIFF/audio assets ingested with immediate initial integrity fingerprinting.',
      icon: FileText
    },
    {
      step: 2,
      name: 'OCR & Data Extraction',
      tech: 'Deep OCR Engine & Layout Parser',
      desc: 'Machine-vision OCR extracts full text, tabular stamp records, signatures, and handwritten notes while preserving exact legal coordinate layout.',
      icon: Cpu
    },
    {
      step: 3,
      name: 'AI Classification & Redaction',
      tech: 'NLP Entity Extraction & Threat Classifier',
      desc: 'Natural Language Processing categorizes document type, extracts key suspects/dates/locations, scores confidentiality tier, and flags threat vectors.',
      icon: Sparkles
    },
    {
      step: 4,
      name: 'Secure Storage (Encrypted)',
      tech: 'AES-256 GCM + Hardware HSM Wrapping',
      desc: 'File payload encrypted at-rest using authenticated AES-256 GCM. Keys wrapped via Hardware Security Module (HSM) with optional air-gapped sovereign backup.',
      icon: Lock
    },
    {
      step: 5,
      name: 'Authorized Audit Access & Trail',
      tech: 'Permissioned Blockchain & Merkle Ledger',
      desc: 'Cryptographic SHA-256 hash anchored to immutable Byzantine Fault Tolerant blockchain. Generates Section 65B / Rule 902 evidentiary certificate.',
      icon: Link2
    }
  ];

  const runSimulation = () => {
    setIsSimulating(true);
    setCurrentStep(1);
    setSimulationComplete(false);
    setSimulationLogs(['[STAGE 1] Optical capture initialized. Ingesting raw document stream...']);

    const randomHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newBlock = 489320 + Math.floor(Math.random() * 50);
    setGeneratedHash(randomHash);
    setGeneratedBlock(newBlock);

    // Step 1 -> 2
    setTimeout(() => {
      setCurrentStep(2);
      setSimulationLogs((prev) => [
        ...prev,
        `[STAGE 1] Ingested 4.82 MB file. Initial SHA-256: ${randomHash.substring(0, 16)}...`,
        '[STAGE 2] Optical Character Recognition executing across 8 pages with 99.4% optical confidence...'
      ]);
    }, 1200);

    // Step 2 -> 3
    setTimeout(() => {
      setCurrentStep(3);
      setSimulationLogs((prev) => [
        ...prev,
        '[STAGE 2] OCR extracted 1,840 tokens, 6 GPS coordinates, and 2 handwritten signature bounding boxes.',
        '[STAGE 3] AI NLP Classification analyzing semantic entities and security clearance...'
      ]);
    }, 2400);

    // Step 3 -> 4
    setTimeout(() => {
      setCurrentStep(4);
      setSimulationLogs((prev) => [
        ...prev,
        '[STAGE 3] AI categorized document as: Verified Legal / Defense Evidentiary Asset. Threat Rating: HIGH.',
        '[STAGE 4] Engaging AES-256 GCM authenticated cipher envelope with HSM key wrapping...'
      ]);
    }, 3600);

    // Step 4 -> 5
    setTimeout(() => {
      setCurrentStep(5);
      setSimulationLogs((prev) => [
        ...prev,
        '[STAGE 4] AES-256 encryption complete. Ciphertext verified with 128-bit authentication tag.',
        `[STAGE 5] Transmitting cryptographic hash to Permissioned Blockchain Quorum (Block #${newBlock})...`
      ]);
    }, 4800);

    // Final completion
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationComplete(true);
      setSimulationLogs((prev) => [
        ...prev,
        `[SUCCESS] Merkle root notarized on immutable ledger. Section 65B legal certificate generated!`,
        `Blockchain Transaction: 0xJV2026_${randomHash.substring(0, 12).toUpperCase()}`
      ]);
      toast.success('Document successfully processed through full 5-stage secure pipeline!');

      // Record an audit event
      auditService.logEvent({
        action: 'DOCUMENT_UPLOAD',
        resourceType: 'DOCUMENT',
        resourceId: `SIM-${randomHash.substring(0, 8)}`,
        resourceName: sampleDocuments.find((d) => d.id === selectedDocType)?.title,
        result: 'Success',
        riskLevel: 'Low',
        details: `Simulated end-to-end ingest completed. SHA-256: ${randomHash.substring(0, 16)}... anchored to Block #${newBlock}`
      });
    }, 6000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-700 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight font-['Cinzel',serif]">
                  JusticeVault System Architecture
                </h2>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  v2.8 Zero-Trust
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Secure Digital Document Management System for Legal, Police, Court, Forensic & Defence Investigations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('problem-solution')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'problem-solution'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            The Problem & Our Solution
          </button>
          <button
            onClick={() => setActiveTab('workflow-simulator')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'workflow-simulator'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            5-Stage Workflow & Interactive Simulator
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'benefits'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Key Benefits & Legal Admissibility
          </button>
          <button
            onClick={() => setActiveTab('tech-stack')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'tech-stack'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4 text-indigo-400" />
            Technologies Used
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: PROBLEM & SOLUTION */}
          {activeTab === 'problem-solution' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* THE PROBLEM CARD */}
                <div className="bg-rose-950/20 border border-rose-500/30 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/40 text-rose-400 font-bold">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                          Critical Vulnerabilities
                        </span>
                        <h3 className="text-xl font-bold text-white font-['Cinzel',serif]">
                          THE PROBLEM
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Traditional paper-based jurisprudence and physical evidence lockups present systemic vulnerabilities that compromise investigations and judicial integrity.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-rose-500/20 space-y-1">
                        <p className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                          <span>⚠️</span> Physical Documents Prone to Loss, Tampering & Delay
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Fire, water damage, intentional page removal, handwritten alterations, ink aging, and misplacement in voluminous record rooms result in acquittals and compromised prosecutions.
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-rose-500/20 space-y-1">
                        <p className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                          <span>🔒</span> No Centralized, Secure Access for Authorized Agencies
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Siloed records across Police stations, Forensic Laboratories, Prosecutors, Courts, and Defense Intelligence prevent cross-agency collaboration and real-time verification.
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-rose-500/20 space-y-1">
                        <p className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                          <span>⏱️</span> Time-Consuming Retrieval Hampers Investigations
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Manual retrieval of case files takes days or weeks. Critical bail hearings, cross-border counter-terror operations, and suspect detainment deadlines are frequently missed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-rose-500/20 text-[11px] text-rose-300/80 flex items-center justify-between">
                    <span>Impact: 42% Trial Delays</span>
                    <span>High Risk of Evidence Suppression</span>
                  </div>
                </div>

                {/* OUR SOLUTION CARD */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40 text-emerald-400 font-bold">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                          Zero-Trust Architecture
                        </span>
                        <h3 className="text-xl font-bold text-white font-['Cinzel',serif]">
                          OUR SOLUTION
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      JusticeVault provides a cryptographically sovereign, centralized digital evidence ecosystem with mathematical tamper-resistance and unified inter-agency governance.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-emerald-500/20 space-y-1">
                        <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <span>🛡️</span> Secure Centralized Repository with Granular RBAC
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Multi-agency role federation (Investigator, Forensic Examiner, Prosecutor, Judge, Defense Officer) with 5 clearance levels from Restricted to Top Secret // SAP.
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-emerald-500/20 space-y-1">
                        <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <span>🔐</span> End-to-End AES-256 & PKI Digital Signatures
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Authenticated AES-256 GCM at-rest encryption, Ed25519 digital signature tokens, zero-knowledge Merkle proofs, and tamper-evident optical micro-watermarking.
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-emerald-500/20 space-y-1">
                        <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <span>⚡</span> Smart Search, Tagging & Automated Workflow
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Sub-100ms vector search across millions of OCR pages, automated entity extraction, judicial deadline alerts, and seamless multi-officer sign-off chains.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-emerald-500/20 text-[11px] text-emerald-300/80 flex items-center justify-between">
                    <span>Outcome: Instant &lt;100ms Query</span>
                    <span>100% Chain-of-Custody Integrity</span>
                  </div>
                </div>

              </div>

              {/* National Security & Defence Callout */}
              <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 p-6 rounded-3xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      National Security & Defence Intelligence Mission
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    Engineered to strengthen national borders with smart UAV aerial scans, biometric checkpoint validation, lawful SIGINT intercepts, and military-grade air-gapped sovereign HSM key vaults.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate?.('defence-intel');
                  }}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  Explore Defence Center
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: 5-STAGE WORKFLOW & SIMULATOR */}
          {activeTab === 'workflow-simulator' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  Core Ingestion Pipeline
                </span>
                <h3 className="text-xl font-bold text-white font-['Cinzel',serif] mt-0.5">
                  WORKFLOW: HOW IT WORKS
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Every legal, forensic, or intelligence document undergoes a rigorous 5-stage automated pipeline from physical scan to immutable blockchain notarization.
                </p>
              </div>

              {/* 5-Step Visualizer Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {workflowStages.map((stage) => {
                  const Icon = stage.icon;
                  const isActive = currentStep === stage.step;
                  const isDone = currentStep > stage.step || simulationComplete;
                  return (
                    <div
                      key={stage.step}
                      className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                        isActive
                          ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/20'
                          : isDone
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : 'bg-slate-800/50 border-slate-700/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-mono ${
                              isDone
                                ? 'bg-emerald-500 text-slate-950'
                                : isActive
                                ? 'bg-indigo-500 text-white animate-pulse'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {isDone ? <Check className="w-3.5 h-3.5" /> : stage.step}
                          </span>
                          <Icon
                            className={`w-4 h-4 ${
                              isDone ? 'text-emerald-400' : isActive ? 'text-indigo-400' : 'text-slate-400'
                            }`}
                          />
                        </div>
                        <p className="text-xs font-bold text-white">{stage.name}</p>
                        <p className="text-[10px] text-indigo-300 font-mono mt-0.5">{stage.tech}</p>
                        <p className="text-[11px] text-slate-400 mt-2 line-clamp-3">{stage.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Pipeline Simulator */}
              <div className="bg-slate-950/80 rounded-3xl p-6 border border-slate-800 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      Live Interactive Pipeline Simulator
                    </h4>
                    <p className="text-xs text-slate-400">
                      Select a sample document payload and execute the real-time ingest sequence.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={selectedDocType}
                      onChange={(e) => setSelectedDocType(e.target.value)}
                      disabled={isSimulating}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {sampleDocuments.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.title}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={runSimulation}
                      disabled={isSimulating}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
                        isSimulating
                          ? 'bg-indigo-900/50 text-indigo-300 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/30'
                      }`}
                    >
                      {isSimulating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Processing Stage {currentStep}...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Run Full Pipeline
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Selected Payload Details */}
                {(() => {
                  const doc = sampleDocuments.find((d) => d.id === selectedDocType);
                  return (
                    <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">
                          Selected Ingest Payload:
                        </span>
                        <p className="font-semibold text-white mt-0.5">{doc?.title}</p>
                        <p className="text-[11px] text-slate-400 italic mt-0.5">"{doc?.contentSample}"</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="blue" size="sm">
                          {doc?.source}
                        </Badge>
                        <Badge variant="purple" size="sm">
                          {doc?.classification}
                        </Badge>
                      </div>
                    </div>
                  );
                })()}

                {/* Pipeline Live Terminal Output */}
                <div className="bg-black/80 rounded-2xl p-4 font-mono text-xs border border-slate-800/80 space-y-1.5 max-h-56 overflow-y-auto">
                  <div className="text-[11px] text-slate-400 pb-1 border-b border-slate-800 flex items-center justify-between">
                    <span>TERMINAL CONSOLE // JUSTICEVAULT SECURE INGEST ENGINE</span>
                    <span className="text-emerald-400">IBFT BLOCKCHAIN ONLINE</span>
                  </div>
                  {simulationLogs.length === 0 ? (
                    <p className="text-slate-400 py-4 text-center italic">
                      Click "Run Full Pipeline" to observe OCR, NLP classification, AES-256 encryption, and blockchain block anchoring in real time.
                    </p>
                  ) : (
                    simulationLogs.map((log, index) => (
                      <div
                        key={index}
                        className={`text-[11px] ${
                          log.includes('[SUCCESS]')
                            ? 'text-emerald-400 font-bold'
                            : log.includes('[STAGE 1]')
                            ? 'text-sky-300'
                            : log.includes('[STAGE 2]')
                            ? 'text-indigo-300'
                            : log.includes('[STAGE 3]')
                            ? 'text-violet-300'
                            : log.includes('[STAGE 4]')
                            ? 'text-amber-300'
                            : log.includes('[STAGE 5]')
                            ? 'text-cyan-300'
                            : 'text-slate-300'
                        }`}
                      >
                        {log}
                      </div>
                    ))
                  )}
                </div>

                {simulationComplete && (
                  <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-in fade-in">
                    <div>
                      <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Section 65B Electronic Evidence Certificate Sealed
                      </p>
                      <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                        SHA-256: {generatedHash}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Anchored to Merkle Root Block #{generatedBlock} • Legally Admissible Self-Authenticating Record
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onNavigate?.('audit');
                      }}
                      className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold border border-emerald-500/40 transition shrink-0 cursor-pointer"
                    >
                      View in Audit Trail →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BENEFITS */}
          {activeTab === 'benefits' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                  Value Realization
                </span>
                <h3 className="text-xl font-bold text-white font-['Cinzel',serif] mt-0.5">
                  SYSTEM BENEFITS & LEGAL ADMISSIBILITY
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Engineered strictly around high-court jurisprudence, military standards, and cross-departmental prosecutorial workflows.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Enhanced Data Security & Integrity</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Zero-trust architecture ensures files are immune to physical theft, unauthorized editing, or malicious tampering. Any single bit inversion automatically triggers system-wide quarantine.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Faster Document Retrieval (&lt;100ms)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Replaces multi-week manual archival search with instant deep full-text indexing, entity filters, and biometric hash lookups across millions of pages in sub-second response times.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Legal Admissibility Ensured</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automates generation of Section 65B (Indian Evidence Act) and Federal Rules of Evidence 902(13)/(14) self-authenticating certificates backed by mathematically verified blockchain notary.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Inter-Department Collaboration</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Unifies Police, Central Forensic Labs, Public Prosecutors, High Court Judges, and Defense Intelligence under a secure role-based sharing model with complete custody chain auditability.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Reduced Physical Storage & Costs</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Eliminates expensive climate-controlled paper archives, courier transit risks, and lost-document retrial costs by transitioning 85%+ of evidentiary assets to encrypted sovereign storage.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Tamper-Proof Digital Signatures</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ed25519 asymmetric cryptographic signing binds the exact officer identity, timestamp, and judicial capacity to the document payload, preventing repudiation in court.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: TECHNOLOGIES USED */}
          {activeTab === 'tech-stack' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">
                  Technical Architecture
                </span>
                <h3 className="text-xl font-bold text-white font-['Cinzel',serif] mt-0.5">
                  TECHNOLOGIES USED
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Built with state-of-the-art cryptographic primitives, neural NLP models, and fault-tolerant distributed consensus.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Tech 1 */}
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                        AI
                      </div>
                      <h4 className="text-sm font-bold text-white">AI / ML (NLP, OCR, Neural Vision)</h4>
                    </div>
                    <Badge variant="blue" size="sm">Deep Learning</Badge>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    <li>Optical Character Recognition (OCR) with multi-language judicial typography support.</li>
                    <li>Named Entity Recognition (NER) extracting suspects, companies, financial accounts, and dates.</li>
                    <li>Automated redaction engine for PII and juvenile witness confidentiality protection.</li>
                    <li>Threat anomaly scoring and foreign intelligence signal categorization.</li>
                  </ul>
                </div>

                {/* Tech 2 */}
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                        BC
                      </div>
                      <h4 className="text-sm font-bold text-white">Blockchain (Audit Trail & Merkle Tree)</h4>
                    </div>
                    <Badge variant="purple" size="sm">IBFT Quorum</Badge>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    <li>Permissioned Byzantine Fault Tolerant (IBFT) consensus across 4 validated nodes.</li>
                    <li>Immutable append-only ledger recording all views, exports, transfers, and signatures.</li>
                    <li>Cryptographic Merkle roots allowing instant zero-knowledge integrity verification.</li>
                    <li>Permanent protection against administrator tampering or retrospective back-dating.</li>
                  </ul>
                </div>

                {/* Tech 3 */}
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                        ENC
                      </div>
                      <h4 className="text-sm font-bold text-white">Encryption (AES-256 GCM & Ed25519 PKI)</h4>
                    </div>
                    <Badge variant="green" size="sm">FIPS 140-2</Badge>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    <li>AES-256 GCM authenticated encryption at rest with 128-bit integrity tag.</li>
                    <li>Hardware Security Module (HSM) master key wrapping with zero cleartext key exposure.</li>
                    <li>Ed25519 elliptic curve digital signatures for all investigating officers and judges.</li>
                    <li>TLS 1.3 encrypted transit tunnels between police stations and court registries.</li>
                  </ul>
                </div>

                {/* Tech 4 */}
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                        RBAC
                      </div>
                      <h4 className="text-sm font-bold text-white">Role-Based Access Control (RBAC)</h4>
                    </div>
                    <Badge variant="yellow" size="sm">Zero-Trust</Badge>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    <li>Multi-tier access separation: Administrator, Officer, Forensic, Prosecutor, Judge, Defence.</li>
                    <li>National Security Clearance Tiers: Restricted, Confidential, Secret, Top Secret // SAP.</li>
                    <li>Mandatory multi-factor authentication (MFA) and hardware token step-up for exports.</li>
                    <li>Session timeout, anomaly detection, and automated geo-fenced access revocation.</li>
                  </ul>
                </div>

                {/* Tech 5 */}
                <div className="md:col-span-2 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-xs">
                        STO
                      </div>
                      <h4 className="text-sm font-bold text-white">Cloud / On-Premise Air-Gapped Hybrid Storage</h4>
                    </div>
                    <Badge variant="blue" size="sm">Sovereign Cloud</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
                      <p className="font-bold text-white mb-1">Local / Edge Cache</p>
                      <p className="text-[11px] text-slate-400">Station-level write-once buffer for rapid document ingestion during field raids and border checkpoints.</p>
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
                      <p className="font-bold text-white mb-1">Sovereign Judicial Cloud</p>
                      <p className="text-[11px] text-slate-400">High-availability geo-replicated encrypted storage accessible strictly by authorized prosecution and judiciary.</p>
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
                      <p className="font-bold text-white mb-1">Air-Gapped Cold Vault</p>
                      <p className="text-[11px] text-slate-400">Physically isolated military bunker archive for Top Secret intelligence and historical judicial case records.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Architecture fully compliant with Section 65B, ISO 27001, and FIPS 140-2</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigate?.('defence-intel');
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/25 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5" />
              Open Defence Intelligence Center
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
