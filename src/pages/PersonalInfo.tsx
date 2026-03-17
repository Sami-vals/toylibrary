import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Shield } from 'lucide-react';

export default function PersonalInfo() {
  const { t } = useTranslation();
  const { currentUser } = useStore();
  const navigate = useNavigate();

  if (!currentUser) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm flex items-center border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 ml-2">{t('personal_info')}</h1>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-sm border border-[#F0EBE1] p-6 space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-4xl font-bold">
              {currentUser.name.charAt(0)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{t('name')}</label>
            <div className="flex items-center text-slate-900 font-medium">
              <User className="w-5 h-5 mr-3 text-gray-400" />
              {currentUser.name}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{t('email')}</label>
            <div className="flex items-center text-slate-900 font-medium">
              <Mail className="w-5 h-5 mr-3 text-gray-400" />
              {currentUser.email}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{t('role')}</label>
            <div className="flex items-center text-slate-900 font-medium">
              <Shield className="w-5 h-5 mr-3 text-gray-400" />
              {currentUser.role === 'admin' || currentUser.email === 'sami@viajealasostenibilidad.org' ? t('admin') : t('active_member')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
