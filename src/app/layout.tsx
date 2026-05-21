import './globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'Mi Boleta',
  description: 'Frontend de Mi Boleta con Next.js App Router',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
