import { useEffect, useState } from 'react';

/** Matches MainApp ultra-wide content cap (16:9 of screen height). */
export const PORTAL_WIDE_LAYOUT_THRESHOLD = (16 / 9) + 0.03;

export const isPortalWideContentLayout = () => {
    const screenWidth = window.screen?.width || window.innerWidth;
    const screenHeight = window.screen?.height || window.innerHeight;
    return screenWidth / Math.max(1, screenHeight) > PORTAL_WIDE_LAYOUT_THRESHOLD;
};

export const usePortalWideContentLayout = () => {
    const [isWide, setIsWide] = useState(() =>
        typeof window !== 'undefined' ? isPortalWideContentLayout() : false
    );

    useEffect(() => {
        const update = () => setIsWide(isPortalWideContentLayout());
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return isWide;
};

export const activityStreamColumnCount = (wideLayout: boolean, sessionCount: number) =>
    wideLayout && sessionCount >= 4 ? 4 : 3;

export const activityStreamGridClass = (wideLayout: boolean, sessionCount: number) => {
    const useFourCols = activityStreamColumnCount(wideLayout, sessionCount) === 4;
    return useFourCols
        ? 'grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 xl:grid-cols-4'
        : 'grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6';
};

/** Discover poster rows: 3 across until extra-wide, then scale up. */
export const discoverPosterGridClass = 'grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-10 gap-3 w-full pb-4';
