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
      radii: {
        control: { value: '0.85rem' },
        panel: { value: '1.25rem' },
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
      },
    },
  },
})

export const system = createSystem(defaultConfig, themeConfig)
