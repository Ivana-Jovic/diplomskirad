import "../styles/global.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../firebase-authProvider";
import { createTheme, ThemeProvider } from "@mui/material";
// import FullCalendar from "@fullcalendar/react";
// The import order DOES MATTER here. If you change it, you'll get an error!
// import interactionPlugin from "@fullcalendar/interaction";
// import timeGridPlugin from "@fullcalendar/timegrid";
// // import "@fullcalendar/common/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";
const theme = createTheme({
  palette: {
    primary: { main: "#161616" }, // Purple and green play nicely together.
    secondary: { main: "#161616" }, // This is just green.A700 as hex.
    // btn-primary:{main: "#161616" },
  },
  //   overrides: {
  // Button: {
  //       raisedPrimary: {
  //         color: 'white',
  //       },
  //     },
});
export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  // progress bar day3 pred kraj
  return (
    // <SessionProvider session={session}>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
    // </SessionProvider>
  );
}
