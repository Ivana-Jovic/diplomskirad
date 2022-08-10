import "../styles/global.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../firebase-authProvider";
// import FullCalendar from "@fullcalendar/react";
// The import order DOES MATTER here. If you change it, you'll get an error!
// import interactionPlugin from "@fullcalendar/interaction";
// import timeGridPlugin from "@fullcalendar/timegrid";
// // import "@fullcalendar/common/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";

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
