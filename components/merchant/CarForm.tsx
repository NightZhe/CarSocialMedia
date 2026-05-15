import React, { useState, useEffect } from 'react';
import { Car } from '../../types';
import { ArrowLeft, Plus, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  initialCar: Car | null;
  onSave: (car: Car) => void;
  onCancel: () => void;
}

const MAKES = ['Toyota', 'BMW', 'Mercedes-Benz', 'Honda', 'Tesla', 'Lexus', 'Audi', 'Ford', 'Mazda', 'Nissan', 'Hyundai', 'Kia', 'Volkswagen', 'Volvo', 'Porsche', '其他'];

const blank = (): Omit<Car, 'id' | 'createdAt' | 'views'> => ({
  make: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  color: '',
  transmission: 'automatic',
  fuelType: 'gasoline',
  condition: 'good',
  description: '',
  images: [''],
  features: [],
  isAvailable: true,
});

const CarForm: React.FC<Props> = ({ initialCar, onSave, onCancel }) => {
  const [form, setForm] = useState(() => initialCar ? { ...initialCar } : { ...blank(), id: '', createdAt: '', views: 0 });
  const [featureInput, setFeatureInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialCar) setForm({ ...initialCar });
  }, [initialCar]);

  const set = <K extends keyof Car>(k: K, v: Car[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.make) e.make = '請選擇品牌';
    if (!form.model.trim()) e.model = '請輸入型號';
    if (!form.price || form.price <= 0) e.price = '請輸入有效售價';
    if (!form.color.trim()) e.color = '請輸入顏色';
    if (form.images.filter(i => i.trim()).length === 0) e.images = '請至少提供一張圖片URL';
    if (!form.description.trim()) e.description = '請輸入車輛說明';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const car: Car = {
      ...form,
      id: initialCar?.id || `car_${Date.now()}`,
      images: form.images.filter(i => i.trim()),
      createdAt: initialCar?.createdAt || new Date().toISOString(),
      views: initialCar?.views ?? 0,
    };
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onSave(car);
    }, 800);
  };

  const addImage = () => setForm(prev => ({ ...prev, images: [...prev.images, ''] }));
  const removeImage = (idx: number) => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  const setImage = (idx: number, val: string) =>
    setForm(prev => ({ ...prev, images: prev.images.map((img, i) => i === idx ? val : img) }));

  const addFeature = () => {
    const f = featureInput.trim();
    if (f && !form.features.includes(f)) {
      set('features', [...form.features, f]);
      setFeatureInput('');
    }
  };
  const removeFeature = (f: string) => set('features', form.features.filter(x => x !== f));

  return (
    <div className="min-h-full" style={{ background: '#f1f5f9' }}>
      {/* Sub-header */}
      <div className="sticky top-0 z-20 px-4 py-3 flex items-center gap-3" style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={onCancel} className="p-2 rounded-xl hover:bg-slate-100 transition-all">
          <ArrowLeft size={20} style={{ color: '#1e293b' }} />
        </button>
        <div>
          <h2 className="font-black text-base" style={{ color: '#1e293b' }}>{initialCar ? '編輯車輛' : '上架新車'}</h2>
          <p className="text-xs" style={{ color: '#94a3b8' }}>{initialCar ? '修改車輛資訊後儲存' : '填寫資訊後立即上架'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 pt-4 pb-32 space-y-4">
        {/* Basic info section */}
        <Section title="基本資訊">
          {/* Make */}
          <Field label="品牌" required error={errors.make}>
            <select
              value={form.make}
              onChange={e => set('make', e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none"
              style={{ background: 'white', border: `1px solid ${errors.make ? '#ef4444' : '#e2e8f0'}`, color: '#1e293b' }}
            >
              <option value="">選擇品牌</option>
              {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>

          {/* Model */}
          <Field label="型號" required error={errors.model}>
            <input
              type="text"
              value={form.model}
              onChange={e => set('model', e.target.value)}
              placeholder="例如：Camry 旗艦版、330i Sport Line"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'white', border: `1px solid ${errors.model ? '#ef4444' : '#e2e8f0'}`, color: '#1e293b' }}
            />
          </Field>

          {/* Year & Price */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="年份" required>
              <input
                type="number"
                value={form.year}
                onChange={e => set('year', Number(e.target.value))}
                min={1990}
                max={new Date().getFullYear() + 1}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'white', border: '1px solid #e2e8f0', color: '#1e293b' }}
              />
            </Field>
            <Field label="售價（元）" required error={errors.price}>
              <input
                type="number"
                value={form.price || ''}
                onChange={e => set('price', Number(e.target.value))}
                placeholder="850000"
                min={0}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'white', border: `1px solid ${errors.price ? '#ef4444' : '#e2e8f0'}`, color: '#1e293b' }}
              />
              {form.price > 0 && (
                <p className="text-xs mt-1" style={{ color: '#3b82f6' }}>
                  ≈ {(form.price / 10000).toFixed(1)}萬元
                </p>
              )}
            </Field>
          </div>

          {/* Mileage & Color */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="里程數（km）" required>
              <input
                type="number"
                value={form.mileage || ''}
                onChange={e => set('mileage', Number(e.target.value))}
                placeholder="15000"
                min={0}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'white', border: '1px solid #e2e8f0', color: '#1e293b' }}
              />
            </Field>
            <Field label="顏色" required error={errors.color}>
              <input
                type="text"
                value={form.color}
                onChange={e => set('color', e.target.value)}
                placeholder="珍珠白"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'white', border: `1px solid ${errors.color ? '#ef4444' : '#e2e8f0'}`, color: '#1e293b' }}
              />
            </Field>
          </div>
        </Section>

        {/* Specs section */}
        <Section title="規格設定">
          <Field label="變速箱">
            <div className="grid grid-cols-2 gap-2">
              {[['automatic', '自動排檔'], ['manual', '手動排檔']].map(([v, l]) => (
                <RadioCard key={v} active={form.transmission === v} onClick={() => set('transmission', v as Car['transmission'])} label={l} />
              ))}
            </div>
          </Field>

          <Field label="燃料類型">
            <div className="grid grid-cols-2 gap-2">
              {[['gasoline', '⛽ 汽油'], ['diesel', '🔧 柴油'], ['electric', '⚡ 電動'], ['hybrid', '🔋 油電']].map(([v, l]) => (
                <RadioCard key={v} active={form.fuelType === v} onClick={() => set('fuelType', v as Car['fuelType'])} label={l} />
              ))}
            </div>
          </Field>

          <Field label="車況">
            <div className="grid grid-cols-3 gap-2">
              {[['excellent', '⭐ 極品'], ['good', '✅ 良好'], ['fair', '📋 普通']].map(([v, l]) => (
                <RadioCard key={v} active={form.condition === v} onClick={() => set('condition', v as Car['condition'])} label={l} small />
              ))}
            </div>
          </Field>

          <Field label="販售狀態">
            <div className="grid grid-cols-2 gap-2">
              <RadioCard active={form.isAvailable} onClick={() => set('isAvailable', true)} label="✅ 販售中" />
              <RadioCard active={!form.isAvailable} onClick={() => set('isAvailable', false)} label="❌ 已售出" />
            </div>
          </Field>
        </Section>

        {/* Images section */}
        <Section title="車輛照片" subtitle="建議至少3張，提供不同角度">
          {errors.images && <p className="text-xs text-red-500 mb-2 flex items-center gap-1"><AlertCircle size={12} />{errors.images}</p>}
          <div className="space-y-2">
            {form.images.map((img, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <div className="flex-1 relative">
                  <ImageIcon size={14} className="absolute left-3 top-3.5" style={{ color: '#94a3b8' }} />
                  <input
                    type="url"
                    value={img}
                    onChange={e => setImage(idx, e.target.value)}
                    placeholder={`圖片 ${idx + 1} URL（https://...）`}
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-xs outline-none"
                    style={{ background: 'white', border: '1px solid #e2e8f0', color: '#1e293b' }}
                  />
                </div>
                {img.trim() && (
                  <img
                    src={img}
                    alt=""
                    className="w-12 h-12 object-cover rounded-xl flex-shrink-0"
                    onError={e => (e.currentTarget.style.display = 'none')}
                    onLoad={e => (e.currentTarget.style.display = 'block')}
                    style={{ display: 'none' }}
                  />
                )}
                {form.images.length > 1 && (
                  <button type="button" onClick={() => removeImage(idx)} className="p-2.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {form.images.length < 5 && (
            <button
              type="button"
              onClick={addImage}
              className="mt-2 w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={{ border: '1.5px dashed #cbd5e1', color: '#94a3b8' }}
            >
              <Plus size={15} />
              新增圖片
            </button>
          )}
        </Section>

        {/* Features section */}
        <Section title="配備特色">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={featureInput}
              onChange={e => setFeatureInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              placeholder="例如：ACC主動定速、電動天窗..."
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'white', border: '1px solid #e2e8f0', color: '#1e293b' }}
            />
            <button type="button" onClick={addFeature} className="px-4 py-3 rounded-xl font-bold text-sm text-white" style={{ background: '#1d4ed8' }}>
              新增
            </button>
          </div>
          {form.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.features.map(f => (
                <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(29,78,216,0.08)', border: '1px solid rgba(29,78,216,0.2)', color: '#1d4ed8' }}>
                  {f}
                  <button type="button" onClick={() => removeFeature(f)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Section>

        {/* Description */}
        <Section title="車輛說明">
          <Field label="" error={errors.description}>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="請詳細描述車輛狀況、保養歷史、特色等..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: 'white', border: `1px solid ${errors.description ? '#ef4444' : '#e2e8f0'}`, color: '#1e293b' }}
            />
            <p className="text-xs mt-1" style={{ color: '#cbd5e1' }}>{form.description.length} 字</p>
          </Field>
        </Section>
      </form>

      {/* Fixed bottom submit */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4" style={{ background: 'white', borderTop: '1px solid #e2e8f0', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all"
            style={{ background: 'rgba(0,0,0,0.05)', color: '#64748b', border: '1px solid #e2e8f0' }}
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={saved}
            className="flex-2 flex-1 py-3.5 rounded-2xl font-bold text-sm text-white transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)', flexGrow: 2 }}
          >
            {saved ? (
              <><CheckCircle size={18} />{initialCar ? '已更新！' : '上架成功！'}</>
            ) : (
              initialCar ? '儲存修改' : '立即上架'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
    <div className="px-4 py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
      <h3 className="font-bold text-sm" style={{ color: '#1e293b' }}>{title}</h3>
      {subtitle && <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{subtitle}</p>}
    </div>
    <div className="px-4 py-4 space-y-4">{children}</div>
  </div>
);

const Field = ({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) => (
  <div>
    {label && (
      <label className="flex items-center gap-1 text-xs font-semibold mb-1.5" style={{ color: '#64748b' }}>
        {label}
        {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
    )}
    {children}
    {error && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#ef4444' }}><AlertCircle size={11} />{error}</p>}
  </div>
);

const RadioCard = ({ active, onClick, label, small }: { active: boolean; onClick: () => void; label: string; small?: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    className="py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition-all"
    style={{
      background: active ? 'rgba(29,78,216,0.08)' : '#f8fafc',
      border: `1.5px solid ${active ? 'rgba(29,78,216,0.4)' : '#e2e8f0'}`,
      color: active ? '#1d4ed8' : '#64748b',
      fontSize: small ? 11 : 12,
    }}
  >
    {label}
  </button>
);

export default CarForm;
