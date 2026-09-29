import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  FileText,
  Layers,
  Calendar,
  UserCheck,
  AlertTriangle,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  GitCompare,
  Search,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { documentService } from '../../services/documentService';
import { storageService } from '../../services/storageService';
import { AIAssistantResponse, Document } from '../../types';
import { Badge } from '../common/Badge';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocumentId?: string;
}

export function AIAssistantDrawer({ isOpen, onClose, initialDocumentId }: AIAssistantDrawerProps) {
  const [documents, setDocuments] = useState<Document[]>(documentService.getDocuments());
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDocumentId || documents[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'ENTITIES' | 'DATES' | 'METADATA' | 'COMPARE' | 'TIMELINE'>('SUMMARY');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIAssistantResponse | null>(null);

  // Compare version state
  const [v1, setV1] = useState(1);
  const [v2, setV2] = useState(2);
  const [compareResult, setCompareResult] = useState<any | null>(null);

  // Timeline state
  const [timelineResult, setTimelineResult] = useState<any | null>(null);

  useEffect(() => {
    if (initialDocumentId) {
      setSelectedDocId(initialDocumentId);
    }
  }, [initialDocumentId]);

  useEffect(() => {
    const unsub = storageService.subscribe(() => {
      setDocuments(documentService.getDocuments());
    });
    return unsub;
  }, []);

  const selectedDoc = documents.find((d) => d.id === selectedDocId);

  useEffect(() => {
    if (isOpen && selectedDoc) {
      handleAnalyzeDocument(selectedDoc);
    }
  }, [isOpen, selectedDocId]);

  const handleAnalyzeDocument = async (doc: Document) => {
    setIsLoading(true);
    setCompareResult(null);
    setTimelineResult(null);
    try {
      const res = await aiService.analyzeDocument(doc);
      setAiResult(res);
    } catch (err) {
      console.error('AI analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunComparison = async () => {
    if (!selectedDoc) return;
    setIsLoading(true);
    try {
      const res = await aiService.compareVersions(selectedDoc, v1, v2);
      setCompareResult(res);
    } catch (err) {
      console.error('Compare error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunTimeline = async () => {
    if (!selectedDoc) return;
    setIsLoading(true);
    try {
      const res = await aiService.generateCaseTimeline(selectedDoc.caseNumber);
      setTimelineResult(res);
    } catch (err) {
      console.error('Timeline error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-slate-200 flex flex-col z-10 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-5 h-5 text-cyan-200" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  JusticeVault Assistant
                  <span className="text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-700/50 px-2 py-0.5 rounded-full">
                    Audited AI Engine
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Legal & forensic document intelligence assistant
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Document Selector Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex-1 w-full">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Active Analyzed Document
              </label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    [{d.caseNumber}] {d.fileName} (v{d.version})
                  </option>
                ))}
              </select>
            </div>
            {selectedDoc && (
              <div className="shrink-0 flex items-center gap-2 mt-4 sm:mt-0">
                <Badge variant={selectedDoc.confidentiality} size="sm">
                  {selectedDoc.confidentiality}
                </Badge>
                <Badge variant={selectedDoc.signatureStatus} size="sm">
                  {selectedDoc.signatureStatus}
                </Badge>
              </div>
            )}
          </div>

          {/* Assistant Action Tabs */}
          <div className="px-6 pt-3 border-b border-slate-200 flex gap-2 overflow-x-auto bg-white">
            {[
              { id: 'SUMMARY', label: 'Executive Summary', icon: FileText },
              { id: 'ENTITIES', label: 'Named Entities', icon: UserCheck },
              { id: 'DATES', label: 'Key Dates', icon: Calendar },
              { id: 'METADATA', label: 'Missing Metadata', icon: AlertTriangle },
              { id: 'COMPARE', label: 'Compare Versions', icon: GitCompare },
              { id: 'TIMELINE', label: 'Case Timeline', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id === 'COMPARE' && !compareResult) handleRunComparison();
                    if (tab.id === 'TIMELINE' && !timelineResult) handleRunTimeline();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* AI Content View */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {isLoading ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-800">
                  Processing document structure and extracting verified entities...
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  Grounding response against case records
                </p>
              </div>
            ) : aiResult ? (
              <>
                {/* TAB 1: SUMMARY */}
                {activeTab === 'SUMMARY' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-blue-600" /> Executive Digest
                        </span>
                        <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                          Confidence: {aiResult.confidence.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed font-normal">
                        {aiResult.summary}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Core Factual Points
                      </h4>
                      <ul className="space-y-2">
                        {aiResult.keyFacts.map((fact, idx) => (
                          <li
                            key={idx}
                            className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5"
                          >
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-snug">{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* TAB 2: NAMED ENTITIES */}
                {activeTab === 'ENTITIES' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Identified Persons, Organizations & Evidence
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {aiResult.entities.map((ent, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900">{ent.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              Source: {ent.sourceReference}
                            </div>
                          </div>
                          <Badge
                            variant={
                              ent.type === 'person'
                                ? 'active'
                                : ent.type === 'evidence'
                                ? 'blockchain'
                                : ent.type === 'organization'
                                ? 'confidential'
                                : 'neutral'
                            }
                            size="sm"
                          >
                            {ent.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: IMPORTANT DATES */}
                {activeTab === 'DATES' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Chronological Milestone Dates
                    </h4>
                    <div className="space-y-2">
                      {aiResult.importantDates.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3"
                        >
                          <div className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-mono font-bold shrink-0 text-center">
                            {item.date}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{item.description}</div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              Source: {item.sourceReference}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: MISSING METADATA & RISK FLAGS */}
                {activeTab === 'METADATA' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Identified Gaps & Missing Metadata
                      </h4>
                      {aiResult.missingMetadata.length > 0 ? (
                        <ul className="space-y-2">
                          {aiResult.missingMetadata.map((gap, idx) => (
                            <li
                              key={idx}
                              className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2"
                            >
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-emerald-600 font-medium">All mandatory statutory metadata fields present.</p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
                        Risk & Security Observations
                      </h4>
                      <ul className="space-y-2">
                        {aiResult.riskFlags.map((risk, idx) => (
                          <li
                            key={idx}
                            className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg text-xs text-rose-900 flex items-start gap-2"
                          >
                            <span className="text-rose-600 font-bold">!</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* TAB 5: COMPARE VERSIONS */}
                {activeTab === 'COMPARE' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Version A</label>
                        <select
                          value={v1}
                          onChange={(e) => setV1(Number(e.target.value))}
                          className="w-full text-xs font-semibold p-1.5 bg-white border border-slate-300 rounded"
                        >
                          <option value={1}>Version 1 (Initial Intake)</option>
                          <option value={2}>Version 2 (Reviewed)</option>
                          <option value={3}>Version 3 (Digitally Signed)</option>
                        </select>
                      </div>
                      <span className="text-slate-400 font-bold">vs</span>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Version B</label>
                        <select
                          value={v2}
                          onChange={(e) => setV2(Number(e.target.value))}
                          className="w-full text-xs font-semibold p-1.5 bg-white border border-slate-300 rounded"
                        >
                          <option value={2}>Version 2 (Reviewed)</option>
                          <option value={3}>Version 3 (Digitally Signed)</option>
                          <option value={4}>Version 4 (Court Submission)</option>
                        </select>
                      </div>
                      <button
                        onClick={handleRunComparison}
                        className="mt-4 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
                      >
                        Compare
                      </button>
                    </div>

                    {compareResult && (
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                          <strong>Summary of Revisions:</strong> {compareResult.differencesSummary}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-700 uppercase mb-2">Detected Changes</h5>
                          <ul className="space-y-1.5">
                            {compareResult.changes.map((c: string, i: number) => (
                              <li key={i} className="text-xs text-slate-800 p-2 bg-slate-50 border border-slate-200 rounded flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 6: CASE TIMELINE */}
                {activeTab === 'TIMELINE' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Auto-Generated Case Milestone Timeline
                    </h4>
                    {timelineResult && (
                      <div className="relative pl-6 border-l-2 border-blue-400 space-y-4 my-2">
                        {timelineResult.events.map((evt: any, i: number) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />
                            <div className="text-xs font-bold font-mono text-blue-600">{evt.date}</div>
                            <div className="text-xs font-bold text-slate-900">{evt.title}</div>
                            <div className="text-[11px] text-slate-600">{evt.description}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Source: {evt.source}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : null}
          </div>

          {/* AI Strict Disclaimer Footer */}
          <div className="p-4 bg-slate-950 text-slate-400 border-t border-slate-800 text-[11px] flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-semibold">Strict Judicial Disclaimer:</span>{' '}
              AI suggestions require review by an authorized professional. The model does not make legal findings, predict trial outcomes, or replace authorized legal counsel.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
