import type { Metadata } from "next";
import { Gabarito, Sora, IBM_Plex_Mono } from "next/font/google";
import { SiteNav } from "@/components/nav";
import "./globals.css";

const display = Gabarito({
  subsets: ["latin"],
  variable: "--font-gabarito",
  display: "swap",
});

const body = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Praburaj Kennady — Product Designer",
  description:
    "Product designer shipping designs into products with AI. Five years across consumer and enterprise, on Android, iOS, and TV.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[--color-bg] text-[--color-text] font-body">
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
