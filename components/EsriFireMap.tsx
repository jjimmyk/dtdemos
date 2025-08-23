import React from 'react';

interface EsriFireMapProps {
  className?: string;
  currentTime?: Date;
}

export function EsriFireMap({ className }: EsriFireMapProps) {
  const baseUrl = (import.meta as any).env.BASE_URL || '/';
  // Cache-bust to ensure latest embedded HTML is loaded on Vercel
  const versionParam = React.useMemo(() => {
    const env = (import.meta as any).env || {};
    return (
      env.VITE_APP_VERSION ||
      env.VITE_COMMIT_SHA ||
      env.VITE_BUILD_ID ||
      String(Date.now())
    );
  }, []);
  const skytlSrc = `${baseUrl}${encodeURI('SkyTL Data 82125/index.html')}?v=${encodeURIComponent(versionParam)}`;

  return (
    <div className={`bg-card rounded-lg overflow-hidden ${className}`}>
      <div className="relative w-full h-full" style={{ minHeight: '700px' }}>
        <iframe
          title="Lahaina Data Map"
          src={skytlSrc}
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
        />
      </div>
    </div>
  );
}
