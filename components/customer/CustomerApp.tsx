import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '../../types';
import CarGallery from './CarGallery';
import CarDetail from './CarDetail';
import SearchFilter from './SearchFilter';
import { Home, Search, Heart, Store } from 'lucide-react';

type CustomerTab = 'browse' | 'search' | 'favorites';

interface Props {
  cars: Car[];
}

const fmt = (price: number) => {
  const wan = price / 10000;
  return `${wan % 1 === 0 ? wan.toFixed(0) : wan.toFixed(1)}萬`;
};

const CustomerApp: React.FC<Props> = ({ cars }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<CustomerTab>('browse');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('carSales_favs');
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('carSales_favs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFav = (id: string) =>
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const favCars = cars.filter(c => favorites.includes(c.id));

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '100dvh', background: '#080808' }}>
      {tab === 'browse' && (
        <CarGallery
          cars={cars}
          favorites={favorites}
          onToggleFavorite={toggleFav}
          onSelectCar={setSelectedCar}
        />
      )}

      {tab === 'search' && (
        <div className="h-full overflow-y-auto no-scrollbar" style={{ paddingBottom: '72px' }}>
          <SearchFilter
            cars={cars}
            favorites={favorites}
            onToggleFavorite={toggleFav}
            onSelectCar={setSelectedCar}
          />
        </div>
      )}

      {tab === 'favorites' && (
        <div className="h-full overflow-y-auto no-scrollbar" style={{ paddingBottom: '72px' }}>
          <div className="pt-16 px-4 pb-4">
            <h2 className="text-white text-xl font-bold mb-1">我的收藏</h2>
            <p className="text-white/40 text-sm mb-5">{favCars.length} 輛車輛</p>
            {favCars.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-white/30">
                <Heart size={52} className="mb-4" />
                <p className="text-lg font-medium">尚無收藏車輛</p>
                <p className="text-sm mt-1">瀏覽時點擊 ♥ 即可收藏</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {favCars.map(car => (
                  <div
                    key={car.id}
                    className="rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-transform"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onClick={() => setSelectedCar(car)}
                  >
                    <div className="relative h-44">
                      <img src={car.images[0]} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                      {!car.isAvailable && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">已售出</div>
                      )}
                      <button
                        className="absolute top-3 right-3 p-2 rounded-full"
                        style={{ background: 'rgba(0,0,0,0.5)' }}
                        onClick={e => { e.stopPropagation(); toggleFav(car.id); }}
                      >
                        <Heart size={16} className="fill-red-400 text-red-400" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-white/50 text-xs">{car.year} · {car.color}</p>
                      <h3 className="text-white font-bold text-base mt-0.5">{car.make} {car.model}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-amber-400 font-bold text-lg">{fmt(car.price)}</span>
                        <span className="text-white/40 text-sm">{car.mileage.toLocaleString()} km</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex justify-around py-3 px-2"
        style={{ background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <NavBtn active={tab === 'browse'} onClick={() => setTab('browse')} icon={<Home size={22} />} label="瀏覽" />
        <NavBtn active={tab === 'search'} onClick={() => setTab('search')} icon={<Search size={22} />} label="搜尋" />
        <NavBtn
          active={tab === 'favorites'}
          onClick={() => setTab('favorites')}
          icon={<Heart size={22} />}
          label={favorites.length > 0 ? `收藏 (${favorites.length})` : '收藏'}
        />
        <NavBtn active={false} onClick={() => navigate('/merchant')} icon={<Store size={22} />} label="商家後台" />
      </nav>

      {selectedCar && (
        <CarDetail
          car={selectedCar}
          isFavorite={favorites.includes(selectedCar.id)}
          onToggleFavorite={() => toggleFav(selectedCar.id)}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </div>
  );
};

const NavBtn = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-0.5 px-2 py-1 transition-all"
    style={{ color: active ? '#f59e0b' : 'rgba(255,255,255,0.38)', minWidth: 56 }}
  >
    {icon}
    <span style={{ fontSize: '9px', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{label}</span>
  </button>
);

export default CustomerApp;
