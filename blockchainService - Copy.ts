export interface BlockchainTransaction {
  txId: string;
  blockNumber: number;
  timestamp: string;
  fromAddress: string;
  toContract: string;
  payloadHash: string;
  consensusProof: string;
  validatorNodes: string[];
  status: 'Committed & Finalized' | 'Pending Quorum' | 'Invalidated';
}

function generateHex(length: number): string {
  const chars = '0123456789abcdef';
  let s = '';
  for (let i = 0; i < length; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

export const blockchainService = {
  generateSha256(seedText?: string): string {
    if (!seedText) {
      return generateHex(64);
    }
    // Deterministic simulation based on string chars + length
    let h = 0x811c9dc5;
    for (let i = 0; i < seedText.length; i++) {
      h ^= seedText.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    const base = Math.abs(h).toString(16).padStart(8, '0');
    return (base + generateHex(56)).substring(0, 64);
  },

  generateTransactionId(prefix: 'DOC' | 'EVD' | 'TX' = 'TX'): string {
    const year = new Date().getFullYear();
    const hex = generateHex(14).toUpperCase();
    return `0xJV${year}${prefix}${hex}`;
  },

  getTransactionDetails(txId: string): BlockchainTransaction {
    return {
      txId,
      blockNumber: 489120 + Math.floor(Math.random() * 500),
      timestamp: new Date().toISOString(),
      fromAddress: `0x71C...${generateHex(6)}`,
      toContract: '0x000000000000000000000000000000000000DEAD_JUSTICE_REGISTRY',
      payloadHash: generateHex(64),
      consensusProof: 'IBFT-2.0-QBFT-Dual-Signature-Quorum',
      validatorNodes: [
        'Node-01-HighCourt-Registry',
        'Node-02-ForensicLab-Primary',
        'Node-03-PoliceDirectorate',
        'Node-04-ProsecutionOversight'
      ],
      status: 'Committed & Finalized'
    };
  },

  verifyRecord(recordHash: string, recordedTx: string): {
    isValid: boolean;
    computedHash: string;
    recordedHash: string;
    blockNumber: number;
    timestamp: string;
    signer: string;
    details: string;
  } {
    // Check if simulate tamper
    const isTampered = recordHash.endsWith('tampered');
    return {
      isValid: !isTampered,
      computedHash: recordHash,
      recordedHash: recordHash,
      blockNumber: 489240,
      timestamp: new Date().toISOString(),
      signer: 'JusticeLedger State Seal Authority (0x992B...41C)',
      details: isTampered
        ? 'Integrity Warning: Computed SHA-256 byte digest differs from genesis immutable blockchain ledger block.'
        : 'Integrity Verified: Document matches its immutable blockchain record and cryptographically signed Merkle branch.'
    };
  }
};
