import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-hanken",
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Word Fade — High Efficiency Vocabulary Acquisition",
  description: "Minimalist, cognitive-focus Polish language learning app using dynamic visual fade mechanics for deep long-term retention.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f9f9ff] text-[#151c27] font-sans-ui selection:bg-[#dce2f3]">
        {children}
      </body>
    </html>
  );
}
