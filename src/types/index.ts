export type NavigationTab = 
  | 'RECORDER_VAULT'
  | 'CLOUD_SYNC'
  | 'CONTACTS'
  | 'LIVE_STREAM'
  | 'TERMUX_MACROS'
  | 'AI_STUDIO'
  | 'LOGIN';

export type AppLanguage = 'FR' | 'EN';

export type AppThemeMode = 'DARK' | 'LIGHT' | 'OLED';

export interface AudioRecording {
  id: number;
  title: string;
  fileName: string;
  durationSeconds: number;
  fileSizeMb: number;
  localPath: string;
  cloudPath: string;
  isSynced: boolean;
  syncStatus: 'LOCAL_ONLY' | 'SYNCING' | 'CLOUD_SYNCED' | 'SYNC_FAILED' | 'ERROR';
  timestamp: number;
  sourceStream: string;
  transcription?: string;
  aiSummary?: string;
  waveformData: string; // CSV numbers e.g. "20,45,80,..."
  audioBlobUrl?: string; // in-memory object URL if recorded during session
}

export interface CommandMacro {
  id: number;
  name: string;
  category: 'RCLONE' | 'ADB' | 'TERMUX' | 'Z_GHOST';
  commandText: string;
  description: string;
  isFavorite: boolean;
  requiresRoot: boolean;
}

export interface Contact {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  organization: string;
  phoneNumber: string;
  phoneLabel: string;
  email: string;
  addressFormatted: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  extendedAddress: string;
  notes: string;
  profileUrl: string;
  labels: string;
  isStarred: boolean;
  createdAt: number;
}

export interface SyncLog {
  id: number;
  recordingId: number | null;
  commandExecuted: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILED';
  progressPercent: number;
  bytesTransferred: string;
  timestamp: number;
  errorMessage?: string | null;
}

export interface RcloneSyncConfig {
  remoteName: string;
  remotePath: string;
  dryRun: boolean;
  autoSyncEnabled: boolean;
  verboseLogging: boolean;
  maxRetries: number;
  bandwidthLimit: string;
  syncOnWifiOnly: boolean;
}

export interface RealDeviceParameters {
  realHardwareDac: boolean;       // 44.1 kHz PCM Lossless Audio
  realMicrophoneDirect: boolean;  // Direct hardware mic access
  realSilenceVAD: boolean;        // Real Voice Activity & Silence Detection
  realRcloneExecution: boolean;   // Live transmission (dryRun = false)
  realGoogleAuthOAuth: boolean;   // Google Drive OAuth2
  realAutoCloudSync: boolean;     // Background sync upon recording finish
  realTermuxSocket: boolean;      // Native Termux commands execution
  realExponentialRetry: boolean;  // Auto retry on network drop
  realStorageAccess: boolean;     // Scoped storage + storage directory
}

export interface Ia22SessionState {
  isSessionActive: boolean;
  masterNode: string;
  operatorName: string;
  lastBroadcastMessage: string;
  lastUpdatedTimestamp: number;
  isTunnelActive: boolean;
  tunnelUrl: string;
  tunnelStatus: string;
  isRamCleaned: boolean;
  totalBroadcastCount: number;
}

export interface ScriptArgument {
  key: string;
  labelFr: string;
  labelEn: string;
  defaultValue: string;
  descriptionFr: string;
  descriptionEn: string;
  isSecret?: boolean;
  options?: string[];
}

export interface PredefinedTermuxScript {
  id: string;
  titleFr: string;
  titleEn: string;
  category: 'RCLONE_CLOUD' | 'AUDIO_PROCESSING' | 'STORAGE_SYSTEM' | 'TELEMETRY_GHOST' | 'DIAGNOSTICS' | 'TERMUX_API';
  descriptionFr: string;
  descriptionEn: string;
  executablePath?: string;
  workDir?: string;
  templateScript: (args: Record<string, string>) => string;
  arguments: ScriptArgument[];
  defaultRunInBackground: boolean;
  iconType: string;
}

export interface TermuxExecutionResult {
  success: boolean;
  message: string;
  executedScriptId: string | null;
  scriptTitle: string;
  commandDispatched: string;
  timestamp: number;
  isBackground: boolean;
}

export interface PlayerState {
  playingRecordingId: number | null;
  isPlaying: boolean;
  currentPositionSeconds: number;
  playbackSpeed: number;
}

export interface RecorderState {
  isRecording: boolean;
  isPaused: boolean;
  isAutoPausedBySilence: boolean;
  isSilenceDetectionEnabled: boolean;
  silenceDurationSeconds: number;
  durationSeconds: number;
  liveAmplitudes: number[];
  recordingName: string;
}
