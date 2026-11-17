# Audio Sync Hub (Z-CORE Voice & Google Drive Sync Infrastructure)

Audio Sync Hub is a full-stack React web application rewritten from the Android project, providing voice recording with real-time waveform visualization, VAD silence auto-pause and resume, Google Drive & Rclone cloud synchronization management, a contacts directory with Google Contacts CSV import, live HLS streaming, Termux shell macro editor and execution intent bridge, S24 IA22 session manager, and Gemini AI audio studio analysis.

## Core Features

- **FLUX WAY Voice Recorder**:
  - Live audio recording using the browser `MediaRecorder` & `AudioContext`
  - Real dynamic amplitude waveform analyzer & live dB level meter
  - Voice Activity Detection (VAD) with 5-second silence auto-pause and voice-sensed auto-resume
  - Real Hardware Mode parameters (44.1 kHz PCM, direct mic, VAD, auto cloud sync)
  - Audio playback with custom seek slider, variable playback speed (0.5x, 1x, 1.25x, 1.5x, 2x), and waveform scrubber
  - Audio recording detail modal with metadata and transcription editor

- **Google Drive & Rclone Cloud Sync**:
  - Google Drive OAuth2 & Firebase authentication (configured with `1976ilies@gmail.com`)
  - 30-Day cloud sync telemetry dashboard (success vs failures distribution, success rate gauge)
  - Automated background sync queue and mass-sync for selected files
  - Interactive Rclone CLI command runner
  - Remote Google Drive file manager (listing, upload, deletion)
  - Detailed sync logs history with status and transfer size

- **Contacts & Destinataires Directory**:
  - Full CRUD operations with initials avatars and starred status
  - Pre-seeded default contact for **Nesrin Ouis** (+1 438-985-5041, Saint-Leonard QC Canada) with direct profile link to CanadaPages.com
  - Direct telephony actions (`tel:...`) and messaging (`sms:...`)
  - Google Contacts CSV parser & importer

- **Live Stream Player (BEIN 1 HF)**:
  - High-performance HLS video stream player via `hls.js`
  - Channels catalog: BEIN 1 HF, Mux Live HLS test, TF1 Direct, France 24 Info, Euronews, and Z-CORE Cloudflare WebUI tunnels (Logic Cover 979V11, USB Live Montreal, Workspace Live)
  - Custom `.m3u8` stream URL launcher and fullscreen viewport

- **Termux & ADB Macro Hub**:
  - Custom shell macro editor with category filtering (RCLONE, TERMUX, ADB, Z_GHOST)
  - Predefined Termux scripts catalog with interactive arguments and live bash code generator
  - Z_GHOST Trailer wakeup sequence targeting the Fido cellular network (+1 438 985-5041)
  - IA22 Session Manager for S24 master node (operator M.I. ZOUBIROU), Cloudflare tunnel ping test, RAM and session trace purge, and Windows `.bat` script exporter

- **Gemini AI Audio Studio**:
  - AI-powered acoustic structure, key point synthesis, and logistics analysis powered by Google Gemini (`gemini-2.5-flash`) via server proxy route `/api/gemini/analyze`
  - Official NETSECUREPRO IA SIM & eSIM license card with RGPD compliance verification

- **Display & Hardware Settings**:
  - French 🇫🇷 and English 🇬🇧 multilingual toggle
  - Dark, Light, and Pure Black OLED display themes
  - Google Play Store listing dialog and Camera photo capture dialog

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Lucide React, Hls.js
- **Backend**: Node.js, Express, @google/genai SDK
- **Database / Auth**: Firebase Auth, LocalStorage reactive cache
