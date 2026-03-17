import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Bell, CreditCard, ChevronRight, BookOpen } from 'lucide-react';

export default function Account() {
  const { t } = useTranslation();
  const { currentUser, logout, setLanguage, language } = useStore();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col px-6 pt-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#1E293B]">{t('account')}</h1>
      </div>

      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-2xl font-bold">
          {currentUser.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1E293B]">{currentUser.name}</h2>
          <p className="text-gray-500">{currentUser.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#F0EBE1] p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-gray-400 text-sm uppercase tracking-wider">{t('library_status')}</span>
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
            {currentUser.role === 'admin' || currentUser.email === 'sami@viajealasostenibilidad.org' ? t('admin') : t('active_member')}
          </span>
        </div>
        <h3 className="text-xl font-bold text-[#1E293B] mb-1">{t('community_library')}</h3>
        <p className="text-gray-500 text-sm mb-6">{t('free_toy_exchange')}</p>
        
        <button 
          onClick={() => navigate('/my-loans')} 
          className="w-full bg-[#FF6B9E] text-white rounded-2xl py-4 flex items-center justify-center font-bold shadow-lg shadow-pink-200 hover:bg-pink-500 transition-colors"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          {t('my_loans')}
        </button>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2">{t('settings')}</h3>
        
        <div className="bg-white rounded-3xl shadow-sm border border-[#F0EBE1] overflow-hidden">
          <button onClick={() => navigate('/account/personal-info')} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-[#F0EBE1]">
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-4" />
              <span className="font-bold text-[#1E293B]">{t('personal_info')}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
          <button onClick={() => navigate('/account/payment-methods')} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-[#F0EBE1]">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-gray-400 mr-4" />
              <span className="font-bold text-[#1E293B]">{t('payment_methods')}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
          <button onClick={() => navigate('/account/notifications')} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-gray-400 mr-4" />
              <span className="font-bold text-[#1E293B]">{t('notifications')}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2">{t('language')}</h3>
        <div className="bg-white rounded-3xl shadow-sm border border-[#F0EBE1] p-2 flex">
          <button onClick={() => setLanguage('en')} className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-colors ${language === 'en' ? 'bg-[#FF6B9E] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>English</button>
          <button onClick={() => setLanguage('es')} className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-colors ${language === 'es' ? 'bg-[#FF6B9E] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Español</button>
          <button onClick={() => setLanguage('ar')} className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-colors ${language === 'ar' ? 'bg-[#FF6B9E] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>العربية</button>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center p-4 bg-white border border-red-200 text-red-500 rounded-2xl font-bold hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-5 h-5 mr-2" />
        {t('logout')}
      </button>
    </div>
  );
}
