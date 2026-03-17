import React, { useRef } from 'react';
import { X, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  name: string;
}

export default function QRCodeModal({ isOpen, onClose, value, name }: QRCodeModalProps) {
  const qrRef = useRef<SVGSVGElement>(null);
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!qrRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height + 40; // Add space for text
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(name, canvas.width / 2, canvas.height - 15);
        
        const dataUrl = canvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.download = `qr-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold">QR Code</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <QRCodeSVG 
              value={value} 
              size={200} 
              level="H"
              includeMargin={true}
              ref={qrRef}
            />
          </div>
          
          <h3 className="font-bold text-center text-lg mb-2">{name}</h3>
          <p className="text-sm text-gray-500 text-center mb-8 break-all">{value}</p>
          
          <button 
            onClick={handleDownload}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center"
          >
            <Printer className="w-5 h-5 mr-2" />
            {t('download_as_image')}
          </button>
        </div>
      </div>
    </div>
  );
}
