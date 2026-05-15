import React, { useState } from 'react';
import { Car } from '../../types';
import MerchantDashboard from './MerchantDashboard';
import MerchantListings from './MerchantListings';
import CarForm from './CarForm';
import { LayoutDashboard, List, PlusCircle, LogOut } from 'lucide-react';

type MerchantTab = 'dashboard' | 'listings' | 'add';

interface Props {
  cars: Car[];
  onAddCar: (car: Car) => void;
  onUpdateCar: (car: Car) => void;
  onDeleteCar: (id: string) => void;
  onLogout: () => void;
}

const MerchantApp: React.FC<Props> = ({ cars, onAddCar, onUpdateCar, onDeleteCar, onLogout }) => {
  const [tab, setTab] = useState<MerchantTab>('dashboard');
  const [editCar, setEditCar] = useState<Car | null>(null);

  const handleEdit = (car: Car) => {
    setEditCar(car);
    setTab('add');
  };

  const handleSave = (car: Car) => {
    if (editCar) {
      onUpdateCar(car);
    } else {
      onAddCar(car);
    }
    setEditCar(null);
    setTab('listings');
  };

  const handleCancelForm = () => {
    setEditCar(null);
    setTab(tab === 'add' ? 'listings' : tab);
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#f1f5f9' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 px-5 py-4 flex justify-between items-center shadow-sm" style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div>
          <h1 className="font-black text-lg" style={{ color: '#1e293b' }}>
            Car<span style={{ color: '#1d4ed8' }}>+</span> 商家後台
          </h1>
          <p className="text-xs" style={{ color: '#94a3b8' }}>車輛銷售管理系統</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-xs font-medium" style={{ color: '#64748b' }}>即時同步中</span>
          <button
            onClick={onLogout}
            className="ml-3 p-2 rounded-xl transition-all hover:bg-slate-100"
            style={{ color: '#ef4444' }}
            title="登出"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: '72px' }}>
        {tab === 'dashboard' && (
          <MerchantDashboard
            cars={cars}
            onNavigateListings={() => setTab('listings')}
            onNavigateAdd={() => { setEditCar(null); setTab('add'); }}
          />
        )}
        {tab === 'listings' && (
          <MerchantListings
            cars={cars}
            onEdit={handleEdit}
            onDelete={onDeleteCar}
            onToggleAvail={car => onUpdateCar({ ...car, isAvailable: !car.isAvailable })}
            onAdd={() => { setEditCar(null); setTab('add'); }}
          />
        )}
        {tab === 'add' && (
          <CarForm
            initialCar={editCar}
            onSave={handleSave}
            onCancel={handleCancelForm}
          />
        )}
      </main>

      {/* Bottom Nav */}
      {tab !== 'add' && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 flex justify-around py-3 px-2"
          style={{ background: 'white', borderTop: '1px solid #e2e8f0', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}
        >
          <MNavBtn active={tab === 'dashboard'} onClick={() => setTab('dashboard')} icon={<LayoutDashboard size={22} />} label="總覽" />
          <MNavBtn active={tab === 'listings'} onClick={() => setTab('listings')} icon={<List size={22} />} label="車輛管理" />
          <button
            onClick={() => { setEditCar(null); setTab('add'); }}
            className="flex flex-col items-center gap-0.5 -mt-6 px-4"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95" style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)' }}>
              <PlusCircle size={26} className="text-white" />
            </div>
            <span className="text-xs font-semibold mt-1" style={{ color: '#1d4ed8' }}>上架車輛</span>
          </button>
        </nav>
      )}
    </div>
  );
};

const MNavBtn = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-0.5 px-4 py-1 transition-colors"
    style={{ color: active ? '#1d4ed8' : '#94a3b8', minWidth: 70 }}
  >
    {icon}
    <span style={{ fontSize: 10, fontWeight: active ? 700 : 400 }}>{label}</span>
  </button>
);

export default MerchantApp;
