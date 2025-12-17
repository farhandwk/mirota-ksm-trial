'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "../components/ui/button";
import { Package, History, LogOut, ChartPie, Building2 } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  // Helper untuk cek link aktif agar bisa dikasih warna beda
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#004aad] rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl text-[#004aad] tracking-tight">Mirota KSM</span>
          </div>

          {/* Menu Links */}
          <div className="hidden md:flex space-x-4">
            <Link href="/inventory">
              <Button 
                variant={isActive('/inventory') ? 'default' : 'ghost'}
                className={isActive('/inventory') ? 'bg-[#004aad]' : 'text-gray-600 hover:text-[#004aad] hover:bg-blue-50'}
              >
                <Package className="w-4 h-4 mr-2" />
                Stok Produk
              </Button>
            </Link>
            
            <Link href="/history">
              <Button 
                variant={isActive('/history') ? 'default' : 'ghost'}
                className={isActive('/history') ? 'bg-[#004aad]' : 'text-gray-600 hover:text-[#004aad] hover:bg-blue-50'}
              >
                <History className="w-4 h-4 mr-2" />
                Riwayat Transaksi
              </Button>
            </Link>

            <Link href="/analytics">
              <Button 
                variant={isActive('/analytics') ? 'default' : 'ghost'}
                className={isActive('/analytics') ? 'bg-[#004aad]' : 'text-gray-600 hover:text-[#004aad] hover:bg-blue-50'}
              >
                <ChartPie className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </Link>
          </div>

          <Link href="/departments">
        <Button 
            variant={isActive('/departments') ? 'default' : 'ghost'}
            className={isActive('/departments') ? 'bg-[#004aad]' : 'text-gray-600 hover:text-[#004aad] hover:bg-blue-50'}
        >
            <Building2 className="w-4 h-4 mr-2" /> {/* Pastikan import Building2 dari lucide-react */}
            Departemen
        </Button>
        </Link>

          {/* Logout / Back to Home */}
          <div>
            <Link href="/">
              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}