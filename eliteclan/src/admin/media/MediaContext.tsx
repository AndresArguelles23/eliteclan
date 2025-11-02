import pica from 'pica';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  deleteMediaAsset,
  fetchMediaLibrary,
  getSupabaseClient,
  registerMediaAsset,
  type MediaAsset,
  type MediaUploadRequest,
} from '../../services/api';

type MediaContextValue = {
  assets: MediaAsset[];
  loading: boolean;
  upload: (request: MediaUploadRequest) => Promise<MediaAsset>;
  registerEmbed: (url: string, alt?: string) => Promise<MediaAsset>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const MediaContext = createContext<MediaContextValue | undefined>(undefined);

export function MediaProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setAssets(await fetchMediaLibrary());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const upload = useCallback(
    async (request: MediaUploadRequest): Promise<MediaAsset> => {
      const { file, alt, optimize = true } = request;
      const client = getSupabaseClient();
      const bucket = import.meta.env.VITE_SUPABASE_MEDIA_BUCKET ?? 'media';
      const extension = file.name.split('.').pop() ?? 'jpg';
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const path = `${id}.${extension}`;

      let uploadFile: File | Blob = file;
      let width: number | undefined;
      let height: number | undefined;
      let thumbnailUrl: string | undefined;

      if (optimize && file.type.startsWith('image/')) {
        const optimized = await optimizeImage(file, request.width ?? 1600);
        if (optimized) {
          uploadFile = optimized.file;
          width = optimized.width;
          height = optimized.height;
          if (optimized.thumbnail) {
            const thumbPath = `${id}-thumb.${extension}`;
            if (client) {
              const { error: thumbError } = await client.storage.from(bucket).upload(thumbPath, optimized.thumbnail, {
                cacheControl: '3600',
                upsert: true,
              });
              if (!thumbError) {
                thumbnailUrl = client.storage.from(bucket).getPublicUrl(thumbPath).data.publicUrl;
              }
            } else {
              thumbnailUrl = URL.createObjectURL(optimized.thumbnail);
            }
          }
        }
      }

      let publicUrl: string;
      if (client) {
        const { error } = await client.storage.from(bucket).upload(path, uploadFile, {
          cacheControl: '3600',
          upsert: true,
        });
        if (error) throw error;
        publicUrl = client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
      } else {
        publicUrl = URL.createObjectURL(uploadFile); // entorno local
      }

      const asset = await registerMediaAsset({
        id,
        type: 'image',
        url: publicUrl,
        alt,
        width,
        height,
        thumbnailUrl,
        provider: 'unknown',
        metadata: { originalName: file.name },
      });

      setAssets((prev) => [asset, ...prev]);
      return asset;
    },
    [],
  );

  const registerEmbed = useCallback(async (url: string, alt?: string) => {
    const asset: MediaAsset = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: 'embed',
      url,
      alt,
      provider: inferProvider(url),
    };
    const stored = await registerMediaAsset(asset);
    setAssets((prev) => [stored, ...prev]);
    return stored;
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteMediaAsset(id);
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
  }, []);

  const value = useMemo<MediaContextValue>(
    () => ({ assets, loading, upload, registerEmbed, remove, refresh }),
    [assets, loading, refresh, registerEmbed, remove, upload],
  );

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export function useMediaLibrary() {
  const context = useContext(MediaContext);
  if (!context) throw new Error('useMediaLibrary debe usarse dentro de MediaProvider');
  return context;
}

async function optimizeImage(file: File, maxWidth: number) {
  if (!file.type.startsWith('image/')) return null;
  const image = await loadImage(file);
  const scale = Math.min(1, maxWidth / image.width);
  const targetWidth = Math.round(image.width * scale);
  const targetHeight = Math.round(image.height * scale);

  const source = document.createElement('canvas');
  source.width = image.width;
  source.height = image.height;
  source.getContext('2d')?.drawImage(image, 0, 0);

  const target = document.createElement('canvas');
  target.width = targetWidth;
  target.height = targetHeight;

  await pica().resize(source, target, { quality: 3 });
  const blob = await pica().toBlob(target, file.type, 0.9);

  const thumbScale = Math.min(1, 320 / image.width);
  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = Math.max(1, Math.round(image.width * thumbScale));
  thumbCanvas.height = Math.max(1, Math.round(image.height * thumbScale));
  await pica().resize(source, thumbCanvas, { quality: 2 });
  const thumbnail = await pica().toBlob(thumbCanvas, file.type, 0.8);

  return {
    file: new File([blob], file.name, { type: file.type }),
    width: targetWidth,
    height: targetHeight,
    thumbnail,
  };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };
    image.src = url;
  });
}

function inferProvider(url: string): MediaAsset['provider'] {
  if (/youtube|youtu\.be/.test(url)) return 'youtube';
  if (/vimeo/.test(url)) return 'vimeo';
  if (/instagram/.test(url)) return 'instagram';
  return 'unknown';
}
