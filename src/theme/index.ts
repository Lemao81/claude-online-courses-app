import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { recipes } from './recipes'
import { slotRecipes } from './slot-recipes'

export const themeConfig = defineConfig({
  globalCss: {
    ':root': {
      colorScheme: 'light dark',
    },
    ':root.light': {
      colorScheme: 'light',
    },
    ':root.dark': {
      colorScheme: 'dark',
    },
    body: {
      overflowWrap: 'anywhere',
      overflowX: 'hidden',
    },
    '*::selection': {
      bg: 'accent',
    },
    a: {
      color: 'accent.fg',
      textDecorationColor: 'brand.600/40',
      textDecorationThickness: '1px',
      textUnderlineOffset: '2px',
      _hover: {
        color: 'accent.fg.hover',
      },
    },
    'button, a': {
      transition:
        'background-color 180ms ease, color 180ms ease, border-color 180ms ease, transform 180ms ease',
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          100: { value: '#d7ece8' },
          200: { value: '#b4f0e8' },
          300: { value: '#8de5db' },
          400: { value: '#60d7cf' },
          500: { value: '#4fb8b2' },
          600: { value: '#328f97' },
          700: { value: '#246f76' },
          800: { value: '#173a40' },
          900: { value: '#0f1a1e' },
          950: { value: '#0a1418' },
        },
        danger: {
          300: { value: '#f2a3a3' },
          700: { value: '#9f3030' },
        },
        shadowTint: { value: '#1e5a48' },
      },
      fonts: {
        body: {
          value:
            '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
        },
        heading: { value: '"Literata Variable", "Literata", Georgia, serif' },
      },
    },
    recipes,
    slotRecipes,
    semanticTokens: {
      colors: {
        fg: {
          DEFAULT: { value: { _light: '{colors.brand.800}', _dark: '{colors.brand.100}' } },
          muted: { value: { _light: '#416166', _dark: '#afcdc8' } },
          error: { value: { _light: '{colors.danger.700}', _dark: '{colors.danger.300}' } },
        },
        bg: {
          DEFAULT: { value: { _light: '#e7f3ec', _dark: '{colors.brand.950}' } },
          subtle: { value: { _light: 'rgb(255 255 255 / 0.74)', _dark: 'rgb(16 30 34 / 0.8)' } },
          muted: { value: { _light: '#e7f0e8', _dark: '{colors.brand.900}' } },
          panel: { value: { _light: 'rgb(255 255 255 / 0.9)', _dark: 'rgb(15 27 31 / 0.92)' } },
          surface: { value: { _light: '#fdfefd', _dark: '{colors.brand.900}' } },
          error: {
            value: {
              _light: 'color-mix(in oklab, {colors.fg.error} 10%, {colors.bg.panel})',
              _dark: 'color-mix(in oklab, {colors.fg.error} 10%, {colors.bg.panel})',
            },
          },
        },
        border: {
          DEFAULT: { value: { _light: 'rgb(23 58 64 / 0.14)', _dark: 'rgb(141 229 219 / 0.18)' } },
          emphasized: {
            value: {
              _light: 'color-mix(in oklab, {colors.fg} 35%, transparent)',
              _dark: 'color-mix(in oklab, {colors.fg} 35%, transparent)',
            },
          },
          accent: { value: 'color-mix(in oklab, {colors.accent.fg} 34%, {colors.border})' },
          focus: { value: 'color-mix(in oklab, {colors.accent.fg} 60%, {colors.border})' },
          error: {
            value: {
              _light: 'color-mix(in oklab, {colors.fg.error} 28%, {colors.border})',
              _dark: 'color-mix(in oklab, {colors.fg.error} 28%, {colors.border})',
            },
          },
        },
        accent: {
          DEFAULT: { value: { _light: '{colors.brand.500}', _dark: '{colors.brand.400}' } },
          fg: {
            DEFAULT: { value: { _light: '{colors.brand.600}', _dark: '{colors.brand.300}' } },
            hover: { value: { _light: '{colors.brand.700}', _dark: '{colors.brand.200}' } },
          },
          subtle: { value: 'color-mix(in oklab, {colors.accent} 14%, {colors.bg.panel})' },
          muted: { value: 'color-mix(in oklab, {colors.accent} 22%, {colors.bg.panel})' },
          emphasized: { value: 'color-mix(in oklab, {colors.accent} 30%, {colors.bg.panel})' },
        },
        glint: { value: { _light: 'rgb(255 255 255 / 0.82)', _dark: 'rgb(194 247 238 / 0.14)' } },
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
        chip: { value: '0 8px 22px {colors.shadowTint/8}' },
        raised: { value: '0 12px 26px {colors.shadowTint/10}' },
        card: {
          value:
            '0 1px 0 {colors.glint} inset, 0 18px 34px {colors.shadowTint/10}, 0 4px 14px {colors.brand.800/6}',
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
      sectionLabel: {
        value: {
          fontSize: 'xs',
          fontWeight: 'semibold',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'fg.muted',
        },
      },
      kicker: {
        value: {
          fontSize: '0.69rem',
          fontWeight: 'bold',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'accent.fg',
        },
      },
      emptyState: {
        value: {
          fontSize: 'sm',
          textAlign: 'center',
          color: 'fg.muted',
        },
      },
      errorText: {
        value: {
          fontSize: 'sm',
          color: 'fg.error',
        },
      },
      control: {
        value: {
          fontSize: '0.9rem',
          lineHeight: '1',
        },
      },
    },
    layerStyles: {
      row: {
        value: {
          borderRadius: 'control',
          borderWidth: '1px',
          borderColor: 'border',
          bg: 'bg.panel',
          paddingInline: '0.9rem',
          paddingBlock: '0.65rem',
        },
      },
      chapterPanel: {
        value: {
          borderRadius: 'panel',
          borderWidth: '1px',
          borderColor: 'border',
          bg: 'bg.panel',
          paddingInline: '1.25rem',
          paddingBlock: '1.15rem',
        },
      },
      emptyStateRow: {
        value: {
          borderRadius: 'control',
          borderWidth: '1px',
          borderStyle: 'dashed',
          borderColor: 'border',
          paddingInline: '1rem',
          paddingBlock: '1.25rem',
        },
      },
      emptyStateCard: {
        value: {
          borderRadius: 'card',
          borderWidth: '1px',
          borderStyle: 'dashed',
          borderColor: 'border',
          paddingInline: '1rem',
          paddingBlock: '2rem',
        },
      },
      container: {
        value: {
          width: 'min(1440px, calc(100% - 2rem))',
          marginInline: 'auto',
        },
      },
      card: {
        value: {
          borderRadius: 'card',
          borderWidth: '1px',
          borderColor: 'border',
          bg: 'bg.panel',
          paddingInline: '1rem',
          paddingBlock: '0.9rem',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'raised',
          },
        },
      },
      surfacePanel: {
        value: {
          borderWidth: '1px',
          borderColor: 'border',
          bg: 'bg.surface',
          transition:
            'background-color 180ms ease, color 180ms ease, border-color 180ms ease, transform 180ms ease',
        },
      },
    },
    keyframes: {
      riseIn: {
        from: {
          opacity: '0',
          transform: 'translateY(12px)',
        },
        to: {
          opacity: '1',
          transform: 'translateY(0)',
        },
      },
    },
    animationStyles: {
      riseIn: {
        value: {
          animationName: 'riseIn',
          animationDuration: '700ms',
          animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          animationFillMode: 'both',
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, themeConfig)
