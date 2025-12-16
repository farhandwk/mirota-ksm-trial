'use client';

import { useState } from 'react';
import QRScanner from '@/components/QRScanner';

export default function PetugasPage() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'IN' | 'OUT'>('IN');
  const [step, setStep] = useState<'SETUP' | 'SCANNING' | 'INPUT_QTY'>('SETUP');
  
  // Data Transaksi
  const [deptId, setDeptId] = useState('');
  const [scannedQR, setScannedQR] = useState('');
  const [qty, setQty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // --- HANDLERS ---

  // 1. Mulai Scan
  const handleStartScan = () => {
    if (activeTab === 'IN' && !deptId) {
      alert("Pilih Departemen dulu!");
      return;
    }
    setStep('SCANNING');
  };

  // 2. Saat QR Terbaca
  const onScanSuccess = (decodedText: string) => {
    setScannedQR(decodedText);
    setStep('INPUT_QTY'); // Pindah ke form input jumlah
  };

  // 3. Submit ke Server
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        qr_code: scannedQR,
        type: activeTab, // 'IN' atau 'OUT'
        quantity: Number(qty),
        department_id: activeTab === 'IN' ? deptId : undefined, // Kirim dept cuma kalau IN
        petugas: "Petugas Gudang 1" // Nanti bisa diambil dari login session
      };

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert(`SUKSES! \n${data.message}`);
        // Reset Flow
        setStep('SETUP');
        setQty(1);
        setScannedQR('');
      } else {
        alert(`GAGAL: ${data.error}`);
        // Jika error "Salah Gudang", kembalikan ke menu awal
        setStep('SETUP');
      }

    } catch (error) {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      
      {/* Header Mobile */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-gray-800">Scanner Gudang</h1>
        <p className="text-sm text-gray-500">Mode Petugas</p>
      </div>

      {/* Tab Switcher (Tombol Besar) */}
      {step === 'SETUP' && (
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setActiveTab('IN')}
            className={`flex-1 py-4 rounded-xl font-bold shadow-sm transition-all ${
              activeTab === 'IN' ? 'bg-blue-600 text-white ring-2 ring-blue-300' : 'bg-white text-gray-600'
            }`}
          >
            ⬇️ Barang Masuk
          </button>
          <button 
            onClick={() => setActiveTab('OUT')}
            className={`flex-1 py-4 rounded-xl font-bold shadow-sm transition-all ${
              activeTab === 'OUT' ? 'bg-orange-600 text-white ring-2 ring-orange-300' : 'bg-white text-gray-600'
            }`}
          >
            ⬆️ Barang Keluar
          </button>
        </div>
      )}

      {/* --- KONTEN UTAMA --- */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        
        {/* STEP 1: SETUP (Pilih Dept) */}
        {step === 'SETUP' && (
          <div className="space-y-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-2xl block mb-2">{activeTab === 'IN' ? '📦' : '🚚'}</span>
              <p className="font-semibold text-gray-700">
                Mode: {activeTab === 'IN' ? 'Input Stok Baru' : 'Output / Pengiriman'}
              </p>
            </div>

            {/* Dropdown hanya muncul jika mode IN */}
            {activeTab === 'IN' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Departemen Tujuan</label>
                <select 
                  className="w-full p-4 border border-gray-300 rounded-xl text-lg bg-white"
                  value={deptId}
                  onChange={(e) => setDeptId(e.target.value)}
                >
                  <option value="">-- Pilih --</option>
                  <option value="D-001">Elektronik (D-001)</option>
                  <option value="D-002">ATK (D-002)</option>
                  <option value="D-003">Pantry (D-003)</option>
                </select>
              </div>
            )}

            <button 
              onClick={handleStartScan}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors"
            >
              📷 Buka Kamera
            </button>
          </div>
        )}

        {/* STEP 2: KAMERA SCANNING */}
        {step === 'SCANNING' && (
          <div className="text-center">
            <h3 className="font-bold mb-4">Arahkan Kamera ke QR Code</h3>
            <QRScanner onScanSuccess={onScanSuccess} />
            <button 
              onClick={() => setStep('SETUP')}
              className="mt-4 text-red-500 font-semibold underline"
            >
              Batal Scan
            </button>
          </div>
        )}

        {/* STEP 3: INPUT QUANTITY (Setelah Scan Sukses) */}
        {step === 'INPUT_QTY' && (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
              <p className="text-xs text-green-600 uppercase font-bold">QR Code Terdeteksi</p>
              <p className="text-lg font-mono font-bold text-green-800 break-all">{scannedQR}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah {activeTab === 'IN' ? 'Diterima' : 'Dikeluarkan'}
              </label>
              <input 
                type="number" 
                min="1"
                className="w-full p-4 text-center text-3xl font-bold border-2 border-blue-500 rounded-xl"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Sedang Memproses...' : '✅ Konfirmasi'}
            </button>
            
            <button 
              onClick={() => setStep('SETUP')}
              disabled={isLoading}
              className="w-full py-3 text-gray-500"
            >
              Batal
            </button>
          </div>
        )}

      </div>
    </div>
  );
}