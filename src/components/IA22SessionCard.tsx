import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Server, 
  Wifi, 
  Radio, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  ShieldAlert 
} from 'lucide-react';

export const IA22SessionCard: React.FC = () => {
  const { 
    ia22SessionStatus, 
    setIa22TunnelUrl, 
    pingIa22Tunnel, 
    wipeIa22SessionTraces, 
    triggerIa22AdbBroadcast,
    tr,
    addToast
  } = useApp();

  const [copiedBatch, setCopiedBatch] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);

  const windowsBatchScript = `@echo off
TITLE Windows System Core Update - IA22 Logic (Noeud S24)
COLOR 0A
echo ========================================================
echo  SCRIPT WINDOWS BATCH (.BAT) & COMPAGNON TERMUX S24
echo  TITRE: Windows System Core Update - IA22 Logic
echo  NOEUD MAITRE: S24 | OPERATEUR: M.I. ZOUBIROU
echo  TUNNEL CLOUDFLARE: ${ia22SessionStatus.tunnelUrl}
echo  LOGIC COVER: ${ia22SessionStatus.tunnelUrl}/logic_cover.html
echo ========================================================
echo.
echo [LOG] Initializing IA22 Logic...
echo [LOG] Verification du Noeud Maitre (S24)...
adb devices
adb shell am broadcast -a com.example.audiosynchub.IA22_SESSION_ACTIVE --es message "IA22 : SESSION ACTIVE - M.I. ZOUBIROU"
adb shell am broadcast -a android.intent.action.MAIN --es message "IA22 : SESSION ACTIVE - M.I. ZOUBIROU"
echo [LOG] Verification Tunnel distant Cloudflare...
echo [LOG] URL Active: ${ia22SessionStatus.tunnelUrl}
echo [LOG] Transmission cle deverrouillage IA (979V11)...
echo [LOG] Nettoyage RAM & traces de session pour mx76...
adb shell pkill -u mx76 2>nul
adb shell history -c 2>nul
echo [LOG] System Secure. Deconnexion du S24 autorisee.
pause`;

  const copyBatchScript = () => {
    navigator.clipboard.writeText(windowsBatchScript);
    setCopiedBatch(true);
    addToast(tr("Script Windows Batch (.BAT) copié !", "Windows Batch (.BAT) script copied!"), 'success');
    setTimeout(() => setCopiedBatch(false), 2000);
  };

  return (
    <div 
      data-testid="ia22_session_card"
      className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
    >
      {/* Title & Master Node Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mt-0.5">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">
                IA22 Windows Core Update & Noeud Maître S24
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                NOEUD S24
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Opérateur: <strong className="text-slate-200">{ia22SessionStatus.operatorName}</strong> • Montreal QC
            </p>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{ia22SessionStatus.tunnelStatus.split(' ')[0]}</span>
        </div>
      </div>

      {/* Cloudflare Tunnel Status Bar */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tunnel Cloudflare (Ghost Routing) :</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold truncate max-w-[200px]">
            {ia22SessionStatus.tunnelStatus}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={ia22SessionStatus.tunnelUrl}
            onChange={(e) => setIa22TunnelUrl(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={pingIa22Tunnel}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer shrink-0"
            title="Tester la latence HTTP du tunnel"
          >
            Tester Ping
          </button>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          onClick={triggerIa22AdbBroadcast}
          className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs hover:bg-emerald-500/25 transition-colors cursor-pointer"
        >
          <Radio className="w-4 h-4 text-emerald-400" />
          <span>Broadcast ADB S24</span>
        </button>

        <button
          onClick={wipeIa22SessionTraces}
          className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold text-xs hover:bg-rose-500/25 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4 text-rose-400" />
          <span>Purger Traces & RAM</span>
        </button>

        <button
          onClick={() => setShowBatchModal(true)}
          className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>Script Windows .BAT</span>
        </button>
      </div>

      {/* Last message banner */}
      <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 font-mono text-[11px] text-slate-400 flex items-center justify-between">
        <span className="truncate">Dernier message: {ia22SessionStatus.lastBroadcastMessage}</span>
        <span className="text-slate-500 shrink-0 ml-2">
          {new Date(ia22SessionStatus.lastUpdatedTimestamp).toLocaleTimeString('fr-FR')}
        </span>
      </div>

      {/* Windows Batch Script Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  Script Windows Batch (.BAT) Compagnon S24
                </h3>
              </div>
              <button
                onClick={() => setShowBatchModal(false)}
                className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto max-h-72">
              {windowsBatchScript}
            </pre>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={copyBatchScript}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 cursor-pointer"
              >
                {copiedBatch ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedBatch ? "Copié !" : "Copier le script"}</span>
              </button>
              <button
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
