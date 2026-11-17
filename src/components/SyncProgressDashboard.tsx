import React from 'react';
import { SyncLog } from '../types';
import { useApp } from '../context/AppContext';
import { Activity, CheckCircle2, XCircle, TrendingUp, BarChart3 } from 'lucide-react';

interface SyncProgressDashboardProps {
  syncLogs: SyncLog[];
  isFr: boolean;
}

export const SyncProgressDashboard: React.FC<SyncProgressDashboardProps> = ({ syncLogs, isFr }) => {
  const totalOperations = syncLogs.length;
  const successCount = syncLogs.filter(l => l.status === 'SUCCESS').length;
  const failedCount = syncLogs.filter(l => l.status === 'FAILED').length;
  const successRate = totalOperations > 0 ? ((successCount / totalOperations) * 100).toFixed(1) : '100.0';

  // Group by day for the last 14 days
  const now = Date.now();
  const dayMs = 86400000;
  const dayBuckets: { dayLabel: string; successes: number; fails: number }[] = [];

  for (let i = 13; i >= 0; i--) {
    const start = now - (i + 1) * dayMs;
    const end = now - i * dayMs;
    const dayDate = new Date(start);
    const dayLabel = `${dayDate.getDate()}/${dayDate.getMonth() + 1}`;

    const successes = syncLogs.filter(l => l.timestamp >= start && l.timestamp < end && l.status === 'SUCCESS').length;
    const fails = syncLogs.filter(l => l.timestamp >= start && l.timestamp < end && l.status === 'FAILED').length;
    dayBuckets.push({ dayLabel, successes, fails });
  }

  const maxVal = Math.max(...dayBuckets.map(b => b.successes + b.fails), 1);

  return (
    <div 
      data-testid="sync_progress_dashboard"
      className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
    >
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              {isFr ? "Télémétrie Cloud 30 Jours (Succès vs Échecs)" : "30-Day Cloud Telemetry (Success vs Fail)"}
            </h3>
            <p className="text-xs text-slate-400">
              {isFr ? "Performance du bridge Rclone / Google Drive" : "Rclone / Google Drive bridge performance"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {successRate}% {isFr ? "Succès" : "Success"}
          </span>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-slate-400 block text-[11px]">{isFr ? "Opérations Totales" : "Total Ops"}</span>
          <span className="text-base font-bold text-slate-100 mt-0.5 block">{totalOperations}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-emerald-500/30">
          <span className="text-slate-400 block text-[11px]">{isFr ? "Transferts Réussis" : "Successes"}</span>
          <span className="text-base font-bold text-emerald-400 mt-0.5 block">{successCount}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-rose-500/30">
          <span className="text-slate-400 block text-[11px]">{isFr ? "Échecs Réseau" : "Failures"}</span>
          <span className="text-base font-bold text-rose-400 mt-0.5 block">{failedCount}</span>
        </div>
      </div>

      {/* Bar Chart Visualization (Last 14 days) */}
      <div className="pt-2">
        <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
          <span>{isFr ? "Distribution des transferts journaliers :" : "Daily transfer distribution:"}</span>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {isFr ? "Succès" : "Success"}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              {isFr ? "Échec" : "Failed"}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-1.5 h-28 px-2 py-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
          {dayBuckets.map((bucket, idx) => {
            const total = bucket.successes + bucket.fails;
            const successHeight = (bucket.successes / maxVal) * 100;
            const failHeight = (bucket.fails / maxVal) * 100;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-[10px] text-slate-200 px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10 font-mono">
                  {bucket.dayLabel}: {bucket.successes}✓ {bucket.fails > 0 ? `| ${bucket.fails}✗` : ''}
                </div>

                <div className="w-full max-w-[12px] flex flex-col items-center justify-end gap-0.5 h-full">
                  {bucket.fails > 0 && (
                    <div
                      style={{ height: `${Math.max(6, failHeight)}%` }}
                      className="w-full bg-rose-500 rounded-t-sm"
                    />
                  )}
                  <div
                    style={{ height: `${Math.max(8, successHeight)}%` }}
                    className={`w-full bg-emerald-500 ${bucket.fails === 0 ? 'rounded-t-sm' : ''} rounded-b-sm`}
                  />
                </div>
                <span className="text-[9px] text-slate-500 mt-1 font-mono">{bucket.dayLabel.split('/')[0]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
