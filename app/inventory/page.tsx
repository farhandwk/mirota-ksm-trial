'use client';

import { useState } from 'react';
import useSWR from 'swr';
import QRCode from 'react-qr-code';

// Fetcher untuk SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InventoryPage() {
  // Mengambil data produk secara real-time
  const { data, error, mutate } = useSWR('/api/products', fetcher);
  
  // State untuk Form Input
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_produk: '',
    id_departemen: '',
    satuan: 'PCS' // Default value
  });

  // Fungsi Submit Form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Produk berhasil ditambahkan!");
        setFormData({ nama_produk: '', id_departemen: '', satuan: 'PCS' }); // Reset form
        mutate(); // Refresh tabel otomatis tanpa reload page
      } else {
        alert("Gagal menyimpan data.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  if (error) return <div className="p-10 text-red-500">Gagal memuat data API. Pastikan server nyala.</div>;
  if (!data) return <div className="p-10">Loading data gudang...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Kepala Gudang</h1>

        {/* --- BAGIAN 1: FORM INPUT --- */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Tambah Produk Baru</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Nama Produk */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
              <input
                type="text"
                required
                className="w-full border p-2 rounded"
                value={formData.nama_produk}
                onChange={(e) => setFormData({...formData, nama_produk: e.target.value})}
                placeholder="Contoh: Kertas A4"
              />
            </div>

            {/* Departemen (Nanti bisa dibikin dropdown otomatis dari API Department) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Departemen</label>
              <select 
                className="w-full border p-2 rounded"
                value={formData.id_departemen}
                onChange={(e) => setFormData({...formData, id_departemen: e.target.value})}
                required
              >
                <option value="">Pilih Departemen...</option>
                <option value="D-001">D-001 (Elektronik)</option>
                <option value="D-002">D-002 (ATK)</option>
                <option value="D-003">D-003 (Pantry)</option>
              </select>
            </div>

            {/* Satuan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
              <select
                className="w-full border p-2 rounded"
                value={formData.satuan}
                onChange={(e) => setFormData({...formData, satuan: e.target.value})}
              >
                <option value="PCS">PCS</option>
                <option value="BOX">BOX</option>
                <option value="KG">KG</option>
                <option value="UNIT">UNIT</option>
              </select>
            </div>

            {/* Tombol Submit */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Menyimpan...' : '+ Simpan Produk'}
            </button>
          </form>
        </div>

        {/* --- BAGIAN 2: TABEL DATA & QR --- */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Info Produk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.data?.map((item: any) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Render QR Code di sini */}
                    <div className="bg-white p-2 border inline-block">
                      <QRCode value={item.qr_code} size={64} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-mono">{item.qr_code}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">ID: {item.id.substring(0,8)}...</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {item.stock} {item.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Dept: {item.department_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}