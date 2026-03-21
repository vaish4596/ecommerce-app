
"use client";

import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Catalyst Catalog</title>
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <CartProvider>
          <Navbar />
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
