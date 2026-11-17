import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AudioPlayerCard } from '../components/AudioPlayerCard';
import { AudioWaveformVisualizer } from '../components/AudioWaveformVisualizer';
import { 
  Mic, 
  Square, 
  Pause, 
  Play, 
  Search, 
  X, 
  CheckSquare, 
  CloudUpload, 
  Zap, 
  Radio, 
  Clock, 
  Sliders, 
  Camera, 
  Contact2 
} from 'lucide-react';

export const RecorderVaultScreen: React.FC = () => {
  const {
    recordings,
    searchQuery,
    setSearchQuery,
    selectedRecordingIds,
    isSelectionMode,
    toggleSelectionMode,
    selectAllRecordings,
    clearSelection,
    toggleRecordingSelection,
    massSyncSelectedRecordings,
    playerState,
    togglePlayPause,
    seekTo,
    setPlaybackSpeed,
    deleteRecording,
    syncRecordingToGoogleDrive,
    analyzeRecordingWithAi,
    setTab,
    recorderState,
    startRecording,
    togglePauseRecording,
    stopAndSaveRecording,
    toggleSilenceDetection,
    simulateAudioInputForAutoResume,
    setShowRealModeDialog,
    setShowCameraDialog,
    tr
  } = useApp();

  const [customNameInput, setCustomNameInput] = useState('enregistrement_ghost_vocal');

  const filteredRecordings = recordings.filter(rec => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      rec.title.toLowerCase().includes(q) ||
      rec.fileName.toLowerCase().includes(q) ||
      rec.sourceStream.toLowerCase().includes(q) ||
      new Date(rec.timestamp).toLocaleDateString().includes(q)
    );
  });

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    startRecording(customNameInput);
  };

  const latestAmp = recorderState.liveAmplitudes[recorderState.liveAmplitudes.length - 1] || 20;
  const dbLevel = latestAmp > 0 ? Math.round((latestAmp / 100) * 50 - 50) : -50;

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Live Recording Studio Card */}
      <div 
        data-testid="live_recorder_card"
        className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
      >
        {/* Header with Title & Live Status Indicator */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-emerald-400 tracking-tight">
                FLUX WAY - Capture Vocale
              </h2>
              <button
                onClick={() => setShowRealModeDialog(true)}
                data-testid="recorder_real_mode_chip"
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/25 transition-colors cursor-pointer"
              >
                <Zap className="w-3 h-3 fill-emerald-400" />
                <span>RÉEL</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Enregistrement local Z-CORE (PCM 44.1kHz direct)
            </p>
          </div>

          {/* Status Badge */}
          <div 
            data-testid="recording_status_indicator"
            className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              recorderState.isRecording && recorderState.isAutoPausedBySilence
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : recorderState.isRecording && recorderState.isPaused
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : recorderState.isRecording
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${
              recorderState.isRecording && !recorderState.isPaused ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
            }`}></span>
            <span>
              {recorderState.isRecording && recorderState.isAutoPausedBySilence
                ? 'PAUSE AUTO (SILENCE > 5S)'
                : recorderState.isRecording && recorderState.isPaused
                ? 'EN PAUSE MANUELLE'
                : recorderState.isRecording
                ? 'ENREGISTREMENT EN COURS'
                : 'PRÊT À ENREGISTRER'}
            </span>
          </div>
        </div>

        {/* Active Parameters Ribbon */}
        <div 
          data-testid="recorder_active_parameters_ribbon"
          className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2 text-emerald-400 font-bold truncate">
            <Zap className="w-4 h-4 shrink-0 fill-emerald-400" />
            <span className="truncate">
              ⚡ Tous paramètres actifs (Mode Réel • Micro Direct • DAC 44.1kHz • Auto-Sync • VAD)
            </span>
          </div>
          <button
            onClick={() => setShowRealModeDialog(true)}
            data-testid="open_real_params_ribbon_btn"
            className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/20 cursor-pointer shrink-0 ml-2"
          >
            RÉGLAGES
          </button>
        </div>

        {/* Big Timer Display */}
        <div className="text-center py-2">
          <div className={`text-4xl sm:text-5xl font-mono font-bold tracking-tight ${
            recorderState.isRecording ? 'text-emerald-400' : 'text-slate-200'
          }`}>
            {formatTimer(recorderState.durationSeconds)}
          </div>
        </div>

        {/* Live Amplitude Waveform & Level Meter */}
        <div data-testid="recording_waveform_container" className="space-y-2">
          {recorderState.isRecording && (
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-emerald-400 font-mono tracking-wider">
                SIGNAL AUDIO DYNAMIQUE
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px]">
                Niveau: {latestAmp}% ({dbLevel} dB)
              </span>
            </div>
          )}

          <AudioWaveformVisualizer
            amplitudes={recorderState.liveAmplitudes}
            isLive={recorderState.isRecording}
            barColor={recorderState.isRecording ? 'bg-emerald-400' : 'bg-slate-700'}
          />
        </div>

        {/* Silence Auto-Pause & Auto-Resume Control Box */}
        <div 
          data-testid="silence_autopause_container"
          className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-slate-200">
                  Pause auto sur silence (5s)
                </div>
                <div className="text-[10.5px] text-slate-400">
                  {recorderState.isSilenceDetectionEnabled
                    ? "Reprise auto sur détection vocale"
                    : "Détection de silence désactivée"}
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleSilenceDetection(!recorderState.isSilenceDetectionEnabled)}
              data-testid="silence_autopause_switch"
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                recorderState.isSilenceDetectionEnabled ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                  recorderState.isSilenceDetectionEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Silence Gauge if recording */}
          {recorderState.isRecording && recorderState.isSilenceDetectionEnabled && (
            <div className="pt-2 border-t border-slate-800/80">
              {recorderState.isAutoPausedBySilence ? (
                <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-amber-300 text-xs">
                    <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Silence &gt; 5s détecté. Écoute active du signal audio pour reprise...</span>
                  </div>
                  <button
                    onClick={simulateAudioInputForAutoResume}
                    className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 cursor-pointer shrink-0"
                  >
                    Détecter Voix
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-mono ${recorderState.silenceDurationSeconds > 3 ? 'text-rose-400' : 'text-slate-400'}`}>
                    Silence détecté : {recorderState.silenceDurationSeconds.toFixed(1)}s / 5.0s
                  </span>
                  <div className="w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (recorderState.silenceDurationSeconds / 5.0) * 100)}%` }}
                      className={`h-full transition-all ${
                        recorderState.silenceDurationSeconds > 3 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recording File Name Input (if idle) */}
        {!recorderState.isRecording && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">
              Nom de l'enregistrement (.wav) :
            </label>
            <input
              type="text"
              value={customNameInput}
              onChange={(e) => setCustomNameInput(e.target.value)}
              placeholder="enregistrement_ghost_vocal"
              data-testid="recording_name_input"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Master Recording Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {!recorderState.isRecording ? (
            <button
              onClick={handleStartRecording}
              data-testid="start_recording_btn"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-colors cursor-pointer shadow-lg shadow-emerald-500/25"
            >
              <Mic className="w-5 h-5 fill-slate-950" />
              <span>Démarrer l'enregistrement</span>
            </button>
          ) : (
            <>
              <button
                onClick={togglePauseRecording}
                data-testid="pause_recording_btn"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
                title={recorderState.isPaused ? "Reprendre" : "Pause"}
              >
                {recorderState.isPaused ? <Play className="w-5 h-5 fill-slate-200" /> : <Pause className="w-5 h-5 fill-slate-200" />}
              </button>

              <button
                onClick={stopAndSaveRecording}
                data-testid="stop_recording_btn"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-rose-600 text-white font-bold text-sm hover:bg-rose-500 transition-colors cursor-pointer shadow-lg shadow-rose-600/25"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Arrêter & Sauvegarder</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Library Header & Action Shortcuts */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-base font-bold text-slate-100">
            Bibliothèque Vocale Z-CORE
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {isSelectionMode ? `${selectedRecordingIds.length} / ${recordings.length} sélectionné(s)` : `${recordings.length} fichier(s)`}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTab('CONTACTS')}
            data-testid="vault_quick_contacts_btn"
            className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            title="Répertoire contacts"
          >
            <Contact2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowCameraDialog(true)}
            data-testid="vault_quick_camera_btn"
            className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            title="Prendre une photo"
          >
            <Camera className="w-4 h-4" />
          </button>

          <button
            onClick={toggleSelectionMode}
            data-testid="toggle_selection_mode_btn"
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isSelectionMode 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-slate-800'
            }`}
            title="Mode sélection en masse"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Batch Selection Action Bar */}
      {isSelectionMode && (
        <div 
          data-testid="batch_selection_bar"
          className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between gap-3"
        >
          <button
            onClick={selectedRecordingIds.length === recordings.length ? clearSelection : selectAllRecordings}
            data-testid="select_all_btn"
            className="text-xs font-bold text-emerald-300 hover:text-emerald-200 cursor-pointer"
          >
            {selectedRecordingIds.length === recordings.length ? "Désélectionner tout" : "Tout sélectionner"}
          </button>

          <button
            onClick={massSyncSelectedRecordings}
            disabled={selectedRecordingIds.length === 0}
            data-testid="batch_rclone_sync_btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            <CloudUpload className="w-4 h-4" />
            <span>Mass-Sync Rclone ({selectedRecordingIds.length})</span>
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par nom de fichier ou date (ex: ghost_vocal, 2023)..."
          data-testid="search_recordings_input"
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Recordings List */}
      <div className="space-y-3">
        {filteredRecordings.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <Mic className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">
              Aucun enregistrement audio trouvé.
            </p>
          </div>
        ) : (
          filteredRecordings.map(rec => (
            <AudioPlayerCard
              key={rec.id}
              recording={rec}
              playerState={playerState}
              onPlayPause={() => togglePlayPause(rec)}
              onSeek={(s) => seekTo(s, rec)}
              onSpeedChange={(speed) => setPlaybackSpeed(speed)}
              onSyncClick={() => syncRecordingToGoogleDrive(rec)}
              onAiAnalyzeClick={() => {
                analyzeRecordingWithAi(rec);
                setTab('AI_STUDIO');
              }}
              onDeleteClick={() => deleteRecording(rec.id)}
              isSelectionMode={isSelectionMode}
              isSelected={selectedRecordingIds.includes(rec.id)}
              onToggleSelect={() => toggleRecordingSelection(rec.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
