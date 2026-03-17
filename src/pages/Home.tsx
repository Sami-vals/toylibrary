import { useState } from 'react';
import { useStore } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import { Car, CheckCircle2, Clock, Bell, QrCode, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../utils/imageUtils';

export default function Home() {
  const { toys, loans, currentUser } = useStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'available' | 'out'>('all');

  const totalToys = toys.reduce((acc, toy) => acc + toy.copies_total, 0);
  const availableToys = toys.reduce((acc, toy) => acc + toy.copies_available, 0);
  const outToys = totalToys - availableToys;

  const filteredToys = toys.filter(toy => {
    const matchesSearch = toy.name[i18n.language as keyof typeof toy.name]?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ? true : 
                          filter === 'available' ? toy.copies_available > 0 : 
                          toy.copies_available === 0;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col px-6 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Car className="w-8 h-8 text-pink-400 mr-3" />
          <h1 className="text-2xl font-bold text-[#1E293B]">{t('toy_library')}</h1>
        </div>
        {currentUser ? (
          <Link to="/account/notifications" className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="w-6 h-6" />
            {/* Optional: Add a red dot if there are unread notifications */}
            {loans.some(l => l.borrower_id === currentUser.id) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </Link>
        ) : (
          <Link to="/login" className="text-gray-500 hover:text-gray-800 font-bold text-sm">
            {t('login')}
          </Link>
        )}
      </div>

      <p className="text-gray-500 mb-6">{t('welcome', { name: currentUser?.name || t('guest') })}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 bg-white rounded-2xl shadow-sm border border-[#F0EBE1] p-4">
        <div className="flex flex-col items-center justify-center border-r border-gray-100">
          <Car className="w-5 h-5 text-pink-400 mb-2" />
          <span className="text-2xl font-bold mb-1">{totalToys}</span>
          <span className="text-[10px] text-gray-400 font-medium">{t('total')}</span>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-gray-100">
          <CheckCircle2 className="w-5 h-5 text-green-500 mb-2" />
          <span className="text-2xl font-bold mb-1">{availableToys}</span>
          <span className="text-[10px] text-gray-400 font-medium">{t('available')}</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Clock className="w-5 h-5 text-red-500 mb-2" />
          <span className="text-2xl font-bold mb-1">{outToys}</span>
          <span className="text-[10px] text-gray-400 font-medium">{t('out')}</span>
        </div>
      </div>

      {/* Quick Scan Button */}
      <Link to="/scan" className="w-full bg-[#FF6B9E] text-white rounded-2xl py-4 px-6 flex items-center justify-center shadow-lg shadow-pink-200 mb-6 relative overflow-hidden">
        <div className="flex items-center space-x-2">
          <QrCode className="w-6 h-6" />
          <span className="font-bold text-lg">{t('quick_scan')}</span>
        </div>
        <span className="absolute bottom-1 right-3 text-[10px] font-medium opacity-80">{t('borrow_or_return')}</span>
      </Link>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder={t('search_toys')} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#F0EBE1] rounded-full py-3 pl-12 pr-4 outline-none focus:border-pink-400 transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setFilter('all')}
          className={`flex items-center px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-[#FF6B9E] text-white' : 'bg-white border border-[#F0EBE1] text-gray-600'}`}
        >
          <Car className="w-4 h-4 mr-2" />
          {t('all_toys')}
        </button>
        <button 
          onClick={() => setFilter('available')}
          className={`flex items-center px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === 'available' ? 'bg-[#FF6B9E] text-white' : 'bg-white border border-[#F0EBE1] text-gray-600'}`}
        >
          <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" />
          {t('available')}
        </button>
        <button 
          onClick={() => setFilter('out')}
          className={`flex items-center px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === 'out' ? 'bg-[#FF6B9E] text-white' : 'bg-white border border-[#F0EBE1] text-gray-600'}`}
        >
          <Clock className="w-4 h-4 mr-2 text-blue-500" />
          {t('checked_out')}
        </button>
      </div>

      {/* Toy Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredToys.map(toy => (
          <Link to={`/toy/${toy.id}`} key={toy.id} className="bg-white rounded-2xl shadow-sm border border-[#F0EBE1] overflow-hidden flex flex-col transition-transform hover:scale-[1.02]">
            <div className="aspect-square w-full bg-gray-50">
              <img src={getImageUrl(toy.image)} alt={toy.name[i18n.language as keyof typeof toy.name]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="p-3 flex flex-col flex-1">
              <h3 className="font-bold text-sm text-slate-900 line-clamp-1 mb-1">{toy.name[i18n.language as keyof typeof toy.name]}</h3>
              <p className="text-xs text-gray-400 mb-3">{t(`categories.${toy.category}`)}</p>
              
              <div className="mt-auto">
                {toy.copies_available > 0 ? (
                  <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-600 text-[10px] font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>
                    {t('available')}
                  </div>
                ) : (
                  <div className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></div>
                    {t('checked_out')}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
