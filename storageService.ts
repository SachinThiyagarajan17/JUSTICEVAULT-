import {
  INITIAL_USERS,
  INITIAL_CASES,
  INITIAL_DOCUMENTS,
  INITIAL_EVIDENCE_ITEMS,
  INITIAL_EVIDENCE_EVENTS,
  INITIAL_AUDIT_EVENTS,
  INITIAL_APPROVALS,
  INITIAL_ALERTS,
  INITIAL_SETTINGS,
  INITIAL_BORDER_INTERCEPTS,
  INITIAL_SIGINT_RECORDS,
  INITIAL_DEFENCE_DOSSIERS
} from '../data/mockData';
import {
  User,
  Case,
  Document,
  EvidenceItem,
  EvidenceEvent,
  AuditEvent,
  Approval,
  Alert,
  SystemSettings,
  BorderInterceptRecord,
  SigintRecord,
  DefenceIntelDossier
} from '../types';

const STORAGE_KEYS = {
  USERS: 'jv_users_v1',
  CASES: 'jv_cases_v1',
  DOCUMENTS: 'jv_documents_v1',
  EVIDENCE_ITEMS: 'jv_evidence_items_v1',
  EVIDENCE_EVENTS: 'jv_evidence_events_v1',
  AUDIT_EVENTS: 'jv_audit_events_v1',
  APPROVALS: 'jv_approvals_v1',
  ALERTS: 'jv_alerts_v1',
  SETTINGS: 'jv_settings_v1',
  CURRENT_USER: 'jv_current_user_v1',
  AUTH_STATE: 'jv_auth_state_v1',
  BORDER_INTERCEPTS: 'jv_border_intercepts_v1',
  SIGINT_RECORDS: 'jv_sigint_records_v1',
  DEFENCE_DOSSIERS: 'jv_defence_dossiers_v1'
};

// Event listener mechanism for reactive state updates
type Listener = () => void;
const listeners = new Set<Listener>();

export const storageService = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  notify() {
    listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('Storage listener error:', e);
      }
    });
  },

  // USERS
  getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      this.setUsers(INITIAL_USERS);
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  },

  setUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.notify();
  },

  // CASES
  getCases(): Case[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CASES);
    if (!raw) {
      this.setCases(INITIAL_CASES);
      return INITIAL_CASES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CASES;
    }
  },

  setCases(cases: Case[]) {
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
    this.notify();
  },

  // DOCUMENTS
  getDocuments(): Document[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!raw) {
      this.setDocuments(INITIAL_DOCUMENTS);
      return INITIAL_DOCUMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DOCUMENTS;
    }
  },

  setDocuments(docs: Document[]) {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
    this.notify();
  },

  // EVIDENCE ITEMS
  getEvidenceItems(): EvidenceItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVIDENCE_ITEMS);
    if (!raw) {
      this.setEvidenceItems(INITIAL_EVIDENCE_ITEMS);
      return INITIAL_EVIDENCE_ITEMS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EVIDENCE_ITEMS;
    }
  },

  setEvidenceItems(items: EvidenceItem[]) {
    localStorage.setItem(STORAGE_KEYS.EVIDENCE_ITEMS, JSON.stringify(items));
    this.notify();
  },

  // EVIDENCE EVENTS
  getEvidenceEvents(): EvidenceEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVIDENCE_EVENTS);
    if (!raw) {
      this.setEvidenceEvents(INITIAL_EVIDENCE_EVENTS);
      return INITIAL_EVIDENCE_EVENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EVIDENCE_EVENTS;
    }
  },

  setEvidenceEvents(events: EvidenceEvent[]) {
    localStorage.setItem(STORAGE_KEYS.EVIDENCE_EVENTS, JSON.stringify(events));
    this.notify();
  },

  // AUDIT EVENTS
  getAuditEvents(): AuditEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_EVENTS);
    if (!raw) {
      this.setAuditEvents(INITIAL_AUDIT_EVENTS);
      return INITIAL_AUDIT_EVENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AUDIT_EVENTS;
    }
  },

  setAuditEvents(events: AuditEvent[]) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_EVENTS, JSON.stringify(events));
    this.notify();
  },

  // APPROVALS
  getApprovals(): Approval[] {
    const raw = localStorage.getItem(STORAGE_KEYS.APPROVALS);
    if (!raw) {
      this.setApprovals(INITIAL_APPROVALS);
      return INITIAL_APPROVALS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_APPROVALS;
    }
  },

  setApprovals(approvals: Approval[]) {
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvals));
    this.notify();
  },

  // ALERTS
  getAlerts(): Alert[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (!raw) {
      this.setAlerts(INITIAL_ALERTS);
      return INITIAL_ALERTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ALERTS;
    }
  },

  setAlerts(alerts: Alert[]) {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    this.notify();
  },

  // SETTINGS
  getSettings(): SystemSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      this.setSettings(INITIAL_SETTINGS);
      return INITIAL_SETTINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  setSettings(settings: SystemSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    this.notify();
  },

  // BORDER INTERCEPTS
  getBorderIntercepts(): BorderInterceptRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BORDER_INTERCEPTS);
    if (!raw) {
      this.setBorderIntercepts(INITIAL_BORDER_INTERCEPTS);
      return INITIAL_BORDER_INTERCEPTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BORDER_INTERCEPTS;
    }
  },

  setBorderIntercepts(records: BorderInterceptRecord[]) {
    localStorage.setItem(STORAGE_KEYS.BORDER_INTERCEPTS, JSON.stringify(records));
    this.notify();
  },

  addBorderIntercept(record: BorderInterceptRecord) {
    const list = this.getBorderIntercepts();
    list.unshift(record);
    this.setBorderIntercepts(list);
  },

  // SIGINT RECORDS
  getSigintRecords(): SigintRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SIGINT_RECORDS);
    if (!raw) {
      this.setSigintRecords(INITIAL_SIGINT_RECORDS);
      return INITIAL_SIGINT_RECORDS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SIGINT_RECORDS;
    }
  },

  setSigintRecords(records: SigintRecord[]) {
    localStorage.setItem(STORAGE_KEYS.SIGINT_RECORDS, JSON.stringify(records));
    this.notify();
  },

  // DEFENCE DOSSIERS
  getDefenceDossiers(): DefenceIntelDossier[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DEFENCE_DOSSIERS);
    if (!raw) {
      this.setDefenceDossiers(INITIAL_DEFENCE_DOSSIERS);
      return INITIAL_DEFENCE_DOSSIERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEFENCE_DOSSIERS;
    }
  },

  setDefenceDossiers(dossiers: DefenceIntelDossier[]) {
    localStorage.setItem(STORAGE_KEYS.DEFENCE_DOSSIERS, JSON.stringify(dossiers));
    this.notify();
  },

  // RESET DEMO DATA
  resetToInitialState() {
    this.resetAllDemoData();
  },

  resetAllDemoData() {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CASES);
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.EVIDENCE_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.EVIDENCE_EVENTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_EVENTS);
    localStorage.removeItem(STORAGE_KEYS.APPROVALS);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.BORDER_INTERCEPTS);
    localStorage.removeItem(STORAGE_KEYS.SIGINT_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.DEFENCE_DOSSIERS);

    this.setUsers(INITIAL_USERS);
    this.setCases(INITIAL_CASES);
    this.setDocuments(INITIAL_DOCUMENTS);
    this.setEvidenceItems(INITIAL_EVIDENCE_ITEMS);
    this.setEvidenceEvents(INITIAL_EVIDENCE_EVENTS);
    this.setAuditEvents(INITIAL_AUDIT_EVENTS);
    this.setApprovals(INITIAL_APPROVALS);
    this.setAlerts(INITIAL_ALERTS);
    this.setSettings(INITIAL_SETTINGS);
    this.setBorderIntercepts(INITIAL_BORDER_INTERCEPTS);
    this.setSigintRecords(INITIAL_SIGINT_RECORDS);
    this.setDefenceDossiers(INITIAL_DEFENCE_DOSSIERS);

    this.notify();
  }
};
