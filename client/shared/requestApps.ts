export const REQUEST_APP_OPTIONS = [
    { label: 'Disabled', value: 'none' },
    { label: 'Seerr', value: 'seerr' },
    { label: 'Ombi', value: 'ombi' },
] as const;

/** Map legacy Overseerr/Jellyseerr configs to Seerr (same API). */
export const normalizeRequestAppType = (type: string | undefined | null): string => {
    const value = String(type || 'none').toLowerCase();
    if (value === 'overseerr' || value === 'jellyseerr') return 'seerr';
    return value;
};
