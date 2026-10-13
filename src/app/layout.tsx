import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { ArrivalFocus } from "@/components/arrival-focus";
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
    "Product designer shipping designs into products with AI. Five years across consumer and enterprise, on Android, iOS, and TV.",
};

/* On phones: the browser's own toolbars take the page colour (the --base
   token, day and night), and the page may draw under the notch and the
   home indicator, with globals.css keeping the content clear of them. */
export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nunito.variable} antialiased`}>
      <body>
        {children}
        <ArrivalFocus />
      </body>
    </html>
  );
}
