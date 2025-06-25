export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "robot-color": "#6B2078",
        "chatbot-bg-color": "#F3ECF8",
        "purple/500":"#532494",
        "orig/600":"#693696",
        "orig/500":"#4A266A",
        "purple/200":"#C7ADEB",
        "dark-background":"#13082B",
        "dark-text":"#E6D9F2",
        "dark-text-secondary":"#0D0713"

      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
