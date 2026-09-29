import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  ShieldCheck,
  CheckSquare,
  Sparkles,
  GitCompare,
  Eye,
  Lock,
  Calendar,
  UserCheck,
  History,
  FileCheck2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Printer,
  Share2,
  ShieldAlert,
  Hash,
  Clock,
  X
} from 'lucide-react';
import { documentService, DocumentFilterOptions } from '../services/documentService';
import { approvalService } from '../services/approvalService';
import { auditService } from '../services/auditService';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import {
  Document,
  DocumentType,
  DocumentStatus,
  ConfidentialityLevel,
  SignatureStatus,
  UserRole
} from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { toast } from '../components/common/ToastContainer';

interface DocumentsPageProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenAIAssistant?: (docId?: string) => void;
  initialSelectedDocId?: string;
  initialCaseId?: string;
}

export function DocumentsPage({
  onNavigate,
  onOpenAIAssistant,
  initialSelectedDocId
}: DocumentsPageProps) {
  const [documents, setDocuments] = useState<Document[]>(documentService.getDocuments());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'ALL'>('ALL');
  const [confidentialityFilter, setConfidentialityFilter] = useState<ConfidentialityLevel | 'ALL'>('ALL');
  const [signatureFilter, setSignatureFilter] = useState<SignatureStatus | 'ALL'>('ALL');

  // Active Selected Document in Detail Viewer Modal
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [viewerTab, setViewerTab] = useState<'preview' | 'metadata' | 'versions' | 'signatures' | 'blockchain' | 'audit'>('preview');

  // Action Modals
  const [showSignModal, setShowSignModal] = useState(false);
  const [signCertificate, setSignCertificate] = useState('Gov-eSign Class 3 PKI (Hardware Token)');
  const [signRemarks, setSignRemarks] = useState('Verified against official investigation docket.');
  const [isSigning, setIsSigning] = useState(false);

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalType, setApprovalType] = useState('Judicial Evidentiary Admissibility');
  const [approvalOfficer, setApprovalOfficer] = useState('Hon. Evelyn Cross');
  const [approvalDue, setApprovalDue] = useState('2026-09-15');

  // Redaction state
  const [isRedactedView, setIsRedactedView] = useState(false);

  const currentUser = authService.getCurrentUser();
  const canSign = authService.hasPermission(currentUser?.role, 'digitallySign');

  useEffect(() => {
    const update = () => {
      setDocuments(documentService.getDocuments());
    };
    const unsub = storageService.subscribe(update);
    return unsub;
  }, []);

  useEffect(() => {
    if (initialSelectedDocId) {
      const d = documentService.getDocumentById(initialSelectedDocId);
      if (d) setSelectedDoc(d);
    }
  }, [initialSelectedDocId]);

  const filteredDocs = documents.filter((doc) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const m =
        doc.fileName.toLowerCase().includes(q) ||
        doc.caseNumber.toLowerCase().includes(q) ||
        doc.documentType.toLowerCase().includes(q) ||
        doc.fileHash.toLowerCase().includes(q);
      if (!m) return false;
    }
    if (typeFilter !== 'ALL' && doc.documentType !== typeFilter) return false;
    if (statusFilter !== 'ALL' && doc.status !== statusFilter) return false;
    if (confidentialityFilter !== 'ALL' && doc.confidentiality !== confidentialityFilter) return false;
    if (signatureFilter !== 'ALL' && doc.signatureStatus !== signatureFilter) return false;
    return true;
  });

  const handleDownload = (doc: Document) => {
    const textContent = `JUSTICEVAULT CERTIFIED RECORD\nDocument: ${doc.fileName}\nCase Number: ${doc.caseNumber}\nClassification: ${doc.confidentiality}\nSHA-256 Digest: ${doc.sha256Hash}\nBlockchain TX: ${doc.blockchainTransactionId}\nSignature Status: ${doc.signatureStatus}\n\nContent:\n${doc.contentSnippet || 'No preview available'}`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.fileName}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${doc.fileName} with digital seal.`);
  };

  const handlePerformDigitalSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !currentUser) return;
    setIsSigning(true);

    setTimeout(() => {
      setIsSigning(false);
      const updated = documentService.digitallySignDocument(
        selectedDoc.id,
        signCertificate
      );
      if (updated) {
        setSelectedDoc(updated);
        toast.success(`Document cryptographically signed by ${currentUser.fullName}.`);
      }
      setShowSignModal(false);
    }, 600);
  };

  const handleRequestApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !currentUser) return;

    approvalService.createApproval({
      documentId: selectedDoc.id,
      documentName: selectedDoc.fileName,
      caseId: selectedDoc.caseId,
      caseNumber: selectedDoc.caseNumber,
      requestedTo: approvalOfficer,
      approvalType: approvalType as any,
      dueDate: `${approvalDue} 17:00:00`,
      comments: `Urgent judicial review requested before hearing.`
    });

    toast.success(`Approval request dispatched to ${approvalOfficer}.`);
    setShowApprovalModal(false);
  };

  const handleVerifyBlockchain = (doc: Document) => {
    const res = documentService.verifyDocumentIntegrity(doc.id);
    if (res.isValid) {
      toast.success(`Ledger Verified: Hash ${res.computedHash.slice(0, 16)}... matches Blockchain TX ${doc.blockchainTransactionId.slice(0, 14)}...`);
    } else {
      toast.error('Cryptographic mismatch detected on blockchain record!');
    }
  };

  // Get specific audits for selected document
  const docAudits = selectedDoc
    ? auditService.getAuditEvents().filter((a) => a.resourceId === selectedDoc.id || a.resourceName?.includes(selectedDoc.fileName))
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-['Cinzel',serif] flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            Evidentiary Document Repository
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable legal filings, forensic reports, charge sheets, and witness depositions
          </p>
        </div>

        <button
          onClick={() => onNavigate('secure-upload')}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>Secure Document Ingestion →</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 bg-slate-800/80 border border-slate-700/50 rounded-2xl shadow-lg space-y-3 backdrop-blur-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by file name, case, SHA-256 hash..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-900/70 border border-slate-700/60 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-900/70 border border-slate-700/60 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Document Types</option>
              <option value="First Information Report (FIR)">FIR</option>
              <option value="Forensic Report">Forensic Report</option>
              <option value="Charge Sheet">Charge Sheet</option>
              <option value="Witness Statement">Witness Statement</option>
              <option value="Court Order">Court Order</option>
              <option value="Seizure Memo">Seizure Memo</option>
              <option value="Bail Application">Bail Application</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-900/70 border border-slate-700/60 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="Uploaded">Uploaded</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Digitally Signed">Digitally Signed</option>
              <option value="Submitted">Submitted to Court</option>
            </select>
          </div>

          {/* Signature Filter */}
          <div>
            <select
              value={signatureFilter}
              onChange={(e) => setSignatureFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-900/70 border border-slate-700/60 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Signature States</option>
              <option value="Signed">Signed (PKI Verified)</option>
              <option value="Unsigned">Unsigned</option>
              <option value="Partially Signed">Partially Signed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold tracking-wider border-b border-slate-700/50">
              <tr>
                <th className="px-5 py-3.5">Document Name</th>
                <th className="px-5 py-3.5">Case Number</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Classification</th>
                <th className="px-5 py-3.5">Signature</th>
                <th className="px-5 py-3.5">Version</th>
                <th className="px-5 py-3.5">SHA-256 Digest</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="hover:bg-slate-700/40 transition cursor-pointer"
                >
                  <td className="px-5 py-4 font-bold text-white flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center border border-indigo-500/30 shrink-0">
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <span className="truncate max-w-[220px]" title={doc.fileName}>
                      {doc.fileName}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-indigo-400">
                    {doc.caseNumber}
                  </td>
                  <td className="px-5 py-4 text-slate-300 font-medium">
                    {doc.documentType}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={doc.status}>{doc.status}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={doc.confidentiality}>{doc.confidentiality}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={doc.signatureStatus}>{doc.signatureStatus}</Badge>
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-300 font-bold">
                    v{doc.version}
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-400 text-[11px] truncate max-w-[120px]" title={doc.fileHash}>
                    {doc.fileHash.slice(0, 12)}...
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/60 rounded-lg transition"
                        title="Download Sealed Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="px-3 py-1.5 bg-slate-700/70 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-semibold text-slate-200 transition border border-slate-600/50"
                      >
                        Inspect →
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-slate-400">
                    No documents match the specified search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Inspector & Preview Modal */}
      {selectedDoc && (
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => {
            setSelectedDoc(null);
            setIsRedactedView(false);
          }}
          title={selectedDoc.fileName}
          subtitle={`Case: ${selectedDoc.caseNumber} • ${selectedDoc.documentType}`}
          size="2xl"
        >
          <div className="space-y-5">
            {/* Header Action Bar */}
            <div className="p-3 bg-slate-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={selectedDoc.status}>{selectedDoc.status}</Badge>
                <Badge variant={selectedDoc.confidentiality}>{selectedDoc.confidentiality}</Badge>
                <Badge variant={selectedDoc.signatureStatus}>{selectedDoc.signatureStatus}</Badge>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  Block #{selectedDoc.blockchainBlock}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAIAssistant(selectedDoc.id)}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  <span>AI Analysis</span>
                </button>

                {canSign && selectedDoc.signatureStatus !== 'Signed' && (
                  <button
                    onClick={() => setShowSignModal(true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Digitally Sign</span>
                  </button>
                )}

                <button
                  onClick={() => setShowApprovalModal(true)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Request Approval</span>
                </button>

                <button
                  onClick={() => handleDownload(selectedDoc)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 hover:text-white"
                  title="Download Sealed Document"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Viewer Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-700/60 overflow-x-auto pb-2">
              {[
                { id: 'preview', label: 'Document Preview', icon: Eye },
                { id: 'metadata', label: 'Metadata & Tags', icon: Layers },
                { id: 'versions', label: `Versions (${selectedDoc.versionHistory.length})`, icon: GitCompare },
                { id: 'signatures', label: `Digital Signatures (${selectedDoc.digitalSignatures.length})`, icon: UserCheck },
                { id: 'blockchain', label: 'Ledger Proof', icon: ShieldCheck },
                { id: 'audit', label: 'Audit Trail', icon: History }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setViewerTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                      viewerTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: PREVIEW */}
            {viewerTab === 'preview' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>File size: {selectedDoc.fileSize}</span>
                    <span>•</span>
                    <span>Uploaded: {selectedDoc.uploadDate}</span>
                  </div>
                  <button
                    onClick={() => setIsRedactedView(!isRedactedView)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold border transition ${
                      isRedactedView
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {isRedactedView ? '● Public Redacted View Active' : 'Toggle Redacted View'}
                  </button>
                </div>

                {/* Rendered Court Document Frame with Official Watermark */}
                <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-950/80 border border-slate-700/60 shadow-inner font-serif text-slate-100 space-y-4 max-h-[460px] overflow-y-auto select-text">
                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none rotate-[-30deg]">
                    <div className="text-5xl sm:text-7xl font-bold tracking-widest text-indigo-400 uppercase font-sans">
                      JUSTICEVAULT EVIDENCE
                    </div>
                  </div>

                  {/* Header Letterhead */}
                  <div className="text-center border-b pb-4 border-slate-800">
                    <div className="text-xs font-mono tracking-widest uppercase text-slate-400 font-bold">
                      IN THE COURT OF CRIMINAL JUDICATURE / OFFICIAL POLICE RECORD
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1 uppercase">
                      {selectedDoc.documentType}
                    </h3>
                    <div className="text-xs font-mono text-slate-300 mt-1">
                      Case Registration: <strong className="text-indigo-400">{selectedDoc.caseNumber}</strong> | Token ID: {selectedDoc.id}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans text-slate-200">
                    {isRedactedView
                      ? selectedDoc.content.replace(/Dr\. Asha Menon|Marcus Sterling|Astra Wealth|Inspector Kavya Rao/g, '[REDACTED BY ORDER OF COURT]')
                      : selectedDoc.content}
                  </div>

                  {/* Digital Signature Seal Block */}
                  {selectedDoc.digitalSignatures.length > 0 && (
                    <div className="mt-8 pt-4 border-t border-dashed border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedDoc.digitalSignatures.map((sig) => (
                        <div
                          key={sig.id}
                          className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/60 text-[11px] font-sans text-slate-300"
                        >
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Digitally Certified Signature</span>
                          </div>
                          <div className="font-bold text-white mt-1">{sig.signerName}</div>
                          <div className="text-slate-400">{sig.signerRole}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-1">
                            Certificate: {sig.certificateDetails}
                          </div>
                          <div className="text-[10px] text-indigo-400 font-mono">
                            Timestamp: {sig.signedAt}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: METADATA */}
            {viewerTab === 'metadata' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/60">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">File Hash (SHA-256)</span>
                    <div className="font-mono text-indigo-400 font-bold break-all mt-0.5">{selectedDoc.fileHash}</div>
                  </div>
                  <div className="p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/60">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Blockchain Block</span>
                    <div className="font-mono text-sky-400 font-bold mt-0.5">Block #{selectedDoc.blockchainBlock}</div>
                  </div>
                  <div className="p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/60">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Ingested By</span>
                    <div className="font-bold text-white mt-0.5">{selectedDoc.uploadedBy} ({selectedDoc.uploadedByRole})</div>
                  </div>
                  <div className="p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/60">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Retention Expiry</span>
                    <div className="font-mono font-bold text-white mt-0.5">{selectedDoc.retentionDate || 'Indefinite Judicial Hold'}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Classified Metadata Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDoc.tags.map((t, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-800/80 text-slate-300 text-xs rounded-xl border border-slate-700/60 font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: VERSIONS */}
            {viewerTab === 'versions' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase">Version Progression</h4>
                  <button
                    onClick={() => onOpenAIAssistant(selectedDoc.id)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <GitCompare className="w-3.5 h-3.5" /> Compare with AI
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedDoc.versionHistory.map((v) => (
                    <div
                      key={v.versionNumber}
                      className="p-3.5 bg-slate-800/40 border border-slate-700/50 rounded-2xl flex items-start justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">Version {v.versionNumber}</span>
                          <span className="text-[10px] font-mono text-slate-400">{v.createdDate}</span>
                        </div>
                        <p className="text-slate-300 mt-1">{v.changeLog}</p>
                        <div className="text-[10px] text-slate-400 mt-1">Author: {v.createdBy}</div>
                      </div>
                      <span className="font-mono text-[10px] bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-indigo-400">
                        {v.fileHash.slice(0, 10)}...
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SIGNATURES */}
            {viewerTab === 'signatures' && (
              <div className="space-y-3">
                {selectedDoc.digitalSignatures.map((s) => (
                  <div key={s.id} className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <div>
                          <div className="text-xs font-bold text-white">{s.signerName}</div>
                          <div className="text-[11px] text-slate-400">{s.signerRole}</div>
                        </div>
                      </div>
                      <Badge variant="verified">PKI Validated</Badge>
                    </div>
                    <div className="text-xs font-mono text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-700/60 break-all">
                      Digest: {s.hash}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Cert: {s.certificateDetails}</span>
                      <span className="font-mono text-indigo-400">{s.signedAt}</span>
                    </div>
                  </div>
                ))}
                {selectedDoc.digitalSignatures.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No digital signatures attached yet.
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: BLOCKCHAIN LEDGER PROOF */}
            {viewerTab === 'blockchain' && (
              <div className="p-5 bg-slate-900/90 border border-slate-700/60 text-slate-100 rounded-2xl space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-indigo-400 font-bold uppercase flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cryptographic Ledger Record
                  </span>
                  <button
                    onClick={() => handleVerifyBlockchain(selectedDoc)}
                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl transition font-sans font-semibold text-xs shadow-md shadow-indigo-600/30"
                  >
                    Verify Against Blockchain
                  </button>
                </div>
                <div className="space-y-2.5 text-[11px]">
                  <div>
                    <span className="text-slate-400">Transaction ID:</span>
                    <div className="text-sky-300 break-all">{selectedDoc.blockchainTxId}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Block Height:</span>
                    <div className="text-white font-bold">#{selectedDoc.blockchainBlock}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Genesis SHA-256 Digest:</span>
                    <div className="text-emerald-400 break-all">{selectedDoc.fileHash}</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: AUDIT */}
            {viewerTab === 'audit' && (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {docAudits.map((a) => (
                  <div key={a.id} className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-xs flex items-start justify-between">
                    <div>
                      <div className="font-bold text-white">{a.action}</div>
                      <div className="text-slate-400 text-[11px]">{a.details}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">By {a.performedBy} ({a.role})</div>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400">{a.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Digital Sign Modal */}
      <Modal
        isOpen={showSignModal}
        onClose={() => setShowSignModal(false)}
        title="Digitally Certify & Sign Document"
        subtitle="Cryptographic PKI e-Sign Authority"
        size="md"
      >
        <form onSubmit={handlePerformDigitalSign} className="space-y-4">
          <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl text-xs text-indigo-300">
            You are applying a legally binding PKI digital seal as <strong className="text-white">{currentUser?.fullName}</strong> ({currentUser?.role}).
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Signing Certificate Authority *
            </label>
            <select
              value={signCertificate}
              onChange={(e) => setSignCertificate(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-xs font-semibold text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Gov-eSign Class 3 PKI (Hardware Token)">Gov-eSign Class 3 PKI (Hardware Token)</option>
              <option value="Judicial Services Internal PKI Cert">Judicial Services Internal PKI Cert</option>
              <option value="Forensic Examiner HSM Key 4096">Forensic Examiner HSM Key 4096</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Signing Endorsement Remarks
            </label>
            <textarea
              rows={2}
              value={signRemarks}
              onChange={(e) => setSignRemarks(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowSignModal(false)}
              className="px-4 py-2 border border-slate-700 rounded-xl text-xs text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSigning}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
            >
              {isSigning ? 'Affixing Seal...' : 'Apply Digital Seal'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Request Approval Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title="Request Document Approval / Judicial Review"
        subtitle="Official Workflow Routing"
        size="md"
      >
        <form onSubmit={handleRequestApproval} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Approval Category *
            </label>
            <select
              value={approvalType}
              onChange={(e) => setApprovalType(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-xs font-semibold text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Judicial Evidentiary Admissibility">Judicial Evidentiary Admissibility</option>
              <option value="Forensic Peer Review">Forensic Peer Review</option>
              <option value="Prosecutorial Filing Approval">Prosecutorial Filing Approval</option>
              <option value="Supervisory Sign-Off">Supervisory Sign-Off</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Designated Reviewing Officer *
            </label>
            <select
              value={approvalOfficer}
              onChange={(e) => setApprovalOfficer(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-xs font-semibold text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Hon. Evelyn Cross">Hon. Evelyn Cross (Court Registry Officer)</option>
              <option value="Adv. Vikramaditya Sen">Adv. Vikramaditya Sen (Lead Public Prosecutor)</option>
              <option value="Dr. Asha Menon">Dr. Asha Menon (Chief Forensic Officer)</option>
              <option value="Inspector Kavya Rao">Inspector Kavya Rao (Senior Detective)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Action Due Date
            </label>
            <input
              type="date"
              value={approvalDue}
              onChange={(e) => setApprovalDue(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-xs font-mono text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowApprovalModal(false)}
              className="px-4 py-2 border border-slate-700 rounded-xl text-xs text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-600/20 transition"
            >
              Dispatch Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
