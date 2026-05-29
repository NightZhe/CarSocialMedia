import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Car, Lock } from 'lucide-react';

interface Props {
  onLogin: () => void;
}

const MERCHANT_PASSWORD = 'dealer168';

const MerchantLogin: React.FC<Props> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (password === MERCHANT_PASSWORD) {
        onLogin();
      } else {
        setError('密碼錯誤，請重新輸入');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      <div className="p-5">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm">返回用戶端</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="mb-10 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 mx-auto" style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)' }}>
            <Car size={36} className="text-white" />
          </div>
          <h1 className="text-white font-black text-3xl tracking-tight">商家後台</h1>
          <p className="text-white/40 text-sm mt-2">Car+ 二手車銷售管理系統</p>
        </div>

        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">商家密碼</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="請輸入商家密碼"
                  className="w-full pl-10 pr-12 py-4 rounded-2xl text-white text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)'}`,
                  }}
                  autoFocus
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && <p className="text-red-400 text-xs mt-2 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
              style={{
                background: loading || !password ? 'rgba(59,130,246,0.3)' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                opacity: loading || !password ? 0.6 : 1,
              }}
            >
              {loading ? '驗證中...' : '登入後台'}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-white/30 text-xs">示範密碼：<span className="text-white/60 font-mono font-bold">dealer168</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantLogin;
