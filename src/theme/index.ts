import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

export const themeConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        ink: { value: 'var(--ink)' },
        inkSoft: { value: 'var(--ink-soft)' },
        brand: { value: 'var(--brand)' },
        brandStrong: { value: 'var(--brand-strong)' },
        base: { value: 'var(--base)' },
        baseMuted: { value: 'var(--base-muted)' },
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
          emphasized: { value: '{colors.brandStrong}' },
          error: { value: '{colors.danger}' },
        },
        bg: {
          DEFAULT: { value: '{colors.base}' },
          subtle: { value: '{colors.surface}' },
          muted: { value: '{colors.baseMuted}' },
          panel: { value: '{colors.surfaceStrong}' },
        },
        border: {
          DEFAULT: { value: '{colors.line}' },
          error: { value: '{colors.danger}' },
        },
        accent: {
          DEFAULT: { value: '{colors.brand}' },
        },
      },
      gradients: {
        glow: { value: 'radial-gradient(circle, {colors.accent}, transparent 66%)' },
        glowMuted: { value: 'radial-gradient(circle, {colors.fg.muted}, transparent 66%)' },
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
        focusRing: { value: '0 0 0 3px {colors.accent}' },
        dropRing: { value: '0 0 0 4px {colors.accent}' },
      },
    },
    textStyles: {
      title: {
        value: {
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'fg',
        },
      },
      itemTitle: {
        value: {
          fontSize: 'sm',
          fontWeight: 'semibold',
          color: 'fg',
        },
      },
      subtitle: {
        value: {
          fontSize: 'sm',
          color: 'fg.muted',
        },
      },
      meta: {
        value: {
          fontSize: 'xs',
          color: 'fg.muted',
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, themeConfig)
