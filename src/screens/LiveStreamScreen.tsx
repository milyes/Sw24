import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import Hls from 'hls.js';
import { 
  Tv, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RefreshCw, 
  Copy, 
  Plus, 
  Check, 
  Radio, 
  ExternalLink, 
  Layers 
} from 'lucide-react';

interface StreamPreset {
  id: string;
  title: string;
  category: string;
  streamUrl: string;
  resolution: string;
  isIframe?: boolean;
}

export const LiveStreamScreen: React.FC = () => {
  const { currentStreamUrl, currentStreamTitle, setStream, tr, addToast } = useApp();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [customTitleInput, setCustomTitleInput] = useState('');
  const [copied, setCopied] = useState(false);

  const presets: StreamPreset[] = [
    {
      id: 'bein_1_hf',
      title: 'BEIN 1 HF',
      category: 'Sport & Direct',
      streamUrl: 'https://tvnow.best/api/stream/amishpatel81@gmail.com/790899/livetv.epg/tf1.fr.m3u8',
      resolution: '1080p High Frequency'
    },
    {
      id: 'mux_test_hls',
      title: 'Mux Live HLS Test',
      category: 'Flux HLS Certifié',
      streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      resolution: '1080p HLS Validé'
    },
    {
      id: 'france_24',
      title: 'France 24 Info',
      category: 'Actualités 24/7',
      streamUrl: 'https://static.france24.com/live/F24_FR_LO_HLS/live_tv.m3u8',
      resolution: '720p HLS'
    },
    {
      id: 'euronews_fr',
      title: 'Euronews Français',
      category: 'Actualités Internationales',
      streamUrl: 'https://rakuten-euronews-1-eu.rakuten.wurl.tv/playlist.m3u8',
      resolution: '720p HLS'
    },
    {
      id: 'tf1_direct',
      title: 'TF1 HD Direct',
      category: 'Généraliste',
      streamUrl: 'https://tvnow.best/api/stream/amishpatel81@gmail.com/790899/livetv.epg/tf1.fr.m3u8',
      resolution: '1080p Direct'
    },
    {
      id: 'zcore_logic_cover',
      title: 'Z-CORE Logic Cover (979V11)',
      category: 'Tunnel Cloudflare (Ghost)',
      streamUrl: 'https://retailers-mitchell-customs-rotation.trycloudflare.com/logic_cover.html',
      resolution: 'Web UI / Gatekeeper 979V11',
      isIframe: true
    },
    {
      id: 'zcore_usb_live',
      title: 'Z-CORE USB Live (Montreal)',
      category: 'Tunnel Cloudflare (Ghost)',
      streamUrl: 'https://retailers-mitchell-customs-rotation.trycloudflare.com/index_usb.html',
      resolution: 'Web UI / Montreal QC',
      isIframe: true
    }
  ];

  const currentPreset = presets.find(p => p.streamUrl === currentStreamUrl);
  const isHtmlPage = currentPreset?.isIframe || currentStreamUrl.endsWith('.html');

  // Load stream via HLS.js or native video
  useEffect(() => {
    if (isHtmlPage) {
      setIsLoading(false);
      setErrorMsg(null);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported() && currentStreamUrl.includes('.m3u8')) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60
      });
      hls.loadSource(currentStreamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setErrorMsg("Flux indisponible ou restriction CORS distante.");
              setIsLoading(false);
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = currentStreamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video.play().catch(() => setIsPlaying(false));
      });
      video.addEventListener('error', () => {
        setErrorMsg("Erreur lors de la lecture du flux natif.");
        setIsLoading(false);
      });
    } else {
      video.src = currentStreamUrl;
      video.play().catch(() => {});
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentStreamUrl, isHtmlPage]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(currentStreamUrl);
    setCopied(true);
    addToast(tr("URL du flux copiée !", "Stream URL copied!"), 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddCustomStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    const title = customTitleInput.trim() || 'Flux Personnalisé';
    setStream(customUrlInput.trim(), title);
    setShowCustomModal(false);
    setCustomUrlInput('');
    setCustomTitleInput('');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">
                  {currentStreamTitle}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white tracking-wider animate-pulse">
                  DIRECT
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono truncate max-w-sm sm:max-w-md">
                {currentStreamUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={copyUrl}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
              title="Copier URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowCustomModal(true)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
              title="Ajouter un flux"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Video Player Viewport */}
      <div
        ref={containerRef}
        className="relative aspect-video w-full rounded-2xl bg-black border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center group"
      >
        {isHtmlPage ? (
          <iframe
            src={currentStreamUrl}
            title={currentStreamTitle}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
            />

            {isLoading && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin"></div>
                <span className="text-xs font-mono text-slate-300">Connexion au flux en cours...</span>
              </div>
            )}

            {errorMsg && (
              <div className="absolute inset-0 bg-slate-950/80 p-6 flex flex-col items-center justify-center text-center space-y-3">
                <Radio className="w-10 h-10 text-rose-400 animate-pulse" />
                <p className="text-xs text-rose-300 max-w-sm">{errorMsg}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStream(presets[1].streamUrl, presets[1].title)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer"
                  >
                    Essayer Flux Mux HLS
                  </button>
                  <a
                    href={currentStreamUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ouvrir URL directe</span>
                  </a>
                </div>
              </div>
            )}

            {/* Overlay Playback Controls */}
            {!isHtmlPage && !errorMsg && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between gap-3 text-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-100 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-100 cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-300">
                    {currentPreset?.resolution || '1080p 60fps'}
                  </span>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-100 cursor-pointer"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 3. Preset Channels Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-300">
          Sélectionner une chaîne ou un tunnel :
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presets.map(p => {
            const isSelected = p.streamUrl === currentStreamUrl;
            return (
              <button
                key={p.id}
                onClick={() => setStream(p.streamUrl, p.title)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-rose-500/15 border-rose-500/50 text-slate-100 shadow-md shadow-rose-950/20' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{p.title}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{p.category} • {p.resolution}</p>
                </div>
                <Tv className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Stream URL Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleAddCustomStream}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">Ajouter un Flux HLS / Direct</h3>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <input
                type="text"
                placeholder="Titre du flux (ex: Mon Flux Sport)"
                value={customTitleInput}
                onChange={(e) => setCustomTitleInput(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              />
              <input
                type="url"
                placeholder="URL du flux HLS (https://.../stream.m3u8)"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 cursor-pointer"
              >
                Charger Flux
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
