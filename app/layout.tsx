import type { Metadata } from "next";
import {  Inter } from "next/font/google";
import {ToastContainer} from "react-toastify"
import "./globals.css";


const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dunamis Bus Tracker",
  description:
    "Find live locations for Dunamis International Gospel Centre shuttle buses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<html lang="en" className={` ${inter.variable}`}>
  <head>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
<link rel="manifest" href="/site.webmanifest"/>
  </head>
  <body className="min-h-screen font-body">
    <ToastContainer/>
    <main className="min-h-screen w-full">
      {children}
  {/*    <footer className="w-full px-5 py-10 text-xs text-text-muted sm:px-8">
      Dunamis International Gospel Centre &middot; Bus Tracker
    </footer>*/}
    </main>

    
  </body>
</html>
  );
}
