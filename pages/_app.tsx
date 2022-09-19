import "../styles/global.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../firebase-authProvider";
import { createTheme, ThemeProvider } from "@mui/material";
const theme = createTheme({
  palette: {
    primary: { main: "#161616" }, // Purple and green play nicely together.
    secondary: { main: "#161616" }, // This is just green.A700 as hex.
  },
});
export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}
