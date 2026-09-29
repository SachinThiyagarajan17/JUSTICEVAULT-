import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Layers,
  Lock,
  Cpu,
  RefreshCw,
  Scale,
  FileText,
  Clock
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { toast } from '../common/ToastContainer';

export interface VerificationCheckItem {
  id: string;
  name: string;
  description: string;
  status: 'PASSED' | 'FAILED' | 'WARNING' | 'PENDING';
  details: string;
}

export interface VerificationReport {
  documentId: string;
  documentName: string;
  caseNumber: string;
  computedHash: string;
  recordedHash: string;
  isMatch: boolean;
  isTampered: boolean;
  blockchainTx: string;
  blockNumber: number;
  signedBy: string;
  verifiedAt: string;
  checks: VerificationCheckItem[];
}

interface VerificationResultCardProps {
  report: VerificationReport | null;
  onOpenCertificate?: () => void;
  onSimulateTamper?: () => void;
  onRestoreIntegrity?: () => void;
  onReverify?: () => void;
}

export function VerificationResultCard({
  report,
  onOpenCertificate,
  onSimulateTamper,
  onRestoreIntegrity,
  onReverify
}: VerificationResultCardProps) {
  if (!report) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const allPassed = report.isMatch && !report.isTampered && report.checks.every(c => c.status === 'PASSED');

  return (
    <div className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 shadow-xl ${
      allPassed
        ? 'bg-slate-900/90 border-emerald-500/40 shadow-emerald-950/20'
        : 'bg-slate-900/90 border-rose-500/50 shadow-rose-950/30'
    }`}>
      {/* Top Header Badge & Result Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-start sm:items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
            allPassed
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse'
          }`}>
            {allPassed ? (
              <ShieldCheck className="w-8 h-8" />
            ) : (
              <ShieldAlert className="w-8 h-8" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[11px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                allPassed
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {allPassed ? '100% Cryptographic Match Verified' : 'CRITICAL INTEGRITY VIOLATION DETECTED'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Case {report.caseNumber}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white font-['Cinzel',serif] mt-1">
              {report.documentName}
            </h3>

            <p className="text-xs text-slate-400">
              Audit Verified at {new Date(report.verifiedAt).toLocaleTimeString()} ({new Date(report.verifiedAt).toLocaleDateString()})
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {onReverify && (
            <button
              onClick={onReverify}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-Verify
            </button>
          )}

          {onOpenCertificate && (
            <button
              onClick={onOpenCertificate}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <Scale className="w-3.5 h-3.5" />
              Section 65B Certificate
            </button>
          )}
        </div>
      </div>

      {/* Side-by-Side Cryptographic Hash Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-6">
        {/* Computed Live Hash */}
        <div className={`p-4 rounded-2xl border space-y-2 ${
          allPassed
            ? 'bg-slate-950/60 border-slate-800'
            : 'bg-rose-950/20 border-rose-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Live Computed SHA-256 Digest
            </span>
            <button
              onClick={() => handleCopy(report.computedHash, 'Computed Hash')}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>
          <div className={`font-mono text-xs break-all p-2.5 rounded-xl border select-all ${
            allPassed
              ? 'bg-slate-900/90 text-emerald-400 border-slate-800'
              : 'bg-rose-950/40 text-rose-300 border-rose-500/40 font-bold'
          }`}>
            {report.computedHash}
          </div>
          <p className="text-[10px] text-slate-400">
            Computed by Web Crypto Engine from currently selected document stream.
          </p>
        </div>

        {/* Registered Genesis Ledger Hash */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Immutable Genesis Ledger Hash
            </span>
            <button
              onClick={() => handleCopy(report.recordedHash, 'Registered Hash')}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>
          <div className="font-mono text-xs break-all p-2.5 rounded-xl bg-slate-900/90 text-emerald-400 border border-slate-800 select-all">
            {report.recordedHash}
          </div>
          <p className="text-[10px] text-slate-400">
            Sealed on Blockchain Block #{report.blockNumber} • Tx: {report.blockchainTx.substring(0, 16)}...
          </p>
        </div>
      </div>

      {/* The 6-Point Forensic Verification Checklist */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          6-Point Cryptographic & Legal Verification Protocol
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {report.checks.map((chk) => {
            const isPass = chk.status === 'PASSED';
            const isWarn = chk.status === 'WARNING';
            return (
              <div
                key={chk.id}
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                  isPass
                    ? 'bg-slate-950/40 border-slate-800/90'
                    : isWarn
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-rose-950/30 border-rose-500/50'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isPass ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isWarn ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white truncate">
                      {chk.name}
                    </span>
                    <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md ${
                      isPass
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : isWarn
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {chk.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {chk.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Tamper Testing Toolbar */}
      <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Signed by: <strong className="text-slate-200">{report.signedBy}</strong></span>
        </div>

        <div className="flex items-center gap-3">
          {report.isTampered ? (
            <button
              onClick={onRestoreIntegrity}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Restore Cryptographic Integrity
            </button>
          ) : (
            <button
              onClick={onSimulateTamper}
              className="px-4 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Inject simulated bit-flip to test verification failover"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Simulate Malicious Tampering (Test Failover)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
