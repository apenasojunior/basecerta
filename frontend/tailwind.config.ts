import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
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
  				'50': '#FFF5F2',
  				'100': '#FFE8E0',
  				'200': '#FFCFBD',
  				'300': '#FFB199',
  				'400': '#FF8766',
  				'500': '#EE4D2D',
  				'600': '#D43919',
  				'700': '#B32A12',
  				'800': '#921F0E',
  				'900': '#78180C',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
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
  			},
  			success: {
  				light: '#D4EDDA',
  				DEFAULT: '#28A745',
  				dark: '#1E7E34'
  			},
  			error: {
  				light: '#F8D7DA',
  				DEFAULT: '#DC3545',
  				dark: '#C82333'
  			},
  			warning: {
  				light: '#FFF3CD',
  				DEFAULT: '#FFC107',
  				dark: '#E0A800'
  			},
  			info: {
  				light: '#D1ECF1',
  				DEFAULT: '#17A2B8',
  				dark: '#117A8B'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-inter)',
  				'Inter',
  				'sans-serif'
  			],
  			display: [
  				'var(--font-poppins)',
  				'Poppins',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-roboto-mono)',
  				'Roboto Mono',
  				'monospace'
  			]
  		},
  		boxShadow: {
  			sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
  			DEFAULT: '0 2px 8px rgba(0, 0, 0, 0.08)',
  			md: '0 4px 12px rgba(0, 0, 0, 0.1)',
  			lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
  			xl: '0 20px 60px rgba(0, 0, 0, 0.3)',
  			primary: '0 4px 12px rgba(238, 77, 45, 0.3)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			fadeIn: {
  				from: {
  					opacity: '0'
  				},
  				to: {
  					opacity: '1'
  				}
  			},
  			slideInRight: {
  				from: {
  					opacity: '0',
  					transform: 'translateX(20px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			slideInDown: {
  				from: {
  					opacity: '0',
  					transform: 'translateY(-20px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			spin: {
  				from: {
  					transform: 'rotate(0deg)'
  				},
  				to: {
  					transform: 'rotate(360deg)'
  				}
  			},
  			pulse: {
  				'0%, 100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0.5'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			fadeIn: 'fadeIn 0.3s ease-out',
  			slideInRight: 'slideInRight 0.3s ease-out',
  			slideInDown: 'slideInDown 0.3s ease-out',
  			spin: 'spin 1s linear infinite',
  			pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  		}
  	}
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
      require("tailwindcss-animate")
],
}

export default config
