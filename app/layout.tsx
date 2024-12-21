import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema de Gestión de Gastos',
  description: 'Aplicación para gestionar y visualizar gastos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100">
          <nav className="w-64 bg-white shadow-lg">
            <div className="p-4">
              <h1 className="text-2xl font-bold mb-4">Menú</h1>
              <ul>
                <li className="mb-2">
                  <Link href="/" className="text-blue-500 hover:text-blue-700">Gestión de Gastos</Link>
                </li>
                <li className="mb-2">
                  <Link href="/graficos" className="text-blue-500 hover:text-blue-700">Gráficos</Link>
                </li>
                <li>
                  <Link href="/personal" className="text-blue-500 hover:text-blue-700">Personal</Link>
                </li>
              </ul>
            </div>
          </nav>
          <main className="flex-1 p-4 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

