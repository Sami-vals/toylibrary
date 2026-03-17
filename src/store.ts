import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Toy, Loan, Language } from './types';
import { addDays, formatISO } from 'date-fns';
import { supabaseService } from './services/supabaseService';
import { supabase, isSupabaseConfigured } from './supabase';

interface AppState {
  users: User[];
  toys: Toy[];
  loans: Loan[];
  currentUser: User | null;
  language: Language;
  isSupabaseInitialized: boolean;
  
  setLanguage: (lang: Language) => void;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  loginWithGoogle: (email: string, name: string) => Promise<void>;
  logout: () => void;
  
  addToy: (toy: Toy) => void;
  updateToy: (toy: Toy) => void;
  deleteToy: (id: string) => void;
  
  checkoutToy: (toyId: string, userId: string) => void;
  returnToy: (toyId: string, userId: string) => void;

  // Internal actions for Supabase sync
  setUsers: (users: User[]) => void;
  setToys: (toys: Toy[]) => void;
  setLoans: (loans: Loan[]) => void;
  setSupabaseInitialized: (status: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: [],
      toys: [],
      loans: [],
      currentUser: null,
      language: 'en',
      isSupabaseInitialized: false,

      setLanguage: (lang) => set({ language: lang }),
      
      setUsers: (users) => {
        set((state) => {
          // Update currentUser if their data changed in Firestore
          const updatedCurrentUser = state.currentUser 
            ? users.find(u => u.id === state.currentUser!.id) || state.currentUser
            : null;
          
          return { users, currentUser: updatedCurrentUser };
        });
      },
      setToys: (toys) => set({ toys }),
      setLoans: (loans) => set({ loans }),
      setSupabaseInitialized: (status) => set({ isSupabaseInitialized: status }),
      
      login: (email) => {
        let user = get().users.find(u => u.email === email);
        if (user) {
          if (email === 'sami@viajealasostenibilidad.org' && user.role !== 'admin') {
            user = { ...user, role: 'admin' };
            if (isSupabaseConfigured) supabaseService.saveUser(user);
            else set(state => ({ users: state.users.map(u => u.id === user!.id ? user! : u) }));
          }
          set({ currentUser: user, language: user.preferred_language });
        } else if (email === 'sami@viajealasostenibilidad.org') {
          // Auto-create admin user if they don't exist
          const newUser: User = {
            id: `user-${Date.now()}`,
            name: 'Sami',
            email,
            role: 'admin',
            preferred_language: 'en',
            is_active: true,
            created_at: new Date().toISOString()
          };
          if (isSupabaseConfigured) supabaseService.saveUser(newUser);
          else set(state => ({ users: [...state.users, newUser] }));
          set({ currentUser: newUser, language: 'en' });
        } else {
          alert('User not found. Try signing up first.');
        }
      },
      
      signup: (name, email) => {
        const existingUser = get().users.find(u => u.email === email);
        if (existingUser) {
          alert('User already exists. Please log in.');
          return;
        }
        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          role: email === 'sami@viajealasostenibilidad.org' ? 'admin' : 'user',
          preferred_language: 'en',
          is_active: true,
          created_at: new Date().toISOString()
        };
        
        if (isSupabaseConfigured) supabaseService.saveUser(newUser);
        else set(state => ({ users: [...state.users, newUser] }));
        
        set({ currentUser: newUser, language: 'en' });
      },
      
      logout: () => set({ currentUser: null }),

      loginWithGoogle: async (email, name) => {
        // Double check if already logged in locally as this user
        if (get().currentUser?.email === email) return;

        let user = null;

        // Force check the database directly to avoid race conditions with local state syncing
        if (isSupabaseConfigured) {
          try {
            const { data } = await supabase.from('users').select('*').eq('email', email).limit(1);
            if (data && data.length > 0) user = data[0] as User;
          } catch (e) {
            console.error("Error fetching user during Google login:", e);
          }
        } else {
           user = get().users.find(u => u.email === email) || null;
        }

        if (user) {
          // User exists, log them in
          set({ currentUser: user, language: user.preferred_language });
        } else {
          // Create new user from Google OAuth
          const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            email,
            role: email === 'sami@viajealasostenibilidad.org' ? 'admin' : 'user',
            preferred_language: 'en',
            is_active: true,
            created_at: new Date().toISOString()
          };
          
          if (isSupabaseConfigured) await supabaseService.saveUser(newUser);
          else set(state => ({ users: [...state.users, newUser] }));
          
          set({ currentUser: newUser, language: 'en' });
        }
      },

      addToy: (toy) => {
        if (isSupabaseConfigured) supabaseService.saveToy(toy);
        else set(state => ({ toys: [...state.toys, toy] }));
      },
      
      updateToy: (updatedToy) => {
        if (isSupabaseConfigured) supabaseService.saveToy(updatedToy);
        else set(state => ({ toys: state.toys.map(t => t.id === updatedToy.id ? updatedToy : t) }));
      },
      
      deleteToy: (id) => {
        if (isSupabaseConfigured) supabaseService.deleteToy(id);
        else set(state => ({ toys: state.toys.filter(t => t.id !== id) }));
      },

      checkoutToy: (toyId, userId) => {
        const state = get();
        const toy = state.toys.find(t => t.id === toyId);
        if (!toy || toy.copies_available <= 0) return;

        const newLoan: Loan = {
          id: `loan-${Date.now()}`,
          toy_id: toyId,
          copy_number: toy.copies_total - toy.copies_available + 1,
          borrower_id: userId,
          checkout_date: formatISO(new Date()),
          expected_return_date: formatISO(addDays(new Date(), 14)),
          actual_return_date: null,
          status: 'checked_out',
          notified_overdue: false
        };

        const updatedToy = { 
          ...toy, 
          copies_available: toy.copies_available - 1, 
          total_checkouts: toy.total_checkouts + 1 
        };

        if (isSupabaseConfigured) {
          supabaseService.saveLoan(newLoan);
          supabaseService.saveToy(updatedToy);
        } else {
          set(state => ({
            loans: [...state.loans, newLoan],
            toys: state.toys.map(t => t.id === toyId ? updatedToy : t)
          }));
        }
      },

      returnToy: (toyId, userId) => {
        const state = get();
        const loan = state.loans.find(
          l => l.toy_id === toyId && l.borrower_id === userId && l.status === 'checked_out'
        );
        
        if (!loan) return;

        const toy = state.toys.find(t => t.id === toyId);
        if (!toy) return;

        if (isSupabaseConfigured) {
          supabaseService.updateLoan(loan.id, {
            status: 'returned',
            actual_return_date: formatISO(new Date())
          });

          supabaseService.saveToy({
            ...toy,
            copies_available: toy.copies_available + 1
          });
        } else {
          set(state => ({
            loans: state.loans.map(l => l.id === loan.id ? { ...l, status: 'returned', actual_return_date: formatISO(new Date()) } : l),
            toys: state.toys.map(t => t.id === toyId ? { ...t, copies_available: t.copies_available + 1 } : t)
          }));
        }
      }
    }),
    {
      name: 'toy-library-storage',
      partialize: (state) => ({ 
        users: state.users, 
        toys: state.toys, 
        loans: state.loans, 
        currentUser: state.currentUser,
        language: state.language
      }),
    }
  )
);
