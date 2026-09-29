import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Lock,
  Database,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Layers
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { toast } from '../components/common/ToastContainer';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';

export function SettingsPage() {
  const [retentionDefault, setRetentionDefault] = useState('10 Years (Statutory Serious Crimes)');
  const [enforceMfa, setEnforceMfa] = useState(true);
  const [watermarkExport, setWatermarkExport] = useState(true);
  const [autoRedactPii, setAutoRedactPii] = useState(true);
  const [blockchainNode, setBlockchainNode] = useState('Quorum-Validator-Node-01 (IBFT 2.0)');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Security configuration & retention policies saved.');
  };

  const handleResetToFactory = () => {
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setShowResetConfirm(false);
      storageService.resetToInitialState();
      toast.success('System database reset to initial prototype state.');
      window.location.reload();
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-['Cinzel',serif] flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Security Policies & System Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Cryptographic node orchestration, retention schedules, and access control governance
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Security & Cryptographic Policies */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Lock className="w-4 h-4 text-blue-600" />
            <span>Cryptographic & Access Enforcement Policies</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-900">Enforce Multi-Factor Authentication (MFA)</div>
                <div className="text-[11px] text-slate-500">Require 6-digit OTP verification for all department logins</div>
              </div>
              <input
                type="checkbox"
                checked={enforceMfa}
                onChange={(e) => setEnforceMfa(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-900">Apply Judicial Forensic Watermarking on Exports</div>
                <div className="text-[11px] text-slate-500">Stamp "JUSTICEVAULT SECURE EVIDENCE" across document pages</div>
              </div>
              <input
                type="checkbox"
                checked={watermarkExport}
                onChange={(e) => setWatermarkExport(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-900">Automated PII Redaction in Public Export Mode</div>
                <div className="text-[11px] text-slate-500">Mask officer home addresses, witness phone numbers, and bank records</div>
              </div>
              <input
                type="checkbox"
                checked={autoRedactPii}
                onChange={(e) => setAutoRedactPii(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Retention & Blockchain */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Cpu className="w-4 h-4 text-cyan-600" />
            <span>Statutory Retention & Blockchain Consensus</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Default Statutory Retention Schedule
              </label>
              <select
                value={retentionDefault}
                onChange={(e) => setRetentionDefault(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="5 Years">5 Years (Summary Offences)</option>
                <option value="10 Years (Statutory Serious Crimes)">10 Years (Statutory Serious Crimes)</option>
                <option value="25 Years">25 Years (Capital & Homicide Proceedings)</option>
                <option value="Permanent Judicial Archive">Permanent Judicial Archive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Active Consensus Validator Node
              </label>
              <input
                type="text"
                value={blockchainNode}
                onChange={(e) => setBlockchainNode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Disaster Recovery & Prototype Reset */}
        <div className="p-6 bg-white border border-rose-200 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
            <Database className="w-4 h-4 text-rose-600" />
            <span>Prototype Maintenance & Database Reset</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Resetting the prototype clears any local modifications and re-initializes all sample cases, documents, evidence items, and mock blockchain ledger blocks to factory defaults.
          </p>
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Prototype Database to Initial Seed State</span>
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetToFactory}
        title="Reset Prototype Data?"
        message="This will re-initialize all cases, documents, and ledger blocks to the default judicial demonstration data. Are you sure you want to proceed?"
        confirmLabel="Reset Everything"
        variant="danger"
        isLoading={isResetting}
      />
    </div>
  );
}
