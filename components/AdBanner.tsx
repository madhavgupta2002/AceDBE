'use client';

import { useEffect } from 'react';

interface AdBannerProps {
    dataAdSlot?: string;
    dataAdFormat?: string;
    dataFullWidthResponsive?: boolean;
    className?: string;
}

export default function AdBanner({
    dataAdSlot,
    dataAdFormat = 'auto',
    dataFullWidthResponsive = true,
    className = '',
}: AdBannerProps) {
    useEffect(() => {
        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className={`my-6 flex justify-center overflow-hidden ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-8390650849299235"
                data-ad-slot={dataAdSlot}
                data-ad-format={dataAdFormat}
                data-full-width-responsive={dataFullWidthResponsive ? 'true' : 'false'}
            />
        </div>
    );
}
