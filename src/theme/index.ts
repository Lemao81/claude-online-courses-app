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
        sand: { value: 'var(--sand)' },
        foam: { value: 'var(--foam)' },
        surface: { value: 'var(--surface)' },
        surfaceStrong: { value: 'var(--surface-strong)' },
        line: { value: 'var(--line)' },
        insetGlint: { value: 'var(--inset-glint)' },
        kicker: { value: 'var(--kicker)' },
        base: { value: 'var(--bg-base)' },
        headerBg: { value: 'var(--header-bg)' },
        chipBg: { value: 'var(--chip-bg)' },
        chipLine: { value: 'var(--chip-line)' },
        linkBgHover: { value: 'var(--link-bg-hover)' },
        danger: { value: 'var(--danger)' },
      },
      fonts: {
        body: { value: 'var(--font-sans)' },
        heading: { value: '"Fraunces", Georgia, serif' },
      },
      radii: {
        control: { value: '0.85rem' },
        row: { value: '0.9rem' },
        panel: { value: '1.25rem' },
      },
      shadows: {
        chip: { value: '0 8px 22px rgba(30,90,72,0.08)' },
        card: {
          value:
            '0 1px 0 {colors.insetGlint} inset, 0 18px 34px rgba(30,90,72,0.1), 0 4px 14px rgba(23,58,64,0.06)',
        },
        island: {
          value:
            '0 1px 0 {colors.insetGlint} inset, 0 22px 44px rgba(30,90,72,0.1), 0 6px 18px rgba(23,58,64,0.08)',
        },
      },
    },
    semanticTokens: {
      colors: {
        fg: {
          DEFAULT: { value: '{colors.seaInk}' },
          muted: { value: '{colors.seaInkSoft}' },
          subtle: { value: '{colors.seaInkSoft}' },
          error: { value: '{colors.danger}' },
        },
        bg: {
          DEFAULT: { value: '{colors.base}' },
          subtle: { value: '{colors.surface}' },
          muted: { value: '{colors.chipBg}' },
          panel: { value: '{colors.surfaceStrong}' },
        },
        border: {
          DEFAULT: { value: '{colors.line}' },
          muted: { value: '{colors.line}' },
          subtle: { value: '{colors.chipLine}' },
          error: { value: '{colors.danger}' },
        },
        accent: {
          DEFAULT: { value: '{colors.lagoon}' },
          emphasized: { value: '{colors.lagoonDeep}' },
          muted: { value: '{colors.palm}' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, themeConfig)
