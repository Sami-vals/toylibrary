import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { Car, CheckCircle2, Clock, History, Shield, Plus, Search, LayoutGrid, Edit2, Trash2, Mail, Phone, Calendar, QrCode } from 'lucide-react';
import { useState } from 'react';
import ToyFormModal from '../components/ToyFormModal';
import QRCodeModal from '../components/QRCodeModal';
import { Toy } from '../types';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';

export default function AdminDashboard() {
  const { toys, loans, users, addToy, updateToy, deleteToy } = useStore();
  const { t, i18n } = useTranslation();
  const [toySearch, setToySearch] = useState('');
  
  const [isToyModalOpen, setIsToyModalOpen] = useState(false);
  const [editingToy, setEditingToy] = useState<Toy | undefined>(undefined);
  
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [qrName, setQrName] = useState('');

  const handleAddToy = () => {
    setEditingToy(undefined);
    setIsToyModalOpen(true);
  };

  const handleEditToy = (toy: Toy) => {
    setEditingToy(toy);
    setIsToyModalOpen(true);
  };

  const handleSaveToy = (toy: Toy) => {
    if (editingToy) {
      updateToy(toy);
    } else {
      addToy(toy);
    }
  };

  const handleDeleteToy = (id: string) => {
    if (window.confirm('Are you sure you want to delete this toy?')) {
      deleteToy(id);
    }
  };

  const handleShowQR = (toy: Toy) => {
    setQrValue(toy.qr_code_value);
    setQrName(toy.name.en);
    setIsQRModalOpen(true);
  };

  const totalToys = toys.reduce((acc, toy) => acc + toy.copies_total, 0);
  const availableToys = toys.reduce((acc, toy) => acc + toy.copies_available, 0);
  const checkedOut = loans.filter(l => l.status === 'checked_out' || l.status === 'overdue').length;
  const allCheckouts = toys.reduce((acc, toy) => acc + toy.total_checkouts, 0);

  const categoriesData = Object.entries(toys.reduce((acc, toy) => {
    let cat: string = toy.category;
    if (cat === 'Vehicles / Cars') cat = 'Vehicles';
    if (cat === 'Symbolic / Role Play') cat = 'Simbólico';
    acc[cat] = (acc[cat] || 0) + toy.copies_total;
    return acc;
  }, {} as Record<string, number>))
  .map(([name, value]) => ({ name: t(`categories.${name}`), value }))
  .sort((a, b) => b.value - a.value);

  const ageRangesData = Object.entries(toys.reduce((acc, toy) => {
    acc[toy.age_range] = (acc[toy.age_range] || 0) + toy.copies_total;
    return acc;
  }, {} as Record<string, number>))
  .map(([name, value]) => ({ name, value }))
  .sort((a, b) => b.value - a.value);

  const topBorrowedData = [...toys]
    .sort((a, b) => b.total_checkouts - a.total_checkouts)
    .slice(0, 5)
    .map(toy => ({ 
      name: toy.name[i18n.language as keyof typeof toy.name], 
      borrows: toy.total_checkouts 
    }));

  const COLORS = ['#FF6B9E', '#4ade80', '#fb923c', '#9fb3c8', '#a78bfa', '#fcd34d', '#38bdf8', '#f472b6'];

  const filteredToys = toys.filter(toy => 
    toy.name[i18n.language as keyof typeof toy.name]?.toLowerCase().includes(toySearch.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center">
        <div className="relative mr-3">
          <Shield className="w-8 h-8 text-pink-400 fill-pink-400" />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-4 h-4 flex items-center justify-center border border-pink-400">
            <span className="text-[10px] font-bold text-pink-400">e</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold">{t('admin_dashboard')}</h1>
      </div>

      <div className="px-6">
        {/* Library Overview */}
        <h2 className="text-lg font-bold mb-4">{t('library_overview')}</h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-[#F0EBE1] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Car className="w-16 h-16" /></div>
            <Car className="w-6 h-6 text-pink-400 mb-3" />
            <span className="text-3xl font-bold mb-1">{totalToys}</span>
            <span className="text-xs text-gray-400 font-medium">{t('total_toys')}</span>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-[#F0EBE1] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><CheckCircle2 className="w-16 h-16" /></div>
            <CheckCircle2 className="w-6 h-6 text-green-500 mb-3" />
            <span className="text-3xl font-bold mb-1">{availableToys}</span>
            <span className="text-xs text-gray-400 font-medium">{t('available')}</span>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-[#F0EBE1] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Clock className="w-16 h-16" /></div>
            <Clock className="w-6 h-6 text-orange-400 mb-3" />
            <span className="text-3xl font-bold mb-1">{checkedOut}</span>
            <span className="text-xs text-gray-400 font-medium">{t('checked_out')}</span>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-[#F0EBE1] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><History className="w-16 h-16" /></div>
            <History className="w-6 h-6 text-slate-400 mb-3" />
            <span className="text-3xl font-bold mb-1">{allCheckouts}</span>
            <span className="text-xs text-gray-400 font-medium">{t('all_checkouts')}</span>
          </motion.div>
        </motion.div>

        {/* Currently Borrowed Toys */}
        <h2 className="text-lg font-bold mb-4">{t('currently_borrowed_toys')}</h2>
        <div className="bg-white rounded-3xl shadow-sm border border-[#F0EBE1] p-6 mb-8">
          <div className="space-y-4">
            {loans.filter(l => l.status === 'checked_out' || l.status === 'overdue').length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">{t('no_active_loans')}</p>
            ) : (
              loans.filter(l => l.status === 'checked_out' || l.status === 'overdue').map(loan => {
                const toy = toys.find(t => t.id === loan.toy_id);
                const user = users.find(u => u.id === loan.borrower_id);
                if (!toy || !user) return null;
                return (
                  <div key={loan.id} className="flex items-center border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Clock className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{toy.name[i18n.language as keyof typeof toy.name]}</h3>
                      <p className="text-xs text-gray-500">{t('borrowed_by')}: <span className="font-bold text-slate-700">{user.name}</span></p>
                      <p className="text-xs text-gray-400">{t('due')}: {new Date(loan.expected_return_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Charts Section */}
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          
          {/* Toys by Category Chart */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-lg font-bold mb-4">{t('toys_by_category')}</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-[#F0EBE1] p-6 pb-2">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoriesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-2 mb-4">
                {categoriesData.map((entry, index) => (
                  <div key={index} className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {entry.name} ({entry.value})
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Toys by Age Range Chart */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-lg font-bold mb-4">{t('toys_by_age')}</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-[#F0EBE1] p-6 pr-8">
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageRangesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" name="Toys" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={30}>
                      {ageRangesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index+1) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Most Borrowed Toys Chart */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-lg font-bold mb-4">{t('most_borrowed')}</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-[#F0EBE1] p-6 pr-8">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topBorrowedData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569' }} width={100} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="borrows" name={t('borrows')} fill="#fb923c" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Most Active Borrowers */}
        <h2 className="text-lg font-bold mb-4">{t('most_active_borrowers')}</h2>
        <div className="bg-white rounded-3xl shadow-sm border border-[#F0EBE1] p-6 mb-8">
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-400 mr-4"></div>
              <span className="text-sm text-gray-600 font-medium">1. Mahmoud Albadarin</span>
              <span className="text-sm font-bold ml-auto">1 {t('toys')}</span>
            </div>
          </div>
        </div>

        {/* Most Popular Categories */}
        <h2 className="text-lg font-bold mb-4">{t('most_popular_categories')}</h2>
        <div className="bg-white rounded-3xl shadow-sm border border-[#F0EBE1] p-6 mb-8">
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-4"></div>
              <span className="text-sm text-gray-600 font-medium">{t('categories.Construction')}</span>
              <span className="text-sm font-bold ml-auto">1 {t('borrows')}</span>
            </div>
          </div>
        </div>

        {/* Registered Users */}
        <h2 className="text-lg font-bold mb-4">{t('registered_users')} ({users.length})</h2>
        <div className="bg-white rounded-3xl shadow-sm border border-[#F0EBE1] p-6 mb-8">
          {users.map(user => (
            <div key={user.id} className="flex items-start border-b border-gray-100 last:border-0 pb-4 last:pb-0 mb-4 last:mb-0">
              <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Shield className="w-5 h-5 text-pink-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900">{user.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                  </div>
                  { (user.role === 'admin' || user.email === 'sami@viajealasostenibilidad.org') && (
                    <span className="bg-[#FF6B9E] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">{t('admin')}</span>
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-400 mb-1">
                  <Phone className="w-3 h-3 mr-2" />
                  123456789
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <Calendar className="w-3 h-3 mr-2" />
                  {t('joined')}: {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Toy Management */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{t('toy_management')} ({totalToys})</h2>
          <button 
            onClick={handleAddToy}
            className="bg-[#FF6B9E] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center hover:bg-pink-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t('add_toy')}
          </button>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder={t('search_toys_admin')} 
            value={toySearch}
            onChange={(e) => setToySearch(e.target.value)}
            className="w-full bg-white border border-[#F0EBE1] rounded-full py-3 pl-12 pr-4 outline-none focus:border-pink-400 transition-colors"
          />
        </div>

        <div className="space-y-4 mb-8">
          {filteredToys.map(toy => (
            <div key={toy.id} className="bg-white rounded-3xl shadow-sm border border-[#F0EBE1] p-5 relative">
              <div className="absolute top-5 right-5 flex space-x-3">
                <button onClick={() => handleShowQR(toy)} className="text-slate-400 hover:text-slate-600"><QrCode className="w-5 h-5" /></button>
                <button onClick={() => handleEditToy(toy)} className="text-blue-500 hover:text-blue-600"><Edit2 className="w-5 h-5" /></button>
                <button onClick={() => handleDeleteToy(toy.id)} className="text-red-500 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
              </div>
              
              <h3 className="font-bold text-slate-900 mb-3 pr-24">{toy.name[i18n.language as keyof typeof toy.name]}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  {t(`categories.${toy.category}`)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-4 h-4 flex items-center justify-center mr-2">
                    <span className="text-xs font-bold">@</span>
                  </div>
                  {toy.age_range}
                </div>
              </div>

              {toy.copies_available > 0 ? (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500 text-white text-[10px] font-bold uppercase">
                  {t('available')}
                </div>
              ) : (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase">
                  {t('checked_out')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <ToyFormModal 
        isOpen={isToyModalOpen} 
        onClose={() => setIsToyModalOpen(false)} 
        onSave={handleSaveToy} 
        initialToy={editingToy} 
      />
      
      <QRCodeModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        value={qrValue} 
        name={qrName} 
      />
    </div>
  );
}
