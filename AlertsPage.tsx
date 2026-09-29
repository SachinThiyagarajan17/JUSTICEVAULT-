import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  ShieldCheck,
  Shield,
  ArrowRight,
  Eye,
  XCircle,
  Sparkles
} from 'lucide-react';
import { alertService } from '../services/alertService';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { Alert, AlertSeverity, AlertStatus } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { toast } from '../components/common/ToastContainer';

interface AlertsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function AlertsPage({ onNavigate }: AlertsPageProps) {
  const [alerts, setAlerts] = useState<Alert[]>(alertService.getAlerts());
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Resolution Modal
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('Reviewed security telemetry. Action verified and resolved.');
  const [isResolving, setIsResolving] = useState(false);

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const update = () => {
      setAlerts(alertService.getAlerts());
    };
    const unsub = storageService.subscribe(update);
    return unsub;
  }, []);

  const filteredAlerts = alerts.filter((al) => {
    if (severityFilter !== 'ALL' && al.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && al.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        al.title.toLowerCase().includes(q) ||
        al.description.toLowerCase().includes(q) ||
        al.relatedResource.toLowerCase().includes(q) ||
        al.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleResolveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlert) return;
    setIsResolving(true);

    setTimeout(() => {
      setIsResolving(false);
      alertService.updateAlertStatus(selectedAlert.id, 'Resolved', resolutionNotes.trim());
      toast.success(`Security Incident #${selectedAlert.id} marked as Resolved.`);
      setSelectedAlert(null);
    }, 400);
  };

  const handleInvestigateAlert = (alertId: string) => {
    alertService.updateAlertStatus(alertId, 'Under Investigation');
    toast.info(`Incident status set to "Under Investigation".`);
  };

  const criticalCount = alerts.filter((a) => a.severity === 'Critical' && a.status !== 'Resolved').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Cinzel',serif] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            Security Incidents & Access Telemetry Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated detection of unauthorized access attempts, hash mismatches, and compliance threshold deviations
          </p>
        </div>

        {criticalCount > 0 && (
          <span className="px-3 py-1 bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-1.5 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            {criticalCount} Critical Active Incidents
          </span>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alert title, resource, description..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Incident Statuses</option>
              <option value="New">New</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Resolved">Resolved</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Incident Title</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Severity</th>
                <th className="px-4 py-3.5">Related Resource</th>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.map((al) => (
                <tr key={al.id} className="hover:bg-rose-50/30 transition">
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    <div>{al.title}</div>
                    <div className="text-[11px] text-slate-500 font-normal line-clamp-1">{al.description}</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 font-medium">
                    {al.type}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={al.severity.toLowerCase()}>{al.severity}</Badge>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-cyan-800 text-[11px]">
                    {al.relatedResource}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-600">
                    {al.timestamp}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={al.status.toLowerCase()}>{al.status}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {al.status === 'New' && (
                        <button
                          onClick={() => handleInvestigateAlert(al.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold"
                        >
                          Investigate
                        </button>
                      )}
                      {al.status !== 'Resolved' && (
                        <button
                          onClick={() => setSelectedAlert(al)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold"
                        >
                          Resolve Incident
                        </button>
                      )}
                      {al.status === 'Resolved' && (
                        <span className="text-[11px] text-emerald-600 font-medium">Resolved</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAlerts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    No security alerts matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolve Incident Modal */}
      {selectedAlert && (
        <Modal
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          title="Resolve Security Incident"
          subtitle={`Incident #${selectedAlert.id}: ${selectedAlert.title}`}
          size="md"
        >
          <form onSubmit={handleResolveAlert} className="space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div><strong className="text-slate-900">Incident Type:</strong> {selectedAlert.type}</div>
              <div><strong className="text-slate-900">Resource:</strong> {selectedAlert.relatedResource}</div>
              <div><strong className="text-slate-900">Recorded:</strong> {selectedAlert.timestamp}</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Remediation / Resolution Notes *
              </label>
              <textarea
                rows={3}
                required
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isResolving}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50"
              >
                {isResolving ? 'Resolving...' : 'Confirm Resolution'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
