import { FiTrendingUp, FiLock, FiUnlock } from 'react-icons/fi';

export default function Header({ todayCount, isLocked, onToggleLock }) {
  return (
    <div className="px-5 pt-4 pb-2 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0f7b4c] flex items-center justify-center text-white font-black tracking-tighter text-sm shadow-md shadow-[#0f7b4c]/20">
            KB
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 tracking-tight leading-none">KeshBak</h1>
            <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              Kassa Operator Panel
            </span>
          </div>
        </div>
        
        {/* Header Action Controls */}
        <div className="flex items-center gap-2">
          {/* Lock Button Icon */}
          <button
            type="button"
            onClick={onToggleLock}
            title={isLocked ? "Ochish (PIN kodi)" : "Qulflash"}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer border active:scale-95 ${
              isLocked
                ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
                : 'bg-slate-50 hover:bg-emerald-50 border-slate-200/80 hover:border-emerald-300 text-slate-600 hover:text-[#0f7b4c] shadow-xs'
            }`}
          >
            {isLocked ? <FiLock className="w-4 h-4 text-rose-600" /> : <FiUnlock className="w-4 h-4" />}
          </button>

          {/* Today Count Badge */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 py-1 px-2.5 rounded-full shadow-sm text-slate-600">
            <FiTrendingUp className="w-3 h-3 text-emerald-600" />
            <span className="text-[10px] font-medium tracking-tight">Bugun:</span>
            <span className="text-xs font-bold text-slate-800">{todayCount} ta</span>
          </div>
        </div>
      </div>
    </div>
  );
}


