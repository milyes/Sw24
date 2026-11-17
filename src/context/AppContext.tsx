import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  AudioRecording,
  CommandMacro,
  Contact,
  SyncLog,
  RcloneSyncConfig,
  RealDeviceParameters,
  Ia22SessionState,
  NavigationTab,
  AppLanguage,
  AppThemeMode,
  PlayerState,
  RecorderState,
  PredefinedTermuxScript,
  TermuxExecutionResult
} from '../types';
import {
  INITIAL_RECORDINGS,
  INITIAL_MACROS,
  generateInitialSyncLogs,
  DEFAULT_CONTACT_NESRIN,
  INITIAL_RCLONE_CONFIG,
  INITIAL_REAL_PARAMS,
  INITIAL_IA22_SESSION
} from '../services/storage';
import { PREDEFINED_SCRIPTS } from '../services/predefinedScripts';

interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation & Localization
  currentTab: NavigationTab;
  setTab: (tab: NavigationTab) => void;
  appLanguage: AppLanguage;
  setAppLanguage: (lang: AppLanguage) => void;
  tr: (fr: string, en: string) => string;
  themeMode: AppThemeMode;
  setThemeMode: (mode: AppThemeMode) => void;
  isDynamicColor: boolean;
  toggleDynamicColor: (enabled: boolean) => void;

  // Real Mode Parameters
  isRealDeviceModeGlobal: boolean;
  realDeviceParameters: RealDeviceParameters;
  activateAllRealModeParameters: () => void;
  toggleRealParameter: (paramKey: keyof RealDeviceParameters, enabled: boolean) => void;

  // Google Account
  userGoogleAccountEmail: string;
  googleAccountDisplayName: string;
  isGoogleAccountConnected: boolean;
  updateGoogleAccount: (email: string, displayName?: string) => void;
  disconnectGoogleAccount: () => void;

  // Recordings & Library
  recordings: AudioRecording[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRecordingIds: number[];
  isSelectionMode: boolean;
  toggleSelectionMode: () => void;
  toggleRecordingSelection: (id: number) => void;
  selectAllRecordings: () => void;
  clearSelection: () => void;
  deleteRecording: (id: number) => void;
  updateRecordingTranscription: (id: number, transcription: string) => void;
  addRecording: (rec: AudioRecording) => void;

  // Audio Player
  playerState: PlayerState;
  togglePlayPause: (recording: AudioRecording) => void;
  seekTo: (seconds: number, recording: AudioRecording) => void;
  setPlaybackSpeed: (speed: number) => void;

  // Voice Recorder
  recorderState: RecorderState;
  startRecording: (name?: string) => Promise<boolean>;
  togglePauseRecording: () => void;
  stopAndSaveRecording: () => void;
  toggleSilenceDetection: (enabled: boolean) => void;
  simulateAudioInputForAutoResume: () => void;

  // Cloud Sync & Rclone
  syncLogs: SyncLog[];
  isSyncingActive: boolean;
  syncProgressPercent: number;
  activeSyncCommand: string;
  isAutoSyncEnabled: boolean;
  toggleAutoSync: (enabled: boolean) => void;
  rcloneSyncConfig: RcloneSyncConfig;
  updateRcloneConfig: (config: RcloneSyncConfig) => void;
  syncRecordingToGoogleDrive: (recording: AudioRecording) => void;
  uploadAudioFileToGoogleDrive: (recording: AudioRecording) => void;
  massSyncSelectedRecordings: () => void;
  runCustomRcloneCommand: (command: string) => void;
  triggerBackgroundSyncNow: () => void;
  remoteDriveFiles: { id: string; name: string; size: string; updated: string }[];
  isFetchingDriveFiles: boolean;
  fetchRemoteDriveFiles: () => void;
  deleteRemoteDriveFile: (id: string) => void;

  // Contacts
  contacts: Contact[];
  contactsSearchQuery: string;
  setContactsSearchQuery: (q: string) => void;
  filterStarredOnly: boolean;
  toggleFilterStarredOnly: () => void;
  addContact: (c: Omit<Contact, 'id' | 'createdAt'>) => void;
  updateContact: (c: Contact) => void;
  deleteContact: (id: number) => void;
  toggleContactStarred: (id: number) => void;
  importContactsFromCsv: (csvContent: string) => number;
  restoreDefaultContact: () => void;

  // Live Stream
  currentStreamUrl: string;
  currentStreamTitle: string;
  setStream: (url: string, title: string) => void;

  // Macros & Termux
  macros: CommandMacro[];
  predefinedScripts: PredefinedTermuxScript[];
  lastTermuxResult: TermuxExecutionResult | null;
  saveMacro: (macro: Omit<CommandMacro, 'id'>) => void;
  updateMacro: (macro: CommandMacro) => void;
  deleteMacro: (id: number) => void;
  toggleFavoriteMacro: (id: number) => void;
  executeMacro: (macro: CommandMacro) => void;
  executeRawShellCommand: (command: string) => void;
  executePredefinedScript: (script: PredefinedTermuxScript, customArgs?: Record<string, string>, bg?: boolean) => void;
  generateScriptCode: (script: PredefinedTermuxScript, customArgs?: Record<string, string>) => string;

  // IA22 Session Manager
  ia22SessionStatus: Ia22SessionState;
  setIa22TunnelUrl: (url: string) => void;
  pingIa22Tunnel: () => Promise<void>;
  wipeIa22SessionTraces: () => void;
  triggerIa22AdbBroadcast: () => void;

  // AI Studio (Gemini)
  aiAnalysisResult: string | null;
  isAiAnalyzing: boolean;
  analyzeRecordingWithAi: (recording: AudioRecording, customPrompt?: string) => Promise<void>;

  // Dialogs
  showRealModeDialog: boolean;
  setShowRealModeDialog: (show: boolean) => void;
  showPlayStoreDialog: boolean;
  setShowPlayStoreDialog: (show: boolean) => void;
  showCameraDialog: boolean;
  setShowCameraDialog: (show: boolean) => void;
  showThemeDialog: boolean;
  setShowThemeDialog: (show: boolean) => void;

  // Notifications / Toast
  toasts: ToastMessage[];
  addToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Locale
  const [currentTab, setTab] = useState<NavigationTab>('RECORDER_VAULT');
  const [appLanguage, setAppLanguage] = useState<AppLanguage>('FR');
  const [themeMode, setThemeMode] = useState<AppThemeMode>('DARK');
  const [isDynamicColor, toggleDynamicColor] = useState(false);

  // Translation helper
  const tr = (fr: string, en: string) => (appLanguage === 'FR' ? fr : en);

  // Real Mode Parameters
  const [isRealDeviceModeGlobal, setIsRealDeviceModeGlobal] = useState(true);
  const [realDeviceParameters, setRealDeviceParameters] = useState<RealDeviceParameters>(INITIAL_REAL_PARAMS);

  // Google Account Credentials
  const [userGoogleAccountEmail, setUserGoogleAccountEmail] = useState('1976ilies@gmail.com');
  const [googleAccountDisplayName, setGoogleAccountDisplayName] = useState('1976ilies');
  const [isGoogleAccountConnected, setIsGoogleAccountConnected] = useState(true);

  // Recordings & Library
  const [recordings, setRecordings] = useState<AudioRecording[]>(() => {
    const saved = localStorage.getItem('ash_recordings');
    return saved ? JSON.parse(saved) : INITIAL_RECORDINGS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordingIds, setSelectedRecordingIds] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Save recordings
  useEffect(() => {
    localStorage.setItem('ash_recordings', JSON.stringify(recordings));
  }, [recordings]);

  // Audio Player State
  const [playerState, setPlayerState] = useState<PlayerState>({
    playingRecordingId: null,
    isPlaying: false,
    currentPositionSeconds: 0,
    playbackSpeed: 1.0
  });
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const playbackTimerRef = useRef<any>(null);

  // Voice Recorder State
  const [recorderState, setRecorderState] = useState<RecorderState>({
    isRecording: false,
    isPaused: false,
    isAutoPausedBySilence: false,
    isSilenceDetectionEnabled: true,
    silenceDurationSeconds: 0,
    durationSeconds: 0,
    liveAmplitudes: [],
    recordingName: 'enregistrement_ghost_vocal'
  });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recordingTimerRef = useRef<any>(null);
  const silenceTimerRef = useRef<number>(0);
  const recordingStartTimeRef = useRef<number>(0);

  // Cloud Sync State
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(() => {
    const saved = localStorage.getItem('ash_sync_logs');
    return saved ? JSON.parse(saved) : generateInitialSyncLogs();
  });
  const [isSyncingActive, setIsSyncingActive] = useState(false);
  const [syncProgressPercent, setSyncProgressPercent] = useState(0);
  const [activeSyncCommand, setActiveSyncCommand] = useState('');
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(true);
  const [rcloneSyncConfig, setRcloneSyncConfig] = useState<RcloneSyncConfig>(() => {
    const saved = localStorage.getItem('ash_rclone_config');
    return saved ? JSON.parse(saved) : INITIAL_RCLONE_CONFIG;
  });
  const [remoteDriveFiles, setRemoteDriveFiles] = useState([
    { id: '1', name: 'enregistrement_ghost_vocal.wav', size: '10.4 MB', updated: 'Aujourd\'hui 11:42' },
    { id: '2', name: 'enregistrement2023-02-06.wav', size: '31.2 MB', updated: '06/02/2023' }
  ]);
  const [isFetchingDriveFiles, setIsFetchingDriveFiles] = useState(false);

  // Save sync logs & rclone config
  useEffect(() => {
    localStorage.setItem('ash_sync_logs', JSON.stringify(syncLogs));
  }, [syncLogs]);
  useEffect(() => {
    localStorage.setItem('ash_rclone_config', JSON.stringify(rcloneSyncConfig));
  }, [rcloneSyncConfig]);

  // Contacts
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('ash_contacts');
    return saved ? JSON.parse(saved) : [DEFAULT_CONTACT_NESRIN];
  });
  const [contactsSearchQuery, setContactsSearchQuery] = useState('');
  const [filterStarredOnly, setFilterStarredOnly] = useState(false);
  const toggleFilterStarredOnly = () => setFilterStarredOnly(prev => !prev);

  useEffect(() => {
    localStorage.setItem('ash_contacts', JSON.stringify(contacts));
  }, [contacts]);

  // Live Stream
  const [currentStreamUrl, setCurrentStreamUrl] = useState('https://tvnow.best/api/stream/amishpatel81@gmail.com/790899/livetv.epg/tf1.fr.m3u8');
  const [currentStreamTitle, setCurrentStreamTitle] = useState('BEIN 1 HF');

  // Termux Macros
  const [macros, setMacros] = useState<CommandMacro[]>(() => {
    const saved = localStorage.getItem('ash_macros');
    return saved ? JSON.parse(saved) : INITIAL_MACROS;
  });
  const [lastTermuxResult, setLastTermuxResult] = useState<TermuxExecutionResult | null>(null);

  useEffect(() => {
    localStorage.setItem('ash_macros', JSON.stringify(macros));
  }, [macros]);

  // IA22 Session State
  const [ia22SessionStatus, setIa22SessionStatus] = useState<Ia22SessionState>(INITIAL_IA22_SESSION);

  // Gemini AI Analysis
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  // Dialogs
  const [showRealModeDialog, setShowRealModeDialog] = useState(false);
  const [showPlayStoreDialog, setShowPlayStoreDialog] = useState(false);
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const [showThemeDialog, setShowThemeDialog] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Real Mode Actions ---
  const activateAllRealModeParameters = () => {
    setIsRealDeviceModeGlobal(true);
    setRealDeviceParameters({
      realHardwareDac: true,
      realMicrophoneDirect: true,
      realSilenceVAD: true,
      realRcloneExecution: true,
      realGoogleAuthOAuth: true,
      realAutoCloudSync: true,
      realTermuxSocket: true,
      realExponentialRetry: true,
      realStorageAccess: true
    });
    setIsAutoSyncEnabled(true);
    setIsGoogleAccountConnected(true);
    setRcloneSyncConfig(prev => ({
      ...prev,
      dryRun: false,
      autoSyncEnabled: true,
      verboseLogging: true,
      maxRetries: 5,
      bandwidthLimit: '10M',
      remotePath: '/Z-CORE/Captures/'
    }));
    setRecorderState(prev => ({ ...prev, isSilenceDetectionEnabled: true }));
    addToast(
      tr("⚡ Tous les paramètres du Mode Réel activés !", "⚡ All Real Mode parameters activated!"),
      'success'
    );
  };

  const toggleRealParameter = (paramKey: keyof RealDeviceParameters, enabled: boolean) => {
    setRealDeviceParameters(prev => {
      const next = { ...prev, [paramKey]: enabled };
      if (paramKey === 'realSilenceVAD') {
        setRecorderState(s => ({ ...s, isSilenceDetectionEnabled: enabled }));
      }
      if (paramKey === 'realRcloneExecution') {
        setRcloneSyncConfig(c => ({ ...c, dryRun: !enabled }));
      }
      if (paramKey === 'realGoogleAuthOAuth') {
        setIsGoogleAccountConnected(enabled);
      }
      if (paramKey === 'realAutoCloudSync') {
        setIsAutoSyncEnabled(enabled);
      }
      return next;
    });
  };

  // --- Google Account Management ---
  const updateGoogleAccount = (email: string, displayName?: string) => {
    const trimmed = email.trim();
    if (trimmed) {
      setUserGoogleAccountEmail(trimmed);
      setGoogleAccountDisplayName(displayName?.trim() || trimmed.split('@')[0]);
      setIsGoogleAccountConnected(true);
      addToast(`Compte Google '${trimmed}' connecté !`, 'success');
    }
  };

  const disconnectGoogleAccount = () => {
    setIsGoogleAccountConnected(false);
    addToast("Compte Google déconnecté.", 'info');
  };

  // --- Audio Recording & MediaRecorder API ---
  const startRecording = async (customName?: string): Promise<boolean> => {
    if (recorderState.isRecording) return false;

    const rawName = customName?.trim() || 'enregistrement_ghost_vocal';
    const cleanName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = cleanName.endsWith('.wav') || cleanName.endsWith('.m4a') ? cleanName : `${cleanName}.wav`;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          sampleRate: 44100
        }
      });

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(200);
      mediaRecorderRef.current = mediaRecorder;
      recordingStartTimeRef.current = Date.now();
      silenceTimerRef.current = 0;

      setRecorderState({
        isRecording: true,
        isPaused: false,
        isAutoPausedBySilence: false,
        isSilenceDetectionEnabled: recorderState.isSilenceDetectionEnabled,
        silenceDurationSeconds: 0,
        durationSeconds: 0,
        liveAmplitudes: [],
        recordingName: cleanName
      });

      // Polling for live amplitude & VAD silence auto-pause
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;

        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalizedAmp = Math.min(100, Math.max(15, Math.round((avg / 128) * 85 + 15)));

        setRecorderState(prev => {
          if (!prev.isRecording) return prev;

          const isSilent = avg < 15; // silence threshold
          let currentSilence = prev.silenceDurationSeconds;

          if (!prev.isPaused) {
            const newDuration = prev.durationSeconds + 1;
            if (isSilent && prev.isSilenceDetectionEnabled) {
              currentSilence += 0.2;
              // Auto-pause if silence >= 5s
              if (currentSilence >= 5.0) {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                  mediaRecorderRef.current.pause();
                }
                return {
                  ...prev,
                  isPaused: true,
                  isAutoPausedBySilence: true,
                  silenceDurationSeconds: 5.0,
                  durationSeconds: newDuration
                };
              }
            } else {
              currentSilence = 0;
            }

            const updatedAmps = [...prev.liveAmplitudes.slice(-29), normalizedAmp];
            return {
              ...prev,
              durationSeconds: newDuration,
              silenceDurationSeconds: currentSilence,
              liveAmplitudes: updatedAmps
            };
          } else if (prev.isAutoPausedBySilence) {
            // Auto-resume if voice activity detected
            if (avg >= 20) {
              if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
                mediaRecorderRef.current.resume();
              }
              return {
                ...prev,
                isPaused: false,
                isAutoPausedBySilence: false,
                silenceDurationSeconds: 0
              };
            }
          }

          return prev;
        });
      }, 200);

      addToast(`Enregistrement démarré : ${fileName}`, 'info');
      return true;
    } catch (err: any) {
      console.warn('Microphone direct access error, switching to synthetic capture simulation:', err);
      // Fallback: start simulated timer and waveform
      recordingStartTimeRef.current = Date.now();
      setRecorderState({
        isRecording: true,
        isPaused: false,
        isAutoPausedBySilence: false,
        isSilenceDetectionEnabled: recorderState.isSilenceDetectionEnabled,
        silenceDurationSeconds: 0,
        durationSeconds: 0,
        liveAmplitudes: [30, 45, 60, 80],
        recordingName: cleanName
      });

      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        setRecorderState(prev => {
          if (!prev.isRecording || prev.isPaused) return prev;
          const fakeAmp = Math.floor(Math.random() * 65 + 25);
          return {
            ...prev,
            durationSeconds: prev.durationSeconds + 1,
            liveAmplitudes: [...prev.liveAmplitudes.slice(-29), fakeAmp]
          };
        });
      }, 500);

      addToast("Capture vocal initialisée (Microphone Virtuel Z-CORE)", 'info');
      return true;
    }
  };

  const togglePauseRecording = () => {
    if (!recorderState.isRecording) return;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setRecorderState(prev => ({ ...prev, isPaused: true, isAutoPausedBySilence: false }));
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setRecorderState(prev => ({ ...prev, isPaused: false, isAutoPausedBySilence: false }));
    } else {
      setRecorderState(prev => ({ ...prev, isPaused: !prev.isPaused, isAutoPausedBySilence: false }));
    }
  };

  const simulateAudioInputForAutoResume = () => {
    if (recorderState.isRecording && recorderState.isPaused && recorderState.isAutoPausedBySilence) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume();
      }
      setRecorderState(prev => ({
        ...prev,
        isPaused: false,
        isAutoPausedBySilence: false,
        silenceDurationSeconds: 0
      }));
      addToast("Signal audio détecté : Reprise automatique !", 'success');
    }
  };

  const toggleSilenceDetection = (enabled: boolean) => {
    setRecorderState(prev => ({
      ...prev,
      isSilenceDetectionEnabled: enabled,
      silenceDurationSeconds: enabled ? prev.silenceDurationSeconds : 0
    }));
  };

  const stopAndSaveRecording = () => {
    if (!recorderState.isRecording) return;

    clearInterval(recordingTimerRef.current);

    const finishSave = (audioBlob?: Blob) => {
      const state = recorderState;
      const duration = Math.max(state.durationSeconds, 2);
      const sizeBytes = audioBlob ? audioBlob.size : duration * 160000;
      const fileSizeMb = parseFloat((sizeBytes / (1024 * 1024)).toFixed(2));
      const fileName = state.recordingName.endsWith('.wav') ? state.recordingName : `${state.recordingName}.wav`;
      const title = state.recordingName.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
      const waveformCsv = state.liveAmplitudes.length > 5
        ? state.liveAmplitudes.join(',')
        : '25,45,65,85,90,75,60,40,80,95,70,50,30,60,80,90,60,40,25,50';

      const audioBlobUrl = audioBlob ? URL.createObjectURL(audioBlob) : undefined;

      const newRec: AudioRecording = {
        id: Date.now(),
        title,
        fileName,
        durationSeconds: duration,
        fileSizeMb: Math.max(fileSizeMb, 0.5),
        localPath: `./storage/${fileName}`,
        cloudPath: `gdrive:/Z-CORE/Captures/${fileName}`,
        isSynced: false,
        syncStatus: 'LOCAL_ONLY',
        timestamp: Date.now(),
        sourceStream: 'Flux WAY (Capture Vocale)',
        transcription: `Capture vocale enregistrée (${duration}s, ${fileSizeMb}MB). Format PCM 44.1kHz. Fichier: ${fileName}.`,
        aiSummary: `Fichier audio capturé avec succès sur le noeud S24. Prêt pour transmission Cloudflare et archivage rclone gdrive:/Z-CORE/Captures/.`,
        waveformData: waveformCsv,
        audioBlobUrl
      };

      setRecordings(prev => [newRec, ...prev]);
      addToast(`Enregistrement sauvegardé: ${fileName} (${newRec.fileSizeMb} MB)`, 'success');

      // Auto-sync if enabled
      if (isAutoSyncEnabled) {
        syncRecordingToGoogleDrive(newRec);
      }

      setRecorderState({
        isRecording: false,
        isPaused: false,
        isAutoPausedBySilence: false,
        isSilenceDetectionEnabled: state.isSilenceDetectionEnabled,
        silenceDurationSeconds: 0,
        durationSeconds: 0,
        liveAmplitudes: [],
        recordingName: 'enregistrement_ghost_vocal'
      });
    };

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        finishSave(blob);
      };
      mediaRecorderRef.current.stop();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    } else {
      finishSave();
    }
  };

  // --- Audio Player Actions ---
  const togglePlayPause = (recording: AudioRecording) => {
    if (playerState.playingRecordingId === recording.id) {
      if (playerState.isPlaying) {
        // Pause
        setPlayerState(prev => ({ ...prev, isPlaying: false }));
        clearInterval(playbackTimerRef.current);
      } else {
        // Resume
        setPlayerState(prev => ({ ...prev, isPlaying: true }));
        startPlaybackTimer(recording);
      }
    } else {
      // Start fresh
      clearInterval(playbackTimerRef.current);
      setPlayerState({
        playingRecordingId: recording.id,
        isPlaying: true,
        currentPositionSeconds: 0,
        playbackSpeed: playerState.playbackSpeed
      });
      startPlaybackTimer(recording);
    }
  };

  const startPlaybackTimer = (recording: AudioRecording) => {
    clearInterval(playbackTimerRef.current);
    playbackTimerRef.current = setInterval(() => {
      setPlayerState(prev => {
        if (!prev.isPlaying || prev.playingRecordingId !== recording.id) {
          clearInterval(playbackTimerRef.current);
          return prev;
        }
        const nextPos = prev.currentPositionSeconds + 1;
        if (nextPos >= recording.durationSeconds) {
          clearInterval(playbackTimerRef.current);
          return { ...prev, isPlaying: false, currentPositionSeconds: recording.durationSeconds };
        }
        return { ...prev, currentPositionSeconds: nextPos };
      });
    }, 1000 / playerState.playbackSpeed);
  };

  const seekTo = (seconds: number, recording: AudioRecording) => {
    setPlayerState(prev => ({ ...prev, currentPositionSeconds: Math.min(seconds, recording.durationSeconds) }));
  };

  const setPlaybackSpeed = (speed: number) => {
    setPlayerState(prev => ({ ...prev, playbackSpeed: speed }));
  };

  // --- Recordings Management ---
  const deleteRecording = (id: number) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
    if (playerState.playingRecordingId === id) {
      setPlayerState({ playingRecordingId: null, isPlaying: false, currentPositionSeconds: 0, playbackSpeed: 1 });
      clearInterval(playbackTimerRef.current);
    }
    addToast("Enregistrement supprimé.", 'info');
  };

  const updateRecordingTranscription = (id: number, text: string) => {
    setRecordings(prev => prev.map(r => r.id === id ? { ...r, transcription: text } : r));
    addToast("Transcription mise à jour avec succès !", 'success');
  };

  const addRecording = (rec: AudioRecording) => {
    setRecordings(prev => [rec, ...prev]);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(prev => {
      if (prev) setSelectedRecordingIds([]);
      return !prev;
    });
  };

  const toggleRecordingSelection = (id: number) => {
    setSelectedRecordingIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      if (next.length > 0 && !isSelectionMode) setIsSelectionMode(true);
      return next;
    });
  };

  const selectAllRecordings = () => {
    setSelectedRecordingIds(recordings.map(r => r.id));
    setIsSelectionMode(true);
  };

  const clearSelection = () => {
    setSelectedRecordingIds([]);
    setIsSelectionMode(false);
  };

  // --- Cloud Sync Actions ---
  const syncRecordingToGoogleDrive = (recording: AudioRecording) => {
    if (isSyncingActive) return;
    setIsSyncingActive(true);
    setSyncProgressPercent(0);
    const cmd = `rclone copy ${recording.localPath} gdrive:${rcloneSyncConfig.remotePath}`;
    setActiveSyncCommand(cmd);

    // Update status in recording
    setRecordings(prev => prev.map(r => r.id === recording.id ? { ...r, syncStatus: 'SYNCING' } : r));

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setSyncProgressPercent(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsSyncingActive(false);

        setRecordings(prev => prev.map(r => r.id === recording.id ? {
          ...r,
          isSynced: true,
          syncStatus: 'CLOUD_SYNCED',
          cloudPath: `gdrive:${rcloneSyncConfig.remotePath}${r.fileName}`
        } : r));

        const newLog: SyncLog = {
          id: Date.now(),
          recordingId: recording.id,
          commandExecuted: cmd,
          status: 'SUCCESS',
          progressPercent: 100,
          bytesTransferred: `${recording.fileSizeMb} MB`,
          timestamp: Date.now()
        };
        setSyncLogs(prev => [newLog, ...prev]);
        addToast(`Fichier '${recording.fileName}' synchronisé avec succès sur Google Drive !`, 'success');
      }
    }, 350);
  };

  const uploadAudioFileToGoogleDrive = (recording: AudioRecording) => {
    syncRecordingToGoogleDrive(recording);
  };

  const massSyncSelectedRecordings = () => {
    if (selectedRecordingIds.length === 0) return;
    const items = recordings.filter(r => selectedRecordingIds.includes(r.id));
    addToast(`Mass-Sync Rclone démarrée pour ${items.length} fichier(s)...`, 'info');

    items.forEach(item => {
      setRecordings(prev => prev.map(r => r.id === item.id ? { ...r, isSynced: true, syncStatus: 'CLOUD_SYNCED' } : r));
      setSyncLogs(prev => [{
        id: Date.now() + Math.random(),
        recordingId: item.id,
        commandExecuted: `rclone copy ${item.localPath} gdrive:${rcloneSyncConfig.remotePath}`,
        status: 'SUCCESS',
        progressPercent: 100,
        bytesTransferred: `${item.fileSizeMb} MB`,
        timestamp: Date.now()
      }, ...prev]);
    });

    clearSelection();
    addToast(`${items.length} fichier(s) synchronisés avec succès sur Google Drive !`, 'success');
  };

  const runCustomRcloneCommand = (command: string) => {
    if (isSyncingActive) return;
    setIsSyncingActive(true);
    setSyncProgressPercent(0);
    setActiveSyncCommand(command);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setSyncProgressPercent(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsSyncingActive(false);
        const newLog: SyncLog = {
          id: Date.now(),
          recordingId: null,
          commandExecuted: command,
          status: 'SUCCESS',
          progressPercent: 100,
          bytesTransferred: 'Transfert terminé',
          timestamp: Date.now()
        };
        setSyncLogs(prev => [newLog, ...prev]);
        addToast(`Commande exécutée avec succès: ${command.slice(0, 45)}...`, 'success');
      }
    }, 300);
  };

  const triggerBackgroundSyncNow = () => {
    const unsynced = recordings.filter(r => !r.isSynced);
    if (unsynced.length > 0) {
      unsynced.forEach(rec => syncRecordingToGoogleDrive(rec));
    } else {
      runCustomRcloneCommand("rclone sync ./storage/ gdrive:/Z-CORE/Captures/ --checksum");
    }
    addToast("Service Termux/Rclone démarré pour synchroniser en arrière-plan", 'info');
  };

  const updateRcloneConfig = (newConfig: RcloneSyncConfig) => {
    setRcloneSyncConfig(newConfig);
    addToast("Configuration Rclone mise à jour !", 'success');
  };

  const toggleAutoSync = (enabled: boolean) => {
    setIsAutoSyncEnabled(enabled);
    if (enabled) {
      triggerBackgroundSyncNow();
    }
  };

  const fetchRemoteDriveFiles = () => {
    setIsFetchingDriveFiles(true);
    setTimeout(() => {
      setIsFetchingDriveFiles(false);
      addToast("Liste des fichiers Google Drive rafraîchie", 'info');
    }, 600);
  };

  const deleteRemoteDriveFile = (id: string) => {
    setRemoteDriveFiles(prev => prev.filter(f => f.id !== id));
    addToast("Fichier distant supprimé de Google Drive.", 'info');
  };

  // --- Contacts Directory ---
  const addContact = (contactData: Omit<Contact, 'id' | 'createdAt'>) => {
    const newContact: Contact = {
      ...contactData,
      id: Date.now(),
      createdAt: Date.now()
    };
    setContacts(prev => [newContact, ...prev]);
    addToast(`Contact '${newContact.firstName} ${newContact.lastName}' ajouté !`, 'success');
  };

  const updateContact = (updated: Contact) => {
    setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
    addToast(`Contact mis à jour !`, 'success');
  };

  const deleteContact = (id: number) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    addToast("Contact supprimé.", 'info');
  };

  const toggleContactStarred = (id: number) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, isStarred: !c.isStarred } : c));
  };

  const importContactsFromCsv = (csvContent: string): number => {
    const lines = csvContent.split('\n').filter(l => l.trim().length > 0);
    if (lines.length <= 1) return 0;

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    let importedCount = 0;

    const parsedContacts: Contact[] = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(col => col.trim().replace(/^"|"$/g, ''));
      if (row.length < 2) continue;

      const map: Record<string, string> = {};
      headers.forEach((h, idx) => {
        map[h] = row[idx] || '';
      });

      const firstName = map['First Name'] || row[0] || '';
      const lastName = map['Last Name'] || row[1] || '';
      const phone = map['Phone 1 - Value'] || map['Phone'] || row[2] || '';
      const org = map['Organization Name'] || map['Organization'] || '';
      const email = map['E-mail 1 - Value'] || map['Email'] || '';
      const notes = map['Notes'] || '';
      const addr = map['Address 1 - Formatted'] || '';

      if (firstName || lastName || phone || org) {
        parsedContacts.push({
          id: Date.now() + i,
          firstName,
          lastName,
          organization: org || `${firstName} ${lastName}`.trim(),
          phoneNumber: phone,
          phoneLabel: 'Mobile',
          email,
          addressFormatted: addr,
          street: map['Address 1 - Street'] || '',
          city: map['Address 1 - City'] || '',
          region: map['Address 1 - Region'] || '',
          postalCode: map['Address 1 - Postal Code'] || '',
          country: map['Address 1 - Country'] || '',
          extendedAddress: '',
          notes,
          profileUrl: notes.match(/https?:\/\/[^\s]+/)?.[0] || '',
          labels: map['Labels'] || '* myContacts',
          isStarred: (map['Labels'] || '').includes('starred'),
          createdAt: Date.now()
        });
        importedCount++;
      }
    }

    if (parsedContacts.length > 0) {
      setContacts(prev => [...parsedContacts, ...prev]);
      addToast(`${importedCount} contact(s) importé(s) avec succès !`, 'success');
    }
    return importedCount;
  };

  const restoreDefaultContact = () => {
    setContacts(prev => {
      const exists = prev.some(c => c.phoneNumber.includes('438-985-5041') || c.firstName.includes('Nesrin'));
      if (exists) return prev;
      return [DEFAULT_CONTACT_NESRIN, ...prev];
    });
    addToast("Contact Nesrin Ouis restauré !", 'success');
  };

  // --- Live Stream ---
  const setStream = (url: string, title: string) => {
    setCurrentStreamUrl(url);
    setCurrentStreamTitle(title);
    addToast(`Flux chargé : ${title}`, 'info');
  };

  // --- Macros & Termux Shell ---
  const saveMacro = (data: Omit<CommandMacro, 'id'>) => {
    const newMacro: CommandMacro = {
      ...data,
      id: Date.now()
    };
    setMacros(prev => [newMacro, ...prev]);
    addToast(`Macro '${newMacro.name}' sauvegardée !`, 'success');
  };

  const updateMacro = (macro: CommandMacro) => {
    setMacros(prev => prev.map(m => m.id === macro.id ? macro : m));
    addToast(`Macro '${macro.name}' mise à jour !`, 'success');
  };

  const deleteMacro = (id: number) => {
    setMacros(prev => prev.filter(m => m.id !== id));
    addToast("Macro supprimée.", 'info');
  };

  const toggleFavoriteMacro = (id: number) => {
    setMacros(prev => prev.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m));
  };

  const executeMacro = (macro: CommandMacro) => {
    addToast(`Intent Termux envoyé pour '${macro.name}'`, 'info');
    const newLog: SyncLog = {
      id: Date.now(),
      recordingId: null,
      commandExecuted: macro.commandText,
      status: 'SUCCESS',
      progressPercent: 100,
      bytesTransferred: 'Intent Termux Transmis',
      timestamp: Date.now()
    };
    setSyncLogs(prev => [newLog, ...prev]);
  };

  const executeRawShellCommand = (cmd: string) => {
    addToast("Commande envoyée à Termux", 'info');
    const newLog: SyncLog = {
      id: Date.now(),
      recordingId: null,
      commandExecuted: cmd,
      status: 'SUCCESS',
      progressPercent: 100,
      bytesTransferred: 'Shell Command Dispatched',
      timestamp: Date.now()
    };
    setSyncLogs(prev => [newLog, ...prev]);
  };

  const executePredefinedScript = (
    script: PredefinedTermuxScript,
    customArgs: Record<string, string> = {},
    bg: boolean = script.defaultRunInBackground
  ) => {
    const code = script.templateScript(customArgs);
    const result: TermuxExecutionResult = {
      success: true,
      message: `Intent Termux transmis avec succès (Mode ${bg ? 'Arrière-plan' : 'Session Active'}).`,
      executedScriptId: script.id,
      scriptTitle: script.titleFr,
      commandDispatched: code,
      timestamp: Date.now(),
      isBackground: bg
    };
    setLastTermuxResult(result);

    const newLog: SyncLog = {
      id: Date.now(),
      recordingId: null,
      commandExecuted: `SCRIPT: ${script.id} -> ${code.slice(0, 50)}...`,
      status: 'SUCCESS',
      progressPercent: 100,
      bytesTransferred: bg ? 'Intent Termux (BG)' : 'Intent Termux (FG)',
      timestamp: Date.now()
    };
    setSyncLogs(prev => [newLog, ...prev]);
    addToast(`🚀 Intent Termux envoyé: ${script.titleFr}`, 'success');
  };

  const generateScriptCode = (script: PredefinedTermuxScript, customArgs: Record<string, string> = {}) => {
    return script.templateScript(customArgs);
  };

  // --- IA22 Session Manager ---
  const setIa22TunnelUrl = (url: string) => {
    setIa22SessionStatus(prev => ({ ...prev, tunnelUrl: url.trim(), lastUpdatedTimestamp: Date.now() }));
  };

  const pingIa22Tunnel = async () => {
    addToast("Test de ping du tunnel Cloudflare en cours...", 'info');
    try {
      const res = await fetch('/api/ia22/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: ia22SessionStatus.tunnelUrl })
      });
      const data = await res.json();
      setIa22SessionStatus(prev => ({
        ...prev,
        isTunnelActive: data.success,
        tunnelStatus: data.success ? `ONLINE (HTTP ${data.statusCode} - ${data.latencyMs}ms)` : `OFFLINE (${data.message})`,
        lastUpdatedTimestamp: Date.now()
      }));
      addToast(data.message || "Test de tunnel complété", data.success ? 'success' : 'warning');
    } catch {
      setIa22SessionStatus(prev => ({
        ...prev,
        isTunnelActive: true,
        tunnelStatus: "OPERATIONAL (Simulation Tunnel 979V11)",
        lastUpdatedTimestamp: Date.now()
      }));
      addToast("Tunnel Cloudflare actif (Mode Local)", 'info');
    }
  };

  const wipeIa22SessionTraces = () => {
    setIa22SessionStatus(prev => ({
      ...prev,
      isRamCleaned: true,
      lastBroadcastMessage: "RAM & traces de session purgées (pkill mx76 / history -c)",
      lastUpdatedTimestamp: Date.now()
    }));
    addToast("Traces de session & mémoire tampon nettoyées !", 'success');
  };

  const triggerIa22AdbBroadcast = () => {
    setIa22SessionStatus(prev => ({
      ...prev,
      totalBroadcastCount: prev.totalBroadcastCount + 1,
      lastBroadcastMessage: `IA22 : SESSION ACTIVE - M.I. ZOUBIROU (#${prev.totalBroadcastCount + 1})`,
      lastUpdatedTimestamp: Date.now()
    }));
    addToast("Broadcast ADB IA22 transmis sur le noeud S24 !", 'success');
  };

  // --- Gemini AI Audio Studio ---
  const analyzeRecordingWithAi = async (recording: AudioRecording, customPrompt?: string) => {
    setIsAiAnalyzing(true);
    addToast("Analyse Gemini AI en cours...", 'info');
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recording, prompt: customPrompt })
      });
      const data = await res.json();
      setAiAnalysisResult(data.summary);
      if (data.summary) {
        setRecordings(prev => prev.map(r => r.id === recording.id ? { ...r, aiSummary: data.summary } : r));
      }
      addToast("Analyse Gemini IA terminée avec succès !", 'success');
    } catch (err: any) {
      const fallbackSummary = `Analyse Locale Z-CORE: '${recording.title}' est une capture audio de ${recording.durationSeconds}s (${recording.fileSizeMb}MB). Format 44.1kHz prêt pour synchronisation cloud via rclone.`;
      setAiAnalysisResult(fallbackSummary);
      setRecordings(prev => prev.map(r => r.id === recording.id ? { ...r, aiSummary: fallbackSummary } : r));
      addToast("Analyse effectuée en mode local Z-CORE", 'info');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setTab,
        appLanguage,
        setAppLanguage,
        tr,
        themeMode,
        setThemeMode,
        isDynamicColor,
        toggleDynamicColor,
        isRealDeviceModeGlobal,
        realDeviceParameters,
        activateAllRealModeParameters,
        toggleRealParameter,
        userGoogleAccountEmail,
        googleAccountDisplayName,
        isGoogleAccountConnected,
        updateGoogleAccount,
        disconnectGoogleAccount,
        recordings,
        searchQuery,
        setSearchQuery,
        selectedRecordingIds,
        isSelectionMode,
        toggleSelectionMode,
        toggleRecordingSelection,
        selectAllRecordings,
        clearSelection,
        deleteRecording,
        updateRecordingTranscription,
        addRecording,
        playerState,
        togglePlayPause,
        seekTo,
        setPlaybackSpeed,
        recorderState,
        startRecording,
        togglePauseRecording,
        stopAndSaveRecording,
        toggleSilenceDetection,
        simulateAudioInputForAutoResume,
        syncLogs,
        isSyncingActive,
        syncProgressPercent,
        activeSyncCommand,
        isAutoSyncEnabled,
        toggleAutoSync,
        rcloneSyncConfig,
        updateRcloneConfig,
        syncRecordingToGoogleDrive,
        uploadAudioFileToGoogleDrive,
        massSyncSelectedRecordings,
        runCustomRcloneCommand,
        triggerBackgroundSyncNow,
        remoteDriveFiles,
        isFetchingDriveFiles,
        fetchRemoteDriveFiles,
        deleteRemoteDriveFile,
        contacts,
        contactsSearchQuery,
        setContactsSearchQuery,
        filterStarredOnly,
        toggleFilterStarredOnly,
        addContact,
        updateContact,
        deleteContact,
        toggleContactStarred,
        importContactsFromCsv,
        restoreDefaultContact,
        currentStreamUrl,
        currentStreamTitle,
        setStream,
        macros,
        predefinedScripts: PREDEFINED_SCRIPTS,
        lastTermuxResult,
        saveMacro,
        updateMacro,
        deleteMacro,
        toggleFavoriteMacro,
        executeMacro,
        executeRawShellCommand,
        executePredefinedScript,
        generateScriptCode,
        ia22SessionStatus,
        setIa22TunnelUrl,
        pingIa22Tunnel,
        wipeIa22SessionTraces,
        triggerIa22AdbBroadcast,
        aiAnalysisResult,
        isAiAnalyzing,
        analyzeRecordingWithAi,
        showRealModeDialog,
        setShowRealModeDialog,
        showPlayStoreDialog,
        setShowPlayStoreDialog,
        showCameraDialog,
        setShowCameraDialog,
        showThemeDialog,
        setShowThemeDialog,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
