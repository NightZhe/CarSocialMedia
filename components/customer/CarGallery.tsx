import React, { useState, useRef, useCallback } from 'react';
import { Car } from '../../types';
import { Heart, ChevronDown, Eye, Zap, Gauge } from 'lucide-react';

interface Props {
  cars: Car[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectCar: (car: Car) => void;
}

const FUEL_LABEL: Record<string, string> = {
  gasoline: '汽油', diesel: '柴油', electric: '電動', hybrid: '油電',
};

const fmt = (price: number) => {
  const wan = price / 10000;
  return `${wan % 1 === 0 ? wan.toFixed(0) : wan.toFixed(1)}萬`;
};

const CarSlide: React.FC<{
  car: Car;
  isFavorite: boolean;
  onToggleFav: () => void;
  onSelect: () => void;
  isLast: boolean;
}> = ({ car, isFavorite, onToggleFav, onSelect, isLast }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 40 && Math.abs(dx) > dy) {
      if (dx > 0) setImgIdx(i => Math.min(i + 1, car.images.length - 1));
      else setImgIdx(i => Math.max(i - 1, 0));
    }
  };

  const prevImg = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx(i => Math.max(i - 1, 0));
  }, []);

  const nextImg = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx(i => Math.min(i + 1, car.images.length - 1));
  }, [car.images.length]);

  return (
    <div
      className="relative flex-shrink-0 w-full"
      style={{ height: '100dvh', scrollSnapAlign: 'start' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background image with crossfade */}
      {car.images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: i === imgIdx ? 1 : 0 }}
          draggable={false}
        />
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 25%, transparent 50%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.92) 100%)' }} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start px-5 pt-safe" style={{ paddingTop: '20px' }}>
        {/* Brand logo */}
        <div className="flex flex-col">
          <span className="text-white font-black text-xl tracking-tight leading-none">CAR<span style={{ color: '#f59e0b' }}>+</span></span>
          <span className="text-white/40 text-[9px] tracking-widest">二手精品車</span>
        </div>

        {/* Image dots */}
        {car.images.length > 1 && (
          <div className="flex gap-1.5 items-center mt-1">
            {car.images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                className="rounded-full transition-all duration-300"
                style={{ width: i === imgIdx ? 20 : 6, height: 6, background: i === imgIdx ? '#f59e0b' : 'rgba(255,255,255,0.4)' }}
              />
            ))}
          </div>
        )}

        {/* Fav button */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFav(); }}
          className="p-2.5 rounded-full transition-all active:scale-90"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}
        >
          <Heart
            size={20}
            className="transition-all"
            style={{ fill: isFavorite ? '#ef4444' : 'transparent', color: isFavorite ? '#ef4444' : 'white' }}
          />
        </button>
      </div>

      {/* Prev/Next image arrows (desktop) */}
      {car.images.length > 1 && imgIdx > 0 && (
        <button
          onClick={prevImg}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full hidden md:flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}
        >
          <ChevronDown size={20} className="text-white rotate-90" />
        </button>
      )}
      {car.images.length > 1 && imgIdx < car.images.length - 1 && (
        <button
          onClick={nextImg}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hidden md:flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}
        >
          <ChevronDown size={20} className="text-white -rotate-90" />
        </button>
      )}

      {/* Sold badge */}
      {!car.isAvailable && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-2xl font-black text-xl text-white"
          style={{ background: 'rgba(239,68,68,0.85)', backdropFilter: 'blur(8px)', letterSpacing: '0.15em', border: '2px solid rgba(239,68,68,0.6)' }}
        >
          已售出
        </div>
      )}

      {/* Bottom info */}
      <div
        className="absolute left-0 right-0 px-5 cursor-pointer"
        style={{ bottom: '80px' }}
        onClick={onSelect}
      >
        {/* Quick specs chips */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <Chip icon={<Gauge size={11} />} label={`${(car.mileage / 1000).toFixed(0)}k km`} />
          <Chip icon={<Zap size={11} />} label={FUEL_LABEL[car.fuelType]} />
          <Chip label={car.transmission === 'automatic' ? '自排' : '手排'} />
          <Chip label={car.color} />
        </div>

        {/* Car title */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-white/60 text-xs mb-0.5 font-medium tracking-wide">{car.year} · {car.condition === 'excellent' ? '極品車況' : car.condition === 'good' ? '良好車況' : '普通車況'}</p>
            <h2 className="text-white font-black leading-tight" style={{ fontSize: 'clamp(20px, 5vw, 26px)' }}>
              {car.make}
            </h2>
            <h3 className="text-white/80 font-semibold text-base leading-tight">{car.model}</h3>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex items-baseline gap-1">
              <span className="font-black" style={{ fontSize: 'clamp(24px, 6vw, 32px)', color: '#f59e0b' }}>{fmt(car.price)}</span>
              <span className="text-white/50 text-sm">元</span>
            </div>
            <button
              className="px-5 py-2 rounded-full font-bold text-sm text-black transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              onClick={e => { e.stopPropagation(); onSelect(); }}
            >
              查看詳情
            </button>
          </div>
        </div>

        {/* View count */}
        <div className="flex items-center gap-1 mt-2">
          <Eye size={12} className="text-white/30" />
          <span className="text-white/30 text-xs">{car.views} 人查看</span>
        </div>
      </div>

      {/* Scroll hint (not last) */}
      {!isLast && (
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ bottom: '82px', pointerEvents: 'none' }}>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.15)' }} />
        </div>
      )}
    </div>
  );
};

const Chip = ({ icon, label }: { icon?: React.ReactNode; label: string }) => (
  <span
    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-white/80 font-medium"
    style={{ fontSize: 11, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
  >
    {icon}
    {label}
  </span>
);

const CarGallery: React.FC<Props> = ({ cars, favorites, onToggleFavorite, onSelectCar }) => {
  if (cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/30" style={{ paddingBottom: 72 }}>
        <div className="text-6xl mb-4">🚗</div>
        <p className="text-lg font-medium">目前無車輛</p>
        <p className="text-sm mt-1">商家尚未上架車輛</p>
      </div>
    );
  }

  return (
    <div
      className="w-full no-scrollbar"
      style={{
        height: '100dvh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {cars.map((car, idx) => (
        <CarSlide
          key={car.id}
          car={car}
          isFavorite={favorites.includes(car.id)}
          onToggleFav={() => onToggleFavorite(car.id)}
          onSelect={() => onSelectCar(car)}
          isLast={idx === cars.length - 1}
        />
      ))}
    </div>
  );
};

export default CarGallery;
