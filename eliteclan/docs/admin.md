# Panel administrativo de EliteClan

## Acceso y autenticación

1. Inicia la aplicación (`pnpm dev`) y visita `http://localhost:5173/admin`.
2. Introduce el correo corporativo y la contraseña provisionada desde Supabase Auth.
3. Ingresa el código TOTP generado por tu app MFA o, en entornos de prueba sin Supabase, utiliza el secreto definido en `VITE_ADMIN_TOTP_SECRET`.
4. Los tokens de sesión se cifran con AES-GCM antes de guardarse en `sessionStorage`, usando la clave derivada de `VITE_ADMIN_TOKEN_SECRET`.

### Roles

- **Admin**: acceso completo, incluidas altas/bajas de integrantes y gestión del gestor de media.
- **Editor**: puede crear/editar contenido pero no gestionar cuentas ni modificar integrantes.

## Contenidos gestionados

| Módulo | Ruta | Vista pública asociada | Notas |
|--------|------|-----------------------|-------|
| Servicios | `/admin/services` | `/services` | Formularios con validación y vista previa usando `ServiceList`.
| Shows | `/admin/shows` | `/shows`, `/shows/:slug` | Soporta setlist, etiquetas, media embebida y preview con `ShowCard` y `MediaCarousel`.
| Discografía | `/admin/discography` | `/discography` | Control de estado y previsualización del embed de Spotify.
| Integrantes | `/admin/members` | Sección "Equipo" | Solo editable por Admin.
| Testimonios | `/admin/testimonials` | Componentes `Testimonials` | Mantiene historia de cambios.
| Próximos eventos | `/admin/events` | Disponible para landing/eventos | Estado borrador/publicado, fechas normalizadas.
| Media | `/admin/media` | Reutilizado por shows y secciones multimedia | Subida optimizada con thumbnails y soporte para URLs (YouTube/Vimeo/Instagram).

Cada recurso registra historial de cambios con usuario, resumen y fecha. Las vistas de formulario incluyen validaciones mínimas (campos obligatorios, formato de URL/fecha) y estados *Borrador* / *Publicado*.

## Gestor de media

- Las imágenes se optimizan en el navegador con `pica`, generando versión comprimida y thumbnail.
- Los archivos se suben al bucket configurado en `VITE_SUPABASE_MEDIA_BUCKET` dentro de Supabase Storage (si no hay Supabase, se almacenan URLs locales para entorno de desarrollo).
- Se pueden registrar URLs embebidas para YouTube/Vimeo/Instagram; el sistema detecta el proveedor automáticamente.
- Los recursos almacenados quedan disponibles para reutilizarse en cualquier formulario del panel.

## API y almacenamiento

- El cliente central vive en `src/services/api.ts` y usa Supabase (`@supabase/supabase-js`).
- Si no existen credenciales de Supabase, el sistema cae en datos locales de `src/data` solo para lectura.
- Las mutaciones (upsert/delete) escriben en tablas (`services`, `shows`, `discography`, `members`, `testimonials`, `events`, `media_assets`) y añaden entradas al historial.

## Flujo de publicación

1. Crea o edita un registro en el panel correspondiente.
2. Elige estado **Borrador** para revisar internamente o **Publicado** para hacer visible el contenido.
3. Usa la previsualización para validar el resultado con los mismos componentes del sitio público.
4. Revisa el historial para auditar quién modificó cada elemento.

## Seguridad y backups

- Configura políticas de seguridad en Supabase para limitar la escritura a usuarios autenticados con rol adecuado (`app_metadata.role`).
- Habilita copias de seguridad automáticas en Supabase o exportaciones programadas (CSV/SQL) para las tablas de contenido y `media_assets`.
- Protege las variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_TOKEN_SECRET`) en la plataforma de despliegue.
- Para medios críticos, sincroniza el bucket de Storage con un sistema de backups externo (p. ej. AWS Glacier) usando `supabase storage copy` o jobs periódicos.
