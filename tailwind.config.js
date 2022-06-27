module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      zIndex: {
        100: "100",
      },
      colors: {
        footer: "#161616",
        textFooter: "#f8fafc",
        background: "#f8fafc",
        text: "#0f172a",
        header: "#f8fafc",
        textHover: "#a1a1aa",
      },
      height: {
        "50vh": "50vh",
      },
      backgroundImage: {
        banner: "url('/image/banner.jpg')",
      },
    },
    fontFamily: {
      logo: ["Montserrat"],
    },
  },
  plugins: [],
};
