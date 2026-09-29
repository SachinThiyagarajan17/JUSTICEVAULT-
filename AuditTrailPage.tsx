import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Lock,
  Eye,
  RefreshCw,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { auditService } from '../services/auditService';
import { reportService } from '../services/reportService';
import { storageService } from '../services/storageService';
import { AuditEvent } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { toast } from '../components/common/ToastContainer';

export function AuditTrailPage() {
  const [audits, setAudits] = useState<AuditEvent[]>(auditService.getAuditEvents());
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [resultFilter, setResultFilter] = useState('ALL');

  // Selected audit event modal
  const [selectedAudit, setSelectedAudit] = useState<AuditEvent | null>(null);

  useEffect(() => {
    const update = () => {
      setAudits(auditService.getAuditEvents());
    };
    const unsub = storageService.subscribe(update);
    return unsub;
  }, []);

  const filteredAudits = audits.filter((evt) => {
    if (actionFilter !== 'ALL' && !evt.action.includes(actionFilter)) return false;
    if (riskFilter !== 'ALL' && evt.riskLevel !== riskFilter) return false;
    if (resultFilter !== 'ALL' && evt.result !== resultFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        evt.action.toLowerCase().includes(q) ||
        evt.performedBy.toLowerCase().includes(q) ||
        evt.role.toLowerCase().includes(q) ||
        (evt.resourceName && evt.resourceName.toLowerCase().includes(q)) ||
        evt.resourceId.toLowerCase().includes(q) ||
        evt.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    reportService.downloadCSV({ reportType: 'User Access & Audit Report' });
    toast.success('Audit trail exported to authenticated CSV file.');
  };

  const handleVerifyChain = () => {
    const res = auditService.verifyAuditLogIntegrity();
    if (!res.tamperDetected) {
      toast.success(`Audit Ledger Verified: ${res.verifiedCount.toLocaleString()} records cryptographically validated against Merkle root ${res.rootMerkleHash.substring(0, 14)}...`);
    } else {
      toast.error('Audit ledger mismatch detected!');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Cinzel',serif] flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Tamper-Evident Immutable Audit Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sequential cryptographically signed activity log of all access, modifications, exports, and judicial decisions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVerifyChain}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Log Chain</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, action, resource, IP..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Actions</option>
              <option value="AUTH">Authentication / Login</option>
              <option value="DOCUMENT">Document Events</option>
              <option value="CUSTODY">Evidence Custody</option>
              <option value="APPROVAL">Approvals</option>
              <option value="INTEGRITY">Integrity Verifications</option>
            </select>
          </div>

          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical Risk</option>
            </select>
          </div>

          <div>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Results</option>
              <option value="Success">Success</option>
              <option value="Denied">Denied</option>
              <option value="Warning">Warning</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Performer & Role</th>
                <th className="px-4 py-3.5">Action Executed</th>
                <th className="px-4 py-3.5">Resource Affected</th>
                <th className="px-4 py-3.5">Result</th>
                <th className="px-4 py-3.5">Risk Level</th>
                <th className="px-4 py-3.5">Workstation IP</th>
                <th className="px-4 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredAudits.map((evt) => (
                <tr
                  key={evt.id}
                  onClick={() => setSelectedAudit(evt)}
                  className="hover:bg-slate-50 transition cursor-pointer"
                >
                  <td className="px-4 py-3.5 font-mono text-slate-600 whitespace-nowrap">
                    {evt.timestamp}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-900">
                    <div>{evt.performedBy}</div>
                    <div className="text-[10px] text-slate-400">{evt.role}</div>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-blue-700">
                    {evt.action}
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 max-w-[200px] truncate" title={evt.resourceName || evt.resourceId}>
                    <div>{evt.resourceName || evt.resourceId}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{evt.resourceType}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={evt.result.toLowerCase()}>{evt.result}</Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={evt.riskLevel.toLowerCase()}>{evt.riskLevel}</Badge>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-500 text-[11px]">
                    {evt.ipAddress}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedAudit(evt)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAudits.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                    No audit records match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Audit Event Inspector Modal */}
      {selectedAudit && (
        <Modal
          isOpen={!!selectedAudit}
          onClose={() => setSelectedAudit(null)}
          title={`Audit Event Inspection: ${selectedAudit.id}`}
          subtitle={`Recorded ${selectedAudit.timestamp}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Action</span>
                <div className="font-mono font-bold text-blue-700 mt-0.5">{selectedAudit.action}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Result</span>
                <div className="mt-0.5">
                  <Badge variant={selectedAudit.result.toLowerCase()}>{selectedAudit.result}</Badge>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Officer</span>
                <div className="font-bold text-slate-900 mt-0.5">{selectedAudit.performedBy} ({selectedAudit.role})</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Workstation IP & Session</span>
                <div className="font-mono text-slate-700 mt-0.5">{selectedAudit.ipAddress}</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-1">Details & Context</h4>
              <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono">
                {selectedAudit.details}
              </p>
            </div>

            <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono space-y-1 border border-slate-800">
              <span className="text-cyan-400 font-bold uppercase text-[10px]">HMAC Cryptographic Proof</span>
              <div className="text-emerald-400 break-all text-[11px]">{selectedAudit.eventHash || '0xAUD829f0...'}</div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAudit(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
