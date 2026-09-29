import React, { useState, useEffect } from 'react';
import {
  Search,
  FileText,
  Briefcase,
  Link2,
  ShieldCheck,
  Hash,
  Filter,
  Eye,
  ArrowRight,
  Sparkles,
  Layers,
  Calendar,
  UserCheck
} from 'lucide-react';
import { documentService } from '../services/documentService';
import { caseService } from '../services/caseService';
import { evidenceService } from '../services/evidenceService';
import { Document, Case, EvidenceItem } from '../types';
import { Badge } from '../components/common/Badge';

interface SearchPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialQuery?: string;
  onOpenAIAssistant: (docId?: string) => void;
}

export function SearchPage({
  onNavigate,
  initialQuery = '',
  onOpenAIAssistant
}: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'ALL' | 'DOCS' | 'CASES' | 'EVIDENCE' | 'BLOCKCHAIN'>('ALL');
  const [docTypeFilter, setDocTypeFilter] = useState('ALL');
  const [confidentialityFilter, setConfidentialityFilter] = useState('ALL');

  const [allDocs, setAllDocs] = useState<Document[]>(documentService.getDocuments());
  const [allCases, setAllCases] = useState<Case[]>(caseService.getCases());
  const [allEvidence, setAllEvidence] = useState<EvidenceItem[]>(evidenceService.getEvidenceItems());

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const q = query.trim().toLowerCase();

  // Search filtering logic
  const matchedDocs = allDocs.filter((d) => {
    if (docTypeFilter !== 'ALL' && d.documentType !== docTypeFilter) return false;
    if (confidentialityFilter !== 'ALL' && d.confidentiality !== confidentialityFilter) return false;
    if (!q) return true;
    return (
      d.fileName.toLowerCase().includes(q) ||
      d.caseNumber.toLowerCase().includes(q) ||
      d.content.toLowerCase().includes(q) ||
      d.fileHash.toLowerCase().includes(q) ||
      d.blockchainTxId.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q)) ||
      d.uploadedBy.toLowerCase().includes(q)
    );
  });

  const matchedCases = allCases.filter((c) => {
    if (confidentialityFilter !== 'ALL' && c.confidentiality !== confidentialityFilter) return false;
    if (!q) return true;
    return (
      c.caseNumber.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.investigatingOfficer.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q)
    );
  });

  const matchedEvidence = allEvidence.filter((e) => {
    if (!q) return true;
    return (
      e.evidenceNumber.toLowerCase().includes(q) ||
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.caseNumber.toLowerCase().includes(q) ||
      e.currentCustodian.toLowerCase().includes(q) ||
      e.initialHash.toLowerCase().includes(q) ||
      e.blockchainTxId.toLowerCase().includes(q)
    );
  });

  const totalResults = matchedDocs.length + matchedCases.length + matchedEvidence.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-['Cinzel',serif] flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          Intelligent Multi-Modal Search & Hash Lookup
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Full-text document scanning, case proceedings, evidence artifacts, and cryptographic SHA-256 hash verification
        </p>
      </div>

      {/* Main Search Input Box */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, officer names, FIR numbers, or paste SHA-256 hash (e.g. 0x8f4d...)..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={docTypeFilter}
            onChange={(e) => setDocTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Document Types</option>
            <option value="First Information Report (FIR)">FIR</option>
            <option value="Forensic Report">Forensic Report</option>
            <option value="Charge Sheet">Charge Sheet</option>
            <option value="Witness Statement">Witness Statement</option>
            <option value="Court Order">Court Order</option>
          </select>

          <select
            value={confidentialityFilter}
            onChange={(e) => setConfidentialityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Classifications</option>
            <option value="Public">Public</option>
            <option value="Confidential">Confidential</option>
            <option value="Restricted">Restricted</option>
            <option value="Highly Restricted">Highly Restricted</option>
          </select>

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setDocTypeFilter('ALL');
                setConfidentialityFilter('ALL');
              }}
              className="text-xs text-rose-600 hover:underline font-semibold ml-auto"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Results Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
        {[
          { id: 'ALL', label: `All Results (${totalResults})` },
          { id: 'DOCS', label: `Documents (${matchedDocs.length})`, icon: FileText },
          { id: 'CASES', label: `Cases (${matchedCases.length})`, icon: Briefcase },
          { id: 'EVIDENCE', label: `Evidence Items (${matchedEvidence.length})`, icon: Link2 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {/* Section 1: Documents */}
        {(activeTab === 'ALL' || activeTab === 'DOCS') && matchedDocs.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              Matching Sealed Documents ({matchedDocs.length})
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {matchedDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onNavigate('documents', { docId: doc.id })}
                  className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {doc.caseNumber}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{doc.fileName}</span>
                      <Badge variant={doc.signatureStatus} size="sm">
                        {doc.signatureStatus}
                      </Badge>
                      <Badge variant={doc.confidentiality} size="sm">
                        {doc.confidentiality}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">{doc.content}</p>
                    <div className="text-[11px] font-mono text-slate-400 truncate">
                      SHA-256: <span className="text-cyan-700">{doc.fileHash}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAIAssistant(doc.id);
                      }}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> AI
                    </button>
                    <span className="text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1">
                      Inspect <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Cases */}
        {(activeTab === 'ALL' || activeTab === 'CASES') && matchedCases.length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Matching Case Proceedings ({matchedCases.length})
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {matchedCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onNavigate('cases', { caseId: c.id })}
                  className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700">{c.caseNumber}</span>
                      <span className="text-sm font-bold text-slate-900">{c.title}</span>
                      <Badge variant={c.status} size="sm">{c.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{c.description}</p>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Officer: <strong>{c.investigatingOfficer}</strong> ({c.department})
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 hover:text-blue-600 shrink-0 flex items-center gap-1">
                    Open Case <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Evidence */}
        {(activeTab === 'ALL' || activeTab === 'EVIDENCE') && matchedEvidence.length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-cyan-600" />
              Matching Evidence Items ({matchedEvidence.length})
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {matchedEvidence.map((e) => (
                <div
                  key={e.id}
                  onClick={() => onNavigate('evidence-chain', { evidenceId: e.id })}
                  className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-cyan-400 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-700">{e.evidenceNumber}</span>
                      <span className="text-sm font-bold text-slate-900">{e.title}</span>
                      <Badge variant="blockchain" size="sm">{e.type}</Badge>
                      <Badge variant={e.integrityStatus} size="sm">{e.integrityStatus}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{e.description}</p>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Custodian: <strong>{e.currentCustodian}</strong> | Case: {e.caseNumber}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 hover:text-cyan-600 shrink-0 flex items-center gap-1">
                    Audit Chain <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Zero Results State */}
        {totalResults === 0 && (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3">
            <Search className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No records found matching "{query}"</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Check for spelling, try broader search terms, or verify that you have proper role-based authorization for restricted dossiers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
