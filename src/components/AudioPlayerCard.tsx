import React, { useState } from 'react';
import { AudioRecording, PlayerState } from '../types';
import { useApp } from '../context/AppContext';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer';
import { RecordingDetailDialog } from './dialogs/RecordingDetailDialog';
import { 
  Play, 
  Pause, 
  CloudUpload, 
  Sparkles, 
  Trash2, 
  Info,
  CheckCircle2, 
  Clock, 
  HardDrive
} from 'lucide-react';

interface AudioPlayerCardProps {
  recording: AudioRecording;
  playerState: PlayerState;
  onPlayPause: () => void;
  onSeek: (seconds: number) => void;
  onSpeedChange: (speed: number) => void;
  onSyncClick: () => void;
  onAiAnalyzeClick: () => void;
  onDeleteClick: () => void;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
}

export const AudioPlayerCard: React.FC<AudioPlayerCardProps> = ({
  recording,
  playerState,
  onPlayPause,
  onSeek,
  onSpeedChange,
  onSyncClick,
  onAiAnalyzeClick,
  onDeleteClick,
  isSelectionMode,
  isSelected,
  onToggleSelect
}) => {
  const { tr } = useApp();
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const isCurrentPlaying = playerState.playingRecordingId === recording.id;
  const isPlaying = isCurrentPlaying && playerState.isPlaying;
  const currentPos = isCurrentPlaying ? playerState.currentPositionSeconds : 0;

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const parsedWaveform = recording.waveformData
    ? recording.waveformData.split(',').map(n => parseInt(n.trim(), 10) || 30)
    : [];

  const speeds = [1.0, 1.25, 1.5, 2.0, 0.5];
  const nextSpeed = () => {
    const curIdx = speeds.indexOf(playerState.playbackSpeed);
    const nextIdx = (curIdx + 1) % speeds.length;
    onSpeedChange(speeds[nextIdx]);
  };

  return (
    <>
      <div 
        data-testid={`audio_player_card_${recording.id}`}
        className={`p-4 rounded-2xl bg-slate-900 border transition-all ${
          isSelected 
            ? 'border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-950/40' 
            : 'border-slate-800/90 hover:border-slate-700'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Select Checkbox (if in selection mode) */}
          {isSelectionMode && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              className="mt-1 w-4 h-4 rounded text-emerald-500 bg-slate-800 border-slate-700 focus:ring-emerald-500 cursor-pointer"
            />
          )}

          {/* Title and metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-100 truncate">
                {recording.title}
              </h3>

              {/* Sync Status Badge */}
              {recording.isSynced || recording.syncStatus === 'CLOUD_SYNCED' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Drive Synchro
                </span>
              ) : recording.syncStatus === 'SYNCING' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 animate-pulse">
                  <Clock className="w-3 h-3 animate-spin" />
                  En cours
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <HardDrive className="w-3 h-3" />
                  Local Only
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-0.5 truncate font-mono">
              {recording.fileName} • {recording.durationSeconds}s • {recording.fileSizeMb} MB
            </p>
          </div>

          {/* Details & Delete icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowDetailDialog(true)}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Détails de l'enregistrement"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={onDeleteClick}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Waveform Visualization */}
        <div className="mt-3">
          <AudioWaveformVisualizer
            amplitudes={parsedWaveform}
            isLive={isPlaying}
            barColor={isPlaying ? 'bg-emerald-400' : 'bg-slate-700'}
          />
        </div>

        {/* Playback Progress Slider */}
        <div className="mt-2.5">
          <input
            type="range"
            min={0}
            max={recording.durationSeconds}
            value={currentPos}
            onChange={(e) => onSeek(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono mt-1">
            <span>{formatTime(currentPos)}</span>
            <span>{formatTime(recording.durationSeconds)}</span>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              onClick={onPlayPause}
              data-testid={`play_pause_btn_${recording.id}`}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer font-bold shadow-md shadow-emerald-500/20"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
            </button>

            {/* Playback Speed toggle */}
            <button
              onClick={nextSpeed}
              className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700 transition-colors cursor-pointer"
              title="Vitesse de lecture"
            >
              {playerState.playbackSpeed}x
            </button>
          </div>

          {/* Action Buttons: Sync & Gemini AI */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onSyncClick}
              disabled={recording.isSynced || recording.syncStatus === 'SYNCING'}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                recording.isSynced 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 opacity-75' 
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-emerald-400'
              }`}
              title="Synchroniser avec Google Drive via Rclone"
            >
              {recording.isSynced ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <CloudUpload className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="hidden sm:inline">{recording.isSynced ? 'Synchro' : 'Sync'}</span>
            </button>

            <button
              onClick={onAiAnalyzeClick}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25 transition-colors cursor-pointer text-xs font-semibold"
              title="Analyser avec Gemini IA"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Gemini IA</span>
            </button>
          </div>
        </div>
      </div>

      {showDetailDialog && (
        <RecordingDetailDialog
          recording={recording}
          onClose={() => setShowDetailDialog(false)}
        />
      )}
    </>
  );
};
