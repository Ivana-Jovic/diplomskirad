import "../styles/global.css";
import type { AppProps } from "next/app";
import Navbar from "../components/navbar";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
  // return <Navbar></Navbar>;
}
