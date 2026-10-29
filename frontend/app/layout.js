import "./globals.css";

export const metadata = {
  title: "MST Multi-Asset Hub | Official MST Blockchain RWA Infrastructure",
  description: "Next-Gen Layer 1 Multi-Asset Management on MST Blockchain (Academic Degrees, Carbon Credits, Cadastral Land Titles)",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#08080c] text-white min-h-screen antialiased selection:bg-[#e52e2e] selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
