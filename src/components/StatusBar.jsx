import { useState, useEffect } from 'react';
import { FiWifi, FiBattery } from 'react-icons/fi';

export default function StatusBar() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hrs}:${mins}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-2 bg-slate-50 text-slate-600 select-none text-xs border-b border-slate-100">
      <span className="font-semibold">{currentTime}</span>
      <div className="flex items-center gap-1.5 font-medium">
        <FiWifi className="w-3.5 h-3.5 text-emerald-600" />
        <span className="tracking-wide">5G</span>
        <FiBattery className="w-4 h-4 text-emerald-600" />
      </div>
    </div>
  );
}
