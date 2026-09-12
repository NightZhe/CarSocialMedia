import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Car } from './types';
import CustomerApp from './components/customer/CustomerApp';
import MerchantApp from './components/merchant/MerchantApp';
import MerchantLogin from './components/merchant/MerchantLogin';
import { DEMO_CARS } from './data/demoCars';

const STORAGE_KEY = 'usedCarSales_v2';

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
