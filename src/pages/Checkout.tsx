import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { addDays, format } from 'date-fns';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { toys, checkoutToy, currentUser } = useStore();

  const toy = toys.find(t => t.id === id || t.qr_code_value === id);

  if (!toy) return <div className="p-8 text-center">{t('toy_not_found')}</div>;

  const name = toy.name[i18n.language as keyof typeof toy.name];
  const expectedReturnDate = addDays(new Date(), 14);

  const handleCheckout = () => {
    if (currentUser && toy.copies_available > 0) {
      checkoutToy(toy.id, currentUser.id);
      navigate('/my-loans', { state: { success: true, toyName: name, date: format(expectedReturnDate, 'MMM dd, yyyy') } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm flex items-center border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 ml-2">{t('checkout_confirm')}</h1>
      </div>

      <div className="p-6 flex flex-col items-center">
        <div className="w-48 h-48 bg-white rounded-3xl shadow-lg overflow-hidden mb-8 relative">
          <img src={getImageUrl(toy.image)} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute top-2 right-2 bg-teal-500 text-white p-1.5 rounded-full shadow-md">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">{name}</h2>
        <p className="text-gray-500 text-center mb-8">{toy.brand}</p>

        <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-500 font-medium">{t('expected_return')}</span>
            <span className="font-bold text-slate-900">{format(expectedReturnDate, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-500 font-medium">{t('loan_duration')}</span>
            <span className="font-bold text-slate-900">{t('14_days')}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex justify-center z-20">
        <div className="w-full max-w-md flex space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex-1 py-4 rounded-full font-bold text-lg bg-gray-100 text-slate-900 hover:bg-gray-200 transition-colors"
          >
            {t('cancel')}
          </button>
          <button 
            onClick={handleCheckout}
            disabled={toy.copies_available === 0}
            className={`flex-1 py-4 rounded-full font-bold text-lg transition-colors shadow-lg ${
              toy.copies_available > 0 
                ? 'bg-slate-900 text-white hover:bg-slate-800' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
