/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            keyframes: {
                "accordion-down": {
                    from: {height: "0"},
                    to: {height: "var(--radix-accordion-content-height)"},
                },
                "accordion-up": {
                    from: {height: "var(--radix-accordion-content-height)"},
                    to: {height: "0"},
                },
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)"
                    },
                    "33%": {
                        transform: "translate(-50px, -50px) scale(1.1)"
                    },
                    "66%": {
                        transform: "translate(-30px, -20px) scale(0.9)"
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)"
                    }
                },
                "typewriter": {
                    from: {width: 0},
                    to: {width: "710px"}
                },
                "blinkTextCursor": {
                    from: {
                        borderRightColor: "hsl(0, 0%, 80%)",
                    },
                    to: {
                        borderRightColor: "transparent",
                    }
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                blob: "blob 7s infinite"
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'hero-image-1': "url('src/assets/hero_bg_1.jpg')",
                'hero-image-2': "url('src/assets/hero_bg_2.jpg')",
                'hero-image-3': "url('src/assets/hero_bg_3.jpg')",
                'hero-image-4': "url('src/assets/hero_bg_4.jpg')",
                'hero-image-5': "url('src/assets/hero_bg_5.jpg')",
                'chat-1': "url('src/assets/chat_bg.jpg')",
                'chat-2': "url('src/assets/chat_bg_2.jpg')",
            }
        },
    },
    plugins: [require("tailwindcss-animate")],
}