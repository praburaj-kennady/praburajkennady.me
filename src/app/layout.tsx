import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ArrivalFocus } from "@/components/arrival-focus";
import { profile } from "@/content/site";
import "./globals.css";

/* Nunito in the five weights the style uses: the same static files the
   Zwap site serves (fonts/, under the SIL Open Font License in OFL.txt),
   so the text draws at the same weight. SemiBold, which the Zwap site
   doesn't use, is the same Nunito 3.602 design, instanced at 600. */
const nunito = localFont({
  src: [
    { path: "./fonts/Nunito-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Nunito-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Nunito-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Nunito-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "./fonts/Nunito-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Praburaj Kennady — Product Designer",
  description: `${profile.tagline.replace("\n", " ")} ${profile.taglineDetail}`,
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
    <html lang="en" className={nunito.variable}>
      <body>
        {children}
        <ArrivalFocus />
      </body>
    </html>
  );
}
