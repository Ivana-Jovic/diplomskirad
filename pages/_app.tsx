import "../styles/global.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../firebase-authProvider";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  // progress bar day3 pred kraj
  return (
    // <SessionProvider session={session}>
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
    // </SessionProvider>
  );
}
