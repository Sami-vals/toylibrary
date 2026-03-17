import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { Link, useLocation } from 'react-router-dom';
import { QrCode, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import { getImageUrl } from '../utils/imageUtils';

export default function MyLoans() {
  const { t, i18n } = useTranslation();
  const { loans, toys, currentUser } = useStore();
  const location = useLocation();

  const userLoans = loans.filter(l => l.borrower_id === currentUser?.id);
  const activeLoans = userLoans.filter(l => l.status === 'checked_out' || l.status === 'overdue');
  const returnedLoans = userLoans.filter(l => l.status === 'returned');

  const successMessage = location.state?.success;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm flex items-center justify-between border-b border-gray-100">
        <h1 className="text-xl font-bold text-slate-900">{t('my_loans')}</h1>
        <Link to="/scan" className="p-2 bg-teal-50 text-teal-600 rounded-full hover:bg-teal-100 transition-colors">
          <QrCode className="w-5 h-5" />
        </Link>
      </div>

      {successMessage && (
        <div className="m-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start">
          <CheckCircle2 className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-green-800">{t('success')}</h3>
            <p className="text-sm text-green-700 mt-1">
              {t('success_checkout', { toy: location.state.toyName, date: location.state.date })}
            </p>
          </div>
        </div>
      )}

      <div className="px-4 py-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">{t('active')} ({activeLoans.length})</h2>
        <div className="space-y-4">
          {activeLoans.length === 0 ? (
            <p className="text-gray-500 text-center py-8">{t('no_active_loans')}</p>
          ) : (
            activeLoans.map(loan => {
              const toy = toys.find(t => t.id === loan.toy_id);
              if (!toy) return null;
              
              const expectedReturn = parseISO(loan.expected_return_date);
              const isOverdue = isPast(expectedReturn);

              return (
                <div key={loan.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center relative overflow-hidden">
                  {isOverdue && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>}
                  <img src={getImageUrl(toy.image)} alt={toy.name[i18n.language as keyof typeof toy.name]} className="w-20 h-20 rounded-xl object-cover mr-4" referrerPolicy="no-referrer" />
                  <Link to={`/toy/${toy.id}`} className="flex-1 block">
                    <h3 className="font-bold text-slate-900 mb-1 hover:text-teal-600 transition-colors">{toy.name[i18n.language as keyof typeof toy.name]}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{t('due', { date: format(expectedReturn, 'MMM dd') })}</span>
                    </div>
                    {isOverdue ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {t('overdue')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {t('active')}
                      </span>
                    )}
                  </Link>
                  <Link to="/scan" className="ml-4 px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-md text-sm font-bold text-center">
                    {t('scan_to_return')}
                  </Link>
                </div>
              );
            })
          )}
        </div>

        <h2 className="text-lg font-bold text-slate-900 mt-8 mb-4">{t('returned')} ({returnedLoans.length})</h2>
        <div className="space-y-4 opacity-75">
          {returnedLoans.map(loan => {
            const toy = toys.find(t => t.id === loan.toy_id);
            if (!toy) return null;

            return (
              <div key={loan.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center">
                <img src={getImageUrl(toy.image)} alt={toy.name[i18n.language as keyof typeof toy.name]} className="w-16 h-16 rounded-xl object-cover mr-4 grayscale" referrerPolicy="no-referrer" />
                <Link to={`/toy/${toy.id}`} className="flex-1 block">
                  <h3 className="font-bold text-slate-900 mb-1 hover:text-teal-600 transition-colors">{toy.name[i18n.language as keyof typeof toy.name]}</h3>
                  <div className="text-sm text-gray-500">
                    {loan.actual_return_date ? t('returned_on', { date: format(parseISO(loan.actual_return_date), 'MMM dd, yyyy') }) : 'N/A'}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
