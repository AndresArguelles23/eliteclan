import { useMemo, useState } from 'react';
import { CTAButton } from './Button';
import { ShowCard } from './ShowCard';
import type { Show } from '../services/api';
import '../App.css';

type FilterableShowGridProps = {
  shows: Show[];
};

export const FilterableShowGrid = ({ shows }: FilterableShowGridProps) => {
  const [activeTag, setActiveTag] = useState<string>('Todos');

  const tags = useMemo(() => ['Todos', ...new Set(shows.flatMap((show) => show.tags ?? []))], [shows]);

  const filtered = useMemo(
    () => (activeTag === 'Todos' ? shows : shows.filter((show) => (show.tags ?? []).includes(activeTag))),
    [shows, activeTag],
  );

  return (
    <div className="grid" style={{ gap: '2rem' }}>
      <div className="badge-row">
        {tags.map((tag) => (
          <CTAButton
            key={tag}
            variant={activeTag === tag ? 'primary' : 'secondary'}
            onClick={() => setActiveTag(tag)}
            aria-pressed={activeTag === tag}
            className="chip"
            style={{ borderRadius: 'var(--radius-pill)', paddingInline: '1rem', paddingBlock: '0.5rem' }}
          >
            {tag}
          </CTAButton>
        ))}
      </div>
      <div className="grid auto-fit">
        {filtered.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
};
