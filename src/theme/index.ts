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
      bg: 'accent.muted',
    },
    a: {
      color: 'accent.fg',
      textDecorationColor: 'accent.fg/40',
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
          50: { value: '#eef8fc' },
          100: { value: '#d7ecf4' },
          200: { value: '#bde4f3' },
          300: { value: '#a1d9ef' },
          400: { value: '#83cae4' },
          500: { value: '#69b7d3' },
          600: { value: '#3f8ba6' },
          700: { value: '#2b6c84' },
          800: { value: '#133948' },
          900: { value: '#0b1b21' },
          950: { value: '#09141a' },
        },
        secondary: {
          50: { value: '#f3f4ff' },
          100: { value: '#e6e8fe' },
          200: { value: '#cdd0fc' },
          300: { value: '#b0b3fa' },
          400: { value: '#8b8bef' },
          500: { value: '#6a64d8' },
          600: { value: '#5850bd' },
          700: { value: '#49429f' },
          800: { value: '#38347a' },
          900: { value: '#24224f' },
          950: { value: '#13122e' },
        },
        danger: {
          50: { value: '#fef4f3' },
          100: { value: '#fde6e5' },
          200: { value: '#fbcac8' },
          300: { value: '#f8a8a6' },
          400: { value: '#f07e7e' },
          500: { value: '#e25a5f' },
          600: { value: '#c5424a' },
          700: { value: '#a5333b' },
          800: { value: '#7e292d' },
          900: { value: '#4f1b1d' },
          950: { value: '#2f0f10' },
        },
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
          muted: { value: { _light: '{colors.brand.700}', _dark: '{colors.brand.200}' } },
          error: { value: '{colors.danger.fg}' },
        },
        bg: {
          DEFAULT: { value: { _light: '{colors.brand.50}', _dark: '{colors.brand.950}' } },
          subtle: { value: { _light: '{colors.white/74}', _dark: '{colors.brand.900/80}' } },
          muted: { value: { _light: '{colors.brand.100}', _dark: '{colors.brand.900}' } },
          panel: { value: { _light: '{colors.white/90}', _dark: '{colors.brand.900/92}' } },
          surface: { value: { _light: '{colors.brand.50}', _dark: '{colors.brand.900}' } },
          error: { value: { _light: '{colors.danger.50}', _dark: '{colors.danger.950}' } },
        },
        border: {
          DEFAULT: { value: { _light: '{colors.brand.800/14}', _dark: '{colors.brand.300/18}' } },
          accent: { value: '{colors.secondary.muted}' },
          focus: { value: '{colors.secondary.border}' },
          error: { value: '{colors.danger.border}' },
        },
        accent: {
          DEFAULT: { value: '{colors.secondary.solid}' },
          fg: {
            DEFAULT: { value: '{colors.secondary.fg}' },
            hover: { value: { _light: '{colors.secondary.800}', _dark: '{colors.secondary.200}' } },
          },
          subtle: { value: '{colors.secondary.subtle}' },
          muted: { value: '{colors.secondary.muted}' },
        },
        glint: { value: { _light: '{colors.white/82}', _dark: '{colors.brand.200/14}' } },
        brand: {
          contrast: { value: '{colors.brand.950}' },
          fg: { value: { _light: '{colors.brand.600}', _dark: '{colors.brand.300}' } },
          subtle: { value: { _light: '{colors.brand.100}', _dark: '{colors.brand.800}' } },
          muted: { value: { _light: '{colors.brand.200}', _dark: '{colors.brand.700}' } },
          emphasized: { value: { _light: '{colors.brand.300}', _dark: '{colors.brand.600}' } },
          solid: { value: { _light: '{colors.brand.500}', _dark: '{colors.brand.400}' } },
          focusRing: { value: { _light: '{colors.brand.500}', _dark: '{colors.brand.400}' } },
          border: { value: { _light: '{colors.brand.500}', _dark: '{colors.brand.400}' } },
        },
        secondary: {
          contrast: { value: 'white' },
          fg: { value: { _light: '{colors.secondary.700}', _dark: '{colors.secondary.300}' } },
          subtle: { value: { _light: '{colors.secondary.100}', _dark: '{colors.secondary.900}' } },
          muted: { value: { _light: '{colors.secondary.200}', _dark: '{colors.secondary.800}' } },
          emphasized: {
            value: { _light: '{colors.secondary.300}', _dark: '{colors.secondary.700}' },
          },
          solid: { value: '{colors.secondary.500}' },
          focusRing: { value: '{colors.secondary.500}' },
          border: { value: { _light: '{colors.secondary.500}', _dark: '{colors.secondary.400}' } },
        },
        danger: {
          contrast: { value: 'white' },
          fg: { value: { _light: '{colors.danger.700}', _dark: '{colors.danger.300}' } },
          subtle: { value: { _light: '{colors.danger.100}', _dark: '{colors.danger.900}' } },
          muted: { value: { _light: '{colors.danger.200}', _dark: '{colors.danger.800}' } },
          emphasized: { value: { _light: '{colors.danger.300}', _dark: '{colors.danger.700}' } },
          solid: { value: '{colors.danger.600}' },
          focusRing: { value: '{colors.danger.500}' },
          border: { value: { _light: '{colors.danger.500}', _dark: '{colors.danger.400}' } },
        },
      },
      radii: {
        icon: { value: '0.6rem' },
        field: { value: '{radii.xl}' },
        control: { value: '0.85rem' },
        card: { value: '{radii.2xl}' },
        panel: { value: '1.25rem' },
      },
      shadows: {
        chip: { value: '0 8px 22px {colors.brand.800/8}' },
        raised: { value: '0 12px 26px {colors.brand.800/10}' },
        card: {
          value:
            '0 1px 0 {colors.glint} inset, 0 18px 34px {colors.brand.800/10}, 0 4px 14px {colors.brand.800/6}',
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
  },
})

export const system = createSystem(defaultConfig, themeConfig)
