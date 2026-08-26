import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

export const themeConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        ink: { value: 'var(--ink)' },
        inkSoft: { value: 'var(--ink-soft)' },
        brand: { value: 'var(--brand)' },
        brandStrong: { value: 'var(--brand-strong)' },
        brandAlt: { value: 'var(--brand-alt)' },
        base: { value: 'var(--base)' },
        baseMuted: { value: 'var(--base-muted)' },
        baseSubtle: { value: 'var(--base-subtle)' },
        danger: { value: 'var(--danger)' },
        surface: { value: 'var(--surface)' },
        surfaceStrong: { value: 'var(--surface-strong)' },
        line: { value: 'var(--line)' },
        glint: { value: 'var(--glint)' },
      },
      fonts: {
        body: { value: 'var(--font-sans)' },
        heading: { value: 'var(--font-serif)' },
      },
    },
    semanticTokens: {
      colors: {
        fg: {
          DEFAULT: { value: '{colors.ink}' },
          muted: { value: '{colors.inkSoft}' },
          subtle: { value: '{colors.inkSoft}' },
          accent: { value: '{colors.brandStrong}' },
          kicker: { value: 'var(--kicker)' },
          error: { value: '{colors.danger}' },
        },
        bg: {
          DEFAULT: { value: '{colors.base}' },
          subtle: { value: '{colors.surface}' },
          muted: { value: '{colors.baseMuted}' },
          panel: { value: '{colors.surfaceStrong}' },
          header: { value: 'var(--header-bg)' },
          chip: { value: 'var(--chip-bg)' },
          hover: { value: 'var(--link-bg-hover)' },
          wash: { value: 'color-mix(in oklab, {colors.surfaceStrong} 74%, transparent)' },
          washHover: { value: 'color-mix(in oklab, {colors.surfaceStrong} 88%, transparent)' },
        },
        border: {
          DEFAULT: { value: '{colors.line}' },
          muted: { value: '{colors.line}' },
          subtle: { value: '{colors.line}' },
          chip: { value: 'var(--chip-line)' },
          error: { value: '{colors.danger}' },
        },
        accent: {
          DEFAULT: { value: '{colors.brand}' },
          emphasized: { value: '{colors.brandStrong}' },
          muted: { value: '{colors.brandAlt}' },
        },
      },
      gradients: {
        panel: { value: 'linear-gradient(165deg, {colors.bg.panel}, {colors.bg.subtle})' },
        brand: { value: 'linear-gradient(90deg, var(--brand-from), var(--brand-to))' },
        glow: {
          value:
            'radial-gradient(circle, color-mix(in oklab, {colors.accent} 32%, transparent), transparent 66%)',
        },
        glowMuted: {
          value:
            'radial-gradient(circle, color-mix(in oklab, {colors.accent.muted} 18%, transparent), transparent 66%)',
        },
      },
      radii: {
        icon: { value: '0.6rem' },
        field: { value: '{radii.xl}' },
        control: { value: '0.85rem' },
        card: { value: '{radii.2xl}' },
        panel: { value: '1.25rem' },
        island: { value: '2rem' },
      },
      shadows: {
        chip: { value: '0 8px 22px rgb(var(--shadow-rgb) / 0.08)' },
        raised: { value: '0 12px 26px rgb(var(--shadow-rgb) / 0.1)' },
        card: {
          value:
            '0 1px 0 {colors.glint} inset, 0 18px 34px rgb(var(--shadow-rgb) / 0.1), 0 4px 14px rgb(var(--shadow-deep-rgb) / 0.06)',
        },
        island: {
          value:
            '0 1px 0 {colors.glint} inset, 0 22px 44px rgb(var(--shadow-rgb) / 0.1), 0 6px 18px rgb(var(--shadow-deep-rgb) / 0.08)',
        },
        focusRing: { value: '0 0 0 3px color-mix(in oklab, {colors.accent} 24%, transparent)' },
        dropRing: { value: '0 0 0 4px color-mix(in oklab, {colors.accent} 18%, transparent)' },
      },
    },
  },
})

export const system = createSystem(defaultConfig, themeConfig)
