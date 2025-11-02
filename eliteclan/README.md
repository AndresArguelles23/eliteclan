# EliteClan Experience Platform

Sitio promocional para el colectivo EliteClan construido con React, Vite y TypeScript. El proyecto incluye enrutamiento con
React Router, layout mobile-first, capa de diseño basada en tokens y componentes reutilizables para presentar shows, servicios
y contenido multimedia.

## Estructura de carpetas

```
src/
├── components/        # Componentes compartidos (botones, carruseles, formularios, grids)
├── data/              # Datos seed y hooks para consumo futuro desde un CMS
├── layouts/           # Layouts de alto nivel (SiteLayout con navegación y footer)
├── pages/             # Páginas individuales conectadas al router
├── styles/            # Definición del tema y proveedores de diseño
├── App.css            # Utilidades globales, tokens derivados y componentes base
├── index.css          # Reset, variables CSS y estilos globales
└── main.tsx           # Punto de entrada, RouterProvider y ThemeProvider
```

## Diseño y tema

- **Paleta**: base `#0F1115`, superficie `#111827`, acentos `#10B981` y `#22D3EE`, acento cálido `#F59E0B`.
- **Tipografías**: Anton para display, Urbanist para headings y Inter para cuerpo (cargadas vía `@fontsource`).
- **Tokens**: Espaciados responsivos, radios, sombras y glassmorphism definidos en `src/styles/theme.ts` y expuestos como
  variables CSS.
- **Accesibilidad**: Estados `:focus-visible` visibles, formulario con validaciones y componentes con soporte para teclado.
- **Componentes base**: Botones CTA, tarjetas, chips, paneles de vidrio y utilidades de grid reutilizados en todo el sitio.

## Características clave

- Hero con video, carruseles multimedia y módulo Spotify embebido.
- Páginas para Home, About, Services, Shows (con filtros), detalle de show (`/shows/:slug`), Discography y Contact.
- Formularios de booking con validaciones y enlaces directos a WhatsApp/email.
- Datos semilla para servicios, shows, discografía, testimonios y marcas aliadas listos para conectarse con un CMS.

## Ejecutar el proyecto

1. Instala dependencias (requiere [pnpm](https://pnpm.io/)).

   ```bash
   pnpm install
   ```

2. Inicia el servidor de desarrollo.

   ```bash
   pnpm dev
   ```

3. Abre [http://localhost:5173](http://localhost:5173) para visualizar la aplicación.

4. Construye la versión de producción con:

   ```bash
   pnpm build
   ```

## Personalización futura

- Reemplaza los datos en `src/data/` con integraciones a APIs o headless CMS utilizando los hooks existentes.
- Añade nuevas páginas registrándolas en `src/pages/` e importándolas en el router de `src/main.tsx`.
- Extiende el tema global ajustando tokens o variables en `src/styles/theme.ts` e `index.css`.
