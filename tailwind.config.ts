import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

// Custom color with css variable color in __theme_color.scss
const customColors = (cssVar: string) => {
	return ({
		opacityVariable,
		opacityValue,
	}: {
		opacityVariable: string;
		opacityValue: number | undefined;
	}) => {
		if (opacityValue !== undefined) {
			return `rgba(var(${cssVar}), ${opacityValue})`;
		}
		if (opacityVariable !== undefined) {
			return `rgba(var(${cssVar}), var(${opacityVariable}, 1))`;
		}
		return `rgb(var(${cssVar}))`;
	};
};

const config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/**/**/*.{ts,tsx}',
		'./components/**/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./components/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./app/**/**/*.{ts,tsx}',
		'./app/**/**/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
		'./shared/**/*.{ts,tsx}',
		'./shared/*.{ts,tsx}',
	],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				// primary: {
				// 	DEFAULT: 'hsl(var(--primary))',
				// 	foreground: 'hsl(var(--primary-foreground))',
				// },
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					50: customColors('--c-primary-50')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					100: customColors('--c-primary-100')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					200: customColors('--c-primary-200')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					300: customColors('--c-primary-300')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					400: customColors('--c-primary-400')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					500: customColors('--c-primary-500')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					600: customColors('--c-primary-600')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					700: customColors('--c-primary-700')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					800: customColors('--c-primary-800')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					900: customColors('--c-primary-900')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
				},
				// secondary: {
				// 	DEFAULT: 'hsl(var(--secondary))',
				// 	foreground: 'hsl(var(--secondary-foreground))',
				// },
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					50: customColors('--c-secondary-50')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					100: customColors('--c-secondary-100')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					200: customColors('--c-secondary-200')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					// Add custom opacity for neutral-200
					'200/90': customColors('--c-neutral-200')({
						opacityVariable: '',
						opacityValue: 0.9,
					}),
					300: customColors('--c-secondary-300')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					400: customColors('--c-secondary-400')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					500: customColors('--c-secondary-500')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					600: customColors('--c-secondary-600')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					700: customColors('--c-secondary-700')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					800: customColors('--c-secondary-800')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					900: customColors('--c-secondary-900')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
				},
				neutral: {
					50: customColors('--c-neutral-50')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					100: customColors('--c-neutral-100')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					200: customColors('--c-neutral-200')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					300: customColors('--c-neutral-300')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					400: customColors('--c-neutral-400')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					500: customColors('--c-neutral-500')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					600: customColors('--c-neutral-600')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					700: customColors('--c-neutral-700')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					800: customColors('--c-neutral-800')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
					900: customColors('--c-neutral-900')({
						opacityVariable: '',
						opacityValue: undefined,
					}),
				},
				tertiary: {
					DEFAULT: 'hsl(var(--tertiary))',
					foreground: 'hsl(var(--tertiary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			fontSize: {
				'10xl': ['12rem', { lineHeight: '1' }],
			},
		},
	},
	plugins: [
		require('tailwindcss-animate'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/aspect-ratio'),
	],
} satisfies Config;

export default config;
