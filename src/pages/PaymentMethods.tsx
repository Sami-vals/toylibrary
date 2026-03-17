import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Plus } from 'lucide-react';

export default function PaymentMethods() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-900" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 ml-2">{t('payment_methods')}</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-sm border border-[#F0EBE1] p-8 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">{t('no_payment_methods')}</h2>
          <p className="text-sm text-gray-500 mb-6">{t('add_payment_method_desc')}</p>
          
          <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center">
            <Plus className="w-5 h-5 mr-2" />
            {t('add_payment_method')}
          </button>
        </div>
      </div>
    </div>
  );
}
