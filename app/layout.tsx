import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OS2 Order Tracker",
  description: "Track your custom apparel orders with OS2 Performance Apparel",
};

const stripExtensionAttrs = `
(function () {
  var ATTRS = [
    "data-gr-ext-installed",
    "data-new-gr-c-s-check-loaded",
    "data-lt-installed",
    "cz-shortcut-listen"
  ];
  function clean(node) {
    if (!node || !node.removeAttribute) return;
    for (var i = 0; i < ATTRS.length; i++) node.removeAttribute(ATTRS[i]);
  }
  function run() {
    clean(document.documentElement);
    clean(document.body);
  }
  run();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  }
  new MutationObserver(run).observe(document.documentElement, {
    attributes: true,
    subtree: true,
    attributeFilter: ATTRS
  });
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        <Script
          id="strip-browser-extension-attrs"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: stripExtensionAttrs }}
        />
        <div className="min-h-screen font-sans antialiased">{children}</div>
      </body>
    </html>
  );
}
