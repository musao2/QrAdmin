import { FiCheckCircle, FiClock, FiAlertTriangle, FiCheck, FiCopy } from 'react-icons/fi';

// Custom inline QR code icon
function QrIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <path d="M16 16h2v2h-2z" fill="currentColor" />
      <path d="M19 19h2v2h-2z" fill="currentColor" />
      <path d="M15 19h1v2h-1z" fill="currentColor" />
      <path d="M19 15h2v1h-2z" fill="currentColor" />
      <path d="M15 15h1v1h-1z" fill="currentColor" />
    </svg>
  );
}

export default function QrModal({
  showModal,
  qrCodeUrl,
  qrTokenId,
  modalAmount,
  modalType,
  timeLeft,
  copied,
  onCopy,
  onClose,
  modalPercent = 1.5,
  isUsed = false
}) {
  if (!showModal) return null;

  const formatDisplayAmount = (num) => {
    const numStr = String(num || 0);
    if (!numStr || numStr === '0') return '0';
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end transition-all duration-300">
      <div className="bg-white rounded-t-3xl max-h-[90%] overflow-y-auto w-full flex flex-col items-center pt-6 pb-8 px-6 shadow-2xl relative animate-slide-up border-t border-slate-100">
        
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Grab handle bar for modal sheet */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mb-6 shrink-0"></div>

        {/* Checkmark Header badge */}
        <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2.5 shrink-0 animate-bounce">
          <FiCheckCircle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-800 tracking-tight text-center">
          {isUsed ? "To'lov muvaffaqiyatli bajarildi!" : "QR-kod muvaffaqiyatli yaratildi"}
        </h3>
        
        {/* Dynamic Type Badge */}
        <div className="mt-2.5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            modalType === 'cashback'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-amber-50 text-amber-700 border border-amber-100'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${modalType === 'cashback' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            {modalType === 'cashback' ? `Cashback berish (${modalPercent}%)` : 'Balansdan yechish'}
          </span>
        </div>

        {/* Amount Box */}
        <div className="mt-3 flex items-baseline justify-center">
          <span className="text-3xl font-black text-slate-800 tracking-tight">
            {formatDisplayAmount(modalAmount)}
          </span>
          <span className="text-sm font-bold text-slate-500 ml-1.5">UZS</span>
        </div>

        {/* QR Code / Used Status Container */}
        <div className="my-6 relative p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-inner group">
          {/* Dynamic QR Guide Corners */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#0f7b4c]"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#0f7b4c]"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#0f7b4c]"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#0f7b4c]"></div>
          
          {isUsed ? (
            <div className="w-[200px] h-[200px] rounded-xl bg-emerald-50 border-2 border-emerald-500 flex flex-col items-center justify-center p-4 text-center animate-fade-in shadow-inner">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg shadow-emerald-500/30 animate-bounce">
                <FiCheckCircle className="w-10 h-10 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-black text-emerald-700 tracking-wider uppercase">O'TILDI</span>
              <span className="text-[11px] font-bold text-emerald-600/80 mt-1">Muvaffaqiyatli skanerlandi</span>
            </div>
          ) : (
            <img
              src={qrCodeUrl}
              alt="Scan KeshBak QR Code"
              className={`w-[200px] h-[200px] rounded-lg bg-white select-none transition-all duration-300 ${
                timeLeft <= 0 ? 'opacity-20 blur-xs grayscale' : 'opacity-100'
              }`}
            />
          )}

          {!isUsed && timeLeft <= 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <FiAlertTriangle className="w-8 h-8 text-red-500 mb-2 animate-bounce" />
              <p className="text-xs font-bold text-red-600 uppercase">QR muddati tugadi</p>
              <p className="text-[10px] text-slate-400 mt-1">Yangi QR-kod hosil qiling</p>
            </div>
          )}
        </div>

        {/* Countdown / Timer / Status Display */}
        {isUsed ? (
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold bg-emerald-50 py-1.5 px-4 rounded-full border border-emerald-200 select-none">
            <FiCheckCircle className="w-4 h-4 text-emerald-600" />
            <span>O'tildi (Mijoz skaner qildi)</span>
          </div>
        ) : timeLeft > 0 ? (
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium bg-slate-50 py-1.5 px-3.5 rounded-full border border-slate-100 select-none">
            <FiClock className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
            <span>Amal qilish muddati:</span>
            <span className="font-bold text-[#0f7b4c] tabular-nums">{formatTime(timeLeft)} daqiqa</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-red-600 text-xs font-bold bg-red-50 py-1.5 px-3.5 rounded-full border border-red-100 select-none">
            <FiAlertTriangle className="w-3.5 h-3.5" />
            <span>Muddati tugagan</span>
          </div>
        )}

        {/* QR Options & Action Bar */}
        <div className="w-full grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={onCopy}
            disabled={timeLeft <= 0}
            className="py-3 px-4 border border-slate-200 hover:border-slate-300 disabled:opacity-40 disabled:border-slate-200 rounded-xl text-slate-600 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 select-none transition-all"
          >
            {copied ? (
              <>
                <FiCheck className="w-4 h-4 text-emerald-600" />
                Nusxalandi!
              </>
            ) : (
              <>
                <FiCopy className="w-4 h-4" />
                Ma'lumot nusxasi
              </>
            )}
          </button>
          
          <button
            onClick={onClose}
            className="py-3 px-4 bg-[#0f7b4c] hover:bg-[#0c623d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 select-none transition-all shadow-md shadow-[#0f7b4c]/10"
          >
            <QrIcon className="w-4 h-4" />
            Yangi QR
          </button>
        </div>
        
      </div>
    </div>
  );
}
