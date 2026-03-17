import { Outlet, Link, useLocation } from 'react-router-dom';
import { Car, User, Shield, BookOpen } from 'lucide-react';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const location = useLocation();
  const { currentUser } = useStore();
  const { t } = useTranslation();

  const navItems = [
    { path: '/', icon: <Car className="w-6 h-6" />, label: t('toys') },
    { path: '/my-loans', icon: <BookOpen className="w-6 h-6" />, label: t('my_loans') },
    { path: '/account', icon: <User className="w-6 h-6" />, label: t('account') },
  ];

  if (currentUser?.role === 'admin' || currentUser?.email === 'sami@viajealasostenibilidad.org') {
    navItems.push({ path: '/admin', icon: <Shield className="w-6 h-6" />, label: t('admin') });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-[#FFFBF7] min-h-screen shadow-2xl relative flex flex-col font-sans text-[#1E293B]">
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#111111] rounded-t-[2rem] flex justify-around items-center py-4 px-6 z-50">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/catalog');
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex flex-col items-center justify-center space-y-1 ${
                  isActive ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {item.path === '/admin' ? (
                  <div className="relative">
                    <Shield className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                    <div className="absolute -bottom-1 -right-1 bg-black rounded-full w-3 h-3 flex items-center justify-center">
                      <span className={`text-[8px] font-bold ${isActive ? 'text-yellow-400' : 'text-gray-500'}`}>e</span>
                    </div>
                  </div>
                ) : (
                  item.icon
                )}
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
