import React from 'react';
import { Car } from '../../types';
import { TrendingUp, Car as CarIcon, CheckCircle, XCircle, Eye, PlusCircle, List, Zap } from 'lucide-react';

interface Props {
  cars: Car[];
  onNavigateListings: () => void;
  onNavigateAdd: () => void;
}

const fmt = (price: number) => {
  const wan = price / 10000;
  return `${wan % 1 === 0 ? wan.toFixed(0) : wan.toFixed(1)}萬`;
};

const FUEL_LABEL: Record<string, string> = {
  gasoline: '汽油', diesel: '柴油', electric: '電動', hybrid: '油電',
};

const MerchantDashboard: React.FC<Props> = ({ cars, onNavigateListings, onNavigateAdd }) => {
  const available = cars.filter(c => c.isAvailable);
  const sold = cars.filter(c => !c.isAvailable);
  const totalViews = cars.reduce((s, c) => s + c.views, 0);
  const avgPrice = cars.length > 0 ? cars.reduce((s, c) => s + c.price, 0) / cars.length : 0;

  const recent = [...cars].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  return (
    <div className="px-4 pt-5 pb-4 space-y-5">
      {/* Real-time sync notice */}
      <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.1), rgba(59,130,246,0.08))', border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" style={{ boxShadow: '0 0 6px #4ade80' }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: '#1e293b' }}>即時同步已啟動</p>
          <p className="text-xs" style={{ color: '#64748b' }}>您新增或修改的車輛將立即顯示在用戶端</p>
        </div>
        <Zap size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<CarIcon size={20} />}
          label="總車輛"
          value={String(cars.length)}
          sub="所有在冊車輛"
          color="#1d4ed8"
          bg="rgba(29,78,216,0.08)"
        />
        <StatCard
          icon={<CheckCircle size={20} />}
          label="可售車輛"
          value={String(available.length)}
          sub={`佔比 ${cars.length > 0 ? Math.round(available.length / cars.length * 100) : 0}%`}
          color="#10b981"
          bg="rgba(16,185,129,0.08)"
        />
        <StatCard
          icon={<XCircle size={20} />}
          label="已售出"
          value={String(sold.length)}
          sub="累計售出"
          color="#f59e0b"
          bg="rgba(245,158,11,0.08)"
        />
        <StatCard
          icon={<Eye size={20} />}
          label="總瀏覽"
          value={totalViews.toLocaleString()}
          sub="用戶查看次數"
          color="#8b5cf6"
          bg="rgba(139,92,246,0.08)"
        />
      </div>

      {/* Avg price */}
      {cars.length > 0 && (
        <div className="p-4 rounded-2xl flex items-center justify-between" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
              <TrendingUp size={18} style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#94a3b8' }}>平均售價</p>
              <p className="font-black text-xl" style={{ color: '#1e293b' }}>{fmt(avgPrice)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: '#94a3b8' }}>最高</p>
            <p className="font-bold text-sm" style={{ color: '#1e293b' }}>{cars.length > 0 ? fmt(Math.max(...cars.map(c => c.price))) : '-'}</p>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-bold mb-3" style={{ color: '#1e293b' }}>快速操作</h2>
        <div className="grid grid-cols-2 gap-3">
          <ActionBtn
            icon={<PlusCircle size={20} />}
            label="上架新車"
            sub="新增車輛資訊"
            onClick={onNavigateAdd}
            primary
          />
          <ActionBtn
            icon={<List size={20} />}
            label="管理車輛"
            sub="編輯、下架車輛"
            onClick={onNavigateListings}
          />
        </div>
      </div>

      {/* Recent listings */}
      {recent.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold" style={{ color: '#1e293b' }}>最新上架</h2>
            <button onClick={onNavigateListings} className="text-xs font-semibold" style={{ color: '#1d4ed8' }}>查看全部</button>
          </div>
          <div className="space-y-3">
            {recent.map(car => {
              const days = Math.floor((Date.now() - new Date(car.createdAt).getTime()) / 86400000);
              return (
                <div key={car.id} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
                  <img src={car.images[0]} alt="" className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: '#1e293b' }}>{car.make} {car.model}</p>
                    <p className="text-xs truncate" style={{ color: '#94a3b8' }}>{car.year} · {FUEL_LABEL[car.fuelType]} · {car.mileage.toLocaleString()}km</p>
                    <p className="font-bold text-sm mt-0.5" style={{ color: '#1d4ed8' }}>{fmt(car.price)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full font-semibold" style={{
                      background: car.isAvailable ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: car.isAvailable ? '#10b981' : '#ef4444',
                    }}>
                      {car.isAvailable ? '販售中' : '已售出'}
                    </span>
                    <p className="text-xs mt-1" style={{ color: '#cbd5e1' }}>{days === 0 ? '今天' : `${days}天前`}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, color, bg }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string; bg: string }) => (
  <div className="p-4 rounded-2xl" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: bg, color }}>
        {icon}
      </div>
      <span className="text-xs font-semibold" style={{ color: '#94a3b8' }}>{label}</span>
    </div>
    <p className="font-black text-2xl" style={{ color: '#1e293b' }}>{value}</p>
    <p className="text-xs mt-0.5" style={{ color: '#cbd5e1' }}>{sub}</p>
  </div>
);

const ActionBtn = ({ icon, label, sub, onClick, primary }: { icon: React.ReactNode; label: string; sub: string; onClick: () => void; primary?: boolean }) => (
  <button
    onClick={onClick}
    className="p-4 rounded-2xl text-left transition-all active:scale-95 w-full"
    style={{
      background: primary ? 'linear-gradient(135deg, #1d4ed8, #3b82f6)' : 'white',
      border: primary ? 'none' : '1px solid #e2e8f0',
    }}
  >
    <div className="flex items-center justify-center w-10 h-10 rounded-xl mb-3" style={{ background: primary ? 'rgba(255,255,255,0.2)' : 'rgba(29,78,216,0.08)' }}>
      <span style={{ color: primary ? 'white' : '#1d4ed8' }}>{icon}</span>
    </div>
    <p className="font-bold text-sm" style={{ color: primary ? 'white' : '#1e293b' }}>{label}</p>
    <p className="text-xs mt-0.5" style={{ color: primary ? 'rgba(255,255,255,0.7)' : '#94a3b8' }}>{sub}</p>
  </button>
);

export default MerchantDashboard;
