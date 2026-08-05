import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

export const themeConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        seaInk: { value: 'var(--sea-ink)' },
        seaInkSoft: { value: 'var(--sea-ink-soft)' },
        lagoon: { value: 'var(--lagoon)' },
        lagoonDeep: { value: 'var(--lagoon-deep)' },
        palm: { value: 'var(--palm)' },
        shore: { value: 'var(--bg-base)' },
        sand: { value: 'var(--sand)' },
        foam: { value: 'var(--foam)' },
        coral: { value: 'var(--danger)' },
        veil: { value: 'var(--surface)' },
        veilStrong: { value: 'var(--surface-strong)' },
        hairline: { value: 'var(--line)' },
        glint: { value: 'var(--inset-glint)' },
      },
      fonts: {
        body: { value: 'var(--font-sans)' },
        heading: { value: '"Fraunces", Georgia, serif' },
      },
    },
    semanticTokens: {
      colors: {
        fg: {
          DEFAULT: { value: '{colors.seaInk}' },
          muted: { value: '{colors.seaInkSoft}' },
          subtle: { value: '{colors.seaInkSoft}' },
          accent: { value: '{colors.lagoonDeep}' },
          kicker: { value: 'var(--kicker)' },
          error: { value: '{colors.coral}' },
        },
        bg: {
          DEFAULT: { value: '{colors.shore}' },
          subtle: { value: '{colors.veil}' },
          muted: { value: '{colors.sand}' },
          panel: { value: '{colors.veilStrong}' },
          header: { value: 'var(--header-bg)' },
          chip: { value: 'var(--chip-bg)' },
          hover: { value: 'var(--link-bg-hover)' },
          wash: { value: 'color-mix(in oklab, {colors.veilStrong} 74%, transparent)' },
          washHover: { value: 'color-mix(in oklab, {colors.veilStrong} 88%, transparent)' },
        },
        border: {
          DEFAULT: { value: '{colors.hairline}' },
          muted: { value: '{colors.hairline}' },
          subtle: { value: '{colors.hairline}' },
          chip: { value: 'var(--chip-line)' },
          error: { value: '{colors.coral}' },
        },
        accent: {
          DEFAULT: { value: '{colors.lagoon}' },
          emphasized: { value: '{colors.lagoonDeep}' },
          muted: { value: '{colors.palm}' },
        },
      },
      gradients: {
        panel: { value: 'linear-gradient(165deg, {colors.bg.panel}, {colors.bg.subtle})' },
        brand: { value: 'linear-gradient(90deg, #56c6be, #7ed3bf)' },
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
        chip: { value: '0 8px 22px rgba(30,90,72,0.08)' },
        raised: { value: '0 12px 26px rgba(30,90,72,0.1)' },
        card: {
          value:
            '0 1px 0 {colors.glint} inset, 0 18px 34px rgba(30,90,72,0.1), 0 4px 14px rgba(23,58,64,0.06)',
        },
        island: {
          value:
            '0 1px 0 {colors.glint} inset, 0 22px 44px rgba(30,90,72,0.1), 0 6px 18px rgba(23,58,64,0.08)',
        },
        focusRing: { value: '0 0 0 3px color-mix(in oklab, {colors.accent} 24%, transparent)' },
        dropRing: { value: '0 0 0 4px color-mix(in oklab, {colors.accent} 18%, transparent)' },
      },
    },
  },
})

export const system = createSystem(defaultConfig, themeConfig)
