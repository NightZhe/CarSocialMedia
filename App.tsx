import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Car } from './types';
import CustomerApp from './components/customer/CustomerApp';
import MerchantApp from './components/merchant/MerchantApp';
import MerchantLogin from './components/merchant/MerchantLogin';

const DEMO_CARS: Car[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry 旗艦版',
    year: 2022,
    price: 850000,
    mileage: 15000,
    color: '珍珠白',
    transmission: 'automatic',
    fuelType: 'hybrid',
    condition: 'excellent',
    description: '原廠保固中，一手女用車，車況極佳，全額貸款可洽。定期保養，所有紀錄完整。內裝全新無受損，適合家庭使用。',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
    ],
    features: ['ACC主動定速', '盲點偵測', 'Toyota Safety Sense', '電動天窗', '導航系統', 'Apple CarPlay'],
    isAvailable: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    views: 128,
  },
  {
    id: '2',
    make: 'BMW',
    model: '330i Sport Line',
    year: 2021,
    price: 1280000,
    mileage: 28000,
    color: '曜石黑',
    transmission: 'automatic',
    fuelType: 'gasoline',
    condition: 'excellent',
    description: '進口原廠車，Sport Line版本，性能卓越，外觀動感，車況完美。M Sport套件加持，駕駛感極佳。',
    images: [
      'https://images.unsplash.com/photo-1555215695-3d98bc139490?w=800&q=80',
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80',
    ],
    features: ['M Sport套件', '抬頭顯示器', 'Harman Kardon音響', '環景攝影', '無線充電', '真皮座椅'],
    isAvailable: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    views: 256,
  },
  {
    id: '3',
    make: 'Tesla',
    model: 'Model 3 Long Range',
    year: 2023,
    price: 1650000,
    mileage: 8000,
    color: '深海藍',
    transmission: 'automatic',
    fuelType: 'electric',
    condition: 'excellent',
    description: '幾近全新，Long Range版本，續航里程超過500公里。全額貸款免頭期款，享政府補助。',
    images: [
      'https://images.unsplash.com/photo-1560958086-6f95d36f45dd?w=800&q=80',
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80',
    ],
    features: ['Autopilot', '全玻璃車頂', 'Premium音響', 'OTA更新', '超音波感應器', '15吋觸控螢幕'],
    isAvailable: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    views: 312,
  },
  {
    id: '4',
    make: 'Honda',
    model: 'Civic e:HEV',
    year: 2022,
    price: 760000,
    mileage: 22000,
    color: '晨霧灰',
    transmission: 'automatic',
    fuelType: 'hybrid',
    condition: 'good',
    description: '油電混合省油環保，市區油耗優異，適合通勤使用，原廠保固尚有一年。',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
    ],
    features: ['Honda SENSING', 'LaneWatch盲點系統', '電動尾門', '換檔撥片', 'HDMI輸入', 'LED大燈'],
    isAvailable: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    views: 89,
  },
  {
    id: '5',
    make: 'Mercedes-Benz',
    model: 'C300 AMG Line',
    year: 2020,
    price: 1580000,
    mileage: 45000,
    color: '鑽石白',
    transmission: 'automatic',
    fuelType: 'gasoline',
    condition: 'good',
    description: '賓士原廠認證中古車，原廠保固，MBUX智慧系統，豪華舒適，AMG外觀套件。',
    images: [
      'https://images.unsplash.com/photo-1618843986637-43b8e30c9f49?w=800&q=80',
      'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800&q=80',
    ],
    features: ['MBUX系統', '全景天窗', 'Burmester音響', '電動座椅', '記憶功能', 'AMG套件'],
    isAvailable: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    views: 445,
  },
  {
    id: '6',
    make: 'Lexus',
    model: 'RX 350h 旗艦版',
    year: 2023,
    price: 2180000,
    mileage: 5000,
    color: '星塵金',
    transmission: 'automatic',
    fuelType: 'hybrid',
    condition: 'excellent',
    description: '準新車，旗艦油電版本，頂規配置，靜謐舒適的豪華SUV體驗。自手保養，從未出險。',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    ],
    features: ['Mark Levinson音響', '360環景', '抬頭顯示器', '全景天窗', '電動尾門', '預碰撞系統'],
    isAvailable: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    views: 203,
  },
];

const STORAGE_KEY = 'usedCarSales_v1';

const App: React.FC = () => {
  const [merchantLoggedIn, setMerchantLoggedIn] = useState(false);
  const [cars, setCars] = useState<Car[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEMO_CARS;
    } catch {
      return DEMO_CARS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
  }, [cars]);

  const addCar = (car: Car) => setCars(prev => [car, ...prev]);
  const updateCar = (updated: Car) => setCars(prev => prev.map(c => c.id === updated.id ? updated : c));
  const deleteCar = (id: string) => setCars(prev => prev.filter(c => c.id !== id));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerApp cars={cars} />} />
        <Route
          path="/merchant"
          element={
            merchantLoggedIn
              ? <MerchantApp
                  cars={cars}
                  onAddCar={addCar}
                  onUpdateCar={updateCar}
                  onDeleteCar={deleteCar}
                  onLogout={() => setMerchantLoggedIn(false)}
                />
              : <MerchantLogin onLogin={() => setMerchantLoggedIn(true)} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
