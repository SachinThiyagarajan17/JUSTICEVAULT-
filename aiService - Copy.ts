import { AIAssistantResponse, Document } from '../types';
import { storageService } from './storageService';

export const aiService = {
  async analyzeDocument(doc: Document): Promise<AIAssistantResponse> {
    // Simulate brief processing delay for realistic responsiveness
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Tailored structured response based on document
    if (doc.id === 'DOC-001' || doc.fileName.includes('ArjunMehta')) {
      return {
        summary: 'First Information Report regarding corporate embezzlement and extortion. Complainant Shri R. K. Singhania alleges suspect Arjun Mehta fabricated board authorizations to siphon USD 1.4M into offshore shadow accounts and issued threats of commercial sabotage.',
        keyFacts: [
          'Initial complaint logged under Section 420/384 (Cheating and Extortion).',
          'Primary financial transfer volume noted as USD 1.4M.',
          'Two in-person meetings alleged on May 15 and May 22, 2026.',
          'Cryptographic signature applied by Adv. Vikramaditya Sen on 2026-08-25.'
        ],
        entities: [
          { name: 'Arjun Mehta', type: 'person', sourceReference: 'FIR Section 2: Accused Particulars' },
          { name: 'R. K. Singhania', type: 'person', sourceReference: 'FIR Section 1: Complainant' },
          { name: 'Inspector Kavya Rao', type: 'person', sourceReference: 'Investigation Branch Signature Block' },
          { name: 'Sessions Court Division 4', type: 'location', sourceReference: 'Jurisdiction Stamp' },
          { name: 'Samsung 990 Pro NVMe SSD', type: 'evidence', sourceReference: 'Seizure Annexure B' }
        ],
        importantDates: [
          { date: '2026-05-15', description: 'Alleged initial demand meeting at Westside Club', sourceReference: 'FIR Paragraph 4' },
          { date: '2026-05-22', description: 'Secondary extortion communication logged', sourceReference: 'FIR Paragraph 6' },
          { date: '2026-06-12', description: 'Official FIR registration at Central Police Station', sourceReference: 'Station Daily Diary #89' },
          { date: '2026-08-25', description: 'Prosecution verification and digital signature', sourceReference: 'Digital Certificate Block' },
          { date: '2026-09-18', description: 'Scheduled preliminary hearing date', sourceReference: 'Court Registry Notice' }
        ],
        missingMetadata: [
          'Offshore receiving bank SWIFT code not specified in initial body.',
          'Full legal counsel identity for defense pending formal notice service.'
        ],
        riskFlags: [
          'High financial exposure (exceeds $1M threshold).',
          'Potential cross-border jurisdiction extradition requirements.'
        ],
        confidence: 'high',
        disclaimer: 'AI suggestions require review by an authorized professional. This analysis is generated from document text and does not constitute a legal finding.'
      };
    }

    if (doc.id === 'DOC-005' || doc.fileName.includes('LockBitX')) {
      return {
        summary: 'Technical forensic teardown of LockBitX ransomware variant deployed against municipal water filtration supervisory control nodes (SCADA). Details payload entry vectors, encryption routines, and command-and-control IP infrastructure.',
        keyFacts: [
          'Targeted critical infrastructure ICS network via spear-phishing payload.',
          'Encryption utilized ChaCha20-Poly1305 with elliptic curve key exchange.',
          'Command-and-control beaconing traced to bulletproof hosting endpoints in Eastern Europe.',
          'Memory volatile dump captured before system restart preserved decryption key remnants.'
        ],
        entities: [
          { name: 'Dr. Asha Menon', type: 'person', sourceReference: 'Lead Forensic Examiner Block' },
          { name: 'Municipal Water Utility', type: 'organization', sourceReference: 'Affected Infrastructure Entity' },
          { name: 'Officer Rohan Das', type: 'person', sourceReference: 'Cyber Cell Investigating Officer' },
          { name: '0x7a8...99e', type: 'evidence', sourceReference: 'Ransom Demand Wallet Address' }
        ],
        importantDates: [
          { date: '2026-07-04', description: 'Initial ransomware beacon detected on SCADA Gateway', sourceReference: 'Event Log ID 4091' },
          { date: '2026-07-05', description: 'Router volatile RAM acquisition snapshot executed', sourceReference: 'Evidence EVD-2026-002A' },
          { date: '2026-07-28', description: 'Forensic reverse-engineering report published', sourceReference: 'Lab Report #FOR-881' }
        ],
        missingMetadata: [
          'Formal CVE identifier for zero-day component pending national CERT assignment.',
          'Vendor patch validation confirmation pending.'
        ],
        riskFlags: [
          'Critical public safety infrastructure vector.',
          'Active threat syndicate attribution.'
        ],
        confidence: 'high',
        disclaimer: 'AI suggestions require review by an authorized professional.'
      };
    }

    // Generic mock response for other documents
    return {
      summary: `Automated summary of ${doc.fileName} (${doc.documentType}). Document is registered in Case ${doc.caseNumber} under ${doc.confidentiality} confidentiality and currently held by ${doc.currentCustodian}.`,
      keyFacts: [
        `Document registered with SHA-256 hash: ${doc.sha256Hash.substring(0, 24)}...`,
        `Cryptographic blockchain transaction commitment: ${doc.blockchainTransactionId}`,
        `Current version: v${doc.version} (${doc.status})`,
        `File classification: ${doc.confidentiality}`
      ],
      entities: [
        { name: doc.uploadedBy, type: 'person', sourceReference: 'Uploader Information' },
        { name: doc.department, type: 'organization', sourceReference: 'Department Record' },
        { name: doc.caseNumber, type: 'case', sourceReference: 'Case Registry' },
        { name: doc.currentCustodian, type: 'person', sourceReference: 'Custody Block' }
      ],
      importantDates: [
        { date: doc.uploadedAt.split(' ')[0], description: 'Original Secure Upload Timestamp', sourceReference: 'Ledger Genesis' },
        { date: doc.lastModifiedAt.split(' ')[0], description: 'Last Verified State Modification', sourceReference: 'Audit Index' }
      ],
      missingMetadata: [
        'Secondary witness cosignature block optional for this document class.'
      ],
      riskFlags: [
        doc.confidentiality === 'Highly Restricted' ? 'Requires Level-3 security clearance to decrypt' : 'Standard institutional retention rules apply'
      ],
      confidence: 'medium',
      disclaimer: 'AI suggestions require review by an authorized professional.'
    };
  },

  async compareVersions(doc: Document, v1: number, v2: number): Promise<{
    versionA: number;
    versionB: number;
    changes: string[];
    differencesSummary: string;
    hashComparison: { v1Hash: string; v2Hash: string; isIdentical: boolean };
    disclaimer: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const verA = doc.versions?.find((v) => v.version === v1) || {
      version: v1,
      fileName: `${doc.fileName} (v${v1})`,
      uploadedAt: doc.uploadedAt,
      uploadedBy: doc.uploadedBy,
      fileSize: doc.fileSize,
      sha256Hash: doc.sha256Hash,
      blockchainTransactionId: doc.blockchainTransactionId,
      signatureStatus: 'Unsigned'
    };

    const verB = doc.versions?.find((v) => v.version === v2) || {
      version: v2,
      fileName: `${doc.fileName} (v${v2})`,
      uploadedAt: doc.lastModifiedAt,
      uploadedBy: doc.uploadedBy,
      fileSize: doc.fileSize,
      sha256Hash: `${doc.sha256Hash.substring(0, 60)}ff99`,
      blockchainTransactionId: `0xJV2026DOC_V${v2}`,
      signatureStatus: 'Digitally Signed'
    };

    return {
      versionA: v1,
      versionB: v2,
      changes: [
        `Version ${v2} includes verified digital signature token from authorized officer.`,
        `Annexure references updated with verified forensic evidence numbers.`,
        `Formal submission stamp for judicial registry added in header metadata.`,
        `File byte size adjusted from ${verA.fileSize} to ${verB.fileSize}.`
      ],
      differencesSummary: `Version ${v2} reflects the finalized court-ready document with cryptographic digital signature and exhibit tags applied. Version ${v1} was the initial raw investigative intake draft.`,
      hashComparison: {
        v1Hash: verA.sha256Hash,
        v2Hash: verB.sha256Hash,
        isIdentical: verA.sha256Hash === verB.sha256Hash
      },
      disclaimer: 'AI version comparison is an analytical aid and does not substitute for judicial side-by-side inspection.'
    };
  },

  async generateCaseTimeline(caseNumber: string): Promise<{
    events: { date: string; title: string; type: string; description: string; source: string }[];
    disclaimer: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const docs = storageService.getDocuments().filter((d) => d.caseNumber === caseNumber);
    const evidence = storageService.getEvidenceItems().filter((e) => e.caseNumber === caseNumber);

    const events = [
      {
        date: '2026-06-12',
        title: 'Investigation Initiated & FIR Logged',
        type: 'Case Milestone',
        description: 'First Information Report registered at Central Police Station by Inspector Kavya Rao.',
        source: 'FIR_2026_089_ArjunMehta.pdf'
      },
      {
        date: '2026-06-18',
        title: 'Search Warrant Execution & Evidence Seizure',
        type: 'Evidence Collection',
        description: 'Physical NVMe storage and handwritten cryptographic ledger notebook seized and sealed under TEB-902188.',
        source: 'Search_And_Seizure_Memo_MehtaResidence.pdf'
      },
      {
        date: '2026-06-20',
        title: 'Forensic Lab Intake & Bit-Stream Imaging',
        type: 'Forensic Milestone',
        description: 'Evidence transferred to Dr. Asha Menon at Central Forensic Science Laboratory for hardware write-blocked clone.',
        source: 'Chain of Custody Event #EVT-003'
      },
      {
        date: '2026-07-15',
        title: 'Technical Forensic Report Completed',
        type: 'Technical Analysis',
        description: 'Digital trail analysis confirmed unauthorized Zurich VPN session matching fraudulent ledger alterations.',
        source: 'Forensic_Analysis_ServerLog_v2.pdf'
      },
      {
        date: '2026-08-25',
        title: 'Prosecution Review & Digital Signature Seal',
        type: 'Legal Milestone',
        description: 'Adv. Vikramaditya Sen validated evidence package and applied digital signature token.',
        source: 'Digital Certificate Block PROS-552'
      },
      {
        date: '2026-09-18',
        title: 'Scheduled Court Hearing',
        type: 'Judicial Proceeding',
        description: 'Preliminary hearing scheduled before Sessions Court Division 4.',
        source: 'Court Registry Docket'
      }
    ];

    return {
      events,
      disclaimer: 'AI suggestions require review by an authorized professional. Timeline extracted automatically from verified case records.'
    };
  }
};
