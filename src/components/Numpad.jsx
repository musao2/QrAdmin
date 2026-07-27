import { FiDelete } from 'react-icons/fi';

export default function Numpad({ onKeyPress }) {
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="px-5 pb-4">
      <div className="grid grid-cols-3 gap-3">
        {keys.map((num) => (
          <button
            key={num}
            onClick={() => onKeyPress(String(num))}
            className="py-4 rounded-xl text-xl font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 active:bg-slate-200 active:scale-95 border border-slate-100 transition-all select-none flex items-center justify-center cursor-pointer shadow-sm"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => onKeyPress('000')}
          className="py-4 rounded-xl text-base font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 active:bg-slate-200 active:scale-95 border border-slate-100 transition-all select-none flex items-center justify-center cursor-pointer shadow-sm"
        >
          000
        </button>
        <button
          onClick={() => onKeyPress('0')}
          className="py-4 rounded-xl text-xl font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 active:bg-slate-200 active:scale-95 border border-slate-100 transition-all select-none flex items-center justify-center cursor-pointer shadow-sm"
        >
          0
        </button>
        <button
          onClick={() => onKeyPress('backspace')}
          className="py-4 rounded-xl text-xl font-bold bg-slate-50 text-red-500 hover:bg-red-50 hover:border-red-100 active:bg-red-100 active:scale-95 border border-slate-100 transition-all select-none flex items-center justify-center cursor-pointer shadow-sm"
          aria-label="Delete key"
        >
          <FiDelete className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
