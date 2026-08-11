# Tokens de Diseño — SSA Web

Basado en el *Manual de Identidad Institucional del Gobierno del Estado de Hidalgo 2022-2028*.

---

## Paleta de Color

### Institucionales

| Token | Hex | Pantone | CMYK | RGB | Uso |
|-------|-----|---------|------|-----|-----|
| `guinda` | `#621132` | 7421 | C35 M94 Y51 K53 | R98 G17 B50 | Primary: nav, headers, CTAs, fondo login |
| `guinda-light` | `#8E3D5C` | — | — | — | Hover states, variantes |
| `guinda-dark` | `#3E001E` | — | — | — | Gradientes, footer |
| `dorado` | `#B38E5D` | 465 | C23 M38 Y68 K12 | R179 G142 B93 | Secondary: badges, acentos, hover |
| `dorado-light` | `#E7BE8C` | — | — | — | Variante clara |
| `dorado-dark` | `#816130` | — | — | — | Variante oscura |

### Neutros

| Token | Hex | Uso |
|-------|-----|-----|
| `white` | `#FFFFFF` | Fondos base (60% regla 60-30-10) |
| `paper` | `#FAFAFA` | Superficies elevadas, tablas |
| `text-primary` | `#1A1A1A` | Texto principal |
| `text-secondary` | `#5A5A5A` | Texto secundario |
| `divider` | `#E0E0E0` | Líneas divisorias |

### Regla 60-30-10 (Digital)

- **60%** — Blanco (`#FFFFFF`) fondos y áreas extensas
- **30%** — Guinda (`#621132`) navegación, encabezados, elementos primarios
- **10%** — Dorado (`#B38E5D`) acentos, detalles, badges

---

## Tipografía

### Familia principal

**Montserrat** (Google Fonts)

Cargas recomendadas: `wght@300;400;500;600;700`

| Peso | Uso |
|------|-----|
| Light (300) | Body text extenso |
| Regular (400) | Texto general, párrafos |
| Medium (500) | Subtítulos, labels, navegación |
| SemiBold (600) | Títulos h2-h4, botones |
| Bold (700) | Título principal h1 |

### Jerarquía

| Elemento | Peso | Tamaño | Line-height |
|----------|------|--------|-------------|
| h1 | Bold 700 | 2.25rem / 36px | 1.2 |
| h2 | SemiBold 600 | 1.75rem / 28px | 1.3 |
| h3 | SemiBold 600 | 1.5rem / 24px | 1.3 |
| h4 | SemiBold 600 | 1.25rem / 20px | 1.4 |
| body1 | Regular 400 | 1rem / 16px | 1.5 |
| body2 | Light 300 | 0.875rem / 14px | 1.5 |
| button | SemiBold 600 | 0.875rem / 14px | — |

### GMX

La tipografía **GMX** es de uso exclusivo para el isologotipo
institucional del Gobierno del Estado de Hidalgo. No debe
utilizarse en la interfaz web del CMS. Reservada para
aplicaciones de papelería y comunicación impresa.

---

## Componentes

### Drawer / Sidebar

- Fondo: Guinda `#621132`
- Texto: Blanco `#FFFFFF`
- Item seleccionado: `rgba(255,255,255,0.15)`
- Item hover: `rgba(255,255,255,0.08)`
- Ancho: 260px

### Botones

| Variante | Estilo |
|----------|--------|
| Contained Primary | Fondo guinda, texto blanco, sin sombra |
| Contained Secondary | Fondo dorado, texto blanco, sin sombra |
| Outlined | Borde guinda, texto guinda |

### Formularios

- Input: borde `#E0E0E0`, focus guinda
- Labels: SemiBold 600
- Mensajes de error: rojo estándar MUI

### Tablas

- Header: fondo `#FAFAFA`, texto SemiBold 600
- Filas: hover sutil
- Paginación: controles estándar MUI

### Status Chip (editorial)

| Estado | Color |
|--------|-------|
| DRAFT | Default (gris) |
| PREPARED | Info (azul) |
| NEEDS_REVIEW | Warning (ámbar) |
| READY_FOR_PUBLICATION | Success (verde) |
| ARCHIVED | Error (rojo) |

---

## Layout

### Login

- Fondo: gradiente vertical `#621132` → `#3E001E`
- Card: blanco, centrado, max-width 420px

### Admin layout

- Sidebar: 260px guinda (fijo)
- Main content: fondo blanco, padding 24px
- Toolbar: 64px

---

## Logotipo

- **Header (admin)**: texto "SSA CMS" en blanco sobre fondo guinda
- **Login page**: no incluir isologotipo oficial (reservado para portal público)
- **Portal público (futuro)**: isologotipo horizontal en header, vertical en footer,
  siempre en versión negativa (blanco)

---

## Imágenes

- Estilo: documental, mostrando personas en situación digna
- No usar: imágenes discriminatorias, estereotipos, rostros de menores sin autorización
- Preferir: contextos de programas y acciones de salud pública
