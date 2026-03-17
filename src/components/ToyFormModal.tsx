import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { Toy, ToyCategory, AgeRange, Material } from '../types';
import { useTranslation } from 'react-i18next';
import { supabaseService } from '../services/supabaseService';

interface ToyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (toy: Toy) => void;
  initialToy?: Toy;
}

const CATEGORIES: ToyCategory[] = [
  'Construction', 'Symbolic / Role Play', 'Babies', 'Puzzles', 'Crafts',
  'Theater / Drama', 'Instruments', 'Sports', 'Open-Ended', 'Board Games',
  'Literacy / Reading', 'Vehicles / Cars', 'Other'
];

const AGE_RANGES: AgeRange[] = ['0-2', '3-5', '6-8', '9-12', '12+'];

const MATERIALS: Material[] = ['Plastic', 'Wood', 'Metal', 'Fabric', 'Cardboard', 'Mixed', 'Other'];

export default function ToyFormModal({ isOpen, onClose, onSave, initialToy }: ToyFormModalProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Toy>>({
    name: { en: '', es: '', ar: '' },
    brand: '',
    category: 'Other',
    age_range: '3-5',
    material: 'Plastic',
    number_of_pieces: 1,
    copies_total: 1,
    copies_available: 1,
    image: '',
    qr_code_value: '',
    total_checkouts: 0,
    is_active: true
  });

  useEffect(() => {
    if (initialToy) {
      setFormData(initialToy);
    } else {
      setFormData({
        name: { en: '', es: '', ar: '' },
        brand: '',
        category: 'Other',
        age_range: '3-5',
        material: 'Plastic',
        number_of_pieces: 1,
        copies_total: 1,
        copies_available: 1,
        image: '',
        qr_code_value: `toy-${Date.now()}`,
        total_checkouts: 0,
        is_active: true
      });
    }
  }, [initialToy, isOpen]);

  if (!isOpen) return null;

  const processImageUrl = (url: string) => {
    // Handle standard drive links
    const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(driveRegex);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    
    // Handle uc?id= links (like the ones returned by our script)
    const ucRegex = /drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/;
    const ucMatch = url.match(ucRegex);
    if (ucMatch && ucMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${ucMatch[1]}`;
    }
    
    return url;
  };

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file.');
      return;
    }

    try {
      setIsUploading(true);
      const publicUrl = await supabaseService.uploadImage(file);
      setFormData({ ...formData, image: publicUrl });
      setIsUploading(false);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setUploadError(error.message || 'Failed to upload image to Supabase.');
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameEn = formData.name?.en || formData.name?.es || formData.name?.ar || '';
    const nameEs = formData.name?.es || formData.name?.en || formData.name?.ar || '';
    const nameAr = formData.name?.ar || formData.name?.en || formData.name?.es || '';

    const newToy: Toy = {
      ...formData,
      name: { en: nameEn, es: nameEs, ar: nameAr },
      id: initialToy?.id || formData.qr_code_value || `toy-${Date.now()}`,
      copies_available: initialToy ? formData.copies_available! : formData.copies_total!
    } as Toy;
    onSave(newToy);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold">{initialToy ? t('edit_toy') : t('add_toy')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t('name_en')}</label>
            <input required={!formData.name?.es && !formData.name?.ar} type="text" value={formData.name?.en} onChange={e => setFormData({...formData, name: {...formData.name!, en: e.target.value}})} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-pink-400" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t('name_es')}</label>
            <input required={!formData.name?.en && !formData.name?.ar} type="text" value={formData.name?.es} onChange={e => setFormData({...formData, name: {...formData.name!, es: e.target.value}})} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-pink-400" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t('name_ar')}</label>
            <input required={!formData.name?.en && !formData.name?.es} type="text" value={formData.name?.ar} onChange={e => setFormData({...formData, name: {...formData.name!, ar: e.target.value}})} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-pink-400 text-right" dir="rtl" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t('brand')}</label>
            <input required type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-pink-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t('category')}</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as ToyCategory})} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-pink-400 bg-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t('age')}</label>
              <select value={formData.age_range} onChange={e => setFormData({...formData, age_range: e.target.value as AgeRange})} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-pink-400 bg-white">
                {AGE_RANGES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t('material')}</label>
              <select value={formData.material} onChange={e => setFormData({...formData, material: e.target.value as Material})} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-pink-400 bg-white">
                {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t('pieces')}</label>
              <input required type="number" min="1" value={formData.number_of_pieces} onChange={e => setFormData({...formData, number_of_pieces: parseInt(e.target.value)})} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-pink-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t('copies_total')}</label>
              <input required type="number" min="1" value={formData.copies_total} onChange={e => setFormData({...formData, copies_total: parseInt(e.target.value)})} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-pink-400" />
            </div>
            {initialToy && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t('available')}</label>
                <input required type="number" min="0" max={formData.copies_total} value={formData.copies_available} onChange={e => setFormData({...formData, copies_available: parseInt(e.target.value)})} className="w-full border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-pink-400" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t('image_url')}</label>
            <div 
              className={`border-2 border-dashed rounded-xl p-4 text-center ${isDragging ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:bg-gray-50'} transition-colors relative`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
            >
              {formData.image ? (
                <div className="relative w-full h-32 mb-2">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-contain rounded-lg" referrerPolicy="no-referrer" />
                  <button type="button" onClick={() => setFormData({...formData, image: ''})} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100">
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ) : isUploading ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-2"></div>
                  <p className="text-sm text-gray-500">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">{t('drag_drop_image')}</p>
                  <label className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-50">
                    {t('upload_image')}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                        e.target.value = ''; // Reset so the same file can be selected again
                      }} 
                      disabled={isUploading} 
                    />
                  </label>
                </div>
              )}
              {uploadError && (
                <div className="mt-2 text-sm text-red-500 font-bold bg-red-50 p-2 rounded-lg border border-red-200">
                  {uploadError}
                </div>
              )}
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-1 font-bold uppercase">{t('or_paste_link')}</p>
                <input 
                  type="url" 
                  value={formData.image} 
                  onChange={e => setFormData({...formData, image: processImageUrl(e.target.value)})} 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-pink-400 text-sm" 
                  placeholder="https://..." 
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isUploading} className={`w-full text-white font-bold py-3 rounded-xl transition-colors ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF6B9E] hover:bg-pink-500'}`}>
              {initialToy ? t('save') : t('add_toy')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
