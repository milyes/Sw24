import React from 'react';

interface AudioWaveformVisualizerProps {
  amplitudes: number[];
  isLive?: boolean;
  barColor?: string;
  className?: string;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({
  amplitudes,
  isLive = false,
  barColor = 'bg-emerald-500',
  className = ''
}) => {
  // Ensure we have at least 24 bars
  const defaultBars = [25, 45, 65, 85, 90, 75, 60, 40, 80, 95, 70, 50, 30, 60, 80, 90, 60, 40, 25, 50, 65, 45, 35, 20];
  const displayBars = amplitudes.length > 0 ? amplitudes : defaultBars;

  return (
    <div 
      data-testid="live_amplitude_visualizer"
      className={`w-full flex items-center justify-between gap-1 h-16 px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-hidden ${className}`}
    >
      {displayBars.map((amp, index) => {
        const heightPercent = Math.max(12, Math.min(100, amp));
        return (
          <div
            key={index}
            className="flex-1 flex flex-col justify-center items-center h-full"
          >
            <div
              style={{ height: `${heightPercent}%` }}
              className={`w-full max-w-[6px] rounded-full transition-all duration-150 ${barColor} ${
                isLive ? 'opacity-90' : 'opacity-70'
              }`}
            />
          </div>
        );
      })}
    </div>
  );
};
