import { FiAlertTriangle } from 'react-icons/fi';

export default function DisplayScreen({ activeTab, amountStr, error }) {
  const formatDisplayAmount = (numStr) => {
    if (!numStr || numStr === '0') return '0';
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <div className="px-4 py-3 flex-1 flex flex-col justify-center min-h-[120px]">
      <div className="bg-[#0f7b4c]/5 border border-[#0f7b4c]/10 rounded-2xl p-5 text-center relative overflow-hidden flex flex-col justify-center items-center shadow-inner">
        <span className="text-[10px] font-extrabold tracking-widest text-[#0f7b4c] uppercase mb-1">
          {activeTab === 'cashback' ? "TO'LOV MIQDORI" : "YECHISH MIQDORI"}
        </span>
        <div className="flex items-baseline justify-center max-w-full overflow-hidden">
          <span className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight transition-all duration-150 truncate">
            {formatDisplayAmount(amountStr)}
          </span>
          <span className="text-sm font-bold text-slate-500 ml-1.5 uppercase">UZS</span>
        </div>
        {activeTab === 'cashback' && amountStr !== '0' && (
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/50 py-0.5 px-2 rounded-full mt-2.5 animate-fade-in">
            Mijoz keshbeki: +{formatDisplayAmount(String(Math.floor(parseInt(amountStr, 10) * 0.05)))} UZS (5%)
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 text-center font-semibold mt-2 flex items-center justify-center gap-1 animate-pulse">
          <FiAlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
