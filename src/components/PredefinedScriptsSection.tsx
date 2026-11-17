import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PredefinedTermuxScript } from '../types';
import { 
  Play, 
  Copy, 
  Check, 
  Terminal, 
  SlidersHorizontal, 
  Code2, 
  ChevronDown, 
  ChevronUp, 
  Layers 
} from 'lucide-react';

export const PredefinedScriptsSection: React.FC = () => {
  const { 
    predefinedScripts, 
    executePredefinedScript, 
    generateScriptCode, 
    lastTermuxResult, 
    tr, 
    addToast 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedScriptId, setExpandedScriptId] = useState<string | null>(predefinedScripts[0]?.id || null);
  const [scriptArgs, setScriptArgs] = useState<Record<string, Record<string, string>>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { key: 'ALL', label: tr('Tous les scripts', 'All Scripts') },
    { key: 'RCLONE_CLOUD', label: tr('Cloud & Rclone', 'Cloud & Rclone') },
    { key: 'AUDIO_PROCESSING', label: tr('Traitement Audio', 'Audio Processing') },
    { key: 'STORAGE_SYSTEM', label: tr('Stockage & Système', 'Storage & System') },
    { key: 'TELEMETRY_GHOST', label: tr('Télémétrie Z-GHOST', 'Z-GHOST Telemetry') }
  ];

  const filtered = predefinedScripts.filter(s => 
    selectedCategory === 'ALL' || s.category === selectedCategory
  );

  const handleArgChange = (scriptId: string, argKey: string, value: string) => {
    setScriptArgs(prev => ({
      ...prev,
      [scriptId]: {
        ...(prev[scriptId] || {}),
        [argKey]: value
      }
    }));
  };

  const getArgsForScript = (script: PredefinedTermuxScript) => {
    const defaults: Record<string, string> = {};
    script.arguments.forEach(a => {
      defaults[a.key] = a.defaultValue;
    });
    return { ...defaults, ...(scriptArgs[script.id] || {}) };
  };

  const handleCopyCode = (script: PredefinedTermuxScript) => {
    const args = getArgsForScript(script);
    const code = generateScriptCode(script, args);
    navigator.clipboard.writeText(code);
    setCopiedId(script.id);
    addToast(tr("Script Shell copié dans le presse-papier !", "Shell script copied to clipboard!"), 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExecute = (script: PredefinedTermuxScript) => {
    const args = getArgsForScript(script);
    executePredefinedScript(script, args, script.defaultRunInBackground);
  };

  return (
    <div className="space-y-4">
      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Scripts Accordion / List */}
      <div className="space-y-3">
        {filtered.map(script => {
          const isExpanded = expandedScriptId === script.id;
          const currentArgs = getArgsForScript(script);
          const generatedCode = generateScriptCode(script, currentArgs);

          return (
            <div
              key={script.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-all"
            >
              {/* Header */}
              <div
                onClick={() => setExpandedScriptId(isExpanded ? null : script.id)}
                className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/40"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">
                      {tr(script.titleFr, script.titleEn)}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {tr(script.descriptionFr, script.descriptionEn)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                    {script.category}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Expanded Configuration & Shell Code Preview */}
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-slate-800/80 space-y-3 mt-1">
                  {/* Arguments Inputs */}
                  {script.arguments.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{tr("Arguments & Variables du Script :", "Script Arguments & Variables:")}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {script.arguments.map(arg => (
                          <div key={arg.key} className="space-y-1">
                            <label className="text-[10.5px] font-medium text-slate-400 block truncate">
                              {tr(arg.labelFr, arg.labelEn)}
                            </label>
                            <input
                              type="text"
                              value={currentArgs[arg.key] || ''}
                              onChange={(e) => handleArgChange(script.id, arg.key, e.target.value)}
                              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Shell Code Preview */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{tr("Code Bash Généré :", "Generated Bash Code:")}</span>
                      </span>
                      <button
                        onClick={() => handleCopyCode(script)}
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 cursor-pointer"
                      >
                        {copiedId === script.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === script.id ? "Copié" : "Copier"}</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-[11px] text-emerald-400/90 overflow-x-auto max-h-48 leading-relaxed">
                      {generatedCode}
                    </pre>
                  </div>

                  {/* Execution Action Button */}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleExecute(script)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>{tr("Transmettre Intent Termux", "Dispatch Termux Intent")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Last Result Banner */}
      {lastTermuxResult && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold text-emerald-400">{lastTermuxResult.scriptTitle} :</span>
            <span className="text-slate-300 truncate max-w-sm">{lastTermuxResult.message}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {new Date(lastTermuxResult.timestamp).toLocaleTimeString('fr-FR')}
          </span>
        </div>
      )}
    </div>
  );
};
