import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  FileText,
  CheckSquare,
  Link2,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Shield,
  ChevronRight,
  Lock,
  Database,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  Layers,
  Radio
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { Badge } from '../components/common/Badge';
import { User } from '../types';

interface DashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenSystemIntegrity?: () => void;
  onOpenAIAssistant?: (docId?: string) => void;
  currentUser?: User | null;
  onOpenArchitectureHub?: () => void;
}

export function DashboardPage({
  onNavigate,
  onOpenSystemIntegrity,
  onOpenAIAssistant,
  currentUser,
  onOpenArchitectureHub
}: DashboardPageProps) {
  const [cases, setCases] = useState(storageService.getCases());
  const [docs, setDocuments] = useState(storageService.getDocuments());
  const [evidence, setEvidence] = useState(storageService.getEvidenceItems());
  const [approvals, setApprovals] = useState(storageService.getApprovals());
  const [alerts, setAlerts] = useState(storageService.getAlerts());
  const [audits, setAudits] = useState(storageService.getAuditEvents());
  const [borderIntercepts, setBorderIntercepts] = useState(storageService.getBorderIntercepts());
  const [sigintRecords, setSigintRecords] = useState(storageService.getSigintRecords());

  useEffect(() => {
    const update = () => {
      setCases(storageService.getCases());
      setDocuments(storageService.getDocuments());
      setEvidence(storageService.getEvidenceItems());
      setApprovals(storageService.getApprovals());
      setAlerts(storageService.getAlerts());
      setAudits(storageService.getAuditEvents());
      setBorderIntercepts(storageService.getBorderIntercepts());
      setSigintRecords(storageService.getSigintRecords());
    };
    const unsub = storageService.subscribe(update);
    return unsub;
  }, []);

  const activeCasesCount = cases.filter((c) => c.status === 'Active').length;
  const pendingApprovals = approvals.filter((a) => a.status === 'Pending');
  const activeAlerts = alerts.filter((a) => a.status === 'New' || a.status === 'Under Investigation');

  const statusCounts = {
    'Submitted': docs.filter((d) => d.status === 'Submitted').length,
    'Digitally Signed': docs.filter((d) => d.status === 'Digitally Signed').length,
    'Approved': docs.filter((d) => d.status === 'Approved').length,
    'Under Review': docs.filter((d) => d.status === 'Under Review').length,
    'Uploaded': docs.filter((d) => d.status === 'Uploaded').length,
  };

  const totalDocs = docs.length || 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 
        NATIONAL SECURITY & ARCHITECTURE SPOTLIGHT BANNERS
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Banner 1: System Architecture Hub Trigger */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold">
                System Blueprint & Ingestion Simulator
              </span>
            </div>
            <h4 className="text-sm font-bold text-white font-['Cinzel',serif]">
              Legal & Investigation Document Management Architecture
            </h4>
            <p className="text-xs text-slate-400 max-w-md">
              Review The Problem, Zero-Trust Solution, 5-Stage Ingest Simulator (OCR, AI, AES-256, Blockchain), Benefits, and Tech Stack.
            </p>
          </div>

          <button
            onClick={onOpenArchitectureHub}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-indigo-600/20"
          >
            Launch System Hub <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Banner 2: Defence Operations Command Trigger */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border border-cyan-500/30 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-bold">
                DEFCON 2 // Joint Defence Command
              </span>
            </div>
            <h4 className="text-sm font-bold text-white font-['Cinzel',serif]">
              National Security & Smart Border Surveillance
            </h4>
            <p className="text-xs text-slate-400 max-w-md">
              {borderIntercepts.length} active border sector intercepts, {sigintRecords.length} satellite Mil-Band SIGINT streams, and air-gapped sovereign HSM key vaults.
            </p>
          </div>

          <button
            onClick={() => onNavigate('defence-intel')}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-cyan-600/20"
          >
            Defence Operations <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 
        BENTO GRID PRIMARY SYSTEM LAYOUT
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Bento Hero Card (Spans 2 columns on lg screens) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl border border-indigo-500/30">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono font-bold tracking-widest text-indigo-200 bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ZERO-TRUST SECURED
              </span>
              <span className="text-xs text-indigo-200 font-medium">Judicial Cloud</span>
            </div>
            <p className="text-indigo-100 font-medium mb-1 opacity-90 text-sm">
              Authenticated Session • {currentUser?.role || 'Investigating Officer'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight font-['Cinzel',serif] tracking-tight">
              Evidence Ledger is <br className="hidden sm:block" />
              <span className="text-cyan-300">Cryptographically Sealed.</span>
            </h2>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 pt-6 sm:pt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/15 shadow-inner">
              <p className="text-[11px] uppercase tracking-wider text-indigo-200 mb-1 opacity-80 font-bold">
                Assigned Division
              </p>
              <p className="text-sm sm:text-base font-bold text-white truncate">
                {currentUser?.department || 'Special Crime Investigation'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/15 shadow-inner flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-indigo-200 mb-1 opacity-80 font-bold">
                  Custody Integrity
                </p>
                <p className="text-sm sm:text-base font-bold text-emerald-300 flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  100% Intact
                </p>
              </div>
              <button
                onClick={onOpenSystemIntegrity}
                className="px-3 py-1.5 bg-white text-indigo-900 rounded-xl text-xs font-bold hover:bg-indigo-50 transition shadow-sm shrink-0 cursor-pointer"
              >
                Verify
              </button>
            </div>
          </div>

          {/* Decorative Bento Glow Orbs */}
          <div className="absolute -right-16 -top-16 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute right-8 bottom-4 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Bento Stat Tile 1: Security Shield */}
        <div
          onClick={onOpenSystemIntegrity}
          className="bg-slate-800/80 hover:bg-slate-800 rounded-3xl p-6 border border-slate-700/50 flex flex-col justify-between shadow-lg transition duration-200 cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
              SECURE
            </span>
          </div>
          <div className="mt-4">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Security Status</p>
            <p className="text-2xl font-bold text-white mt-1">AES-256 Active</p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" /> Zero Tamper Events
            </p>
          </div>
        </div>

        {/* Bento Stat Tile 2: Ledger Quorum */}
        <div
          onClick={() => onNavigate('evidence-chain')}
          className="bg-slate-800/80 hover:bg-slate-800 rounded-3xl p-6 border border-slate-700/50 flex flex-col justify-between shadow-lg transition duration-200 cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center border border-sky-500/20 group-hover:scale-105 transition">
              <Cpu className="w-6 h-6 text-sky-400" />
            </div>
            <p className="text-2xl font-bold text-sky-400 font-mono">98.7%</p>
          </div>
          <div className="mt-4">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Blockchain Node</p>
            <p className="text-2xl font-bold text-white mt-1">IBFT Quorum</p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" /> 4/4 Nodes Synced
            </p>
          </div>
        </div>

        {/* Bento Stat Tile 3: Active Cases */}
        <div
          onClick={() => onNavigate('cases')}
          className="bg-slate-800/80 hover:bg-slate-800 rounded-3xl p-6 border border-slate-700/50 flex flex-col justify-between shadow-lg transition duration-200 cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition">
              <Briefcase className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              ACTIVE
            </span>
          </div>
          <div className="mt-4">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Case Dossiers</p>
            <p className="text-3xl font-bold text-white font-mono mt-1">{activeCasesCount}</p>
            <p className="text-[11px] text-slate-400 mt-1">High-Priority Registrations</p>
          </div>
        </div>

        {/* Bento Stat Tile 4: Evidence Repository */}
        <div
          onClick={() => onNavigate('documents')}
          className="bg-slate-800/80 hover:bg-slate-800 rounded-3xl p-6 border border-slate-700/50 flex flex-col justify-between shadow-lg transition duration-200 cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 group-hover:scale-105 transition">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              ENCRYPTED
            </span>
          </div>
          <div className="mt-4">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Evidence Files</p>
            <p className="text-3xl font-bold text-white font-mono mt-1">{docs.length}</p>
            <p className="text-[11px] text-slate-400 mt-1">SHA-256 Verified Records</p>
          </div>
        </div>

        {/* Bento Tile 5: Operational Activity Rhythm & Graph (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-slate-800/80 rounded-3xl p-6 border border-slate-700/50 flex flex-col justify-between shadow-lg overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Audit Ledger Ingestion Rate
              </p>
              <h3 className="text-lg font-bold text-white mt-0.5">Cryptographic Operations Rhythm</h3>
            </div>
            <p className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-mono">
              +18% throughput
            </p>
          </div>

          {/* Bento Glow Chart Bars */}
          <div className="flex-1 flex items-end gap-3 px-2 pt-6 pb-2 min-h-[140px]">
            {[
              { day: 'Mon', h: '42%', val: 18, highlight: false },
              { day: 'Tue', h: '65%', val: 29, highlight: false },
              { day: 'Wed', h: '50%', val: 22, highlight: false },
              { day: 'Thu', h: '88%', val: 41, highlight: true },
              { day: 'Fri', h: '72%', val: 34, highlight: false },
              { day: 'Sat', h: '35%', val: 14, highlight: false },
              { day: 'Today', h: '80%', val: 38, highlight: true }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className={`w-full rounded-t-xl transition-all duration-300 ${
                    bar.highlight
                      ? 'bg-gradient-to-t from-indigo-600 to-violet-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                      : 'bg-slate-700/60 hover:bg-slate-600/80'
                  }`}
                  style={{ height: bar.h }}
                ></div>
                <span className="text-[10px] font-mono text-slate-400">{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700/40 mt-2">
            <span>24h Ingested Blocks: <strong className="text-slate-200 font-mono">196 Blocks</strong></span>
            <span>Avg Confirm Time: <strong className="text-cyan-400 font-mono">1.2s</strong></span>
          </div>
        </div>

        {/* Bento Tile 6: Document Status Breakdown */}
        <div className="lg:col-span-2 bg-slate-800/80 rounded-3xl p-6 border border-slate-700/50 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Repository Lifecycle</p>
                <h3 className="text-lg font-bold text-white mt-0.5">Evidence Status Breakdown</h3>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-full border border-slate-700/50">
                {docs.length} Items Total
              </span>
            </div>

            <div className="space-y-3">
              {Object.entries(statusCounts).map(([st, count]) => {
                const pct = Math.round((count / totalDocs) * 100);
                return (
                  <div key={st} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">{st}</span>
                      <span className="font-mono text-slate-400">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/40">
                      <div
                        className={`h-full rounded-full transition-all ${
                          st === 'Submitted'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                            : st === 'Digitally Signed'
                            ? 'bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                            : st === 'Approved'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                            : st === 'Under Review'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                            : 'bg-slate-600'
                        }`}
                        style={{ width: `${Math.max(pct, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs">
            <span className="text-slate-400">Cryptographic Signing Compliance</span>
            <span className="font-bold text-indigo-400 font-mono">100% Target Met</span>
          </div>
        </div>

        {/* Bento Tile 7: Connected Cryptographic Infrastructure (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 border border-slate-700/40 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-400" /> Defense & Cryptographic Nodes
              </p>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Network: Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/40">
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.7)] shrink-0"></div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">HSM Key Vault</p>
                  <p className="text-[10px] text-slate-400 font-mono">Hardware PKI • Ed25519</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/40">
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.7)] shrink-0"></div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">Blockchain Notary</p>
                  <p className="text-[10px] text-slate-400 font-mono">Block #489,312 • IBFT</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/40">
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.7)] shrink-0"></div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">AES-GCM Storage</p>
                  <p className="text-[10px] text-slate-400 font-mono">Encrypted At-Rest</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/40">
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.7)] shrink-0"></div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">Zero-Knowledge Ledger</p>
                  <p className="text-[10px] text-slate-400 font-mono">Immutable Audit Chain</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Security Benchmark: <strong className="text-emerald-400">ISO 27001 / FIPS 140-2</strong></span>
            <button
              onClick={() => onNavigate('settings')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Config →
            </button>
          </div>
        </div>

        {/* Bento Tile 8: Urgent Approvals & Actions (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-slate-800/80 rounded-3xl p-6 border border-slate-700/50 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Supervisory Queue</p>
                <h3 className="text-lg font-bold text-white mt-0.5">Pending Approvals & Signatures</h3>
              </div>
              <button
                onClick={() => onNavigate('approvals')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                View Queue →
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingApprovals.slice(0, 2).map((app) => (
                <div
                  key={app.id}
                  onClick={() => onNavigate('approvals')}
                  className="p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="text-xs font-bold text-slate-100 truncate">{app.documentName}</div>
                    <div className="text-[11px] text-amber-400/90 mt-0.5 flex items-center gap-1.5 font-mono">
                      <span>{app.approvalType}</span>
                      <span>•</span>
                      <span>Due {app.dueDate.split(' ')[0]}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />
                </div>
              ))}

              {activeAlerts.slice(0, 1).map((al) => (
                <div
                  key={al.id}
                  onClick={() => onNavigate('alerts')}
                  className="p-3.5 rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="text-xs font-bold text-rose-300 truncate">{al.title}</div>
                    <div className="text-[11px] text-rose-400/90 mt-0.5 font-mono">
                      {al.type} • {al.severity}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
            <span>Pending Judicial Tasks: <strong className="text-amber-400 font-mono">{pendingApprovals.length}</strong></span>
            <span>Active Incidents: <strong className="text-rose-400 font-mono">{activeAlerts.length}</strong></span>
          </div>
        </div>

        {/* Bento Tile 9: Full Recent Activity Log (Spans 4 columns / full width) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-slate-800/80 rounded-3xl border border-slate-700/50 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-700/40 flex items-center justify-between bg-slate-900/40">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chronological Log</p>
              <h3 className="text-lg font-bold text-white mt-0.5">Recent Tamper-Evident Ledger Ingestions</h3>
            </div>
            <button
              onClick={() => onNavigate('audit-trail')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-200 hover:text-white transition"
            >
              Full Ledger Explorer →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700/40">
                <tr>
                  <th className="px-6 py-3.5">Performer</th>
                  <th className="px-6 py-3.5">Action Executed</th>
                  <th className="px-6 py-3.5">Target Resource</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Verification</th>
                  <th className="px-6 py-3.5">Risk Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {audits.slice(0, 5).map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4 font-medium text-slate-200">
                      <div>{evt.performedBy}</div>
                      <div className="text-[10px] text-slate-400">{evt.role}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] font-semibold text-indigo-400">
                      {evt.action}
                    </td>
                    <td className="px-6 py-4 text-slate-300 truncate max-w-[200px]" title={evt.resourceName || evt.resourceId}>
                      {evt.resourceName || evt.resourceId}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                      {evt.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={evt.result.toLowerCase()} size="sm">
                        {evt.result}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={evt.riskLevel.toLowerCase()} size="sm">
                        {evt.riskLevel}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
