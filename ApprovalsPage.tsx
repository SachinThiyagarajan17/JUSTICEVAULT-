import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  UserCheck,
  FileText,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { approvalService } from '../services/approvalService';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { Approval, ApprovalStatus, ApprovalType } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { toast } from '../components/common/ToastContainer';

interface ApprovalsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function ApprovalsPage({ onNavigate }: ApprovalsPageProps) {
  const [approvals, setApprovals] = useState<Approval[]>(approvalService.getApprovals());
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Approval Action Modal
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | 'REQUEST_CHANGES' | null>(null);
  const [actionRemarks, setActionRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const update = () => {
      setApprovals(approvalService.getApprovals());
    };
    const unsub = storageService.subscribe(update);
    return unsub;
  }, []);

  const filteredApprovals = approvals.filter((a) => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.documentName.toLowerCase().includes(q) ||
        a.caseNumber.toLowerCase().includes(q) ||
        a.requestedBy.toLowerCase().includes(q) ||
        a.requestedTo.toLowerCase().includes(q) ||
        a.approvalType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExecuteAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApproval || !actionType || !currentUser) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const remarks = actionRemarks.trim() || `Processed by ${currentUser.fullName}`;

      if (actionType === 'APPROVE') {
        approvalService.approve(selectedApproval.id, remarks, true);
        toast.success(`Approval Request #${selectedApproval.id} Approved.`);
      } else if (actionType === 'REJECT') {
        approvalService.reject(selectedApproval.id, remarks);
        toast.warning(`Approval Request #${selectedApproval.id} Rejected.`);
      } else {
        approvalService.requestChanges(selectedApproval.id, remarks);
        toast.info(`Changes requested for Approval Request #${selectedApproval.id}.`);
      }

      setSelectedApproval(null);
      setActionType(null);
      setActionRemarks('');
    }, 400);
  };

  const pendingCount = approvals.filter((a) => a.status === 'Pending').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Cinzel',serif] flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-600" />
            Judicial & Evidentiary Approval Workflows
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Peer reviews, prosecutorial filings, judicial admissions, and supervisory sign-offs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold rounded-xl flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {pendingCount} Pending Review
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by document, case, requester, reviewer..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Document & Case</th>
                <th className="px-4 py-3.5">Approval Category</th>
                <th className="px-4 py-3.5">Requested By</th>
                <th className="px-4 py-3.5">Designated Reviewer</th>
                <th className="px-4 py-3.5">Due Date</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApprovals.map((app) => (
                <tr key={app.id} className="hover:bg-amber-50/30 transition">
                  <td className="px-4 py-3.5 font-medium text-slate-900">
                    <div className="font-bold">{app.documentName}</div>
                    <div className="font-mono text-blue-700 text-[11px]">{app.caseNumber}</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-800 font-semibold">
                    {app.approvalType}
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">
                    <div>{app.requestedBy}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{app.requestedAt.split(' ')[0]}</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-800 font-medium">
                    {app.requestedTo}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-600">
                    {app.dueDate.split(' ')[0]}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={app.status}>{app.status}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {app.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectedApproval(app);
                              setActionType('APPROVE');
                              setActionRemarks('Statutory compliance verified; approved for judicial filing.');
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedApproval(app);
                              setActionType('REJECT');
                              setActionRemarks('Evidentiary gaps identified; admissibility rejected.');
                            }}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => {
                              setSelectedApproval(app);
                              setActionType('REQUEST_CHANGES');
                              setActionRemarks('Please attach additional witness affidavits before final approval.');
                            }}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-semibold"
                          >
                            Request Changes
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">
                          {app.status} • {app.completedAt?.split(' ')[0] || 'Processed'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredApprovals.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    No approval requests found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Action Modal */}
      {selectedApproval && actionType && (
        <Modal
          isOpen={!!selectedApproval && !!actionType}
          onClose={() => {
            setSelectedApproval(null);
            setActionType(null);
          }}
          title={
            actionType === 'APPROVE'
              ? 'Affix Approval Endorsement'
              : actionType === 'REJECT'
              ? 'Reject Evidentiary Submission'
              : 'Request Clarifications / Changes'
          }
          subtitle={`Document: ${selectedApproval.documentName} • ${selectedApproval.caseNumber}`}
          size="md"
        >
          <form onSubmit={handleExecuteAction} className="space-y-4">
            <div
              className={`p-3 rounded-xl border text-xs leading-relaxed ${
                actionType === 'APPROVE'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : actionType === 'REJECT'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              Processing review decision as <strong>{currentUser?.fullName}</strong> ({currentUser?.role}). This decision will be cryptographically logged to the audit ledger.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Official Judicial / Review Remarks *
              </label>
              <textarea
                rows={3}
                required
                value={actionRemarks}
                onChange={(e) => setActionRemarks(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedApproval(null);
                  setActionType(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className={`px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition disabled:opacity-50 ${
                  actionType === 'APPROVE'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : actionType === 'REJECT'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {isProcessing ? 'Recording Decision...' : 'Confirm Decision'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
