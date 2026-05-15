import React, { useState, useRef, useEffect } from 'react';
import { Car } from '../../types';
import { X, Heart, Phone, MessageCircle, ChevronLeft, ChevronRight, Gauge, Calendar, Fuel, Settings, Palette, Star, Eye, CheckCircle, Shield } from 'lucide-react';

interface Props {
  car: Car;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}

const FUEL_LABEL: Record<string, string> = {
  gasoline: '汽油', diesel: '柴油', electric: '電動', hybrid: '油電混合',
};
const COND_LABEL: Record<string, string> = {
  excellent: '極品車況', good: '良好車況', fair: '普通車況',
};
const COND_COLOR: Record<string, string> = {
  excellent: '#10b981', good: '#3b82f6', fair: '#f59e0b',
};

const fmt = (price: number) => {
  const wan = price / 10000;
  return `NT$${wan % 1 === 0 ? wan.toFixed(0) : wan.toFixed(1)}萬`;
};

const CarDetail: React.FC<Props> = ({ car, isFavorite, onToggleFavorite, onClose }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) {
      if (dx > 0) setImgIdx(i => Math.min(i + 1, car.images.length - 1));
      else setImgIdx(i => Math.max(i - 1, 0));
    }
  };

  const daysSince = Math.floor((Date.now() - new Date(car.createdAt).getTime()) / 86400000);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: '#0a0a0a' }}
    >
      {/* Image carousel */}
      <div
        className="relative flex-shrink-0"
        style={{ height: '42dvh' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {car.images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-400"
            style={{ opacity: i === imgIdx ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 30%, rgba(0,0,0,0.5) 100%)' }} />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}
        >
          <X size={20} className="text-white" />
        </button>

        {/* Fav */}
        <button
          onClick={onToggleFavorite}
          className="absolute top-4 right-4 p-2 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}
        >
          <Heart size={20} style={{ fill: isFavorite ? '#ef4444' : 'transparent', color: isFavorite ? '#ef4444' : 'white' }} />
        </button>

        {/* Sold overlay */}
        {!car.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-8 py-3 rounded-2xl font-black text-2xl text-white" style={{ background: 'rgba(239,68,68,0.8)', backdropFilter: 'blur(8px)', letterSpacing: '0.2em' }}>
              已售出
            </div>
          </div>
        )}

        {/* Prev/Next */}
        {car.images.length > 1 && (
          <>
            {imgIdx > 0 && (
              <button onClick={() => setImgIdx(i => i - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <ChevronLeft size={18} className="text-white" />
              </button>
            )}
            {imgIdx < car.images.length - 1 && (
              <button onClick={() => setImgIdx(i => i + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <ChevronRight size={18} className="text-white" />
              </button>
            )}
            {/* Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {car.images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className="rounded-full transition-all" style={{ width: i === imgIdx ? 18 : 6, height: 6, background: i === imgIdx ? '#f59e0b' : 'rgba(255,255,255,0.5)' }} />
              ))}
            </div>
          </>
        )}

        {/* View count */}
        <div className="absolute bottom-3 right-4 flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <Eye size={12} />
          <span style={{ fontSize: 11 }}>{car.views}</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ paddingBottom: '96px' }}>
        <div className="px-5 pt-5">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: car.isAvailable ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: car.isAvailable ? '#10b981' : '#ef4444' }}>
                  {car.isAvailable ? '● 可購買' : '● 已售出'}
                </span>
                <span className="text-white/30 text-xs">{daysSince === 0 ? '今日上架' : `${daysSince}天前上架`}</span>
              </div>
              <h2 className="text-white font-black text-2xl leading-tight">{car.make}</h2>
              <p className="text-white/70 font-medium text-base">{car.model}</p>
            </div>
            <div className="text-right">
              <p className="text-amber-400 font-black text-2xl">{fmt(car.price)}</p>
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <SpecCard icon={<Calendar size={16} />} label="年份" value={String(car.year)} />
            <SpecCard icon={<Gauge size={16} />} label="里程" value={`${car.mileage.toLocaleString()} km`} />
            <SpecCard icon={<Fuel size={16} />} label="燃料" value={FUEL_LABEL[car.fuelType]} />
            <SpecCard icon={<Settings size={16} />} label="變速" value={car.transmission === 'automatic' ? '自動排檔' : '手動排檔'} />
            <SpecCard icon={<Palette size={16} />} label="顏色" value={car.color} />
            <SpecCard icon={<Star size={16} />} label="車況" value={COND_LABEL[car.condition]} valueColor={COND_COLOR[car.condition]} />
          </div>

          {/* Features */}
          {car.features.length > 0 && (
            <div className="mb-5">
              <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">配備特色</h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map(f => (
                  <span key={f} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-xs font-medium" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
                    <CheckCircle size={11} style={{ color: '#f59e0b' }} />
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-5">
            <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">車輛說明</h3>
            <p className="text-white/80 text-sm leading-relaxed">{car.description}</p>
          </div>

          {/* Trust badges */}
          <div className="flex gap-3 mb-2">
            <div className="flex items-center gap-1.5 text-white/30 text-xs">
              <Shield size={14} />
              <span>安心保障</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/30 text-xs">
              <CheckCircle size={14} />
              <span>車況透明</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action buttons */}
      <div
        className="fixed left-0 right-0 px-5 py-4"
        style={{ bottom: 0, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        {car.isAvailable ? (
          <div className="flex gap-3">
            <button
              onClick={() => setShowContact(!showContact)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <Phone size={18} />
              電話洽詢
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-black transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              onClick={() => setShowContact(!showContact)}
            >
              <MessageCircle size={18} />
              立即詢問
            </button>
          </div>
        ) : (
          <div className="py-3.5 text-center rounded-2xl font-bold text-white/40" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            此車輛已售出
          </div>
        )}

        {showContact && (
          <div className="mt-3 p-4 rounded-2xl text-center" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <p className="text-amber-400 font-bold text-base">📞 0912-345-678</p>
            <p className="text-white/50 text-xs mt-1">週一至週六 09:00–18:00</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SpecCard = ({ icon, label, value, valueColor }: { icon: React.ReactNode; label: string; value: string; valueColor?: string }) => (
  <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="flex items-center gap-1.5 mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
      {icon}
      <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    </div>
    <p className="font-bold text-xs leading-tight" style={{ color: valueColor || 'white' }}>{value}</p>
  </div>
);

export default CarDetail;
