import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NetsecureProLicenseCard } from '../components/NetsecureProLicenseCard';
import { Sparkles, BrainCircuit, FileAudio, ArrowRight, CheckCircle2, RotateCw } from 'lucide-react';

export const AiStudioScreen: React.FC = () => {
  const { 
    recordings, 
    aiAnalysisResult, 
    isAiAnalyzing, 
    analyzeRecordingWithAi,
    tr 
  } = useApp();

  const [selectedRecId, setSelectedRecId] = useState<number | null>(
    recordings[0]?.id || null
  );
  const [promptInput, setPromptInput] = useState(
    "Analyse la structure, les fréquences dominantes et les points clés de cette capture vocale Z-CORE."
  );

  const selectedRecording = recordings.find(r => r.id === selectedRecId) || recordings[0];

  const handleRunAnalysis = () => {
    if (!selectedRecording) return;
    analyzeRecordingWithAi(selectedRecording, promptInput);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Gemini AI Audio Studio
            </h2>
            <p className="text-xs text-slate-400">
              Analyse acoustique, transcription & synthèse Z-CORE vocale
            </p>
          </div>
        </div>
      </div>

      {/* 2. Official License Card */}
      <NetsecureProLicenseCard isInitiallyExpanded={false} />

      {/* 3. Audio File Selection & Prompt Input */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1.5">
            Sélectionner un fichier audio Z-CORE :
          </label>
          <select
            value={selectedRecording?.id || ''}
            onChange={(e) => setSelectedRecId(parseInt(e.target.value, 10))}
            data-testid="ai_file_select_dropdown"
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
          >
            {recordings.map(rec => (
              <option key={rec.id} value={rec.id}>
                {rec.title} ({rec.fileName} • {rec.durationSeconds}s)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1.5">
            Instruction d'analyse Gemini :
          </label>
          <textarea
            rows={3}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            data-testid="ai_prompt_input"
            placeholder="Posez une question ou demandez une synthèse sur cet audio..."
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={isAiAnalyzing || !selectedRecording}
          data-testid="generate_ai_btn"
          className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-indigo-500/20"
        >
          {isAiAnalyzing ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Analyse Gemini en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Générer l'Analyse IA</span>
            </>
          )}
        </button>
      </div>

      {/* 4. Analysis Result Card */}
      {aiAnalysisResult && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
              <BrainCircuit className="w-4 h-4" />
              <span>Résultat de l'Analyse Google Gemini</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300">
              Modèle: gemini-2.5-flash
            </span>
          </div>

          <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            {aiAnalysisResult}
          </div>

          {selectedRecording?.transcription && (
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">
                Transcription synchronisée :
              </span>
              <p className="text-xs text-slate-300 font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                {selectedRecording.transcription}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
