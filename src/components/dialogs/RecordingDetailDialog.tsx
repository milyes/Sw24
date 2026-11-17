import React, { useState } from 'react';
import { AudioRecording } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Save, Sparkles, FileAudio, CheckCircle2, HardDrive, Clock } from 'lucide-react';

interface RecordingDetailDialogProps {
  recording: AudioRecording;
  onClose: () => void;
}

export const RecordingDetailDialog: React.FC<RecordingDetailDialogProps> = ({
  recording,
  onClose
}) => {
  const { updateRecordingTranscription, analyzeRecordingWithAi, isAiAnalyzing, tr } = useApp();
  const [transcriptionText, setTranscriptionText] = useState(recording.transcription || '');

  const handleSaveTranscription = () => {
    updateRecordingTranscription(recording.id, transcriptionText);
  };

  const handleAiAnalyze = () => {
    analyzeRecordingWithAi(recording);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        data-testid="recording_detail_dialog"
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <FileAudio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">{recording.title}</h2>
              <p className="text-xs text-slate-400 font-mono">{recording.fileName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 font-mono text-xs">
            <div>
              <span className="text-slate-400 block">Durée:</span>
              <span className="text-slate-200 font-semibold">{recording.durationSeconds}s</span>
            </div>
            <div>
              <span className="text-slate-400 block">Taille fichier:</span>
              <span className="text-slate-200 font-semibold">{recording.fileSizeMb} MB</span>
            </div>
            <div>
              <span className="text-slate-400 block">Statut synchronisation:</span>
              <span className="text-emerald-400 font-semibold">{recording.syncStatus}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Date capture:</span>
              <span className="text-slate-200">{new Date(recording.timestamp).toLocaleString('fr-FR')}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block">Chemin Cloud Google Drive:</span>
              <span className="text-slate-300 break-all">{recording.cloudPath}</span>
            </div>
          </div>

          {/* AI Summary Section */}
          <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Synthèse Gemini AI</span>
              </div>
              <button
                onClick={handleAiAnalyze}
                disabled={isAiAnalyzing}
                className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors cursor-pointer font-medium"
              >
                {isAiAnalyzing ? 'Analyse...' : 'Relancer Analyse'}
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {recording.aiSummary || "Aucune analyse générée. Cliquez sur 'Relancer Analyse' pour soumettre cet enregistrement à Gemini."}
            </p>
          </div>

          {/* Transcription Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Transcription vocale :
              </label>
              <button
                onClick={handleSaveTranscription}
                className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Sauvegarder</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={transcriptionText}
              onChange={(e) => setTranscriptionText(e.target.value)}
              placeholder="Saisissez ou modifiez la transcription..."
              className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-mono resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
