import "../styles/global.css";
import type { AppProps } from "next/app";
import Navbar from "../components/navbar";
import { SessionProvider } from "next-auth/react";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  // progress bar day3 pred kraj
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />{" "}
    </SessionProvider>
  );
}
