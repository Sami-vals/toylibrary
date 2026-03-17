import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { differenceInDays, parseISO } from 'date-fns';

export default function Return() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { toys, loans, returnToy, currentUser } = useStore();

  const toy = toys.find(t => t.id === id || t.qr_code_value === id);

  if (!toy) return <div className="p-8 text-center">{t('toy_not_found')}</div>;

  const name = toy.name[i18n.language as keyof typeof toy.name];

  const activeLoan = loans.find(l => l.toy_id === toy.id && l.borrower_id === currentUser?.id && (l.status === 'checked_out' || l.status === 'overdue'));
  const daysBorrowed = activeLoan ? differenceInDays(new Date(), parseISO(activeLoan.checkout_date)) : 0;
  
  // Allow admins to bypass this rule, otherwise enforce 7 days
  const canReturn = currentUser?.role === 'admin' || daysBorrowed >= 7;

  const handleReturn = () => {
    if (currentUser && canReturn) {
      returnToy(toy.id, currentUser.id);
      navigate('/my-loans', { state: { success: true, toyName: name, date: t('today') } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm flex items-center border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 ml-2">{t('return_confirm')}</h1>
      </div>

      <div className="p-6 flex flex-col items-center">
        <div className="w-48 h-48 bg-white rounded-3xl shadow-lg overflow-hidden mb-8 relative">
          <img src={getImageUrl(toy.image)} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute top-2 right-2 bg-blue-500 text-white p-1.5 rounded-full shadow-md">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">{name}</h2>
        <p className="text-gray-500 text-center mb-8">{toy.brand}</p>

        {!canReturn && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start w-full max-w-md mb-8">
            <AlertCircle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-orange-800">{t('return_too_early')}</h3>
              <p className="text-sm text-orange-700 mt-1">
                {t('return_too_early_desc', { days: daysBorrowed })}
              </p>
            </div>
          </div>
        )}
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
            onClick={handleReturn}
            disabled={!canReturn}
            className={`flex-1 py-4 rounded-full font-bold text-lg transition-colors shadow-lg ${
              canReturn 
                ? 'bg-slate-900 text-white hover:bg-slate-800' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            }`}
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
