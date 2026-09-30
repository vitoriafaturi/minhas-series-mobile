/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        fundo: '#2d2f42', // fundo das telas
        campo: '#202330', // cards e caixas de texto
        concluida: '#15172a', // card de série concluída
        borda: '#464954',
        rosa: {
          DEFAULT: '#d46c7f', // botões e destaques
          escuro: '#b9586b', // botão pressionado
        },
      },
    },
  },
  plugins: [],
};
