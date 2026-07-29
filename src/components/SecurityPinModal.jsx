import React, { useState, useEffect } from 'react';
import { Delete, X, ShieldCheck, AlertCircle, KeyRound } from 'lucide-react';

export default function SecurityPinModal({ isOpen, onClose, onSuccess, title, description }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Read PIN code from .env environment variable (defaults to 123456 if not set)
  const EXPECTED_PIN = import.meta.env.VITE_SECURITY_CODE || '123456';

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
      setIsShaking(false);
    }
  }, [isOpen]);

  // Physical keyboard support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handlePressDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDeleteDigit();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin]);

  if (!isOpen) return null;

  const handlePressDigit = (digit) => {
    if (pin.length >= 6) return;
    setError('');
    const newPin = pin + digit;
    setPin(newPin);

    // Auto verify when 6th digit is pressed
    if (newPin.length === 6) {
      verifyPin(newPin);
    }
  };

  const handleDeleteDigit = () => {
    setError('');
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setError('');
    setPin('');
  };

  const verifyPin = (codeToVerify) => {
    const code = codeToVerify || pin;
    if (code === EXPECTED_PIN) {
      setError('');
      onSuccess();
      onClose();
    } else {
      setError("❌ Xato 6 xonali PIN-kod! Iltimos, qayta kiriting.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all ${
          isShaking ? 'animate-bounce border-rose-500' : ''
        }`}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            {title || 'Xavfsizlik Tasdiqlash Kodi'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {description || "Davom etish uchun 6 xonali maxfiy PIN-kodni kiriting."}
          </p>
        </div>

        {/* PIN Display Slots */}
        <div className="p-6 space-y-6 bg-white">
          <div className="flex justify-center items-center gap-2.5">
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const isFilled = pin.length > index;
              return (
                <div
                  key={index}
                  className={`w-11 h-13 rounded-2xl border-2 flex items-center justify-center text-xl font-black transition-all ${
                    isFilled
                      ? 'border-[#0f7b4c] bg-emerald-50 text-[#0f7b4c] shadow-sm scale-105'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  {isFilled ? '●' : ''}
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {error ? (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center justify-center gap-2 text-center">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tizim 6-xonali maxfiy PIN-kod bilan himoyalangan</span>
            </div>
          )}

          {/* Numeric Keypad Buttons */}
          <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handlePressDigit(num)}
                className="h-14 rounded-2xl bg-slate-50 hover:bg-emerald-50 active:bg-emerald-100 border border-slate-200/80 hover:border-emerald-300 text-slate-800 hover:text-[#0f7b4c] text-xl font-bold transition-all shadow-sm active:scale-95 select-none"
              >
                {num}
              </button>
            ))}

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all shadow-sm active:scale-95 select-none"
            >
              C
            </button>

            {/* Zero Button */}
            <button
              type="button"
              onClick={() => handlePressDigit('0')}
              className="h-14 rounded-2xl bg-slate-50 hover:bg-emerald-50 active:bg-emerald-100 border border-slate-200/80 hover:border-emerald-300 text-slate-800 hover:text-[#0f7b4c] text-xl font-bold transition-all shadow-sm active:scale-95 select-none"
            >
              0
            </button>

            {/* Backspace Delete Button */}
            <button
              type="button"
              onClick={handleDeleteDigit}
              className="h-14 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 flex items-center justify-center transition-all shadow-sm active:scale-95 select-none"
              title="O'chirish"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Manual Submit Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => verifyPin()}
              disabled={pin.length !== 6}
              className="w-full py-3.5 rounded-2xl bg-[#0f7b4c] hover:bg-[#0a5c39] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99]"
            >
              Tasdiqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
