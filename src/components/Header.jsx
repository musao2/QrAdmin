import { FiTrendingUp } from 'react-icons/fi';

export default function Header({ todayCount }) {
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
        
        {/* Today's QRs generated stats */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 py-1 px-2.5 rounded-full shadow-sm text-slate-600">
          <FiTrendingUp className="w-3 h-3 text-emerald-600" />
          <span className="text-[10px] font-medium tracking-tight">Bugun:</span>
          <span className="text-xs font-bold text-slate-800">{todayCount} ta</span>
        </div>
      </div>
    </div>
  );
}
