import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { ArrowLeft, Plus, Edit, Trash2, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ToyFormModal from '../components/ToyFormModal';
import QRCodeModal from '../components/QRCodeModal';
import { Toy } from '../types';
import { getImageUrl } from '../utils/imageUtils';

export default function AdminToys() {
  const { t, i18n } = useTranslation();
  const { toys, deleteToy, addToy, updateToy } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const [isToyModalOpen, setIsToyModalOpen] = useState(false);
  const [editingToy, setEditingToy] = useState<Toy | undefined>(undefined);
  
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [qrName, setQrName] = useState('');

  const handleAddToy = () => {
    setEditingToy(undefined);
    setIsToyModalOpen(true);
  };

  const handleEditToy = (toy: Toy) => {
    setEditingToy(toy);
    setIsToyModalOpen(true);
  };

  const handleSaveToy = (toy: Toy) => {
    if (editingToy) {
      updateToy(toy);
    } else {
      addToy(toy);
    }
  };

  const handleDeleteToy = (id: string) => {
    if (window.confirm('Are you sure you want to delete this toy?')) {
      deleteToy(id);
    }
  };

  const handleShowQR = (toy: Toy) => {
    setQrValue(toy.qr_code_value);
    setQrName(toy.name[i18n.language as keyof typeof toy.name] || toy.name.en);
    setIsQRModalOpen(true);
  };

  const filteredToys = toys.filter(toy => 
    toy.name[i18n.language as keyof typeof toy.name]?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-900" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 ml-2">{t('manage_toys')}</h1>
        </div>
        <button onClick={handleAddToy} className="p-2 bg-teal-50 text-teal-600 rounded-full hover:bg-teal-100 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <input
          type="text"
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all mb-6"
        />

        <div className="space-y-4">
          {filteredToys.map(toy => (
            <div key={toy.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center">
              <img src={getImageUrl(toy.image)} alt={toy.name[i18n.language as keyof typeof toy.name]} className="w-16 h-16 rounded-xl object-cover mr-4" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{toy.name[i18n.language as keyof typeof toy.name]}</h3>
                <p className="text-xs text-gray-500 mb-2">{t('available_out_of_total', { available: toy.copies_available, total: toy.copies_total })}</p>
                <div className="flex space-x-2">
                  <button onClick={() => handleEditToy(toy)} className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleShowQR(toy)} className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteToy(toy.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors ml-auto">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToyFormModal 
        isOpen={isToyModalOpen} 
        onClose={() => setIsToyModalOpen(false)} 
        onSave={handleSaveToy} 
        initialToy={editingToy} 
      />
      
      <QRCodeModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        value={qrValue} 
        name={qrName} 
      />
    </div>
  );
}
