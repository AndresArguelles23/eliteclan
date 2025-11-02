import { useEffect, useMemo, useState } from 'react';
import type { ShowMedia } from '../data';
import '../App.css';

type MediaCarouselProps = {
  items: ShowMedia[];
  autoPlay?: boolean;
  interval?: number;
};

export const MediaCarousel = ({ items, autoPlay = true, interval = 6000 }: MediaCarouselProps) => {
  const safeItems = useMemo(() => items.slice(0, 6), [items]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoPlay || safeItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % safeItems.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, safeItems.length, interval]);

  return (
    <div className="glass-panel" style={{ padding: '1rem', position: 'relative' }}>
      <div className="media-ratio">
        {safeItems[current].type === 'image' ? (
          <img src={safeItems[current].src} alt={safeItems[current].alt} loading="lazy" />
        ) : (
          <iframe
            title={safeItems[current].alt}
            src={safeItems[current].src}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          display: 'flex',
          gap: '0.35rem',
        }}
        aria-label="Seleccionar media"
      >
        {safeItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Mostrar elemento ${index + 1}`}
            style={{
              width: '0.75rem',
              height: '0.75rem',
              borderRadius: '999px',
              background: index === current ? 'var(--color-accent)' : 'rgba(255,255,255,0.25)',
              border: 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};
