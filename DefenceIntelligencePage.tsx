import React, { useState } from 'react';
import {
  Shield,
  Radio,
  Eye,
  Cpu,
  Lock,
  Layers,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Crosshair,
  Satellite,
  Compass,
  Zap,
  Activity,
  ChevronRight,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  Terminal,
  Server,
  Share2,
  FileCheck,
  Send,
  MapPin,
  Clock,
  KeyRound,
  FileSpreadsheet
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { toast } from '../components/common/ToastContainer';
import { storageService } from '../services/storageService';
import { auditService } from '../services/auditService';
import { BorderInterceptRecord, SigintRecord, DefenceIntelDossier, User } from '../types';

interface DefenceIntelligencePageProps {
  currentUser: User;
  onNavigate?: (page: string, params?: any) => void;
}

export function DefenceIntelligencePage({ currentUser, onNavigate }: DefenceIntelligencePageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'border-surveillance' | 'ai-defence' | 'sigint-data' | 'operations-dossiers'>('overview');
  
  const [borderIntercepts, setBorderIntercepts] = useState<BorderInterceptRecord[]>(() => storageService.getBorderIntercepts());
  const [sigintRecords, setSigintRecords] = useState<SigintRecord[]>(() => storageService.getSigintRecords());
  const [defenceDossiers, setDefenceDossiers] = useState<DefenceIntelDossier[]>(() => storageService.getDefenceDossiers());

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThreatFilter, setSelectedThreatFilter] = useState<'All' | 'Critical' | 'High' | 'Medium'>('All');

  // Interactive Action Modals / State
  const [selectedDossier, setSelectedDossier] = useState<DefenceIntelDossier | null>(null);
  const [selectedIntercept, setSelectedIntercept] = useState<BorderInterceptRecord | null>(null);
  const [selectedSigint, setSelectedSigint] = useState<SigintRecord | null>(null);
  
  // Interactive Simulation State
  const [isDeciphering, setIsDeciphering] = useState<string | null>(null);
  const [isSyncingVault, setIsSyncingVault] = useState(false);
  const [newInterceptModal, setNewInterceptModal] = useState(false);
  const [newInterceptForm, setNewInterceptForm] = useState({
    checkpointName: 'Sector 7 High-Altitude Pass',
    sector: 'Northern Frontier Command',
    interceptType: 'UAV Drone Sighting' as BorderInterceptRecord['interceptType'],
    threatSeverity: 'Critical' as BorderInterceptRecord['threatSeverity'],
    suspectEntityOrVehicle: '',
    coordinates: '34.2215° N, 74.5290° E',
    details: ''
  });

  const isDefenceAuthorized = ['Defence Officer', 'Administrator', 'Investigating Officer'].includes(currentUser.role);

  // Handle Quick Action: Air-Gapped HSM Vault Resync
  const handleResyncAirGappedVault = () => {
    setIsSyncingVault(true);
    setTimeout(() => {
      setIsSyncingVault(false);
      toast.success('Air-Gapped Sovereign Vault re-synchronized. All cryptographic tokens verified.');
      auditService.logEvent({
        action: 'SECURITY_ALERT',
        resourceType: 'SYSTEM',
        resourceId: 'HSM-VAULT-DEF',
        resourceName: 'Air-Gapped Sovereign Military Key Vault',
        result: 'Success',
        riskLevel: 'Low',
        details: `Manual zero-trust cryptographic audit sync executed by ${currentUser.fullName}`
      });
    }, 1500);
  };

  // Handle Decrypt Signal via AI Lattice Engine
  const handleDecryptSignal = (sigId: string) => {
    setIsDeciphering(sigId);
    setTimeout(() => {
      setIsDeciphering(null);
      setSigintRecords((prev) =>
        prev.map((s) => (s.id === sigId ? { ...s, decryptionStatus: 'Cracked (AI Lattice Engine)' } : s))
      );
      toast.success('AI Neural Lattice completed cryptanalysis. Decrypted payload available.');
      auditService.logEvent({
        action: 'DOCUMENT_VIEW',
        resourceType: 'DOCUMENT',
        resourceId: sigId,
        resourceName: `SIGINT Record ${sigId}`,
        result: 'Success',
        riskLevel: 'Medium',
        details: `Neural cryptanalysis payload extraction authorized under Section 65B by ${currentUser.fullName}`
      });
    }, 1800);
  };

  // Handle New Intercept Submission
  const handleCreateIntercept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterceptForm.suspectEntityOrVehicle || !newInterceptForm.details) {
      toast.error('Please enter all required fields.');
      return;
    }

    const randomHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newRecord: BorderInterceptRecord = {
      id: `BRD-00${borderIntercepts.length + 1}`,
      checkpointId: `CP-FIELD-${Math.floor(Math.random() * 90 + 10)}`,
      checkpointName: newInterceptForm.checkpointName,
      sector: newInterceptForm.sector,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      interceptType: newInterceptForm.interceptType,
      threatSeverity: newInterceptForm.threatSeverity,
      suspectEntityOrVehicle: newInterceptForm.suspectEntityOrVehicle,
      coordinates: newInterceptForm.coordinates,
      evidenceHash: randomHash,
      blockchainBlock: 489325 + borderIntercepts.length,
      status: 'Escalated to Military Intel',
      details: newInterceptForm.details,
      assignedUnit: 'Rapid Counter-Infiltration Strike Team'
    };

    storageService.addBorderIntercept(newRecord);
    setBorderIntercepts(storageService.getBorderIntercepts());
    setNewInterceptModal(false);
    setNewInterceptForm({
      checkpointName: 'Sector 7 High-Altitude Pass',
      sector: 'Northern Frontier Command',
      interceptType: 'UAV Drone Sighting',
      threatSeverity: 'Critical',
      suspectEntityOrVehicle: '',
      coordinates: '34.2215° N, 74.5290° E',
      details: ''
    });
    toast.success(`Border intercept logged to Blockchain block #${newRecord.blockchainBlock}!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Defence Operations Command Bar */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Subtle glowing accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                DEFCON 2 // HIGH ALERT STATUS
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-[11px] font-mono text-cyan-300 flex items-center gap-1">
                <Satellite className="w-3.5 h-3.5 text-cyan-400" />
                GEO-SYNCHRONOUS ORBIT (SAT-NET 09 ACTIVE)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Cinzel',serif] flex items-center gap-3">
              National Security & Defence Intelligence Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
              Centralized sovereign repository for smart border surveillance, AI threat detection, decrypted SIGINT intercepts, and multi-agency joint defense campaigns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleResyncAirGappedVault}
              disabled={isSyncingVault}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Lock className={`w-3.5 h-3.5 text-cyan-400 ${isSyncingVault ? 'animate-spin' : ''}`} />
              {isSyncingVault ? 'Syncing Air-Gap...' : 'Air-Gap HSM Status: Sealed'}
            </button>

            <button
              onClick={() => setNewInterceptModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-cyan-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Log Border Intercept
            </button>
          </div>
        </div>

        {/* Quick Metric Bento Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800/80">
          <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Active Borders</span>
            <p className="text-xl font-bold text-white mt-1">4 Sectors</p>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> FLIR & LiDAR Online
            </span>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">SIGINT Intercepts</span>
            <p className="text-xl font-bold text-cyan-300 mt-1">{sigintRecords.length} Streams</p>
            <span className="text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5">
              <Radio className="w-3 h-3 animate-pulse" /> Mil X-Band Decrypted
            </span>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">AI Threat Score</span>
            <p className="text-xl font-bold text-rose-400 mt-1">94 / 100</p>
            <span className="text-[10px] text-rose-300 flex items-center gap-1 mt-0.5">
              <AlertTriangle className="w-3 h-3" /> Critical Drone Infiltration
            </span>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Joint Operations</span>
            <p className="text-xl font-bold text-indigo-300 mt-1">{defenceDossiers.length} Active</p>
            <span className="text-[10px] text-indigo-400 flex items-center gap-1 mt-0.5">
              <Shield className="w-3 h-3" /> Multi-Agency Synchronized
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'border-cyan-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4 text-cyan-400" />
          Strengthening National Security
        </button>

        <button
          onClick={() => setActiveTab('border-surveillance')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'border-surveillance'
              ? 'border-cyan-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye className="w-4 h-4 text-emerald-400" />
          Smart Surveillance & Border Management
        </button>

        <button
          onClick={() => setActiveTab('ai-defence')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'ai-defence'
              ? 'border-cyan-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4 text-violet-400" />
          AI-Powered Defence Technologies
        </button>

        <button
          onClick={() => setActiveTab('sigint-data')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'sigint-data'
              ? 'border-cyan-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-4 h-4 text-amber-400" />
          Communication & Data Intelligence (SIGINT)
        </button>

        <button
          onClick={() => setActiveTab('operations-dossiers')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'operations-dossiers'
              ? 'border-cyan-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Crosshair className="w-4 h-4 text-rose-400" />
          Intelligence System for Defence Operations
        </button>
      </div>

      {/* TAB 1: OVERVIEW & STRENGTHENING NATIONAL SECURITY */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* National Security Strategic Pillars (Span 2) */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                    Sovereign Mandate
                  </span>
                  <h3 className="text-lg font-bold text-white font-['Cinzel',serif] mt-0.5">
                    Strengthening National Security Protocols
                  </h3>
                </div>
                <Badge variant="blue" size="sm">Directive 77B Certified</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <Shield className="w-4 h-4" />
                    <span>Air-Gapped Sovereign HSM Vault</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    All high-grade defense dossiers, wiretap transcripts, and tactical maps are anchored in physical air-gapped bunkers with threshold multi-party Ed25519 authorization.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Eye className="w-4 h-4" />
                    <span>Real-Time Perimeter Neural Grid</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Integrated FLIR infrared cameras, acoustic sensors, and UAV radars stream telemetry into automated neural threat-correlation nodes to detect unauthorized border crossings.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-violet-400 font-bold text-xs">
                    <Radio className="w-4 h-4" />
                    <span>Autonomous SIGINT Decryption</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Real-time intercept of military X-band satellite downlinks and burst transceivers; automated lattice decryption engine extracts rendezvous coordinates and enemy calls.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Layers className="w-4 h-4" />
                    <span>Cross-Agency Judicial Chain</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Defense telemetry and contraband physical seizures are cryptographically committed to the permissioned blockchain ledger, ensuring unquestionable Section 65B court admissibility.
                  </p>
                </div>
              </div>

              {/* Case Linkage */}
              <div className="p-4 bg-indigo-950/30 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">
                    Primary Active Defense Case:
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5">
                    Case JV-DEF-2026-009: Operation Sentinel - Transnational Border Infiltration
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Lead Officer: Col. Devendra Rathore • 7 Classified Documents • Top Secret // SAP
                  </p>
                </div>
                <button
                  onClick={() => onNavigate?.('cases', { caseId: 'CASE-005' })}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer"
                >
                  Open Case File →
                </button>
              </div>
            </div>

            {/* Theatre Threat Radar (Span 1) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                    Sector Radar
                  </span>
                  <span className="text-xs font-mono text-slate-400">LIVE FEED</span>
                </div>

                {/* Simulated Radar Display */}
                <div className="w-full aspect-square max-w-[240px] mx-auto rounded-full border border-cyan-500/40 relative flex items-center justify-center p-4 bg-cyan-950/10 overflow-hidden">
                  <div className="absolute inset-0 rounded-full border border-cyan-500/20 scale-75" />
                  <div className="absolute inset-0 rounded-full border border-cyan-500/10 scale-50" />
                  <div className="absolute w-full h-0.5 bg-cyan-500/20" />
                  <div className="absolute h-full w-0.5 bg-cyan-500/20" />
                  
                  {/* Rotating sweep line */}
                  <div className="absolute inset-0 rounded-full animate-spin [animation-duration:4s] border-r-2 border-r-cyan-400/80 bg-gradient-to-tr from-transparent via-transparent to-cyan-500/20 pointer-events-none" />

                  {/* Radar Blips */}
                  <div className="absolute top-1/4 left-1/3 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                  <div className="absolute top-1/4 left-1/3 w-2.5 h-2.5 bg-rose-500 rounded-full shadow-lg shadow-rose-500" title="UAV Drone Sighting (Sector 7)" />
                  
                  <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-amber-400 rounded-full shadow-lg shadow-amber-400" title="Maritime Cargo Radar" />
                  <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400" title="Checkpoint Bravo Post" />

                  <span className="text-[10px] font-mono text-cyan-300 z-10 bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    SWEEP: 360°
                  </span>
                </div>

                <div className="space-y-2 mt-4 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Sector 7 High Pass
                    </span>
                    <span className="font-mono text-rose-400 font-bold">UAV Breach</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Marine Gate 4
                    </span>
                    <span className="font-mono text-amber-300">Cargo Scrambler</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Northern Alpine Bravo
                    </span>
                    <span className="font-mono text-cyan-300">Biometric Audit</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('border-surveillance')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-semibold border border-cyan-500/30 transition cursor-pointer text-center mt-2"
              >
                Inspect All Checkpoints →
              </button>
            </div>

          </div>

          {/* Defence Operations Dossiers Preview Strip */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-wider">
                  Operational Campaign Briefings
                </span>
                <h3 className="text-base font-bold text-white font-['Cinzel',serif] mt-0.5">
                  Intelligence System for Defence Operations (Active Dossiers)
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('operations-dossiers')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                View Full Dossiers →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {defenceDossiers.map((dossier) => (
                <div
                  key={dossier.id}
                  onClick={() => setSelectedDossier(dossier)}
                  className="p-4 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={dossier.threatLevel === 'Critical' ? 'red' : 'yellow'} size="sm">
                      {dossier.threatLevel}
                    </Badge>
                    <span className="text-[10px] font-mono text-slate-400">{dossier.id}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                      {dossier.operationCodename}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{dossier.summary}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Threat: {dossier.aiThreatScore}%</span>
                    <span className="text-cyan-400 group-hover:translate-x-0.5 transition flex items-center gap-1">
                      Details <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SMART SURVEILLANCE & BORDER MANAGEMENT */}
      {activeTab === 'border-surveillance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                Frontier Reconnaissance
              </span>
              <h3 className="text-xl font-bold text-white font-['Cinzel',serif] mt-0.5">
                Smart Surveillance & Border Management
              </h3>
              <p className="text-xs text-slate-400">
                Automated ANPR vehicle identification, FLIR nocturnal thermal sweeps, and biometric passport chip verification.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedThreatFilter('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedThreatFilter === 'All' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                All Records
              </button>
              <button
                onClick={() => setSelectedThreatFilter('Critical')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedThreatFilter === 'Critical' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Critical Only
              </button>
              <button
                onClick={() => setNewInterceptModal(true)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ml-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Intercept
              </button>
            </div>
          </div>

          {/* Intercepts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {borderIntercepts
              .filter((rec) => selectedThreatFilter === 'All' || rec.threatSeverity === selectedThreatFilter)
              .map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl space-y-4 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-cyan-400 font-bold">{rec.checkpointId}</span>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-xs text-slate-300 font-semibold">{rec.checkpointName}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {rec.interceptType}
                        <Badge
                          variant={rec.threatSeverity === 'Critical' ? 'red' : 'yellow'}
                          size="sm"
                        >
                          {rec.threatSeverity}
                        </Badge>
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                      Block #{rec.blockchainBlock}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                    {rec.details}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400">Suspect / Asset:</span>
                      <p className="text-slate-200 font-medium truncate">{rec.suspectEntityOrVehicle}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400">Coordinates:</span>
                      <p className="text-cyan-300 font-mono">{rec.coordinates}</p>
                    </div>
                  </div>

                  {rec.biometricMatchConfidence !== undefined && (
                    <div className="p-2.5 bg-rose-950/20 border border-rose-500/30 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-rose-300 font-semibold">3D Biometric Facial Mesh Match:</span>
                      <span className="font-mono font-bold text-rose-400">{rec.biometricMatchConfidence}% (Severe Anomaly)</span>
                    </div>
                  )}

                  {rec.anprLicensePlate && (
                    <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-amber-300 font-semibold">ANPR Plate Detected:</span>
                      <span className="font-mono font-bold text-amber-200 bg-slate-900 px-2 py-0.5 rounded border border-amber-500/40">
                        {rec.anprLicensePlate}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono text-[10px]">
                      Hash: {rec.evidenceHash.substring(0, 16)}...
                    </span>
                    <button
                      onClick={() => {
                        toast.success(`Exporting Section 65B certified chain-of-custody for ${rec.id}`);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      Audit Proof <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: AI-POWERED DEFENCE TECHNOLOGIES */}
      {activeTab === 'ai-defence' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-violet-400 uppercase font-bold tracking-wider">
                Autonomous Defense Systems
              </span>
              <h3 className="text-xl font-bold text-white font-['Cinzel',serif] mt-0.5">
                AI-Powered Defence Technologies
              </h3>
              <p className="text-xs text-slate-400">
                Machine learning algorithms for predictive threat scoring, ballistic fingerprint verification, and synthetic aperture radar (SAR) feature segmentation.
              </p>
            </div>
            <Badge variant="purple" size="sm">Neural Core v4.1 Active</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* AI Module 1: Threat Anomaly Engine */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white font-['Cinzel',serif]">
                  Predictive Infiltration Neural Classifier
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Processes multi-spectral drone video streams and acoustic tripwires along 400km of border perimeters, automatically tagging unauthorized nocturnal movements.
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Sector 7 Infiltration Risk</span>
                    <span className="font-mono text-rose-400 font-bold">94.2% [CRITICAL]</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full w-[94%]" />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">Coastal Marine Vulnerability</span>
                    <span className="font-mono text-amber-400 font-bold">62.8% [MODERATE]</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[63%]" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => toast.success('Neural threat weights updated from Joint Satellite Reconnaissance.')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl transition cursor-pointer"
              >
                Re-calibrate Neural Weights
              </button>
            </div>

            {/* AI Module 2: SAR Radar Segmentation */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Satellite className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white font-['Cinzel',serif]">
                  Synthetic Aperture Radar (SAR) Subsurface Detection
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Analyzes Sentinel-9 UAV radar passes to penetrate camouflage, foliage, and soil up to 5 meters, mapping covert underground tunnel entries.
                </p>

                <div className="p-3 bg-slate-950/80 rounded-2xl border border-cyan-500/30 text-xs space-y-1">
                  <div className="flex items-center justify-between text-cyan-300 font-mono text-[11px]">
                    <span>SAR Scan #8819:</span>
                    <span className="text-emerald-400">ANOMALY CONFIRMED</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Linear density void detected at 4.2m depth extending 320 meters past the international border line.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate?.('documents', { docId: 'DOC-012' })}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 rounded-xl transition cursor-pointer"
              >
                View SAR Telemetry File (DOC-012)
              </button>
            </div>

            {/* AI Module 3: Ballistic & Clandestine Weapon Matching */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Crosshair className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white font-['Cinzel',serif]">
                  Automated Ballistic & Micro-Striae Matching
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  High-resolution 3D optical profilometry compares breech-face marks and firing pin impressions from seized munitions against the National Ballistic Database.
                </p>

                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-indigo-300 font-mono text-[11px]">
                    <span>Cartridge ID #762-SEIZED:</span>
                    <span className="text-rose-400 font-bold">MATCH: SYNDICATE K</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    99.1% optical striation match with shell casings recovered in Harbor Narcotics Seizure (CASE-004).
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate?.('evidence')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-indigo-300 rounded-xl transition cursor-pointer"
              >
                Open Evidence Locker →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: COMMUNICATION AND DATA INTELLIGENCE (SIGINT) */}
      {activeTab === 'sigint-data' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                Signals & Spectrum Intelligence
              </span>
              <h3 className="text-xl font-bold text-white font-['Cinzel',serif] mt-0.5">
                Communication and Data Intelligence (SIGINT / COMINT)
              </h3>
              <p className="text-xs text-slate-400">
                Lawful military wiretaps, satellite carrier downlinks, and encrypted darknet mesh node communications decrypted under Section 65B judicial authority.
              </p>
            </div>
            <Badge variant="yellow" size="sm">Lawful Intercept Warrant Active</Badge>
          </div>

          <div className="space-y-4">
            {sigintRecords.map((sig) => (
              <div
                key={sig.id}
                className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Radio className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">{sig.interceptFrequency}</span>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-xs text-slate-300 font-semibold">{sig.protocol}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{sig.originGeoEstimate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={sig.classification.includes('SAP') ? 'red' : 'purple'} size="sm">
                      {sig.classification}
                    </Badge>
                    <Badge
                      variant={sig.decryptionStatus.includes('Cracked') ? 'green' : 'yellow'}
                      size="sm"
                    >
                      {sig.decryptionStatus}
                    </Badge>
                  </div>
                </div>

                {/* Transcript Box */}
                <div className="p-4 bg-black/70 rounded-2xl border border-slate-800/80 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                    <span>RAW DECRYPTED AUDIO / DATA STREAM</span>
                    <span className="text-amber-400">{sig.capturedTimestamp}</span>
                  </div>
                  <p className="text-amber-200/90 leading-relaxed italic">
                    {sig.rawTranscriptSnippet}
                  </p>
                </div>

                {/* Metadata details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Cipher Envelope:</span>
                    <p className="text-slate-200 font-mono text-[11px] mt-0.5">{sig.encryptionCipher}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Judicial Warrant:</span>
                    <p className="text-slate-200 font-mono text-[11px] mt-0.5">{sig.judicialWarrantNumber}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Extracted Keywords:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sig.extractedKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-2 py-0.5 bg-slate-800 text-cyan-300 rounded text-[10px] font-mono"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-400">
                    Blockchain TX: {sig.blockchainTx}
                  </span>

                  {sig.decryptionStatus !== 'Cracked (AI Lattice Engine)' ? (
                    <button
                      onClick={() => handleDecryptSignal(sig.id)}
                      disabled={isDeciphering === sig.id}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Cpu className={`w-3.5 h-3.5 ${isDeciphering === sig.id ? 'animate-spin' : ''}`} />
                      {isDeciphering === sig.id ? 'Analyzing Lattice...' : 'Run Neural Decrypt'}
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate?.('documents', { docId: 'DOC-010' })}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      View Certified Transcript (DOC-010)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INTELLIGENCE SYSTEM FOR DEFENCE OPERATIONS */}
      {activeTab === 'operations-dossiers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                Multi-Agency Command
              </span>
              <h3 className="text-xl font-bold text-white font-['Cinzel',serif] mt-0.5">
                Intelligence System for Defence Operations (Joint Task Forces)
              </h3>
              <p className="text-xs text-slate-400">
                Unified operational coordination between Army Border Command, Naval Coast Guard, Cyber Defense Agency, and State Police.
              </p>
            </div>
            <Badge variant="red" size="sm">3 Synchronized Theatres</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {defenceDossiers.map((dos) => (
              <div
                key={dos.id}
                className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-rose-400">{dos.id}</span>
                    <Badge variant={dos.threatLevel === 'Critical' ? 'red' : 'yellow'} size="sm">
                      {dos.threatLevel}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white font-['Cinzel',serif]">
                      {dos.operationCodename}
                    </h4>
                    <p className="text-xs text-cyan-300 font-mono mt-0.5">{dos.theatre}</p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{dos.summary}</p>

                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Key Intelligence Findings:</span>
                    <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc pl-4">
                      {dos.keyIntelligenceFindings.map((finding, idx) => (
                        <li key={idx}>{finding}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-1 text-xs">
                    <span className="text-[10px] font-mono text-indigo-300 uppercase font-bold">
                      Participating Agencies:
                    </span>
                    <p className="text-[11px] text-slate-300">
                      {dos.participatingAgencies.join(' • ')}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Sat-Sync: {dos.lastSatelliteSync.substring(11, 19)}</span>
                    <span className="text-emerald-400">Vault: {dos.airGappedVaultStatus}</span>
                  </div>

                  <button
                    onClick={() => {
                      toast.success(`Quick-Reaction Force (QRF) dispatch simulation acknowledged for ${dos.operationCodename}`);
                      auditService.logEvent({
                        action: 'SECURITY_ALERT',
                        resourceType: 'SYSTEM',
                        resourceId: dos.id,
                        resourceName: dos.operationCodename,
                        result: 'Success',
                        riskLevel: 'High',
                        details: `Tactical military directive execution initiated by ${currentUser.fullName}`
                      });
                    }}
                    className="w-full py-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Dispatch Tactical Directive
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: LOG NEW BORDER INTERCEPT */}
      {newInterceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white font-['Cinzel',serif]">
                  Log New Border Surveillance Intercept
                </h3>
                <p className="text-xs text-slate-400">
                  Record field reconnaissance telemetry into the immutable blockchain ledger.
                </p>
              </div>
              <button
                onClick={() => setNewInterceptModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIntercept} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Checkpoint / Outpost
                  </label>
                  <input
                    type="text"
                    value={newInterceptForm.checkpointName}
                    onChange={(e) =>
                      setNewInterceptForm({ ...newInterceptForm, checkpointName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Command Sector
                  </label>
                  <input
                    type="text"
                    value={newInterceptForm.sector}
                    onChange={(e) =>
                      setNewInterceptForm({ ...newInterceptForm, sector: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Intercept Type
                  </label>
                  <select
                    value={newInterceptForm.interceptType}
                    onChange={(e) =>
                      setNewInterceptForm({
                        ...newInterceptForm,
                        interceptType: e.target.value as BorderInterceptRecord['interceptType']
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="UAV Drone Sighting">UAV Drone Sighting</option>
                    <option value="Biometric Mismatch">Biometric Mismatch</option>
                    <option value="Vehicle Anomaly">Vehicle Anomaly</option>
                    <option value="Maritime Cargo Discrepancy">Maritime Cargo Discrepancy</option>
                    <option value="Perimeter Breach">Perimeter Breach</option>
                    <option value="Thermal Optical Alert">Thermal Optical Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Threat Severity
                  </label>
                  <select
                    value={newInterceptForm.threatSeverity}
                    onChange={(e) =>
                      setNewInterceptForm({
                        ...newInterceptForm,
                        threatSeverity: e.target.value as BorderInterceptRecord['threatSeverity']
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Suspect Entity, Drone Type, or Vehicle License
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unidentified Quadcopter UAV with RF transponder"
                  value={newInterceptForm.suspectEntityOrVehicle}
                  onChange={(e) =>
                    setNewInterceptForm({ ...newInterceptForm, suspectEntityOrVehicle: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  GPS Coordinates
                </label>
                <input
                  type="text"
                  value={newInterceptForm.coordinates}
                  onChange={(e) =>
                    setNewInterceptForm({ ...newInterceptForm, coordinates: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Tactical Observations & Forensic Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe radar cross-section, jamming response, seized electronic components..."
                  value={newInterceptForm.details}
                  onChange={(e) =>
                    setNewInterceptForm({ ...newInterceptForm, details: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewInterceptModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
                >
                  Anchor to Blockchain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW DOSSIER DETAILS */}
      {selectedDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">
                  Classified Defence Dossier // {selectedDossier.id}
                </span>
                <h3 className="text-lg font-bold text-white font-['Cinzel',serif] mt-0.5">
                  {selectedDossier.operationCodename}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDossier(null)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Operational Summary:</span>
                <p className="text-slate-200 mt-0.5 leading-relaxed">{selectedDossier.summary}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Tactical Directives:</span>
                <ul className="mt-1 space-y-1 list-disc pl-4 text-slate-300">
                  {selectedDossier.tacticalDirectives.map((td, i) => (
                    <li key={i}>{td}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase">Associated Classified Documents:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedDossier.associatedDocumentIds.map((docId) => (
                    <button
                      key={docId}
                      onClick={() => {
                        setSelectedDossier(null);
                        onNavigate?.('documents', { docId });
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-lg font-mono text-[11px] cursor-pointer"
                    >
                      {docId} →
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedDossier(null)}
                className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-700 cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
