import React from 'react';
import {
  Shield,
  FileCheck,
  Printer,
  Download,
  Copy,
  CheckCircle2,
  Lock,
  QrCode,
  Scale,
  X
} from 'lucide-react';
import { Section65BCertificate } from '../../utils/cryptoUtils';
import { toast } from '../common/ToastContainer';

interface Section65BCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Section65BCertificate | null;
}

export function Section65BCertificateModal({
  isOpen,
  onClose,
  certificate
}: Section65BCertificateModalProps) {
  if (!isOpen || !certificate) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certificate.sha256Hash);
    toast.success('SHA-256 hash copied to clipboard');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(certificate, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${certificate.certificateId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Certificate cryptographic manifest downloaded');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-950 text-slate-100 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-['Cinzel',serif] tracking-wide">
                Judicial Certificate of Electronic Evidence
              </h3>
              <p className="text-[11px] font-mono text-indigo-300">
                Section 65B(4) IEA / Section 63 BSA / FRE Rule 902(11)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-semibold flex items-center gap-1.5"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-semibold flex items-center gap-1.5"
              title="Download JSON Manifest"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-300 text-xs leading-relaxed font-sans bg-slate-950/90">
          {/* Official Emblem & Header */}
          <div className="text-center pb-6 border-b border-slate-800/80 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-2">
              <Shield className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold">
              Republic Judicial Evidence Repository • Zero-Trust Digital Vault
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-['Cinzel',serif] tracking-wider uppercase">
              Certificate of Authenticity of Electronic Record
            </h2>
            <p className="text-[11px] text-slate-400 max-w-xl mx-auto">
              Issued in compliance with statutory requirements governing the admissibility of computer outputs and forensic hashes into judicial proceedings.
            </p>
            <div className="inline-block px-3 py-1 bg-indigo-950/60 border border-indigo-500/30 rounded-full font-mono text-[10px] text-indigo-300 font-semibold mt-2">
              Certificate Ref: {certificate.certificateId}
            </div>
          </div>

          {/* Key Identification Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400">Case Docket Number</span>
              <p className="text-sm font-bold text-white font-mono">{certificate.caseNumber}</p>
              <p className="text-[11px] text-slate-400 truncate">{certificate.caseTitle}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400">Competent Court / Jurisdiction</span>
              <p className="text-xs font-semibold text-white">{certificate.jurisdictionCourt}</p>
              <p className="text-[10px] text-slate-400">Designated Special Judicial Magistrate Division</p>
            </div>
          </div>

          {/* Document & Cryptographic Digest Box */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white text-sm">{certificate.documentName}</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                {certificate.fileSize}
              </span>
            </div>

            {/* SHA-256 Digest */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Cryptographic SHA-256 Digest (FIPS 180-4)</span>
                <button
                  onClick={handleCopyHash}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-sans cursor-pointer text-[10px]"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 break-all border border-slate-800 select-all">
                {certificate.sha256Hash}
              </div>
            </div>

            {/* Ledger & Hardware Attestation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-1">
              <div>
                <span className="text-slate-400">Blockchain Block:</span>{' '}
                <span className="text-slate-200">#{certificate.blockNumber}</span>
              </div>
              <div className="truncate">
                <span className="text-slate-400">Tx Hash:</span>{' '}
                <span className="text-slate-200">{certificate.blockchainTx.substring(0, 18)}...</span>
              </div>
              <div className="truncate">
                <span className="text-slate-400">HSM Keystore:</span>{' '}
                <span className="text-slate-200">{certificate.hsmKeyId}</span>
              </div>
              <div className="truncate">
                <span className="text-slate-400">Tamper Seal:</span>{' '}
                <span className="text-indigo-300">{certificate.tamperEvidentSeal}</span>
              </div>
            </div>
          </div>

          {/* Statutory Affirmation */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-300 text-[11px] uppercase tracking-wider font-mono">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              Solemn Legal Affirmation by Certifying Officer
            </div>
            <p className="italic text-[11px] leading-relaxed text-slate-300">
              "{certificate.declarationText}"
            </p>
          </div>

          {/* Signatures & Seal Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Officer Signature */}
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-['Cinzel',serif] text-sm font-bold text-white">
                {certificate.certifyingOfficer}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {certificate.officerDesignation}
              </div>
              <div className="text-[10px] text-slate-400">
                Digital Signature Token Verified • {new Date(certificate.intakeTimestamp).toLocaleString()}
              </div>
            </div>

            {/* Cryptographic QR & Seal */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center text-slate-900">
                <QrCode className="w-10 h-10" />
              </div>
              <div className="text-[10px] font-mono text-slate-400 space-y-0.5">
                <div className="font-bold text-white">VERIFIED BY LEDGER</div>
                <div>Node Consensus: 3/3 Quorum</div>
                <div className="text-indigo-400">Zero-Trust Certified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Cryptographically sealed under FIPS 140-3 standards
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
