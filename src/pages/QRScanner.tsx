import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../store';

export default function QRScanner() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { loans, currentUser, toys } = useStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        // Assuming the QR code contains the toy ID directly for simplicity
        const scannedId = decodedText.split('/').pop() || decodedText;
        
        // Find the actual toy to get its real ID (since qr_code_value might differ from id)
        const toy = toys.find(t => t.id === scannedId || t.qr_code_value === scannedId);
        
        if (!toy) {
          setError(t('toy_not_found'));
          return;
        }

        const toyId = toy.id;
        
        // Check if the user already has this toy checked out
        const hasActiveLoan = loans.some(
          l => l.toy_id === toyId && l.borrower_id === currentUser?.id && l.status === 'checked_out'
        );

        if (hasActiveLoan) {
          navigate(`/return/${toyId}`);
        } else {
          navigate(`/checkout/${toyId}`);
        }
      },
      (err) => {
        // Ignore continuous scan errors
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [navigate, loans, currentUser, toys, t]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      <div className="px-4 py-3 flex items-center border-b border-slate-800">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold ml-2">{t('scan_qr')}</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm aspect-square bg-slate-800 rounded-3xl overflow-hidden relative shadow-2xl">
          <div id="reader" className="w-full h-full"></div>
          {/* Overlay for scanning area */}
          <div className="absolute inset-0 pointer-events-none border-4 border-teal-500 rounded-3xl opacity-50"></div>
        </div>
        <p className="mt-8 text-center text-slate-400 max-w-xs">
          Point your camera at the QR code on the toy to check it out or return it.
        </p>
        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
}
