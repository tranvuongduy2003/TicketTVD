/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    fontFamily: {
      body: 'var(--body-font)'
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          '100': '#fef1f6',
          '150': '#fcdfea',
          '200': '#fbcdde',
          '250': '#fabcd2',
          '300': '#f8aac7',
          '350': '#f798bb',
          '400': '#f587af',
          '450': '#f475a3',
          '500': '#f26298',
          '550': '#f04382',
          '600': '#ed226d',
          '650': '#da125b',
          '700': '#ba0f4e',
          '750': '#990c40',
          '800': '#790a32',
          '850': '#580725',
          '900': '#370417',
          DEFAULT: '#f26298'
        },
        secondary: {
          '100': '#f6f9f6',
          '150': '#e7efe5',
          '200': '#d7e5d5',
          '250': '#c8dbc5',
          '300': '#b8d1b5',
          '350': '#a9c7a5',
          '400': '#9abd95',
          '450': '#8ab385',
          '500': '#7aa874',
          '550': '#699d62',
          '600': '#5d8b57',
          '650': '#50784b',
          '700': '#446640',
          '750': '#385334',
          '800': '#2b4128',
          '850': '#1f2e1d',
          '900': '#121c11',
          DEFAULT: '#7aa874'
        },
        info: {
          '100': '#f1f8fd',
          '150': '#daecfa',
          '200': '#c3e1f8',
          '250': '#acd5f5',
          '300': '#94c9f2',
          '350': '#7dbeef',
          '400': '#66b2ec',
          '450': '#4fa6e9',
          '500': '#379ae6',
          '550': '#1d8de3',
          '600': '#197dca',
          '650': '#166db0',
          '700': '#125d95',
          '750': '#0f4c7b',
          '800': '#0c3c61',
          '850': '#092c47',
          '900': '#061c2d',
          DEFAULT: '#379ae6'
        },
        warning: {
          '100': '#fef9ee',
          '150': '#fcf0d7',
          '200': '#fae7c0',
          '250': '#f8dea9',
          '300': '#f6d491',
          '350': '#f4cb7a',
          '400': '#f2c263',
          '450': '#f0b94b',
          '500': '#efb034',
          '550': '#eca517',
          '600': '#d29211',
          '650': '#b57e0f',
          '700': '#98690c',
          '750': '#7a550a',
          '800': '#5d4108',
          '850': '#402c05',
          '900': '#221803',
          DEFAULT: '#efb034'
        },
        danger: {
          '100': '#fdf2f2',
          '150': '#f9dbdc',
          '200': '#f5c4c6',
          '250': '#f1adaf',
          '300': '#ed9699',
          '350': '#e97f83',
          '400': '#e5696d',
          '450': '#e25256',
          '500': '#de3b40',
          '550': '#d9252b',
          '600': '#c12126',
          '650': '#aa1d22',
          '700': '#93191d',
          '750': '#7b1518',
          '800': '#641114',
          '850': '#4d0d0f',
          '900': '#36090b',
          DEFAULT: '#de3b40'
        },
        success: {
          '100': '#eefdf3',
          '150': '#d3f9e0',
          '200': '#b8f5cd',
          '250': '#9df2b9',
          '300': '#82eea6',
          '350': '#67ea93',
          '400': '#4ce77f',
          '450': '#31e36c',
          '500': '#1dd75b',
          '550': '#1ac052',
          '600': '#17a948',
          '650': '#14923e',
          '700': '#117b34',
          '750': '#0e642a',
          '800': '#0a4d20',
          '850': '#073517',
          '900': '#041e0d',
          DEFAULT: '#1dd75b'
        },
        neutral: {
          '100': '#FAFAFBFF',
          '150': '#F8F9FAFF',
          '200': '#F3F4F6FF',
          '300': '#DEE1E6FF',
          '400': '#BCC1CAFF',
          '500': '#9095A0FF',
          '550': '#6E7787FF',
          '600': '#565E6CFF',
          '650': '#424955FF',
          '700': '#323842FF',
          '800': '#1D2128FF',
          '900': '#171A1FFF',
          DEFAULT: '#171A1FFF'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      boxShadow: {
        xs: '0px 0px 1px rgba(23, 26, 31, 0.07), 0px 0px 2px rgba(23, 26, 31, 0.12)',
        s: '0px 2px 5px rgba(23, 26, 31, 0.09), 0px 0px 2px rgba(23, 26, 31, 0.12)',
        m: '0px 4px 9px rgba(23, 26, 31, 0.11), 0px 0px 2px rgba(23, 26, 31, 0.12)',
        l: '0px 8px 17px rgba(23, 26, 31, 0.15), 0px 0px 2px rgba(23, 26, 31, 0.12)',
        xl: '0px 17px 35px rgba(23, 26, 31, 0.24), 0px 0px 2px rgba(23, 26, 31, 0.12)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xs: '0.1875rem',
        s: '0.25rem',
        m: '0.375rem',
        l: '0.5rem',
        xl: '0.75rem',
        '100-percent': '100%'
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
