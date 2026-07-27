import { FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';

export default function TabSwitcher({ activeTab, setActiveTab, setError }) {
  return (
    <div className="px-4 py-2 bg-white">
      <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl relative">
        <button
          onClick={() => {
            setActiveTab('cashback');
            setError('');
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 select-none cursor-pointer ${
            activeTab === 'cashback'
              ? 'bg-[#0f7b4c] text-white shadow-md shadow-[#0f7b4c]/20 scale-[1.02]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          <FiArrowUpRight className={`w-3.5 h-3.5 ${activeTab === 'cashback' ? 'text-white' : 'text-slate-400'}`} />
          Cashback berish
        </button>
        <button
          onClick={() => {
            setActiveTab('withdraw');
            setError('');
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 select-none cursor-pointer ${
            activeTab === 'withdraw'
              ? 'bg-[#0f7b4c] text-white shadow-md shadow-[#0f7b4c]/20 scale-[1.02]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          <FiArrowDownLeft className={`w-3.5 h-3.5 ${activeTab === 'withdraw' ? 'text-white' : 'text-slate-400'}`} />
          Balansdan yechish
        </button>
      </div>
    </div>
  );
}
