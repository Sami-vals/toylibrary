import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { Search, Heart, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { ToyCategory, AgeRange } from '../types';
import { getImageUrl } from '../utils/imageUtils';

export default function Catalog() {
  const { t, i18n } = useTranslation();
  const { toys } = useStore();
  const [search, setSearch] = useState('');
  const [selectedAge, setSelectedAge] = useState<AgeRange | ''>('');

  const filteredToys = toys.filter(toy => {
    const matchesSearch = toy.name[i18n.language as keyof typeof toy.name]?.toLowerCase().includes(search.toLowerCase());
    const matchesAge = selectedAge ? toy.age_range === selectedAge : true;
    return matchesSearch && matchesAge;
  });

  const ageRanges: AgeRange[] = ['0-2', '3-5', '6-8', '9-12', '12+'];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">{t('catalog')}</h1>
        <div className="flex items-center space-x-3">
          <Search className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <button className="flex items-center text-sm font-medium text-gray-700">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {t('filter')} (3)
          </button>
          <button className="flex items-center text-sm font-medium text-gray-700">
            {t('popular_first')}
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="mb-2 text-sm text-gray-500">{t('choose_age_group')}</div>
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setSelectedAge('')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedAge === '' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {t('all')}
          </button>
          {ageRanges.map(age => (
            <button
              key={age}
              onClick={() => setSelectedAge(age)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedAge === age ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {age}
            </button>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
          <span>{t('items_found', { count: filteredToys.length })}</span>
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded-sm"></div>
            <div className="w-4 h-4 bg-gray-200 rounded-sm"></div>
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        {filteredToys.map(toy => (
          <Link key={toy.id} to={`/toy/${toy.id}`} className="bg-white rounded-2xl p-3 shadow-sm flex flex-col relative group">
            <button className="absolute top-3 right-3 z-10 text-gray-300 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <div className="aspect-square w-full mb-3 rounded-xl overflow-hidden bg-gray-50 relative">
              <img src={getImageUrl(toy.image)} alt={toy.name[i18n.language as keyof typeof toy.name]} className="w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
              {toy.copies_available === 0 && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
                  <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">{t('out_of_stock')}</span>
                </div>
              )}
            </div>
            <h3 className="font-bold text-sm text-slate-900 line-clamp-2 mb-1 uppercase tracking-wide">
              {toy.name[i18n.language as keyof typeof toy.name]}
            </h3>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">{t('toys_available', { count: toy.copies_available })}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 px-6 text-center">
        <p className="text-gray-500 text-sm mb-4">{t('love_our_toys')}</p>
        <Link to="/login" className="block w-full text-center bg-slate-900 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-slate-800 transition-colors">
          {t('get_subscription')}
        </Link>
      </div>
    </div>
  );
}
