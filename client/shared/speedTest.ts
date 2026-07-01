export type SpeedTestPhase = 'idle' | 'ping' | 'download' | 'upload' | 'done' | 'error';

export type SpeedTestResult = {
    pingMs: number;
    downloadMbps: number;
    uploadMbps: number;
};

export type SpeedTestProgress = {
    phase: SpeedTestPhase;
    progress: number;
    result?: SpeedTestResult;
    error?: string;
};

const measurePing = async (samples = 5): Promise<number> => {
    const times: number[] = [];
    for (let i = 0; i < samples; i++) {
        const start = performance.now();
        const res = await fetch('/api/speedtest/ping', { credentials: 'include', cache: 'no-store' });
        if (!res.ok) throw new Error('Ping failed');
        await res.text();
        times.push(performance.now() - start);
    }
    return times.reduce((a, b) => a + b, 0) / times.length;
};

const measureDownload = async (bytes = 3 * 1024 * 1024): Promise<number> => {
    const start = performance.now();
    const res = await fetch(`/api/speedtest/download?bytes=${bytes}`, { credentials: 'include', cache: 'no-store' });
    if (!res.ok) throw new Error('Download test failed');
    const blob = await res.blob();
    const seconds = (performance.now() - start) / 1000;
    if (seconds <= 0) return 0;
    return (blob.size * 8) / 1_000_000 / seconds;
};

const measureUpload = async (bytes = 1024 * 1024): Promise<number> => {
    const body = new Uint8Array(bytes);
    const start = performance.now();
    const res = await fetch('/api/speedtest/upload', {
        method: 'POST',
        body,
        credentials: 'include',
        headers: { 'Content-Type': 'application/octet-stream' },
    });
    if (!res.ok) throw new Error('Upload test failed');
    await res.text();
    const seconds = (performance.now() - start) / 1000;
    if (seconds <= 0) return 0;
    return (bytes * 8) / 1_000_000 / seconds;
};

export async function runSpeedTest(onProgress: (update: SpeedTestProgress) => void): Promise<SpeedTestResult> {
    onProgress({ phase: 'ping', progress: 0 });
    const pingMs = await measurePing();
    onProgress({ phase: 'ping', progress: 100 });

    onProgress({ phase: 'download', progress: 0 });
    const downloadMbps = await measureDownload();
    onProgress({ phase: 'download', progress: 100 });

    onProgress({ phase: 'upload', progress: 0 });
    const uploadMbps = await measureUpload();
    onProgress({ phase: 'upload', progress: 100 });

    const result = { pingMs, downloadMbps, uploadMbps };
    onProgress({ phase: 'done', progress: 100, result });
    return result;
}

export const formatMbps = (mbps: number) => {
    if (!Number.isFinite(mbps) || mbps <= 0) return '—';
    if (mbps >= 100) return `${Math.round(mbps)} Mbps`;
    if (mbps >= 10) return `${mbps.toFixed(1)} Mbps`;
    return `${mbps.toFixed(2)} Mbps`;
};

export const formatPing = (ms: number) => {
    if (!Number.isFinite(ms) || ms <= 0) return '—';
    return `${Math.round(ms)} ms`;
};
