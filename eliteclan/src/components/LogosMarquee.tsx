import type { Partner } from '../data';
import '../App.css';

type LogosMarqueeProps = {
  partners: Partner[];
};

export const LogosMarquee = ({ partners }: LogosMarqueeProps) => {
  return (
    <div
      className="glass-panel"
      style={{ overflow: 'hidden', padding: '1.5rem', position: 'relative' }}
      aria-label="Marcas aliadas"
    >
      <div
        style={{
          display: 'flex',
          gap: '2.5rem',
          animation: 'scrollX 18s linear infinite',
          alignItems: 'center',
          minWidth: 'max-content',
        }}
      >
        {[...partners, ...partners].map((partner, index) => (
          <a key={`${partner.id}-${index}`} href={partner.website} target="_blank" rel="noreferrer">
            <img
              src={partner.logo}
              alt={partner.name}
              loading="lazy"
              style={{ height: '44px', width: 'auto', filter: 'invert(1)' }}
            />
          </a>
        ))}
      </div>
      <style>{`
        @keyframes scrollX {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
