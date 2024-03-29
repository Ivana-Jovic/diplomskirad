import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Head from "next/head";
export const siteTitle = "Airbnb";
import { Toaster } from "react-hot-toast";

export default function Layout({
  children,
  placeholder,
}: {
  children: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Head>
        {/* <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" /> */}
      </Head>
      <Navbar placeholder={placeholder} />
      <Toaster />
      <main className="bg-background pb-7 w-full grow">{children}</main>
      <Footer />
    </div>
  );
}
