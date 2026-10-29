import "./globals.css";

export const metadata = {
  title: "MST Multi-Asset Hub | Real-World & Digital Assets",
  description: "Universal Multi-Asset Management System on MST Blockchain (Degrees, Carbon Credits, Land Ownership)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
