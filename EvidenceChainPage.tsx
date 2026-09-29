import React, { useState, useEffect } from 'react';
import {
  Link2,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  Download,
  Clock,
  UserCheck,
  ArrowRight,
  Shield,
  Layers,
  FileText,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { evidenceService } from '../services/evidenceService';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { EvidenceItem, EvidenceEvent, IntegrityStatus } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { toast } from '../components/common/ToastContainer';

interface EvidenceChainPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialSelectedEvidenceId?: string;
  initialCaseId?: string;
}

export function EvidenceChainPage({
  onNavigate,
  initialSelectedEvidenceId,
  initialCaseId
}: EvidenceChainPageProps) {
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>(evidenceService.getEvidenceItems());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<IntegrityStatus | 'ALL'>('ALL');

  // Selected Item for Deep Chain-of-Custody Timeline Modal
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [evidenceEvents, setEvidenceEvents] = useState<EvidenceEvent[]>([]);

  // Transfer Custody Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferredTo, setTransferredTo] = useState('Dr. Asha Menon');
  const [receivingDept, setReceivingDept] = useState('State Forensic Science Laboratory (CFSL)');
  const [purpose, setPurpose] = useState('Forensic DNA & Ballistic Micro-Spectrometry Analysis');
  const [transferLoc, setTransferLoc] = useState('CFSL Ballistics Wing, Lab 3B');
  const [condition, setCondition] = useState('Intact / Tamper Seal Verified');

  // Add Evidence Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Physical' | 'Digital' | 'Biological' | 'Documentary' | 'Forensic Sample'>('Digital');
  const [newCaseNumber, setNewCaseNumber] = useState('JV-2026-001');
  const [newLocation, setNewLocation] = useState('Central Police Vault Alpha, Locker 14');
  const [newDesc, setNewDesc] = useState('');

  const currentUser = authService.getCurrentUser();
  const canTransfer = authService.hasPermission(currentUser?.role, 'transferEvidence');

  useEffect(() => {
    const update = () => {
      setEvidenceItems(evidenceService.getEvidenceItems());
      if (selectedEvidence) {
        setEvidenceEvents(evidenceService.getEvidenceEvents(selectedEvidence.id));
      }
    };
    const unsub = storageService.subscribe(update);
    return unsub;
  }, [selectedEvidence]);

  useEffect(() => {
    if (initialSelectedEvidenceId) {
      const evd = evidenceService.getEvidenceById(initialSelectedEvidenceId);
      if (evd) {
        setSelectedEvidence(evd);
        setEvidenceEvents(evidenceService.getEvidenceEvents(evd.id));
      }
    } else if (initialCaseId) {
      const items = evidenceService.getEvidenceItems({ caseId: initialCaseId });
      if (items.length > 0) {
        setSelectedEvidence(items[0]);
        setEvidenceEvents(evidenceService.getEvidenceEvents(items[0].id));
      }
    }
  }, [initialSelectedEvidenceId, initialCaseId]);

  const handleSelectEvidence = (item: EvidenceItem) => {
    setSelectedEvidence(item);
    setEvidenceEvents(evidenceService.getEvidenceEvents(item.id));
  };

  const filteredItems = evidenceItems.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const m =
        item.evidenceNumber.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.caseNumber.toLowerCase().includes(q) ||
        item.currentCustodian.toLowerCase().includes(q);
      if (!m) return false;
    }
    if (typeFilter !== 'ALL' && item.category !== typeFilter) return false;
    if (statusFilter !== 'ALL' && item.integrityStatus !== statusFilter) return false;
    return true;
  });

  const handleTransferCustody = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvidence || !currentUser) return;

    const event = evidenceService.transferCustody({
      evidenceId: selectedEvidence.id,
      newCustodian: transferredTo,
      receivingDepartment: receivingDept,
      purpose: purpose,
      location: transferLoc,
      transferNotes: condition
    });

    const updated = evidenceService.getEvidenceById(selectedEvidence.id);
    if (updated) {
      setSelectedEvidence(updated);
      setEvidenceEvents(evidenceService.getEvidenceEvents(updated.id));
      toast.success(`Custody transfer recorded for ${updated.evidenceNumber}. Chain cryptographically sealed.`);
    }
    setShowTransferModal(false);
  };

  const handleVerifyEvidence = (item: EvidenceItem) => {
    const res = evidenceService.verifyEvidenceIntegrity(item.id);
    if (res.isValid) {
      toast.success(`Chain of Custody 100% Intact. ${res.eventsChecked} handoffs cryptographically verified against ledger.`);
    } else {
      toast.error('Custody ledger discrepancy detected!');
    }
  };

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Evidence title is required.');
      return;
    }

    const created = evidenceService.addEvidenceItem({
      caseId: 'CASE-001',
      caseNumber: newCaseNumber,
      title: newTitle.trim(),
      category: newCategory,
      description: newDesc,
      location: newLocation
    });

    toast.success(`Evidence Item ${created.evidenceNumber} registered.`);
    setShowAddModal(false);
    handleSelectEvidence(created);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Cinzel',serif] flex items-center gap-2">
            <Link2 className="w-5 h-5 text-cyan-600" />
            Chain of Custody & Evidence Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamper-evident forensic tracking with cryptographic transfer receipts for court admissibility
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register Evidence Item</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by evidence ID, title, case, custodian..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Categories</option>
              <option value="Digital">Digital</option>
              <option value="Physical">Physical</option>
              <option value="Forensic Sample">Forensic Sample</option>
              <option value="Documentary">Documentary</option>
              <option value="Biological">Biological</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Custody States</option>
              <option value="Verified">Verified (Intact)</option>
              <option value="Warning">Warning</option>
              <option value="Tampered">Tampered</option>
              <option value="Pending Check">Pending Check</option>
            </select>
          </div>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Evidence ID</th>
                <th className="px-4 py-3.5">Title & Description</th>
                <th className="px-4 py-3.5">Case Number</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Current Custodian</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5 text-center">Handoffs</th>
                <th className="px-4 py-3.5">Integrity</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleSelectEvidence(item)}
                  className="hover:bg-cyan-50/40 transition cursor-pointer"
                >
                  <td className="px-4 py-3.5 font-mono font-bold text-cyan-700">
                    {item.evidenceNumber}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{item.description}</div>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-blue-700">
                    {item.caseNumber}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant="blockchain">{item.category}</Badge>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">
                    {item.currentCustodian}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 text-[11px]">
                    {item.currentLocation}
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-700">
                    {item.eventsCount}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={item.integrityStatus}>{item.integrityStatus}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleSelectEvidence(item)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-cyan-600 hover:text-white rounded-lg text-xs font-semibold text-slate-700 transition"
                    >
                      Audit Chain →
                    </button>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-500">
                    No evidence items match the specified filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custody Chain Detail Modal */}
      {selectedEvidence && (
        <Modal
          isOpen={!!selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
          title={`Evidence Chain: ${selectedEvidence.evidenceNumber}`}
          subtitle={`${selectedEvidence.title} • Case ${selectedEvidence.caseNumber}`}
          size="2xl"
        >
          <div className="space-y-6">
            {/* Top Summary Banner */}
            <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400">Current Custodian & Organization</div>
                <div className="text-sm font-bold text-cyan-400 mt-0.5">{selectedEvidence.currentCustodian}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{selectedEvidence.currentLocation}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVerifyEvidence(selectedEvidence)}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify Cryptographic Chain</span>
                </button>

                {canTransfer && (
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Transfer Custody</span>
                  </button>
                )}
              </div>
            </div>

            {/* Evidence Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Classification Type</span>
                <div className="font-bold text-slate-900 mt-0.5">{selectedEvidence.category}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Collection Date</span>
                <div className="font-mono font-bold text-slate-900 mt-0.5">{selectedEvidence.collectionDate.split(' ')[0]}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Collecting Officer</span>
                <div className="font-bold text-slate-900 mt-0.5">{selectedEvidence.collectedBy}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Blockchain Anchor</span>
                <div className="font-mono text-cyan-700 font-bold mt-0.5">{selectedEvidence.latestBlockchainTx.slice(0, 14)}...</div>
              </div>
            </div>

            {/* Cryptographic Chain-of-Custody Progression Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-600" />
                Immutable Transfer Log ({evidenceEvents.length} Total Handoffs)
              </h4>

              <div className="relative pl-6 border-l-2 border-cyan-500 space-y-6">
                {evidenceEvents.map((event, index) => (
                  <div key={event.id} className="relative">
                    {/* Node Pin */}
                    <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-cyan-600 border-2 border-white ring-2 ring-cyan-200" />

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-800">
                          Handoff #{index + 1} • {event.timestamp}
                        </span>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          ● Blockchain Anchored
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Released By</span>
                          <div className="font-bold text-slate-900">{event.fromCustodian}</div>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Received By</span>
                          <div className="font-bold text-slate-900">{event.toCustodian}</div>
                          <div className="text-[10px] text-slate-500">{event.organization}</div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-700">
                        <strong className="text-slate-900">Event:</strong> {event.description}
                      </div>

                      {event.notes && (
                        <div className="text-xs text-slate-600">
                          <strong className="text-slate-900">Condition Notes:</strong> {event.notes}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-500 truncate">
                        Event Hash: <span className="text-cyan-700 font-bold">{event.eventHash}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Transfer Custody Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Execute Official Custody Transfer"
        subtitle="Cryptographically sealed custody handoff"
        size="md"
      >
        <form onSubmit={handleTransferCustody} className="space-y-4">
          <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-cyan-900">
            Transferring item <strong>{selectedEvidence?.evidenceNumber}</strong> from <strong>{selectedEvidence?.currentCustodian}</strong>.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Receiving Official *
            </label>
            <input
              type="text"
              required
              value={transferredTo}
              onChange={(e) => setTransferredTo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Receiving Department / Organization *
            </label>
            <input
              type="text"
              required
              value={receivingDept}
              onChange={(e) => setReceivingDept(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Transfer Location / Facility *
            </label>
            <input
              type="text"
              required
              value={transferLoc}
              onChange={(e) => setTransferLoc(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Transfer Purpose / Ground *
            </label>
            <textarea
              rows={2}
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Inspection Condition Notes
            </label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowTransferModal(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              Execute Sealed Handoff
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Evidence Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Evidence Item"
        subtitle="Forensic Chain of Custody Ingestion"
        size="md"
      >
        <form onSubmit={handleAddEvidence} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Evidence Title / Item Description *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Encrypted SanDisk Extreme SSD"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="Digital">Digital</option>
                <option value="Physical">Physical</option>
                <option value="Forensic Sample">Forensic Sample</option>
                <option value="Biological">Biological</option>
                <option value="Documentary">Documentary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Associated Case Number</label>
              <input
                type="text"
                value={newCaseNumber}
                onChange={(e) => setNewCaseNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Storage Location</label>
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detailed Remarks</label>
            <textarea
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Physical serial numbers, packaging seals, condition upon intake..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              Register & Anchor to Ledger
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
