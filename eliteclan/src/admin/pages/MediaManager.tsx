import type { FormEvent } from 'react';
import { useRef, useState } from 'react';

import type { MediaAsset } from '../../services/api';
import { useMediaLibrary } from '../media/MediaContext';

export default function MediaManagerPage() {
  const { assets, upload, registerEmbed, remove, loading, refresh } = useMediaLibrary();
  const [error, setError] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState('');
  const [embedAlt, setEmbedAlt] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError('Selecciona un archivo de imagen');
      return;
    }
    try {
      await upload({ file, alt: imageAlt, optimize: true });
      if (fileInputRef.current) fileInputRef.current.value = '';
      setImageAlt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir el archivo');
    }
  };

  const handleEmbed = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      await registerEmbed(embedUrl, embedAlt);
      setEmbedUrl('');
      setEmbedAlt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar la URL');
    }
  };

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <header style={{ display: 'grid', gap: '0.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Gestor de media</h1>
        <p style={{ color: 'rgba(255,255,255,0.65)' }}>
          Optimiza imágenes, genera thumbnails y almacena los recursos multimedia utilizados en el sitio.
        </p>
        <button
          type="button"
          onClick={() => void refresh()}
          style={{
            justifySelf: 'start',
            padding: '0.5rem 0.85rem',
            borderRadius: '0.65rem',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent',
            color: 'inherit',
            cursor: 'pointer',
          }}
        >
          Actualizar biblioteca
        </button>
      </header>

      {error && (
        <div style={{ background: 'rgba(255, 87, 87, 0.18)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#ff8a80' }}>
          {error}
        </div>
      )}

      <section className="card" style={{ padding: '1.5rem', display: 'grid', gap: '1.5rem', background: 'rgba(17,24,39,0.85)' }}>
        <form onSubmit={handleUpload} style={{ display: 'grid', gap: '0.75rem' }}>
          <h2 style={{ margin: 0 }}>Subir imagen</h2>
          <input ref={fileInputRef} type="file" accept="image/*" required />
          <input
            type="text"
            placeholder="Texto alternativo"
            value={imageAlt}
            onChange={(event) => setImageAlt(event.target.value)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
              color: 'inherit',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              color: 'white',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Subir y optimizar
          </button>
        </form>

        <form onSubmit={handleEmbed} style={{ display: 'grid', gap: '0.75rem' }}>
          <h2 style={{ margin: 0 }}>Registrar URL embebida</h2>
          <input
            type="url"
            placeholder="https://www.youtube.com/..."
            value={embedUrl}
            onChange={(event) => setEmbedUrl(event.target.value)}
            required
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
              color: 'inherit',
            }}
          />
          <input
            type="text"
            placeholder="Texto alternativo del embed"
            value={embedAlt}
            onChange={(event) => setEmbedAlt(event.target.value)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
              color: 'inherit',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'linear-gradient(135deg, #22d3ee, #6366f1)',
              color: 'white',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Guardar enlace
          </button>
        </form>
      </section>

      <section style={{ display: 'grid', gap: '1rem' }}>
        <h2>Biblioteca ({assets.length})</h2>
        {loading && <p>Cargando biblioteca…</p>}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {assets.map((asset) => (
            <MediaCard
              key={asset.id}
              asset={asset}
              onDelete={() => {
                void remove(asset.id);
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function MediaCard({ asset, onDelete }: { asset: MediaAsset; onDelete: () => void }) {
  return (
    <article className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      {asset.type === 'image' ? (
        <img
          src={asset.thumbnailUrl ?? asset.url}
          alt={asset.alt}
          style={{ width: '100%', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>{asset.provider?.toUpperCase()} · Contenido embebido</p>
        </div>
      )}
      <div style={{ display: 'grid', gap: '0.35rem' }}>
        <strong>{asset.alt ?? asset.provider ?? 'Recurso'}</strong>
        <a href={asset.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', fontSize: '0.85rem' }}>
          Abrir recurso
        </a>
      </div>
      <button
        type="button"
        onClick={onDelete}
        style={{
          justifySelf: 'start',
          padding: '0.5rem 0.75rem',
          borderRadius: '0.65rem',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
        }}
      >
        Eliminar
      </button>
    </article>
  );
}
