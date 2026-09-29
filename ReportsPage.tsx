import React, { useState } from 'react';
import {
  BarChart3,
  FileDown,
  FileText,
  Briefcase,
  Link2,
  History,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { reportService, ReportType } from '../services/reportService';
import { storageService } from '../services/storageService';
import { toast } from '../components/common/ToastContainer';

export function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleGenerate = (reportType: ReportType) => {
    setIsGenerating(reportType);
    setTimeout(() => {
      setIsGenerating(null);
      reportService.downloadCSV({ reportType });
      toast.success(`Generated official "${reportType}" compliance report in CSV format.`);
    }, 400);
  };

  const reportsList: {
    id: ReportType;
    title: string;
    desc: string;
    icon: any;
    recordsCount: number;
    format: string;
  }[] = [
    {
      id: 'Case Activity Report',
      title: 'Judicial Case Proceedings & Dossier Register',
      desc: 'Complete overview of all active, closed, and submitted case proceedings with hearing schedules and assigned officers.',
      icon: Briefcase,
      recordsCount: storageService.getCases().length,
      format: 'Authenticated CSV / Ledger'
    },
    {
      id: 'Document Inventory Report',
      title: 'Evidentiary Document Compliance & Signature Audit',
      desc: 'Exhaustive inventory of documents, PKI digital signature certificates, retention dates, and SHA-256 digests.',
      icon: FileText,
      recordsCount: storageService.getDocuments().length,
      format: 'Authenticated CSV / Ledger'
    },
    {
      id: 'Evidence Chain-of-Custody Report',
      title: 'Forensic Chain of Custody Transfer Certificates',
      desc: 'Full transfer trail for physical and digital evidence items with custodian signatures and condition notes.',
      icon: Link2,
      recordsCount: storageService.getEvidenceItems().length,
      format: 'Authenticated CSV / Ledger'
    },
    {
      id: 'User Access & Audit Report',
      title: 'Zero-Trust Immutable Audit Ledger & Event History',
      desc: 'Complete chronological record of all user sessions, file accesses, modifications, and judicial approvals with HMAC hashes.',
      icon: History,
      recordsCount: storageService.getAuditEvents().length,
      format: 'Authenticated CSV / Ledger'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-['Cinzel',serif] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Statutory Compliance & Reporting Center
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate authenticated court-admissible records, audit summaries, and evidentiary custody exports
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportsList.map((rep) => {
          const Icon = rep.icon;
          const loading = isGenerating === rep.id;
          return (
            <div
              key={rep.id}
              className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                    {rep.recordsCount} Records Available
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{rep.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{rep.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">{rep.format}</span>
                <button
                  onClick={() => handleGenerate(rep.id)}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{loading ? 'Compiling...' : 'Export Report'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
