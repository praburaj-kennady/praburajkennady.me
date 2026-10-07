import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

/* Nunito in the four weights the style uses. next/font serves the files
   from this site, so no request goes to Google. */
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Praburaj Kennady — Product Designer",
  description:
    "Product designer shipping designs into products with AI. Case studies coming soon.",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nunito.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
