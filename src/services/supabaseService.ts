import { supabase } from '../supabase';
import { Toy, User, Loan } from '../types';

export const supabaseService = {
  // Listeners
  listenToToys: (callback: (toys: Toy[]) => void) => {
    if (!supabase) return () => {};
    
    // Initial fetch
    supabase.from('toys').select('*').then(({ data }) => {
      if (data) callback(data as Toy[]);
    });

    // Subscribe to changes
    const channel = supabase
      .channel('public:toys')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'toys' }, () => {
        supabase.from('toys').select('*').then(({ data }) => {
          if (data) callback(data as Toy[]);
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  listenToUsers: (callback: (users: User[]) => void) => {
    if (!supabase) return () => {};
    
    // Initial fetch
    supabase.from('users').select('*').then(({ data }) => {
      if (data) callback(data as User[]);
    });

    // Subscribe to changes
    const channel = supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        supabase.from('users').select('*').then(({ data }) => {
          if (data) callback(data as User[]);
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  listenToLoans: (callback: (loans: Loan[]) => void) => {
    if (!supabase) return () => {};
    
    // Initial fetch
    supabase.from('loans').select('*').then(({ data }) => {
      if (data) callback(data as Loan[]);
    });

    // Subscribe to changes
    const channel = supabase
      .channel('public:loans')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'loans' }, () => {
        supabase.from('loans').select('*').then(({ data }) => {
          if (data) callback(data as Loan[]);
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Toys
  saveToy: async (toy: Toy) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('toys').upsert(toy);
      if (error) throw error;
    } catch (error) {
      console.error("Error saving toy:", error);
      alert("Failed to save toy to database.");
    }
  },

  deleteToy: async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('toys').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting toy:", error);
      alert("Failed to delete toy.");
    }
  },

  // Users
  saveUser: async (user: User) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('users').upsert(user);
      if (error) throw error;
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user.");
    }
  },

  // Loans
  saveLoan: async (loan: Loan) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('loans').upsert(loan);
      if (error) throw error;
    } catch (error) {
      console.error("Error saving loan:", error);
      alert("Failed to save loan.");
    }
  },

  updateLoan: async (id: string, data: Partial<Loan>) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('loans').update(data).eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error("Error updating loan:", error);
      alert("Failed to update loan.");
    }
  },

  // Storage
  uploadImage: async (file: File): Promise<string> => {
    if (!supabase) throw new Error("Supabase is not configured");
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('toys')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Upload error details:", uploadError);
      throw new Error(uploadError.message || "Failed to upload image");
    }

    const { data } = supabase.storage.from('toys').getPublicUrl(fileName);
    return data.publicUrl;
  }
};
