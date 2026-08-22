/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Simple & Rounded options
        nunito: ['Nunito_400Regular', 'sans-serif'],
        'nunito-semibold': ['Nunito_600SemiBold', 'sans-serif'],
        'nunito-bold': ['Nunito_700Bold', 'sans-serif'],
        'nunito-extrabold': ['Nunito_800ExtraBold', 'sans-serif'],

        // Modern & Sharp rounded options
        poppins: ['Poppins_400Regular', 'sans-serif'],
        'poppins-medium': ['Poppins_500Medium', 'sans-serif'],
        'poppins-semibold': ['Poppins_600SemiBold', 'sans-serif'],
        'poppins-bold': ['Poppins_700Bold', 'sans-serif'],

        // Clean & Modern tech options
        jakarta: ['PlusJakartaSans_400Regular', 'sans-serif'],
        'jakarta-semibold': ['PlusJakartaSans_600SemiBold', 'sans-serif'],
        'jakarta-bold': ['PlusJakartaSans_700Bold', 'sans-serif'],
        'jakarta-extrabold': ['PlusJakartaSans_800ExtraBold', 'sans-serif'],

        // Soft & Friendly geometry
        outfit: ['Outfit_400Regular', 'sans-serif'],
        'outfit-medium': ['Outfit_500Medium', 'sans-serif'],
        'outfit-semibold': ['Outfit_600SemiBold', 'sans-serif'],
        'outfit-bold': ['Outfit_700Bold', 'sans-serif'],
      },
      colors: {
        brand: {
          red: '#D9232E',
          'red-dark': '#B91C27',
          'red-light': '#FEE2E2',
        },
        healthcare: {
          900: '#0F2A43',
          700: '#155E8A',
          500: '#2196C7',
          300: '#7DD3FC',
          100: '#E0F2FE',
          50: '#F0F9FF',
        },
        status: {
          success: '#16A34A',
          warning: '#F59E0B',
          danger: '#DC2626',
          info: '#0EA5E9',
        },
      },
    },
  },
  plugins: [],
};
