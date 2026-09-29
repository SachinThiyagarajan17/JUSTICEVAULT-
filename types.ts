export type UserRole =
  | 'Administrator'
  | 'Investigating Officer'
  | 'Forensic Officer'
  | 'Prosecutor'
  | 'Court Officer'
  | 'Legal Officer'
  | 'Auditor'
  | 'Read-Only Reviewer'
  | 'Defence Officer';

export type CaseStatus = 'Active' | 'Under Review' | 'Court Submission' | 'Closed' | 'Archived';
export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type ConfidentialityLevel = 'Public' | 'Confidential' | 'Restricted' | 'Highly Restricted' | 'Top Secret' | 'Top Secret // SAP';

export type DocumentType =
  | 'First Information Report (FIR)'
  | 'Witness Statement'
  | 'Investigation Progress Report'
  | 'Forensic Analysis Report'
  | 'Digital Evidence Collection Form'
  | 'Chain of Custody Form'
  | 'Charge Sheet'
  | 'Court Filing'
  | 'Legal Notice'
  | 'Search and Seizure Memo'
  | 'Digital Signature Certificate'
  | 'Final Investigation Report'
  | 'Bail Application'
  | 'Expert Testimony'
  | 'National Security Directive'
  | 'Border Surveillance Intercept Log'
  | 'SIGINT Intercept Report'
  | 'Tactical Operations Plan'
  | 'UAV Aerial Reconnaissance Scan'
  | 'Defence Intelligence Briefing';

export type DocumentStatus = 'Uploaded' | 'Under Review' | 'Approved' | 'Digitally Signed' | 'Submitted' | 'Archived';
export type SignatureStatus = 'Unsigned' | 'Pending Signature' | 'Digitally Signed' | 'Verified' | 'Revoked';
export type StorageStatus = 'Encrypted AES-256' | 'Cold Storage' | 'Decrypted Cache' | 'Archived';
export type IntegrityStatus = 'Verified' | 'Warning' | 'Tampered' | 'Pending Check';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department: string;
  organization: string;
  phone: string;
  status: 'Active' | 'Suspended' | 'Pending Verification';
  lastLogin: string;
  mfaEnabled: boolean;
  avatarInitials: string;
  badgeNumber?: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  category: string;
  description: string;
  status: CaseStatus;
  priority: PriorityLevel;
  confidentiality: ConfidentialityLevel;
  department: string;
  investigatingOfficer: string;
  assignedUsers: string[]; // User IDs or Names
  openedDate: string;
  nextHearingDate?: string;
  documentCount: number;
  evidenceCount: number;
  progressPercentage: number;
  jurisdiction?: string;
  courtName?: string;
  tags?: string[];
}

export interface DocumentVersion {
  version: number;
  fileName: string;
  uploadedAt: string;
  uploadedBy: string;
  fileSize: string;
  sha256Hash: string;
  blockchainTransactionId: string;
  signatureStatus: SignatureStatus;
  changesSummary?: string;
}

export interface Document {
  id: string;
  caseId: string;
  caseNumber: string;
  fileName: string;
  documentType: DocumentType;
  description: string;
  uploadedBy: string;
  department: string;
  version: number;
  fileSize: string;
  fileFormat: string;
  status: DocumentStatus;
  confidentiality: ConfidentialityLevel;
  uploadedAt: string;
  lastModifiedAt: string;
  sha256Hash: string;
  blockchainTransactionId: string;
  signatureStatus: SignatureStatus;
  storageStatus: StorageStatus;
  currentCustodian: string;
  tags: string[];
  versions?: DocumentVersion[];
  contentSnippet?: string;
  signedBy?: string;
  signedAt?: string;
  tamperFlag?: boolean;
}

export interface EvidenceEvent {
  id: string;
  evidenceId: string;
  caseId: string;
  eventType: string;
  description: string;
  fromCustodian: string;
  toCustodian: string;
  organization: string;
  timestamp: string;
  location: string;
  eventHash: string;
  blockchainTransactionId: string;
  digitalSignatureStatus: 'Signed' | 'Pending' | 'Verified';
  verificationStatus: IntegrityStatus;
  notes?: string;
}

export interface EvidenceItem {
  id: string;
  evidenceNumber: string;
  caseId: string;
  caseNumber: string;
  title: string;
  category: 'Physical' | 'Digital' | 'Biological' | 'Documentary' | 'Forensic Sample';
  description: string;
  collectedBy: string;
  collectionDate: string;
  currentCustodian: string;
  currentOrganization: string;
  currentLocation: string;
  integrityStatus: IntegrityStatus;
  eventsCount: number;
  latestBlockchainTx: string;
  storageRequirement?: string;
  tags: string[];
}

export type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'DOCUMENT_UPLOAD'
  | 'DOCUMENT_VIEW'
  | 'DOCUMENT_DOWNLOAD'
  | 'DOCUMENT_SHARE'
  | 'DOCUMENT_UPDATE'
  | 'DIGITAL_SIGNATURE'
  | 'APPROVAL_GRANTED'
  | 'APPROVAL_REJECTED'
  | 'CUSTODY_TRANSFER'
  | 'PERMISSION_CHANGE'
  | 'DOCUMENT_ARCHIVE'
  | 'INTEGRITY_VERIFICATION'
  | 'TAMPER_ALERT_TRIGGERED'
  | 'SECURITY_ALERT'
  | 'TACTICAL_DIRECTIVE'
  | 'MFA_RESET'
  | 'SYSTEM_INTEGRITY_CHECK';

export type AuditRiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface AuditEvent {
  id: string;
  action: AuditAction;
  resourceType: 'DOCUMENT' | 'CASE' | 'EVIDENCE' | 'USER' | 'SYSTEM' | 'AUTH' | 'APPROVAL';
  resourceId: string;
  resourceName?: string;
  performedBy: string;
  role: UserRole;
  department: string;
  ipAddress: string;
  device: string;
  timestamp: string;
  result: 'Success' | 'Denied' | 'Warning' | 'Failed';
  riskLevel: AuditRiskLevel;
  details: string;
  eventHash?: string;
}

export type ApprovalType =
  | 'Document Review'
  | 'Digital Signature'
  | 'Court Submission'
  | 'Evidence Transfer Acceptance'
  | 'Access Permission Request';

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Expired';

export interface Approval {
  id: string;
  documentId?: string;
  caseId: string;
  caseNumber: string;
  documentName: string;
  requestedBy: string;
  requestedTo: string;
  approvalType: ApprovalType;
  status: ApprovalStatus;
  requestedAt: string;
  dueDate: string;
  completedAt?: string;
  comments?: string;
  version?: number;
  priority: PriorityLevel;
}

export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type AlertStatus = 'New' | 'Under Investigation' | 'Escalated' | 'Resolved' | 'False Positive';

export interface Alert {
  id: string;
  type: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;
  relatedResource: string;
  relatedCaseId?: string;
  status: AlertStatus;
  recommendedAction: string;
  assignedInvestigator?: string;
  resolutionNotes?: string;
}

export interface SystemSettings {
  organizationName: string;
  agencyCode: string;
  jurisdiction: string;
  mfaEnforcement: 'Mandatory for All' | 'High Risk Only' | 'Optional';
  sessionTimeoutMinutes: number;
  passwordMinLength: number;
  passwordExpiryDays: number;
  maxFailedLoginAttempts: number;
  defaultRetentionYears: number;
  allowedFileExtensions: string[];
  maxUploadSizeBytes: number;
  blockchainNetworkName: string;
  blockchainBlockTimeSeconds: number;
  consensusAlgorithm: string;
  backupSchedule: 'Hourly' | 'Daily' | 'Continuous';
  lastBackupTime: string;
  backupStatus: 'Healthy' | 'Warning' | 'Error';
  prototypeMode: boolean;
}

export interface AIEntity {
  name: string;
  type: 'person' | 'organization' | 'location' | 'case' | 'date' | 'evidence';
  sourceReference: string;
}

export interface AIDateItem {
  date: string;
  description: string;
  sourceReference: string;
}

export interface AIAssistantResponse {
  summary: string;
  keyFacts: string[];
  entities: AIEntity[];
  importantDates: AIDateItem[];
  missingMetadata: string[];
  riskFlags: string[];
  confidence: 'high' | 'medium' | 'low';
  disclaimer: string;
  relatedDocumentIds?: string[];
}

// ==========================================
// NATIONAL SECURITY & DEFENCE INTELLIGENCE
// ==========================================

export type DefenceClearanceLevel =
  | 'RESTRICTED'
  | 'CONFIDENTIAL'
  | 'SECRET'
  | 'TOP SECRET'
  | 'TOP SECRET // SAP';

export type DefenceThreatLevel = 'DEFCON 1' | 'DEFCON 2' | 'DEFCON 3' | 'DEFCON 4' | 'DEFCON 5';

export interface BorderInterceptRecord {
  id: string;
  checkpointId: string;
  checkpointName: string;
  sector: string;
  timestamp: string;
  interceptType: 'Vehicle Anomaly' | 'Biometric Mismatch' | 'Thermal Perimeter Alert' | 'UAV Drone Sighting' | 'Maritime Cargo Discrepancy';
  threatSeverity: 'Critical' | 'High' | 'Medium' | 'Low';
  suspectEntityOrVehicle: string;
  anprLicensePlate?: string;
  biometricMatchConfidence?: number;
  coordinates: string;
  evidenceHash: string;
  blockchainBlock: number;
  status: 'Intercepted' | 'Quarantined' | 'Escalated to Military Intel' | 'Cleared';
  details: string;
  assignedUnit: string;
}

export interface SigintRecord {
  id: string;
  interceptFrequency: string;
  protocol: 'Satellite Mil-Band' | 'Encrypted UHF/VHF' | 'Burst Transceiver' | 'Darknet Mesh Packet';
  capturedTimestamp: string;
  originGeoEstimate: string;
  encryptionCipher: string;
  decryptionStatus: 'Cracked (AI Lattice Engine)' | 'Partial Decryption' | 'Encrypted - Analyzing' | 'Cleartext';
  classification: DefenceClearanceLevel;
  extractedKeywords: string[];
  rawTranscriptSnippet: string;
  judicialWarrantNumber: string; // Lawful intercept certification
  sha256Hash: string;
  blockchainTx: string;
}

export interface DefenceIntelDossier {
  id: string;
  operationCodename: string;
  theatre: string;
  classification: DefenceClearanceLevel;
  threatLevel: PriorityLevel;
  leadAgency: string; // e.g. 'Joint Defence Intelligence Cell'
  participatingAgencies: string[]; // ['Military Intelligence', 'Border Security Command', 'Metropolitan Police', 'Coast Guard']
  status: 'Active Engagement' | 'Under Surveillance' | 'Standby Readiness' | 'Completed';
  lastSatelliteSync: string;
  airGappedVaultStatus: 'Synchronized & Sealed' | 'Pending Air-Gap Transfer' | 'Tamper-Evident Lock';
  summary: string;
  aiThreatScore: number; // 0-100
  keyIntelligenceFindings: string[];
  associatedDocumentIds: string[];
  tacticalDirectives: string[];
}

export interface WorkflowSimulationStep {
  stepNumber: number;
  title: string;
  status: 'waiting' | 'processing' | 'completed';
  timestamp?: string;
  details?: string;
  hashOutput?: string;
}

