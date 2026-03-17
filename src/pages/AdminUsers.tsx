import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { ArrowLeft, User, Mail, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminUsers() {
  const { t } = useTranslation();
  const { users } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm flex items-center border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 ml-2">{t('manage_users')}</h1>
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
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm mb-1">{user.name}</h3>
                <div className="flex items-center text-xs text-gray-500 mb-1">
                  <Mail className="w-3 h-3 mr-1" />
                  {user.email}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                    user.role === 'admin' || user.email === 'sami@viajealasostenibilidad.org' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role === 'admin' || user.email === 'sami@viajealasostenibilidad.org' ? t('admin') : t('active_member')}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {user.is_active ? t('active') : t('inactive')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
