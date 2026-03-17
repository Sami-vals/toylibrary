import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useStore } from '../store';
import { format, parseISO } from 'date-fns';

export default function Notifications() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { loans, toys, users, currentUser } = useStore();

  // Generate notification events from loans
  const events: { id: string, type: 'borrow' | 'return', date: string, toyName: string, userName: string, isCurrentUser: boolean }[] = [];

  loans.forEach(loan => {
    // Only show events for current user, unless they are admin
    if (currentUser?.role !== 'admin' && loan.borrower_id !== currentUser?.id) return;

    const toy = toys.find(t => t.id === loan.toy_id);
    const user = users.find(u => u.id === loan.borrower_id);
    
    if (!toy || !user) return;

    const toyName = toy.name[i18n.language as keyof typeof toy.name] || toy.name.en;
    const isCurrentUser = user.id === currentUser?.id;

    // Borrow event
    events.push({
      id: `${loan.id}-borrow`,
      type: 'borrow',
      date: loan.checkout_date,
      toyName,
      userName: user.name,
      isCurrentUser
    });

    // Return event
    if (loan.status === 'returned' && loan.actual_return_date) {
      events.push({
        id: `${loan.id}-return`,
        type: 'return',
        date: loan.actual_return_date,
        toyName,
        userName: user.name,
        isCurrentUser
      });
    }
  });

  // Sort events by date descending
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm flex items-center border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 ml-2">{t('notifications')}</h1>
      </div>

      <div className="p-4">
        {events.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-[#F0EBE1] p-8 text-center flex flex-col items-center justify-center mt-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">{t('no_notifications')}</h2>
            <p className="text-sm text-gray-500">{t('no_notifications_desc')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${event.type === 'borrow' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'}`}>
                  {event.type === 'borrow' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900 font-medium">
                    {event.type === 'borrow' 
                      ? (event.isCurrentUser ? t('you_borrowed', { toy: event.toyName }) : t('borrowed_toy', { user: event.userName, toy: event.toyName }))
                      : (event.isCurrentUser ? t('you_returned', { toy: event.toyName }) : t('returned_toy', { user: event.userName, toy: event.toyName }))
                    }
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(parseISO(event.date), 'MMM dd, yyyy - HH:mm')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
