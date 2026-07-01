import React, { useState, useCallback } from 'react';
import { Activity, Download, Upload, Wifi, RefreshCw } from 'lucide-react';
import { runSpeedTest, formatMbps, formatPing, type SpeedTestPhase, type SpeedTestResult } from './speedTest';

export const SpeedTestPanel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
    const [phase, setPhase] = useState<SpeedTestPhase>('idle');
    const [result, setResult] = useState<SpeedTestResult | null>(null);
    const [error, setError] = useState('');

    const running = phase !== 'idle' && phase !== 'done' && phase !== 'error';

    const handleRun = useCallback(async () => {
        setError('');
        setResult(null);
        try {
            await runSpeedTest(({ phase: p, result: r, error: err }) => {
                setPhase(p);
                if (r) setResult(r);
                if (err) setError(err);
            });
        } catch (e) {
            setPhase('error');
            setError(e instanceof Error ? e.message : 'Speed test failed');
        }
    }, []);

    const phaseLabel = phase === 'ping' ? 'Measuring latency…'
        : phase === 'download' ? 'Testing download…'
            : phase === 'upload' ? 'Testing upload…'
                : '';

    return (
        <div className={`bg-card border border-border rounded-2xl shadow-xl ${compact ? 'p-5' : 'p-6'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                    <h3 className={`font-bold text-text flex items-center gap-2 ${compact ? 'text-base' : 'text-lg'}`}>
                        <Wifi className="w-5 h-5 text-plex" />
                        Connection Speed Test
                    </h3>
                    <p className="text-muted text-sm mt-1">Measure your connection to this portal server.</p>
                </div>
                <button
                    type="button"
                    onClick={handleRun}
                    disabled={running}
                    className="px-5 py-2.5 bg-plex text-background rounded-lg font-bold text-sm hover:bg-plex-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                    {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                    {running ? 'Testing…' : result ? 'Run Again' : 'Start Test'}
                </button>
            </div>

            {running && phaseLabel && (
                <div className="mb-4 text-sm text-plex font-medium animate-pulse">{phaseLabel}</div>
            )}

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-background/60 border border-border rounded-xl p-4 flex flex-col items-center text-center">
                    <Wifi className="w-5 h-5 text-blue-400 mb-2" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Ping</span>
                    <span className="text-2xl font-black text-text">{result ? formatPing(result.pingMs) : '—'}</span>
                </div>
                <div className="bg-background/60 border border-border rounded-xl p-4 flex flex-col items-center text-center">
                    <Download className="w-5 h-5 text-green-400 mb-2" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Download</span>
                    <span className="text-2xl font-black text-text">{result ? formatMbps(result.downloadMbps) : '—'}</span>
                </div>
                <div className="bg-background/60 border border-border rounded-xl p-4 flex flex-col items-center text-center">
                    <Upload className="w-5 h-5 text-purple-400 mb-2" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Upload</span>
                    <span className="text-2xl font-black text-text">{result ? formatMbps(result.uploadMbps) : '—'}</span>
                </div>
            </div>
        </div>
    );
};
