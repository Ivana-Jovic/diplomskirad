const defaultTheme = require("tailwindcss/defaultTheme");

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
        logo: "#FF5A5F",
        darkGreen: "#134e4a",
      },
      height: {
        "50vh": "50vh",
        "20vh": "20vh",
      },
      backgroundImage: {
        banner: "url('/image/banner.jpg')",
      },
    },
    fontFamily: {
      logo: ["Montserrat"],
    },
    screens: {
      xs: "550px",
      ...defaultTheme.screens,
    },
    // fontSize: {
    //   xs: ".75rem",
    //   sm: ".875rem",
    //   tiny: ".875rem",
    //   base: "1rem",
    //   lg: "1.125rem",
    //   xl: "1.25rem",
    //   "2xl": "1.5rem",
    //   "3xl": "1.875rem",
    //   "4xl": "2.25rem",
    //   "5xl": "3rem",
    //   "6xl": "4rem",
    //   "7xl": "5rem",
    // },
  },
  plugins: [require("tailwind-scrollbar-hide"), require("daisyui")],
};
