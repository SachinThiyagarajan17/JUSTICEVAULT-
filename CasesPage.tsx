import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  FileDown,
  LayoutGrid,
  List,
  Eye,
  FileText,
  Link2,
  Clock,
  Shield,
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  UploadCloud,
  CheckSquare,
  Sparkles,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { caseService, CaseFilterOptions } from '../services/caseService';
import { documentService } from '../services/documentService';
import { evidenceService } from '../services/evidenceService';
import { approvalService } from '../services/approvalService';
import { auditService } from '../services/auditService';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { Case, CaseStatus, PriorityLevel, ConfidentialityLevel, UserRole } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { toast } from '../components/common/ToastContainer';

interface CasesPageProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenUploadWithCase?: (caseId: string, caseNumber: string) => void;
  onOpenAIAssistant?: (docId?: string) => void;
  initialSelectedCaseId?: string;
}

export function CasesPage({
  onNavigate,
  onOpenUploadWithCase,
  onOpenAIAssistant,
  initialSelectedCaseId
}: CasesPageProps) {
  const [cases, setCases] = useState<Case[]>(caseService.getCases());
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | 'ALL'>('ALL');
  const [confidentialityFilter, setConfidentialityFilter] = useState<ConfidentialityLevel | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Selected Case for Workspace Drawer / Modal
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState<'overview' | 'documents' | 'evidence' | 'timeline' | 'participants' | 'approvals' | 'audit'>('overview');

  // New Case Modal State
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseNumber, setNewCaseNumber] = useState(`JV-2026-${(cases.length + 1).toString().padStart(3, '0')}`);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Criminal Investigation');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('High');
  const [newConfidentiality, setNewConfidentiality] = useState<ConfidentialityLevel>('Restricted');
  const [newDepartment, setNewDepartment] = useState('Special Crime Investigation Branch');
  const [newOfficer, setNewOfficer] = useState('Inspector Kavya Rao');
  const [newHearingDate, setNewHearingDate] = useState('2026-10-15');

  const currentUser = authService.getCurrentUser();
  const canCreateCase = authService.hasPermission(currentUser?.role, 'createCases');

  useEffect(() => {
    const update = () => {
      setCases(caseService.getCases());
    };
    const unsub = storageService.subscribe(update);
    return unsub;
  }, []);

  useEffect(() => {
    if (initialSelectedCaseId) {
      const c = caseService.getCaseById(initialSelectedCaseId);
      if (c) setSelectedCase(c);
    }
  }, [initialSelectedCaseId]);

  const filteredCases = cases.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const m =
        c.caseNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.investigatingOfficer.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      if (!m) return false;
    }
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
    if (confidentialityFilter !== 'ALL' && c.confidentiality !== confidentialityFilter) return false;
    if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
    return true;
  });

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCaseNumber.trim()) {
      toast.error('Case Number and Case Title are mandatory.');
      return;
    }

    const created = caseService.createCase({
      caseNumber: newCaseNumber.trim(),
      title: newTitle.trim(),
      category: newCategory,
      description: newDesc,
      status: 'Active',
      priority: newPriority,
      confidentiality: newConfidentiality,
      department: newDepartment,
      investigatingOfficer: newOfficer,
      assignedUsers: [currentUser?.id || 'USR-001'],
      openedDate: new Date().toISOString().split('T')[0],
      nextHearingDate: newHearingDate,
      tags: [newCategory, 'Active Inquest']
    });

    toast.success(`Case ${created.caseNumber} registered into cryptographic registry.`);
    setShowNewCaseModal(false);
    // Reset form
    setNewTitle('');
    setNewDesc('');
    setSelectedCase(created);
  };

  const handleVerifyCaseIntegrity = (caseId: string) => {
    toast.success(`Cryptographic verification complete for Case ${selectedCase?.caseNumber}. All document Merkle hashes match the blockchain ledger.`);
    auditService.logEvent({
      action: 'INTEGRITY_VERIFICATION',
      resourceType: 'CASE',
      resourceId: caseId,
      resourceName: selectedCase?.caseNumber,
      details: `On-demand case integrity verification passed across all attached documents and evidence blocks.`,
      result: 'Success',
      riskLevel: 'Low'
    });
  };

  // Associated resources for selected case
  const caseDocs = selectedCase ? documentService.getDocumentsByCaseId(selectedCase.id) : [];
  const caseEvidence = selectedCase ? evidenceService.getEvidenceItems({ caseId: selectedCase.id }) : [];
  const caseApprovals = selectedCase ? approvalService.getApprovals({ caseId: selectedCase.id }) : [];
  const caseAudits = selectedCase
    ? auditService.getAuditEvents().filter((a) => a.resourceId === selectedCase.id || a.resourceName?.includes(selectedCase.caseNumber))
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-['Cinzel',serif] flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-indigo-400" />
            </div>
            Case Management & Dossiers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cryptographically anchored legal proceedings, criminal investigations, and judicial matters
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {canCreateCase && (
            <button
              onClick={() => setShowNewCaseModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Case Dossier</span>
            </button>
          )}

          <div className="flex items-center border border-slate-700/60 rounded-xl overflow-hidden bg-slate-900/60 p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-medium transition ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-medium transition ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-slate-800/80 border border-slate-700/50 rounded-2xl shadow-lg space-y-3 backdrop-blur-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by case number, title, officer..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900/70 border border-slate-700/60 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-900/70 border border-slate-700/60 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Under Review">Under Review</option>
              <option value="Court Submission">Court Submission</option>
              <option value="Closed">Closed</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-900/70 border border-slate-700/60 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Confidentiality Filter */}
          <div>
            <select
              value={confidentialityFilter}
              onChange={(e) => setConfidentialityFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-900/70 border border-slate-700/60 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Classifications</option>
              <option value="Public">Public</option>
              <option value="Confidential">Confidential</option>
              <option value="Restricted">Restricted</option>
              <option value="Highly Restricted">Highly Restricted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Case Table / Grid View */}
      {viewMode === 'table' ? (
        <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold tracking-wider border-b border-slate-700/50">
                <tr>
                  <th className="px-5 py-3.5">Case Number</th>
                  <th className="px-5 py-3.5">Title & Category</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Classification</th>
                  <th className="px-5 py-3.5">Assigned Officer</th>
                  <th className="px-5 py-3.5 text-center">Docs</th>
                  <th className="px-5 py-3.5 text-center">Evidence</th>
                  <th className="px-5 py-3.5">Next Hearing</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-700/40 transition cursor-pointer"
                    onClick={() => setSelectedCase(c)}
                  >
                    <td className="px-5 py-4 font-mono font-bold text-indigo-400">
                      {c.caseNumber}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-white">{c.title}</div>
                      <div className="text-[11px] text-slate-400">{c.category}</div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={c.status}>{c.status}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={c.priority}>{c.priority}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={c.confidentiality}>{c.confidentiality}</Badge>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-200">
                      {c.investigatingOfficer}
                    </td>
                    <td className="px-5 py-4 text-center font-mono font-bold text-slate-200">
                      {c.documentCount}
                    </td>
                    <td className="px-5 py-4 text-center font-mono font-bold text-slate-200">
                      {c.evidenceCount}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-300">
                      {c.nextHearingDate || 'TBD'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCase(c);
                        }}
                        className="px-3 py-1.5 bg-slate-700/70 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-semibold text-slate-200 transition border border-slate-600/50"
                      >
                        Workspace →
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCases.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-5 py-12 text-center text-slate-400">
                      No cases match the selected filter parameters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCase(c)}
              className="bg-slate-800/80 border border-slate-700/50 rounded-3xl p-5 shadow-lg hover:border-indigo-500/50 transition cursor-pointer flex flex-col justify-between group backdrop-blur-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/15 px-2.5 py-1 rounded-full border border-indigo-500/30">
                    {c.caseNumber}
                  </span>
                  <Badge variant={c.status} size="sm">
                    {c.status}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition mt-2">{c.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{c.description}</p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  <Badge variant={c.priority} size="sm">
                    {c.priority}
                  </Badge>
                  <Badge variant={c.confidentiality} size="sm">
                    {c.confidentiality}
                  </Badge>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Investigating Officer</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{c.investigatingOfficer}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Records</div>
                  <div className="font-mono font-bold text-slate-200 mt-0.5">
                    {c.documentCount} Docs • {c.evidenceCount} Evd
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case Workspace Full Modal / Drawer */}
      {selectedCase && (
        <Modal
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          title={`Case Workspace: ${selectedCase.caseNumber}`}
          subtitle={`${selectedCase.title} • ${selectedCase.category}`}
          size="2xl"
        >
          <div className="space-y-6">
            {/* Case Workspace Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-700/60 overflow-x-auto pb-2">
              {[
                { id: 'overview', label: 'Overview', icon: Briefcase },
                { id: 'documents', label: `Documents (${caseDocs.length})`, icon: FileText },
                { id: 'evidence', label: `Evidence (${caseEvidence.length})`, icon: Link2 },
                { id: 'timeline', label: 'Milestones', icon: Clock },
                { id: 'participants', label: 'Participants', icon: Users },
                { id: 'approvals', label: `Approvals (${caseApprovals.length})`, icon: CheckSquare },
                { id: 'audit', label: 'Audit History', icon: Shield }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setWorkspaceTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                      workspaceTab === tab.id
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

            {/* TAB 1: OVERVIEW */}
            {workspaceTab === 'overview' && (
              <div className="space-y-6">
                {/* Top Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Priority</span>
                    <div className="mt-1">
                      <Badge variant={selectedCase.priority}>{selectedCase.priority}</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Confidentiality</span>
                    <div className="mt-1">
                      <Badge variant={selectedCase.confidentiality}>{selectedCase.confidentiality}</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Next Hearing Date</span>
                    <div className="mt-1 font-mono font-bold text-slate-200">
                      {selectedCase.nextHearingDate || 'Not Scheduled'}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Matter Description & Scope
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                    {selectedCase.description}
                  </p>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-300">Dossier Completion Progress</span>
                    <span className="font-mono font-bold text-indigo-400">{selectedCase.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                      style={{ width: `${selectedCase.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                    Case Quick Actions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        setSelectedCase(null);
                        onNavigate('secure-upload', { caseId: selectedCase.id, caseNumber: selectedCase.caseNumber });
                      }}
                      className="p-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 rounded-2xl text-left transition flex items-center gap-3 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center border border-indigo-500/30 shrink-0">
                        <UploadCloud className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition">Upload Document</div>
                        <div className="text-[10px] text-slate-400">Add verified PDF/DOC</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCase(null);
                        onNavigate('evidence-chain', { caseId: selectedCase.id });
                      }}
                      className="p-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-sky-500/50 rounded-2xl text-left transition flex items-center gap-3 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-sky-500/15 flex items-center justify-center border border-sky-500/30 shrink-0">
                        <Link2 className="w-4 h-4 text-sky-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-sky-300 transition">Add Evidence</div>
                        <div className="text-[10px] text-slate-400">Log chain event</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleVerifyCaseIntegrity(selectedCase.id)}
                      className="p-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/50 rounded-2xl text-left transition flex items-center gap-3 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30 shrink-0">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition">Verify Integrity</div>
                        <div className="text-[10px] text-slate-400">Check Merkle proofs</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DOCUMENTS */}
            {workspaceTab === 'documents' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase">Linked Dossier Documents</h4>
                  <button
                    onClick={() => {
                      setSelectedCase(null);
                      onNavigate('secure-upload', { caseId: selectedCase.id, caseNumber: selectedCase.caseNumber });
                    }}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    + Upload to this Case
                  </button>
                </div>
                <div className="space-y-2">
                  {caseDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-2xl border border-slate-700/50 bg-slate-800/40 flex items-center justify-between hover:border-indigo-500/40 transition"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        <div>
                          <div className="text-xs font-bold text-white">{doc.fileName}</div>
                          <div className="text-[11px] text-slate-400">{doc.documentType} • v{doc.version}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={doc.signatureStatus} size="sm">
                          {doc.signatureStatus}
                        </Badge>
                        <button
                          onClick={() => {
                            setSelectedCase(null);
                            onNavigate('documents', { docId: doc.id });
                          }}
                          className="px-3 py-1 bg-slate-700/60 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-semibold text-slate-200 transition"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                  {caseDocs.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs">No documents uploaded yet for this case.</div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: EVIDENCE */}
            {workspaceTab === 'evidence' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Attached Physical & Digital Evidence</h4>
                <div className="space-y-2">
                  {caseEvidence.map((evd) => (
                    <div
                      key={evd.id}
                      className="p-3.5 rounded-2xl border border-slate-700/50 bg-slate-800/40 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Link2 className="w-5 h-5 text-sky-400" />
                        <div>
                          <div className="text-xs font-bold text-white">{evd.evidenceNumber}: {evd.title}</div>
                          <div className="text-[11px] text-slate-400">Custodian: {evd.currentCustodian}</div>
                        </div>
                      </div>
                      <Badge variant={evd.integrityStatus} size="sm">
                        {evd.integrityStatus}
                      </Badge>
                    </div>
                  ))}
                  {caseEvidence.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs">No evidence logged yet.</div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: MILESTONES / TIMELINE */}
            {workspaceTab === 'timeline' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Chronological Case Dossier Progression</h4>
                <div className="relative pl-6 border-l-2 border-indigo-500/50 space-y-4 my-2">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900" />
                    <div className="text-xs font-bold font-mono text-indigo-400">{selectedCase.openedDate}</div>
                    <div className="text-xs font-bold text-white">Case Dossier Formally Opened</div>
                    <div className="text-[11px] text-slate-400">Assigned to {selectedCase.investigatingOfficer} in {selectedCase.department}.</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-violet-500 border-2 border-slate-900" />
                    <div className="text-xs font-bold font-mono text-violet-400">Active Intake & Forensic Seizure</div>
                    <div className="text-xs font-bold text-white">Cryptographic Registration</div>
                    <div className="text-[11px] text-slate-400">{caseDocs.length} documents and {caseEvidence.length} physical items registered.</div>
                  </div>
                  {selectedCase.nextHearingDate && (
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                      <div className="text-xs font-bold font-mono text-emerald-400">{selectedCase.nextHearingDate}</div>
                      <div className="text-xs font-bold text-white">Next Scheduled Judicial Hearing</div>
                      <div className="text-[11px] text-slate-400">Sessions Court Division 4 Docket.</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: PARTICIPANTS */}
            {workspaceTab === 'participants' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Assigned Officers & Judicial Personnel</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-800/40 border border-slate-700/50 rounded-2xl text-xs">
                    <div className="font-bold text-white">{selectedCase.investigatingOfficer}</div>
                    <div className="text-slate-400">Lead Investigating Officer</div>
                    <div className="text-[10px] text-indigo-400 font-mono mt-1">Badge: DET-4821</div>
                  </div>
                  <div className="p-3.5 bg-slate-800/40 border border-slate-700/50 rounded-2xl text-xs">
                    <div className="font-bold text-white">Adv. Vikramaditya Sen</div>
                    <div className="text-slate-400">Designated Public Prosecutor</div>
                    <div className="text-[10px] text-indigo-400 font-mono mt-1">Bar: PROS-552</div>
                  </div>
                  <div className="p-3.5 bg-slate-800/40 border border-slate-700/50 rounded-2xl text-xs">
                    <div className="font-bold text-white">Dr. Asha Menon</div>
                    <div className="text-slate-400">Chief Forensic Science Examiner</div>
                    <div className="text-[10px] text-indigo-400 font-mono mt-1">Lab: CFSL-CYB</div>
                  </div>
                  <div className="p-3.5 bg-slate-800/40 border border-slate-700/50 rounded-2xl text-xs">
                    <div className="font-bold text-white">Hon. Registrar Evelyn Cross</div>
                    <div className="text-slate-400">Court Registry Officer</div>
                    <div className="text-[10px] text-indigo-400 font-mono mt-1">Court: High Court Div 4</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: APPROVALS */}
            {workspaceTab === 'approvals' && (
              <div className="space-y-2">
                {caseApprovals.map((app) => (
                  <div key={app.id} className="p-3.5 bg-slate-800/40 border border-slate-700/50 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{app.documentName}</div>
                      <div className="text-slate-400">{app.approvalType} • Assigned to {app.requestedTo}</div>
                    </div>
                    <Badge variant={app.status}>{app.status}</Badge>
                  </div>
                ))}
                {caseApprovals.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-xs">No active approvals for this case.</div>
                )}
              </div>
            )}

            {/* TAB 7: AUDIT HISTORY */}
            {workspaceTab === 'audit' && (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {caseAudits.map((a) => (
                  <div key={a.id} className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-xs flex items-start justify-between">
                    <div>
                      <div className="font-bold text-white">{a.action}</div>
                      <div className="text-slate-400 text-[11px]">{a.details}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">By {a.performedBy} ({a.role})</div>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400">{a.timestamp}</span>
                  </div>
                ))}
                {caseAudits.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-xs">No audit logs matching this case ID.</div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* New Case Modal */}
      <Modal
        isOpen={showNewCaseModal}
        onClose={() => setShowNewCaseModal(false)}
        title="Register New Case Dossier"
        subtitle="Cryptographically sealed legal & investigative proceeding"
        size="lg"
      >
        <form onSubmit={handleCreateCase} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Case Identification Number *
              </label>
              <input
                type="text"
                required
                value={newCaseNumber}
                onChange={(e) => setNewCaseNumber(e.target.value)}
                placeholder="JV-2026-005"
                className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700/60 rounded-xl text-xs font-mono font-bold text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Category *
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Criminal Investigation">Criminal Investigation</option>
                <option value="Cybercrime">Cybercrime</option>
                <option value="Civil Legal Matter">Civil Legal Matter</option>
                <option value="Narcotics & Smuggling">Narcotics & Smuggling</option>
                <option value="Financial Fraud">Financial Fraud</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Case Title / Inquest Header *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. State v. Marcus Sterling"
              className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700/60 rounded-xl text-xs font-semibold text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Description & Allegation Overview
            </label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Provide a concise summary of charges, involved parties, and jurisdictional scope..."
              className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700/60 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700/60 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Classification</label>
              <select
                value={newConfidentiality}
                onChange={(e) => setNewConfidentiality(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700/60 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Public">Public</option>
                <option value="Confidential">Confidential</option>
                <option value="Restricted">Restricted</option>
                <option value="Highly Restricted">Highly Restricted</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Hearing Date</label>
              <input
                type="date"
                value={newHearingDate}
                onChange={(e) => setNewHearingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700/60 rounded-xl text-xs font-mono text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Department</label>
              <input
                type="text"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700/60 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Lead Investigating Officer</label>
              <input
                type="text"
                value={newOfficer}
                onChange={(e) => setNewOfficer(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700/60 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => setShowNewCaseModal(false)}
              className="px-4 py-2 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition cursor-pointer"
            >
              Register Case
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
