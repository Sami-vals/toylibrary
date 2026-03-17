import React, { useState } from 'react';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';

export default function Login() {
  const { t } = useTranslation();
  const { login, signup, setLanguage, language, currentUser } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(email);
    } else {
      signup(name, email);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await authService.signInWithGoogle();
    } catch (err) {
      console.error('Google sign-in failed:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  React.useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-white relative">
      <Link to="/" className="absolute top-6 left-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
        <ArrowLeft className="w-6 h-6 text-slate-900" />
      </Link>
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-bold text-center mb-2">
          Swapie <span className="text-gray-400 font-normal text-xl">{t('online_toy_library')}</span>
        </h1>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full mt-8 flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {googleLoading ? t('loading') || 'Loading...' : t('sign_in_with_google') || 'Sign in with Google'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mt-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-400 font-medium">{t('or') || 'or'}</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-teal-600 outline-none transition-colors"
                placeholder="Your Name"
                required={!isLogin}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-teal-600 outline-none transition-colors"
              placeholder="family@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
            <input
              type="password"
              className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-teal-600 outline-none transition-colors"
              placeholder="••••••••"
              defaultValue="password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-full font-semibold text-lg hover:bg-slate-800 transition-colors mt-8"
          >
            {isLogin ? t('login') : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-teal-600 font-medium hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-full ${language === 'en' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100'}`}>EN</button>
          <button onClick={() => setLanguage('es')} className={`px-3 py-1 rounded-full ${language === 'es' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100'}`}>ES</button>
          <button onClick={() => setLanguage('ar')} className={`px-3 py-1 rounded-full ${language === 'ar' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100'}`}>AR</button>
        </div>
      </div>
    </div>
  );
}
