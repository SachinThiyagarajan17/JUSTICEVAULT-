import {
  Document,
  DocumentStatus,
  DocumentType,
  ConfidentialityLevel,
  SignatureStatus,
  DocumentVersion
} from '../types';
import { storageService } from './storageService';
import { auditService } from './auditService';
import { blockchainService } from './blockchainService';
import { caseService } from './caseService';
import { authService } from './authService';

export interface DocumentFilterOptions {
  search?: string;
  caseId?: string | 'ALL';
  documentType?: DocumentType | 'ALL';
  status?: DocumentStatus | 'ALL';
  confidentiality?: ConfidentialityLevel | 'ALL';
  signatureStatus?: SignatureStatus | 'ALL';
  sortBy?: 'date_desc' | 'date_asc' | 'name_asc' | 'version_desc';
}

export const documentService = {
  getDocuments(filters?: DocumentFilterOptions): Document[] {
    let docs = storageService.getDocuments();
    const currentUser = authService.getCurrentUser();

    // Security filtering based on user role
    if (currentUser?.role === 'Read-Only Reviewer') {
      docs = docs.filter((d) => d.confidentiality !== 'Highly Restricted' && d.confidentiality !== 'Top Secret');
    }

    if (!filters) return docs;

    return docs.filter((d) => {
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const matchName = d.fileName.toLowerCase().includes(query);
        const matchCase = d.caseNumber.toLowerCase().includes(query);
        const matchType = d.documentType.toLowerCase().includes(query);
        const matchDesc = d.description.toLowerCase().includes(query);
        const matchHash = d.sha256Hash.toLowerCase().includes(query);
        const matchTx = d.blockchainTransactionId.toLowerCase().includes(query);
        const matchTags = d.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchName && !matchCase && !matchType && !matchDesc && !matchHash && !matchTx && !matchTags) {
          return false;
        }
      }

      if (filters.caseId && filters.caseId !== 'ALL' && d.caseId !== filters.caseId && d.caseNumber !== filters.caseId) {
        return false;
      }

      if (filters.documentType && filters.documentType !== 'ALL' && d.documentType !== filters.documentType) {
        return false;
      }

      if (filters.status && filters.status !== 'ALL' && d.status !== filters.status) {
        return false;
      }

      if (filters.confidentiality && filters.confidentiality !== 'ALL' && d.confidentiality !== filters.confidentiality) {
        return false;
      }

      if (filters.signatureStatus && filters.signatureStatus !== 'ALL' && d.signatureStatus !== filters.signatureStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'name_asc') {
        return a.fileName.localeCompare(b.fileName);
      }
      if (filters.sortBy === 'date_asc') {
        return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      }
      if (filters.sortBy === 'version_desc') {
        return b.version - a.version;
      }
      // default: date_desc
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    });
  },

  getDocumentById(id: string): Document | undefined {
    const docs = storageService.getDocuments();
    return docs.find((d) => d.id === id);
  },

  getDocumentsByCaseId(caseId: string): Document[] {
    const docs = storageService.getDocuments();
    return docs.filter((d) => d.caseId === caseId || d.caseNumber === caseId);
  },

  uploadDocument(params: {
    caseId: string;
    caseNumber: string;
    fileName: string;
    documentType: DocumentType;
    description: string;
    confidentiality: ConfidentialityLevel;
    fileSize?: string;
    fileFormat?: string;
    tags?: string[];
    author?: string;
    contentSnippet?: string;
  }): Document {
    const currentUser = authService.getCurrentUser();
    const docs = storageService.getDocuments();
    const nextIdx = docs.length + 1;
    const docId = `DOC-${nextIdx.toString().padStart(3, '0')}`;

    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);

    const generatedHash = blockchainService.generateSha256(`${params.fileName}-${dateStr}`);
    const generatedTx = blockchainService.generateTransactionId('DOC');

    const initialVersion: DocumentVersion = {
      version: 1,
      fileName: params.fileName,
      uploadedAt: dateStr,
      uploadedBy: currentUser?.fullName || 'Authorized Investigator',
      fileSize: params.fileSize || '3.42 MB',
      sha256Hash: generatedHash,
      blockchainTransactionId: generatedTx,
      signatureStatus: 'Unsigned',
      changesSummary: 'Initial verified upload to secure repository.'
    };

    const newDoc: Document = {
      id: docId,
      caseId: params.caseId,
      caseNumber: params.caseNumber,
      fileName: params.fileName,
      documentType: params.documentType,
      description: params.description,
      uploadedBy: currentUser?.fullName || 'Authorized Investigator',
      department: currentUser?.department || 'Special Crime Investigation Branch',
      version: 1,
      fileSize: params.fileSize || '3.42 MB',
      fileFormat: params.fileFormat || params.fileName.split('.').pop()?.toUpperCase() || 'PDF',
      status: 'Uploaded',
      confidentiality: params.confidentiality,
      uploadedAt: dateStr,
      lastModifiedAt: dateStr,
      sha256Hash: generatedHash,
      blockchainTransactionId: generatedTx,
      signatureStatus: 'Unsigned',
      storageStatus: 'Encrypted AES-256',
      currentCustodian: `${currentUser?.fullName || 'Investigating Officer'} (${currentUser?.department || 'Investigation Unit'})`,
      tags: params.tags || [params.documentType.split(' ')[0]],
      versions: [initialVersion],
      contentSnippet: params.contentSnippet || `Verified registration record for ${params.fileName} in Case ${params.caseNumber}.`
    };

    storageService.setDocuments([newDoc, ...docs]);
    caseService.incrementCounts(params.caseId, 'document');

    auditService.logEvent({
      action: 'DOCUMENT_UPLOAD',
      resourceType: 'DOCUMENT',
      resourceId: newDoc.id,
      resourceName: newDoc.fileName,
      details: `Document uploaded. AES-256 encrypted, SHA-256 hash registered on blockchain ledger TX ${generatedTx}.`,
      result: 'Success',
      riskLevel: 'Low'
    });

    return newDoc;
  },

  verifyDocumentIntegrity(docId: string): {
    isValid: boolean;
    computedHash: string;
    recordedHash: string;
    blockchainTx: string;
    statusMessage: string;
    blockNumber: number;
    timestamp: string;
  } {
    const doc = this.getDocumentById(docId);
    if (!doc) {
      throw new Error('Document not found');
    }

    const isTampered = doc.tamperFlag === true;
    const computedHash = isTampered
      ? `${doc.sha256Hash.substring(0, 56)}badc0de`
      : doc.sha256Hash;

    const isValid = computedHash === doc.sha256Hash && !isTampered;
    const statusMessage = isValid
      ? 'Integrity verified: document matches its blockchain record.'
      : 'Integrity warning: hash mismatch detected.';

    auditService.logEvent({
      action: 'INTEGRITY_VERIFICATION',
      resourceType: 'DOCUMENT',
      resourceId: doc.id,
      resourceName: doc.fileName,
      details: isValid
        ? `Cryptographic hash check verified against ledger TX ${doc.blockchainTransactionId}. No tampering detected.`
        : `CRITICAL INTEGRITY MISMATCH: Computed hash ${computedHash} differs from registered immutable hash ${doc.sha256Hash}.`,
      result: isValid ? 'Success' : 'Warning',
      riskLevel: isValid ? 'Low' : 'Critical'
    });

    return {
      isValid,
      computedHash,
      recordedHash: doc.sha256Hash,
      blockchainTx: doc.blockchainTransactionId,
      statusMessage,
      blockNumber: 489312,
      timestamp: new Date().toISOString()
    };
  },

  digitallySignDocument(docId: string, certInfo?: string): Document {
    const docs = storageService.getDocuments();
    const index = docs.findIndex((d) => d.id === docId);
    if (index === -1) throw new Error('Document not found');

    const currentUser = authService.getCurrentUser();
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);

    const doc = docs[index];
    const newVersionNum = doc.version + 1;
    const signedTx = blockchainService.generateTransactionId('DOC');
    const newHash = blockchainService.generateSha256(`${doc.fileName}-signed-${dateStr}`);

    const newVersion: DocumentVersion = {
      version: newVersionNum,
      fileName: doc.fileName.replace(/\.([a-z]+)$/i, `_signed_v${newVersionNum}.$1`),
      uploadedAt: dateStr,
      uploadedBy: currentUser?.fullName || 'Prosecutor',
      fileSize: doc.fileSize,
      sha256Hash: newHash,
      blockchainTransactionId: signedTx,
      signatureStatus: 'Digitally Signed',
      changesSummary: `Cryptographic digital signature applied by ${currentUser?.fullName || 'Prosecutor'} (${currentUser?.role || 'Prosecutor'}). Certificate ID: ${certInfo || 'PROS-SIG-TOKEN-2026'}.`
    };

    const updatedDoc: Document = {
      ...doc,
      version: newVersionNum,
      status: 'Digitally Signed',
      signatureStatus: 'Digitally Signed',
      sha256Hash: newHash,
      blockchainTransactionId: signedTx,
      signedBy: `${currentUser?.fullName} (${currentUser?.role})`,
      signedAt: dateStr,
      lastModifiedAt: dateStr,
      versions: [...(doc.versions || []), newVersion]
    };

    docs[index] = updatedDoc;
    storageService.setDocuments([...docs]);

    auditService.logEvent({
      action: 'DIGITAL_SIGNATURE',
      resourceType: 'DOCUMENT',
      resourceId: updatedDoc.id,
      resourceName: updatedDoc.fileName,
      details: `Digital signature applied with high-assurance certificate. Hash recorded in blockchain TX ${signedTx}.`,
      result: 'Success',
      riskLevel: 'Low'
    });

    return updatedDoc;
  },

  toggleTamperSimulation(docId: string): Document {
    const docs = storageService.getDocuments();
    const index = docs.findIndex((d) => d.id === docId);
    if (index === -1) throw new Error('Document not found');

    const doc = docs[index];
    const newTamperState = !doc.tamperFlag;
    docs[index] = { ...doc, tamperFlag: newTamperState };
    storageService.setDocuments([...docs]);

    if (newTamperState) {
      auditService.logEvent({
        action: 'TAMPER_ALERT_TRIGGERED',
        resourceType: 'DOCUMENT',
        resourceId: doc.id,
        resourceName: doc.fileName,
        details: `Simulated unauthorized modification injected for testing. Byte hash mismatch will trigger on next verification.`,
        result: 'Warning',
        riskLevel: 'Critical'
      });
    }

    return docs[index];
  },

  archiveDocument(docId: string): Document {
    const docs = storageService.getDocuments();
    const index = docs.findIndex((d) => d.id === docId);
    if (index === -1) throw new Error('Document not found');

    const doc = docs[index];
    docs[index] = { ...doc, status: 'Archived', storageStatus: 'Cold Storage' };
    storageService.setDocuments([...docs]);

    auditService.logEvent({
      action: 'DOCUMENT_ARCHIVE',
      resourceType: 'DOCUMENT',
      resourceId: doc.id,
      resourceName: doc.fileName,
      details: `Document transitioned to tamper-sealed Cold Storage archival tier.`,
      result: 'Success',
      riskLevel: 'Medium'
    });

    return docs[index];
  }
};
