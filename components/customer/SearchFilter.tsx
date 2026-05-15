import React, { useState, useMemo } from 'react';
import { Car, FilterState } from '../../types';
import { Search, SlidersHorizontal, X, Heart, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  cars: Car[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectCar: (car: Car) => void;
}

const INIT: FilterState = {
  search: '', minPrice: '', maxPrice: '', transmission: '', fuelType: '', condition: '',
};

const FUEL_LABEL: Record<string, string> = {
  gasoline: '汽油', diesel: '柴油', electric: '電動', hybrid: '油電',
};
const COND_LABEL: Record<string, string> = {
  excellent: '極品', good: '良好', fair: '普通',
};

const fmt = (price: number) => {
  const wan = price / 10000;
  return `${wan % 1 === 0 ? wan.toFixed(0) : wan.toFixed(1)}萬`;
};

const SearchFilter: React.FC<Props> = ({ cars, favorites, onToggleFavorite, onSelectCar }) => {
  const [filter, setFilter] = useState<FilterState>(INIT);
  const [showFilters, setShowFilters] = useState(false);

  const set = (k: keyof FilterState, v: string | number) =>
    setFilter(prev => ({ ...prev, [k]: v }));

  const filtered = useMemo(() => {
    return cars.filter(car => {
      const q = filter.search.toLowerCase();
      if (q && !`${car.make} ${car.model} ${car.year} ${car.color}`.toLowerCase().includes(q)) return false;
      if (filter.minPrice !== '' && car.price < Number(filter.minPrice) * 10000) return false;
      if (filter.maxPrice !== '' && car.price > Number(filter.maxPrice) * 10000) return false;
      if (filter.transmission && car.transmission !== filter.transmission) return false;
      if (filter.fuelType && car.fuelType !== filter.fuelType) return false;
      if (filter.condition && car.condition !== filter.condition) return false;
      return true;
    });
  }, [cars, filter]);

  const hasFilters = Object.entries(filter).some(([k, v]) => k !== 'search' && v !== '');

  const clearFilters = () => setFilter(INIT);

  return (
    <div className="min-h-full" style={{ background: '#080808', paddingTop: '16px' }}>
      {/* Search bar */}
      <div className="px-4 mb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }} />
          <input
            type="text"
            placeholder="搜尋品牌、型號、顏色..."
            value={filter.search}
            onChange={e => set('search', e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-2xl text-white text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          {filter.search && (
            <button onClick={() => set('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={15} style={{ color: 'rgba(255,255,255,0.4)' }} />
            </button>
          )}
        </div>
      </div>

      {/* Filter toggle */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: showFilters || hasFilters ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${showFilters || hasFilters ? 'rgba(245,158,11,0.35)' : 'rgba(255,255,255,0.1)'}`,
            color: showFilters || hasFilters ? '#f59e0b' : 'rgba(255,255,255,0.6)',
          }}
        >
          <SlidersHorizontal size={14} />
          篩選條件
          {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <div className="flex items-center gap-2">
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs px-3 py-1.5 rounded-xl" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
              清除篩選
            </button>
          )}
          <span className="text-white/30 text-sm">{filtered.length} 輛</span>
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="px-4 mb-4 space-y-3">
          {/* Price range */}
          <div>
            <p className="text-white/40 text-xs font-semibold mb-2 uppercase tracking-widest">價格範圍 (萬元)</p>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="最低"
                value={filter.minPrice}
                onChange={e => set('minPrice', e.target.value ? Number(e.target.value) : '')}
                className="flex-1 px-3 py-2.5 rounded-xl text-white text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <span className="text-white/30 text-sm">–</span>
              <input
                type="number"
                placeholder="最高"
                value={filter.maxPrice}
                onChange={e => set('maxPrice', e.target.value ? Number(e.target.value) : '')}
                className="flex-1 px-3 py-2.5 rounded-xl text-white text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>

          {/* Transmission */}
          <div>
            <p className="text-white/40 text-xs font-semibold mb-2 uppercase tracking-widest">變速箱</p>
            <div className="flex gap-2">
              {[{ v: '', l: '全部' }, { v: 'automatic', l: '自動' }, { v: 'manual', l: '手動' }].map(o => (
                <ChipBtn key={o.v} active={filter.transmission === o.v} onClick={() => set('transmission', o.v)} label={o.l} />
              ))}
            </div>
          </div>

          {/* Fuel */}
          <div>
            <p className="text-white/40 text-xs font-semibold mb-2 uppercase tracking-widest">燃料類型</p>
            <div className="flex gap-2 flex-wrap">
              {[{ v: '', l: '全部' }, { v: 'gasoline', l: '汽油' }, { v: 'diesel', l: '柴油' }, { v: 'electric', l: '電動' }, { v: 'hybrid', l: '油電' }].map(o => (
                <ChipBtn key={o.v} active={filter.fuelType === o.v} onClick={() => set('fuelType', o.v)} label={o.l} />
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <p className="text-white/40 text-xs font-semibold mb-2 uppercase tracking-widest">車況</p>
            <div className="flex gap-2">
              {[{ v: '', l: '全部' }, { v: 'excellent', l: '極品' }, { v: 'good', l: '良好' }, { v: 'fair', l: '普通' }].map(o => (
                <ChipBtn key={o.v} active={filter.condition === o.v} onClick={() => set('condition', o.v)} label={o.l} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="px-4 pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/30">
            <Search size={40} className="mb-3" />
            <p className="font-medium">找不到符合條件的車輛</p>
            <button onClick={clearFilters} className="mt-3 text-sm px-4 py-2 rounded-xl" style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.1)' }}>
              清除所有篩選
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(car => (
              <CarResultCard
                key={car.id}
                car={car}
                isFavorite={favorites.includes(car.id)}
                onFav={() => onToggleFavorite(car.id)}
                onSelect={() => onSelectCar(car)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ChipBtn = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
    style={{
      background: active ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)',
      border: `1px solid ${active ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.1)'}`,
      color: active ? '#f59e0b' : 'rgba(255,255,255,0.5)',
    }}
  >
    {label}
  </button>
);

const FUEL_LABEL2: Record<string, string> = {
  gasoline: '汽油', diesel: '柴油', electric: '電動', hybrid: '油電',
};

const CarResultCard = ({ car, isFavorite, onFav, onSelect }: { car: Car; isFavorite: boolean; onFav: () => void; onSelect: () => void }) => (
  <div
    className="rounded-2xl overflow-hidden cursor-pointer active:scale-98 transition-transform flex"
    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', height: 120 }}
    onClick={onSelect}
  >
    {/* Image */}
    <div className="relative flex-shrink-0" style={{ width: 130 }}>
      <img src={car.images[0]} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 70%, rgba(0,0,0,0.4))' }} />
      {!car.isAvailable && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white font-bold text-xs px-2 py-1 rounded" style={{ background: 'rgba(239,68,68,0.8)' }}>已售出</span>
        </div>
      )}
    </div>

    {/* Info */}
    <div className="flex-1 px-3.5 py-3 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/40 text-xs">{car.year} · {car.color}</p>
            <p className="text-white font-bold text-sm leading-tight mt-0.5">{car.make} {car.model}</p>
          </div>
          <button onClick={e => { e.stopPropagation(); onFav(); }} className="p-1.5">
            <Heart size={16} style={{ fill: isFavorite ? '#ef4444' : 'transparent', color: isFavorite ? '#ef4444' : 'rgba(255,255,255,0.3)' }} />
          </button>
        </div>
      </div>
      <div>
        <div className="flex gap-2 mb-1">
          <span className="text-white/40 text-xs">{car.mileage.toLocaleString()} km</span>
          <span className="text-white/25 text-xs">·</span>
          <span className="text-white/40 text-xs">{FUEL_LABEL2[car.fuelType]}</span>
        </div>
        <p className="text-amber-400 font-bold text-base">{fmt(car.price)}</p>
      </div>
    </div>
  </div>
);

export default SearchFilter;
