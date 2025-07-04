
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider
import { CartProvider } from '@/context/CartContext'; // Import CartProvider

export const metadata: Metadata = {
  title: 'Bucks',
  description: 'Your personal finance and lifestyle companion by Bucks.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Poppins:wght@600;700&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
