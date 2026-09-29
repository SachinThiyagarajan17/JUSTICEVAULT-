import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Cpu,
  RefreshCw,
  AlertCircle,
  Copy,
  ArrowRight,
  Sparkles,
  Layers,
  FileCheck2
} from 'lucide-react';
import { documentService } from '../services/documentService';
import { caseService } from '../services/caseService';
import { authService } from '../services/authService';
import { DocumentType, ConfidentialityLevel, Case } from '../types';
import { Badge } from '../components/common/Badge';
import { toast } from '../components/common/ToastContainer';

interface SecureUploadPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialCaseId?: string;
  initialCaseNumber?: string;
}

export function SecureUploadPage({
  onNavigate,
  initialCaseId,
  initialCaseNumber
}: SecureUploadPageProps) {
  const cases = caseService.getCases();
  const currentUser = authService.getCurrentUser();

  // Form State
  const [selectedCaseId, setSelectedCaseId] = useState(initialCaseId || cases[0]?.id || '');
  const [fileName, setFileName] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('Forensic Analysis Report');
  const [confidentiality, setConfidentiality] = useState<ConfidentialityLevel>('Restricted');
  const [retentionPeriod, setRetentionPeriod] = useState('2036-09-01 (10-Year Statutory Hold)');
  const [tagsInput, setTagsInput] = useState('Forensic, Cyber, Verified Intake');
  const [applyDigitalSign, setApplyDigitalSign] = useState(true);
  const [recordOnBlockchain, setRecordOnBlockchain] = useState(true);
  const [fileSize, setFileSize] = useState('1.8 MB');

  // Simulated File Content
  const [fileContent, setFileContent] = useState('');
  const [computedHash, setComputedHash] = useState('0x8f4d92a1c0e3b4a5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9');

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Upload progress simulation
  const [uploadStep, setUploadStep] = useState<'IDLE' | 'PROGRESS' | 'SUCCESS'>('IDLE');
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentStageText, setCurrentStageText] = useState('');
  const [uploadedDocId, setUploadedDocId] = useState<string | null>(null);

  useEffect(() => {
    if (initialCaseId) setSelectedCaseId(initialCaseId);
  }, [initialCaseId]);

  const handleFileSelect = (selectedName: string, sizeStr: string = '2.4 MB') => {
    setFileName(selectedName);
    setFileSize(sizeStr);
    // Generate simulated SHA-256 hash
    const fakeHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setComputedHash(fakeHash);
    setFileContent(
      `JUSTICEVAULT EVIDENTIARY SUBMISSION\nDocument: ${selectedName}\nGenerated: ${new Date().toISOString()}\n\nOfficial forensic inquest record containing statutory findings, digital chain logs, and evidentiary disclosures for judicial consideration under Indian Evidence Act / Federal Rules of Criminal Procedure.`
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const mbSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      handleFileSelect(file.name, mbSize);
    }
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) {
      toast.error('Please select or upload a document file.');
      return;
    }

    const matchedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
    setUploadStep('PROGRESS');
    setProgressPercent(15);
    setCurrentStageText('Computing SHA-256 cryptographic digest...');

    setTimeout(() => {
      setProgressPercent(45);
      setCurrentStageText('Encrypting payload via AES-256 hardware acceleration...');
    }, 350);

    setTimeout(() => {
      setProgressPercent(80);
      setCurrentStageText('Broadcasting transaction to Quorum validator blockchain nodes...');
    }, 700);

    setTimeout(() => {
      setProgressPercent(100);
      setCurrentStageText('Sealing digital signatures and creating tamper-evident audit receipt...');

      const tagsArray = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      const created = documentService.uploadDocument({
        caseId: matchedCase.id,
        caseNumber: matchedCase.caseNumber,
        fileName: fileName.trim(),
        documentType: documentType,
        description: `Verified upload for ${fileName.trim()} by ${currentUser?.fullName || 'Investigator'}.`,
        confidentiality: confidentiality,
        fileSize: fileSize,
        fileFormat: fileName.split('.').pop()?.toUpperCase() || 'PDF',
        tags: tagsArray.length > 0 ? tagsArray : ['Sealed Ingestion', documentType],
        contentSnippet: fileContent || `Official evidentiary content for ${fileName.trim()}`
      });

      if (applyDigitalSign) {
        try {
          documentService.digitallySignDocument(created.id, 'SEC-INTAKE-AUTO-SIGN');
        } catch (err) {
          console.warn('Auto sign error:', err);
        }
      }

      setUploadedDocId(created.id);
      setUploadStep('SUCCESS');
      toast.success(`Document ${created.fileName} successfully ingested and anchored.`);
    }, 1100);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(computedHash);
    toast.info('Cryptographic SHA-256 hash copied to clipboard.');
  };

  const handleResetForm = () => {
    setFileName('');
    setUploadStep('IDLE');
    setProgressPercent(0);
    setUploadedDocId(null);
  };

  const selectedCaseObj = cases.find((c) => c.id === selectedCaseId);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-['Cinzel',serif] flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-blue-600" />
          Secure Document Ingestion & Verification
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Zero-trust upload gateway with on-the-fly SHA-256 hashing, AES-256 encryption, and blockchain ledger anchoring
        </p>
      </div>

      {uploadStep === 'SUCCESS' ? (
        /* Success Screen */
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 font-['Cinzel',serif]">
              Evidentiary Document Anchored Successfully
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              File <strong className="text-slate-900">{fileName}</strong> has been sealed into Case{' '}
              <strong className="text-blue-700">{selectedCaseObj?.caseNumber}</strong>.
            </p>
          </div>

          {/* Cryptographic Receipt Card */}
          <div className="max-w-xl mx-auto p-4 bg-slate-900 text-slate-200 rounded-xl text-left text-xs font-mono space-y-2 border border-slate-800">
            <div className="flex items-center justify-between text-cyan-400 font-bold uppercase text-[11px]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Cryptographic Ledger Receipt
              </span>
              <span>Block #489318</span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px]">SHA-256 File Digest:</span>
              <div className="text-emerald-400 break-all text-[11px] select-all flex items-center justify-between">
                <span>{computedHash}</span>
                <button
                  onClick={handleCopyHash}
                  className="p-1 hover:text-white text-slate-400 shrink-0 ml-2"
                  title="Copy Hash"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
              <span>Timestamp: {new Date().toLocaleString()}</span>
              <span>Encryption: AES-256 Active</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('documents', { docId: uploadedDocId })}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <span>View Sealed Document in Repository</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetForm}
              className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Upload Another Document
            </button>
          </div>
        </div>
      ) : uploadStep === 'PROGRESS' ? (
        /* Progress Animation Screen */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-2xl text-center text-white space-y-6 animate-in fade-in">
          <div className="w-16 h-16 bg-blue-950 border border-cyan-500/40 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Cryptographically Sealing Evidentiary Record...</h3>
            <p className="text-xs text-slate-400 mt-1">{fileName}</p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{currentStageText}</span>
              <span className="font-bold text-cyan-400">{progressPercent}%</span>
            </div>
          </div>
        </div>
      ) : (
        /* Main Ingestion Form */
        <form onSubmit={handleSubmitUpload} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Form Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Target Case Selection */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Target Case Dossier
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Associated Case Proceeding *
                </label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.caseNumber}] {c.title} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              {selectedCaseObj && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200 flex items-center justify-between">
                  <span>Lead Officer: <strong>{selectedCaseObj.investigatingOfficer}</strong></span>
                  <Badge variant={selectedCaseObj.priority} size="sm">{selectedCaseObj.priority} Priority</Badge>
                </div>
              )}
            </div>

            {/* Step 2: Drag & Drop Ingestion Zone */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Document Artifact Ingestion
                </h3>
              </div>

              {/* Drag and drop area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-blue-600 bg-blue-50/80 scale-[1.01]'
                    : fileName
                    ? 'border-emerald-400 bg-emerald-50/40'
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80'
                }`}
                onClick={() => {
                  if (!fileName) {
                    handleFileSelect('CFSL_Ballistics_Spectrometry_Analysis.pdf', '3.1 MB');
                  }
                }}
              >
                {fileName ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-slate-900">{fileName}</div>
                    <div className="text-xs text-slate-500 font-mono">Size: {fileSize} • Validated Format</div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFileName('');
                      }}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Remove and Select Different File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        Drag and drop official legal document here
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Supported: PDF, DOCX, TIFF, MP4, JSON, CSV (Max 50MB)
                      </div>
                    </div>
                    <div className="inline-block px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm">
                      Browse Files / Use Demo File
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Metadata & Classification */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Statutory Metadata & Access Control
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Document Classification Type *
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="First Information Report (FIR)">First Information Report (FIR)</option>
                    <option value="Forensic Analysis Report">Forensic Analysis Report</option>
                    <option value="Witness Statement">Witness Statement</option>
                    <option value="Investigation Progress Report">Investigation Progress Report</option>
                    <option value="Digital Evidence Collection Form">Digital Evidence Collection Form</option>
                    <option value="Chain of Custody Form">Chain of Custody Form</option>
                    <option value="Charge Sheet">Charge Sheet</option>
                    <option value="Court Filing">Court Filing</option>
                    <option value="Search and Seizure Memo">Search and Seizure Memo</option>
                    <option value="Bail Application">Bail Application</option>
                    <option value="Final Investigation Report">Final Investigation Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Security Confidentiality Level *
                  </label>
                  <select
                    value={confidentiality}
                    onChange={(e) => setConfidentiality(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Public">Public (Unrestricted Access)</option>
                    <option value="Confidential">Confidential (Court & Prosecution)</option>
                    <option value="Restricted">Restricted (Assigned Team Only)</option>
                    <option value="Highly Restricted">Highly Restricted (Judicial In-Camera)</option>
                    <option value="Top Secret">Top Secret (National Security)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Retention Statutory Period
                </label>
                <input
                  type="text"
                  value={retentionPeriod}
                  onChange={(e) => setRetentionPeriod(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Comma-Separated Keywords / Tags
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Forensic, Cyber, Seizure, Ballistics"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right 1 Col: Security Summary & Submit */}
          <div className="space-y-6">
            <div className="p-5 bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl shadow-md space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Trust Security Controls</span>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={applyDigitalSign}
                    onChange={(e) => setApplyDigitalSign(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-200">Affix PKI Digital Signature</span>
                    <p className="text-[11px] text-slate-400">Sign with active token as {currentUser?.fullName}</p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={recordOnBlockchain}
                    onChange={(e) => setRecordOnBlockchain(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-200">Record SHA-256 on Blockchain</span>
                    <p className="text-[11px] text-slate-400">Immutable timestamping across Quorum nodes</p>
                  </div>
                </label>
              </div>

              {/* Hash Preview Block */}
              {fileName && (
                <div className="pt-3 border-t border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <span className="text-slate-400 font-sans text-xs">Live SHA-256 Digest:</span>
                  <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-cyan-300 break-all">
                    {computedHash}
                  </div>
                </div>
              )}
            </div>

            {/* Ingestion Submit Button */}
            <button
              type="submit"
              disabled={!fileName}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Seal & Ingest Document</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
