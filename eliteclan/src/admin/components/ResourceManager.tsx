import { useEffect, useMemo, useState } from 'react';

import type { ChangeLogEntry, ContentStatus, Role } from '../../services/api';
import { useAuth } from '../auth/AuthContext';
import type { User } from '@supabase/supabase-js';

type FieldType = 'text' | 'textarea' | 'date' | 'datetime' | 'list' | 'tags' | 'url' | 'number' | 'status' | 'select';

export type FieldDefinition<T> = {
  name: keyof T & string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  helperText?: string;
  placeholder?: string;
  min?: number;
  max?: number;
};

export type ResourceManagerProps<T extends { id: string; title: string; status: ContentStatus; history?: ChangeLogEntry[] }> = {
  title: string;
  description: string;
  role?: Role;
  fetchItems: () => Promise<T[]>;
  saveItem: (item: Partial<T>, user: User | null) => Promise<T>;
  deleteItem: (id: string) => Promise<void>;
  initialValue: () => Partial<T>;
  fields: FieldDefinition<T>[];
  renderPreview: (item: T) => React.ReactNode;
};

export function ResourceManager<T extends { id: string; title: string; status: ContentStatus; history?: ChangeLogEntry[] }>(
  props: ResourceManagerProps<T>,
) {
  const { user, role } = useAuth();
  const { title, description, fetchItems, saveItem, deleteItem, initialValue, fields, renderPreview, role: requiredRole } = props;

  const [items, setItems] = useState<T[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Partial<T>>(initialValue());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const result = await fetchItems();
        if (!ignore) setItems(result);
      } catch (err) {
        console.error('[resource-manager] unable to load', err);
        if (!ignore) setError('No se pudieron cargar los registros');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [fetchItems]);

  const handleSelect = (item: T | null) => {
    setSelectedId(item?.id ?? null);
    setFormState(item ? { ...item } : initialValue());
  };

  const updateField = (name: string, value: unknown) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = { ...formState } as Partial<T>;
      if (!payload.title) throw new Error('El título es obligatorio');
      const saved = await saveItem(payload, user ?? null);
      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === saved.id);
        if (existingIndex === -1) return [...prev, saved];
        const clone = [...prev];
        clone[existingIndex] = saved;
        return clone;
      });
      handleSelect(saved);
    } catch (err) {
      console.error('[resource-manager] save failed', err);
      setError(err instanceof Error ? err.message : 'No se pudo guardar el registro');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este registro?')) return;
    await deleteItem(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    handleSelect(null);
  };

  const previewItem = useMemo(() => {
    const base = (items.find((item) => item.id === selectedId) ?? formState) as T | Partial<T>;
    return {
      ...(base as T),
      ...(formState as T),
      id: (formState.id ?? selectedId ?? 'preview') as string,
      title: (formState.title ?? (base as T)?.title ?? 'Nuevo registro') as string,
      status: (formState.status ?? (base as T)?.status ?? 'draft') as ContentStatus,
      history: ((formState.history ?? (base as T)?.history) ?? []) as ChangeLogEntry[],
    } as T;
  }, [formState, items, selectedId]);

  const canEdit = !requiredRole || requiredRole === role;

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <header style={{ display: 'grid', gap: '0.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{title}</h1>
        <p style={{ color: 'rgba(255,255,255,0.65)' }}>{description}</p>
      </header>
      {error && (
        <div style={{ background: 'rgba(255, 87, 87, 0.18)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#ff8a80' }}>
          {error}
        </div>
      )}
      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'minmax(320px, 360px) 1fr', alignItems: 'start' }}>
        <section style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Registros</h2>
            <button
              type="button"
              onClick={() => handleSelect(null)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.65rem',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              Nuevo
            </button>
          </div>
          <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '60vh', overflow: 'auto', paddingRight: '0.5rem' }}>
            {loading && <p>Cargando…</p>}
            {!loading &&
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  style={{
                    textAlign: 'left',
                    borderRadius: '0.75rem',
                    padding: '0.85rem 1rem',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: item.id === selectedId ? 'rgba(99,102,241,0.22)' : 'rgba(255,255,255,0.04)',
                    color: 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '1rem' }}>{item.title}</strong>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{item.status === 'published' ? 'Publicado' : 'Borrador'}</span>
                </button>
              ))}
          </div>
        </section>
        <section style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="card" style={{ display: 'grid', gap: '1rem', padding: '1.5rem', background: 'rgba(17,24,39,0.85)' }}>
            <h2 style={{ margin: 0 }}>{selectedId ? 'Editar registro' : 'Nuevo registro'}</h2>
            <form
              style={{ display: 'grid', gap: '1rem' }}
              onSubmit={(event) => {
                event.preventDefault();
                if (!canEdit) {
                  setError('Tu rol no permite editar este recurso');
                  return;
                }
                void handleSubmit();
              }}
            >
              {fields.map((field) => (
                <Field
                  key={field.name}
                  definition={field}
                  value={(formState as any)[field.name] ?? ''}
                  onChange={(value) => updateField(field.name, value)}
                />
              ))}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  disabled={saving || !canEdit}
                  style={{
                    padding: '0.85rem 1.25rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {saving ? 'Guardando…' : 'Guardar cambios'}
                </button>
                {selectedId && canEdit && (
                  <button
                    type="button"
                    onClick={() => void handleDelete(selectedId)}
                    style={{
                      padding: '0.85rem 1.25rem',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(255,255,255,0.24)',
                      background: 'transparent',
                      color: 'inherit',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </form>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <section className="card" style={{ padding: '1.5rem', background: 'rgba(17,24,39,0.85)' }}>
              <h2 style={{ marginTop: 0 }}>Historial</h2>
              <HistoryTimeline history={(previewItem.history ?? []) as ChangeLogEntry[]} />
            </section>
            <section className="card" style={{ padding: '1.5rem', background: 'rgba(17,24,39,0.85)' }}>
              <h2 style={{ marginTop: 0 }}>Vista previa</h2>
              <div style={{ background: 'white', borderRadius: '1rem', padding: '1.25rem', color: 'var(--color-text)' }}>
                {renderPreview(previewItem)}
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}

type FieldProps = {
  definition: FieldDefinition<any>;
  value: any;
  onChange: (value: any) => void;
};

function Field({ definition, value, onChange }: FieldProps) {
  const { label, type, helperText, placeholder, required, min, max } = definition;

  const commonStyles = {
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)',
    color: 'inherit',
    fontSize: '1rem',
  } as const;

  let control: React.ReactNode;

  switch (type) {
    case 'textarea':
      control = (
        <textarea
          required={required}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          style={{ ...commonStyles, resize: 'vertical' }}
        />
      );
      break;
    case 'date':
      control = (
        <input
          type="date"
          required={required}
          value={value ? String(value).substring(0, 10) : ''}
          onChange={(event) => onChange(event.target.value)}
          style={commonStyles}
        />
      );
      break;
    case 'datetime':
      control = (
        <input
          type="datetime-local"
          required={required}
          value={value ? toDateTimeLocal(value) : ''}
          onChange={(event) => onChange(event.target.value)}
          style={commonStyles}
        />
      );
      break;
    case 'list':
      control = (
        <textarea
          required={required}
          placeholder={placeholder}
          value={Array.isArray(value) ? value.join('\n') : value ?? ''}
          onChange={(event) => onChange(event.target.value.split('\n').filter(Boolean))}
          rows={4}
          style={{ ...commonStyles, resize: 'vertical' }}
        />
      );
      break;
    case 'tags':
      control = (
        <input
          type="text"
          placeholder={placeholder}
          value={Array.isArray(value) ? value.join(', ') : value ?? ''}
          onChange={(event) =>
            onChange(
              event.target.value
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean),
            )
          }
          style={commonStyles}
        />
      );
      break;
    case 'number':
      control = (
        <input
          type="number"
          required={required}
          placeholder={placeholder}
          value={value ?? ''}
          min={min}
          max={max}
          onChange={(event) => onChange(event.target.value === '' ? null : Number(event.target.value))}
          style={commonStyles}
        />
      );
      break;
    case 'url':
      control = (
        <input
          type="url"
          required={required}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          style={commonStyles}
        />
      );
      break;
    case 'select':
      control = (
        <select value={value ?? ''} onChange={(event) => onChange(event.target.value)} style={commonStyles}>
          <option value="" disabled>
            Selecciona una opción
          </option>
          {definition.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
      break;
    case 'status':
      control = (
        <select value={value ?? 'draft'} onChange={(event) => onChange(event.target.value)} style={commonStyles}>
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
        </select>
      );
      break;
    default:
      control = (
        <input
          type="text"
          required={required}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          style={commonStyles}
        />
      );
  }

  return (
    <label style={{ display: 'grid', gap: '0.5rem' }}>
      <span>
        {label}
        {required ? ' *' : ''}
      </span>
      {control}
      {helperText && <small style={{ color: 'rgba(255,255,255,0.55)' }}>{helperText}</small>}
    </label>
  );
}

type HistoryProps = {
  history: ChangeLogEntry[];
};

function HistoryTimeline({ history }: HistoryProps) {
  if (!history?.length) return <p style={{ color: 'rgba(255,255,255,0.55)' }}>Sin cambios registrados.</p>;

  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1rem' }}>
      {history
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((entry) => (
          <li key={entry.id} style={{ display: 'grid', gap: '0.25rem' }}>
            <strong>{entry.change}</strong>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
              {entry.userEmail ?? entry.userId} · {new Date(entry.createdAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
            </span>
          </li>
        ))}
    </ol>
  );
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
