'use client';

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: any) => void;
}

export default function QRScanner({ onScanSuccess, onScanFailure }: QRScannerProps) {
  useEffect(() => {
    // Inisialisasi Scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        // Stop scanning setelah berhasil baca (agar tidak spamming)
        scanner.clear(); 
        onScanSuccess(decodedText);
      },
      (error) => {
        if (onScanFailure) onScanFailure(error);
      }
    );

    // Cleanup saat component ditutup
    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner", error));
    };
  }, [onScanSuccess, onScanFailure]);

  return (
    <div className="overflow-hidden rounded-lg border-2 border-blue-500">
      <div id="reader" className="w-full"></div>
    </div>
  );
}