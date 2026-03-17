export type Role = 'admin' | 'user';
export type Language = 'en' | 'es' | 'ar';
export type ToyCategory =
  | 'Construction'
  | 'Symbolic / Role Play'
  | 'Babies'
  | 'Puzzles'
  | 'Crafts'
  | 'Theater / Drama'
  | 'Instruments'
  | 'Sports'
  | 'Open-Ended'
  | 'Board Games'
  | 'Literacy / Reading'
  | 'Vehicles / Cars'
  | 'Other';

export type AgeRange = '0-2' | '3-5' | '6-8' | '9-12' | '12+';
export type Material = 'Plastic' | 'Wood' | 'Metal' | 'Fabric' | 'Cardboard' | 'Mixed' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  preferred_language: Language;
  is_active: boolean;
  created_at: string;
}

export interface Toy {
  id: string;
  name: {
    en: string;
    es: string;
    ar: string;
  };
  brand: string;
  category: ToyCategory;
  age_range: AgeRange;
  material: Material;
  number_of_pieces: number;
  copies_total: number;
  copies_available: number;
  image: string;
  qr_code_value: string;
  total_checkouts: number;
  is_active: boolean;
}

export type LoanStatus = 'checked_out' | 'returned' | 'overdue';

export interface Loan {
  id: string;
  toy_id: string;
  copy_number: number;
  borrower_id: string;
  checkout_date: string;
  expected_return_date: string;
  actual_return_date: string | null;
  status: LoanStatus;
  notified_overdue: boolean;
}
