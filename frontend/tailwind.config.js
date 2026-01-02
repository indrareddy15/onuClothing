const tailwindAnimated = require('tailwindcss-animate');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
                kumbsan: ['Kumbsan', 'sans-serif'],
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
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
            keyframes: {
                vibrateScale: {
                    '0%, 100%': { transform: 'translateX(0) scale(1)' },
                    '25%': { transform: 'translateX(-2px) scale(1.1)' },
                    '50%': { transform: 'translateX(2px) scale(1.05)' },
                    '75%': { transform: 'translateX(-2px) scale(1.1)' },
                },
                shineEffect: {
                    '0%': { boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)' },
                    '50%': { boxShadow: '0 0 20px rgba(255, 255, 255, 1)' },
                    '100%': { boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)' },
                },
                marquee: {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(calc(-100% - var(--gap)))' },
                },
                'marquee-vertical': {
                    from: { transform: 'translateY(0)' },
                    to: { transform: 'translateY(calc(-100% - var(--gap)))' },
                },
            },
            animation: {
                vibrateScale: 'vibrateScale 0.4s ease-out',
                'shine': 'shineEffect 1.5s infinite',
                marquee: 'marquee var(--duration) linear infinite',
                'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
            },
            transitionTimingFunction: {
                'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
                'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
                'ease-in-out-expo': 'cubic-bezier(1, 0, 0, 1)',

                // Ease-In and Ease-Out variations
                'ease-in': 'cubic-bezier(0.42, 0, 1, 1)', // Smooth ease-in effect
                'ease-out': 'cubic-bezier(0, 0, 0.58, 1)', // Smooth ease-out effect
                'ease-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)', // Smooth ease-in-out effect

                // Custom easing
                'ease-in-circ': 'cubic-bezier(0.6, 0.04, 0.98, 0.335)', // Ease-in with circular curve
                'ease-out-circ': 'cubic-bezier(0.075, 0.82, 0.165, 1)', // Ease-out with circular curve
                'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.15, 0.86)', // Ease-in-out with circular curve

                // Custom curves
                'ease-in-back': 'cubic-bezier(0.36, 0, 0.66, -0.56)', // Ease-in with back curve
                'ease-out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Ease-out with back curve
                'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Ease-in-out with back curve

                // Elastic and Bounce effects
                'ease-in-elastic': 'cubic-bezier(0.75, 0.1, 0.5, 1.5)', // Elastic ease-in
                'ease-out-elastic': 'cubic-bezier(0.5, 1.5, 0.75, 1)', // Elastic ease-out
                'ease-in-out-elastic': 'cubic-bezier(0.75, 0.25, 0.25, 1.5)', // Elastic ease-in-out

                'ease-in-bounce': 'cubic-bezier(0.55, 0.05, 0.68, 0.53)', // Bounce ease-in
                'ease-out-bounce': 'cubic-bezier(0.215, 0.61, 0.355, 1)', // Bounce ease-out
                'ease-in-out-bounce': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Bounce ease-in-out
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar'),
        tailwindAnimated
    ],
}