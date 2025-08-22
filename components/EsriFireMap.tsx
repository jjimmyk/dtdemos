import React from 'react';

interface EsriFireMapProps {
  className?: string;
  currentTime?: Date;
}

export function EsriFireMap({ className }: EsriFireMapProps) {
  const skytlSrc = encodeURI('/SkyTL Data 82125/index.html');

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
