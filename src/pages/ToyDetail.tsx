import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { ArrowLeft, Heart, Share2, Info } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

export default function ToyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { toys } = useStore();

  const toy = toys.find(t => t.id === id || t.qr_code_value === id);

  if (!toy) return <div className="p-8 text-center">{t('toy_not_found')}</div>;

  const name = toy.name[i18n.language as keyof typeof toy.name];

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 truncate px-4">{name}</h1>
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 className="w-5 h-5 text-slate-900" />
          </button>
        </div>
      </div>

      <div className="w-full aspect-square bg-gray-50 relative">
        <img src={getImageUrl(toy.image)} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-slate-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-slate-900 leading-tight pr-4">{name}</h2>
          <button className="p-3 bg-red-50 rounded-full text-red-500 hover:bg-red-100 transition-colors flex-shrink-0">
            <Heart className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-500 font-medium">{t('brand')}</span>
            <span className="font-semibold text-slate-900">{toy.brand}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-500 font-medium">{t('age')}</span>
            <span className="font-semibold text-slate-900 bg-gray-100 px-3 py-1 rounded-full text-sm">{t('years_old', { age: toy.age_range })}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-500 font-medium">{t('skills')}</span>
            <div className="flex space-x-2">
              <span className="font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full text-sm">{t('motor_skills')}</span>
              <span className="font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full text-sm">{t('erudition')}</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-500 font-medium">{t('material')}</span>
            <span className="font-semibold text-slate-900">{toy.material}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-500 font-medium">{t('pieces')}</span>
            <span className="font-semibold text-slate-900">{toy.number_of_pieces}</span>
          </div>
        </div>

        <div className="flex items-center p-4 bg-teal-50 rounded-2xl mb-8">
          <Info className="w-6 h-6 text-teal-600 mr-3 flex-shrink-0" />
          <p className="text-sm text-teal-900 font-medium">
            {t('toy_availability_info', {
              status: toy.copies_available > 0 ? t('available_status') : t('out_of_stock_status'),
              available: toy.copies_available,
              total: toy.copies_total
            })}
          </p>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex justify-center z-20">
          <div className="w-full max-w-md flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">{name.substring(0, 15)}...</span>
              <span className="font-bold text-slate-900">{t('toys_available', { count: toy.copies_available })}</span>
            </div>
            <button 
              onClick={() => navigate('/scan')}
              disabled={toy.copies_available === 0}
              className={`px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg ${
                toy.copies_available > 0 
                  ? 'bg-slate-900 text-white hover:bg-slate-800' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {t('scan_to_borrow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
