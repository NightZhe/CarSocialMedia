import React, { useState } from 'react';
import { Car } from '../../types';
import { Edit2, Trash2, Eye, EyeOff, PlusCircle, Search, AlertCircle } from 'lucide-react';

interface Props {
  cars: Car[];
  onEdit: (car: Car) => void;
  onDelete: (id: string) => void;
  onToggleAvail: (car: Car) => void;
  onAdd: () => void;
}

const fmt = (price: number) => {
  const wan = price / 10000;
  return `${wan % 1 === 0 ? wan.toFixed(0) : wan.toFixed(1)}萬`;
};

const FUEL_LABEL: Record<string, string> = {
  gasoline: '汽油', diesel: '柴油', electric: '電動', hybrid: '油電',
};

const MerchantListings: React.FC<Props> = ({ cars, onEdit, onDelete, onToggleAvail, onAdd }) => {
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('all');

  const filtered = cars.filter(car => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${car.make} ${car.model} ${car.year}`.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || (filter === 'available' ? car.isAvailable : !car.isAvailable);
    return matchSearch && matchFilter;
  });

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="px-4 pt-5 pb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-black text-lg" style={{ color: '#1e293b' }}>車輛管理</h2>
          <p className="text-xs" style={{ color: '#94a3b8' }}>共 {cars.length} 輛車輛</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)' }}
        >
          <PlusCircle size={16} />
          上架車輛
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="搜尋車輛..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
          style={{ background: 'white', border: '1px solid #e2e8f0', color: '#1e293b' }}
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {([['all', '全部'], ['available', '販售中'], ['sold', '已售出']] as const).map(([v, l]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: filter === v ? 'rgba(29,78,216,0.1)' : 'white',
              border: `1px solid ${filter === v ? 'rgba(29,78,216,0.3)' : '#e2e8f0'}`,
              color: filter === v ? '#1d4ed8' : '#94a3b8',
            }}
          >
            {l}
            {v === 'all' && ` (${cars.length})`}
            {v === 'available' && ` (${cars.filter(c => c.isAvailable).length})`}
            {v === 'sold' && ` (${cars.filter(c => !c.isAvailable).length})`}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20" style={{ color: '#cbd5e1' }}>
          <AlertCircle size={40} className="mb-3" />
          <p className="font-medium">無符合條件的車輛</p>
          {cars.length === 0 && (
            <button onClick={onAdd} className="mt-4 px-6 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)' }}>
              立即上架第一輛車
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(car => (
            <div key={car.id} className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
              <div className="flex">
                {/* Image */}
                <div className="relative flex-shrink-0" style={{ width: 110 }}>
                  <img src={car.images[0]} alt="" className="w-full h-full object-cover" style={{ minHeight: 100 }} />
                  {!car.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold text-xs px-2 py-1 rounded" style={{ background: 'rgba(239,68,68,0.9)' }}>已售出</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs" style={{ color: '#94a3b8' }}>{car.year} · {FUEL_LABEL[car.fuelType]}</p>
                      <p className="font-bold text-sm mt-0.5" style={{ color: '#1e293b' }}>{car.make} {car.model}</p>
                      <p className="font-bold text-base mt-1" style={{ color: '#1d4ed8' }}>{fmt(car.price)}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0" style={{
                      background: car.isAvailable ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: car.isAvailable ? '#10b981' : '#ef4444',
                    }}>
                      {car.isAvailable ? '販售中' : '已售出'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-1">
                    <Eye size={11} style={{ color: '#94a3b8' }} />
                    <span className="text-xs" style={{ color: '#94a3b8' }}>{car.views} 次瀏覽 · {car.mileage.toLocaleString()} km</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex border-t" style={{ borderColor: '#f1f5f9' }}>
                <ActionBtn
                  icon={car.isAvailable ? <EyeOff size={14} /> : <Eye size={14} />}
                  label={car.isAvailable ? '標記售出' : '重新販售'}
                  onClick={() => onToggleAvail(car)}
                  color={car.isAvailable ? '#f59e0b' : '#10b981'}
                />
                <div style={{ width: 1, background: '#f1f5f9' }} />
                <ActionBtn
                  icon={<Edit2 size={14} />}
                  label="編輯"
                  onClick={() => onEdit(car)}
                  color="#1d4ed8"
                />
                <div style={{ width: 1, background: '#f1f5f9' }} />
                <ActionBtn
                  icon={<Trash2 size={14} />}
                  label={deleteConfirm === car.id ? '確認刪除' : '刪除'}
                  onClick={() => handleDelete(car.id)}
                  color="#ef4444"
                  danger={deleteConfirm === car.id}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ActionBtn = ({ icon, label, onClick, color, danger }: { icon: React.ReactNode; label: string; onClick: () => void; color: string; danger?: boolean }) => (
  <button
    onClick={onClick}
    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 transition-all active:opacity-70"
    style={{
      color,
      background: danger ? 'rgba(239,68,68,0.06)' : 'transparent',
      fontSize: 12,
      fontWeight: 600,
    }}
  >
    {icon}
    {label}
  </button>
);

export default MerchantListings;
