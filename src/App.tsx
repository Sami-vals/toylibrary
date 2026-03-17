import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import { supabaseService } from './services/supabaseService';
import { authService } from './services/authService';
import { isSupabaseConfigured } from './supabase';
import './i18n';
import { useTranslation } from 'react-i18next';

import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ToyDetail from './pages/ToyDetail';
import MyLoans from './pages/MyLoans';
import Account from './pages/Account';
import QRScanner from './pages/QRScanner';
import Checkout from './pages/Checkout';
import Return from './pages/Return';
import AdminDashboard from './pages/AdminDashboard';
import AdminToys from './pages/AdminToys';
import AdminUsers from './pages/AdminUsers';
import PersonalInfo from './pages/PersonalInfo';
import PaymentMethods from './pages/PaymentMethods';
import Notifications from './pages/Notifications';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { currentUser } = useStore();
  
  if (!currentUser) return <Navigate to="/login" replace />;
  if (requireAdmin && currentUser.role !== 'admin') return <Navigate to="/" replace />;
  
  return <>{children}</>;
}

export default function App() {
  const { language, currentUser, setUsers, setToys, setLoans, setSupabaseInitialized, loginWithGoogle } = useStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase is not configured. Data will be saved locally.');
      return;
    }

    const unsubscribeToys = supabaseService.listenToToys(setToys);
    const unsubscribeUsers = supabaseService.listenToUsers(setUsers);
    const unsubscribeLoans = supabaseService.listenToLoans(setLoans);
    
    setSupabaseInitialized(true);

    return () => {
      unsubscribeToys();
      unsubscribeUsers();
      unsubscribeLoans();
    };
  }, []);

  // Listen for Supabase Auth state changes (Google OAuth redirect)
  useEffect(() => {
    let isHandlingSession = false;

    const handleSession = async (session: any) => {
      if (!session?.user || isHandlingSession) return;
      
      const user = session.user;
      const email = user.email || '';
      
      // Prevent rapid double executions
      isHandlingSession = true;
      try {
        const name = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0];
        await loginWithGoogle(email, name);
      } finally {
        isHandlingSession = false;
      }
    };

    const unsubscribe = authService.onAuthStateChange((event, session) => {
      if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && session) {
        handleSession(session);
      } else if (event === 'SIGNED_IN' && session) {
        handleSession(session);
      }
    });

    return unsubscribe;
  }, [loginWithGoogle]);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language, i18n]);

  useEffect(() => {
    if (currentUser?.email === 'sami@viajealasostenibilidad.org' && currentUser.role !== 'admin') {
      useStore.setState((state) => ({
        currentUser: { ...state.currentUser!, role: 'admin' },
        users: state.users.map(u => u.email === 'sami@viajealasostenibilidad.org' ? { ...u, role: 'admin' } : u)
      }));
    }
  }, [currentUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="toy/:id" element={<ToyDetail />} />
          
          <Route path="my-loans" element={
            <ProtectedRoute>
              <MyLoans />
            </ProtectedRoute>
          } />
          
          <Route path="account" element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } />
          
          <Route path="account/personal-info" element={
            <ProtectedRoute>
              <PersonalInfo />
            </ProtectedRoute>
          } />
          
          <Route path="account/payment-methods" element={
            <ProtectedRoute>
              <PaymentMethods />
            </ProtectedRoute>
          } />
          
          <Route path="account/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          
          <Route path="admin/toys" element={
            <ProtectedRoute requireAdmin>
              <AdminToys />
            </ProtectedRoute>
          } />
          
          <Route path="admin/users" element={
            <ProtectedRoute requireAdmin>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="admin" element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Route>
        
        <Route path="/scan" element={
          <ProtectedRoute>
            <QRScanner />
          </ProtectedRoute>
        } />
        
        <Route path="/checkout/:id" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        
        <Route path="/return/:id" element={
          <ProtectedRoute>
            <Return />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
