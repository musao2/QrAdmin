import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import StatusBar from './components/StatusBar';
import Header from './components/Header';
import TabSwitcher from './components/TabSwitcher';
import DisplayScreen from './components/DisplayScreen';
import Numpad from './components/Numpad';
import QrModal from './components/QrModal';

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

export default function App() {
  const [activeTab, setActiveTab] = useState('cashback'); // 'cashback' or 'withdraw'
  const [amountStr, setAmountStr] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [todayCount, setTodayCount] = useState(0);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrTokenId, setQrTokenId] = useState('');
  const [modalAmount, setModalAmount] = useState(0);
  const [modalType, setModalType] = useState('cashback');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [copied, setCopied] = useState(false);

  // Fetch count of today's generated QRs on load
  useEffect(() => {
    fetchTodayCount();
  }, []);

  // Countdown timer logic when modal is open
  useEffect(() => {
    if (!showModal || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showModal, timeLeft]);

  const fetchTodayCount = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Local midnight
      
      const { count, error: countError } = await supabase
        .from('qr_tokens')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());
        
      if (countError) throw countError;
      setTodayCount(count || 0);
    } catch (err) {
      console.error("Bugungi QR-kodlarni yuklashda xatolik:", err);
    }
  };

  const handleKeyPress = (val) => {
    setError('');
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    setAmountStr((prev) => {
      if (val === 'backspace') {
        if (prev.length <= 1) return '0';
        return prev.slice(0, -1);
      }
      
      // Limit to 9 digits (max 999 999 999 UZS)
      if (prev.length >= 9) return prev;

      if (val === '000') {
        if (prev === '0') return '0';
        return prev + '000';
      }

      if (val === '0') {
        if (prev === '0') return '0';
        return prev + '0';
      }

      // Normal digits 1-9
      if (prev === '0') return val;
      return prev + val;
    });
  };

  const handleCreateQr = async () => {
    const numericAmount = parseInt(amountStr, 10);
    if (!numericAmount || numericAmount <= 0) {
      setError('Iltimos, toʻlov miqdorini kiriting');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Generate local UUID
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes expiry

      // 2. Insert token into Supabase table: qr_tokens
      const { error: insertError } = await supabase
        .from('qr_tokens')
        .insert([
          {
            id: uuid,
            type: activeTab,
            amount: numericAmount,
            used: false,
            created_at: now.toISOString(),
            expires_at: expiresAt.toISOString()
          }
        ]);

      if (insertError) throw insertError;

      // 3. Construct QR code data string
      // Format: KESHBAK|<uuid>|<type>|<amount>
      const qrData = `KESHBAK|${uuid}|${activeTab}|${numericAmount}`;
      const encodedData = encodeURIComponent(qrData);
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`;

      // 4. Update states & Open Modal
      setQrTokenId(uuid);
      setQrCodeUrl(url);
      setModalAmount(numericAmount);
      setModalType(activeTab);
      setTimeLeft(300); // 5 minutes reset
      setShowModal(true);
      setCopied(false);

      // Refresh today count
      await fetchTodayCount();
    } catch (err) {
      console.error("QR yaratishda xatolik:", err);
      setError('Kutilmagan xatolik yuz berdi. Supabase ulanishini tekshiring.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAmountStr('0');
    setQrCodeUrl('');
    setQrTokenId('');
  };

  const copyQrLink = () => {
    const rawQrData = `KESHBAK|${qrTokenId}|${modalType}|${modalAmount}`;
    navigator.clipboard.writeText(rawQrData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col h-full bg-white relative">
      
      {/* StatusBar Component */}
      <StatusBar />

      {/* Header Component */}
      <Header todayCount={todayCount} />

      {/* TabSwitcher Component */}
      <TabSwitcher 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setError={setError} 
      />

      {/* DisplayScreen Component */}
      <DisplayScreen 
        activeTab={activeTab} 
        amountStr={amountStr} 
        error={error} 
      />

      {/* Numpad Component */}
      <Numpad onKeyPress={handleKeyPress} />

      {/* Generate QR Trigger Button */}
      <div className="px-5 pb-6">
        <button
          onClick={handleCreateQr}
          disabled={loading || amountStr === '0'}
          className={`w-full py-4 bg-[#0f7b4c] hover:bg-[#0c623d] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0f7b4c]/30 hover:shadow-xl active:scale-[0.99] select-none cursor-pointer transition-all ${
            loading ? 'animate-pulse' : ''
          }`}
        >
          <QrIcon className="w-5 h-5 shrink-0" />
          {loading ? 'Yaratilmoqda...' : 'QR yaratish'}
        </button>
      </div>

      {/* QrModal Component */}
      <QrModal 
        showModal={showModal}
        qrCodeUrl={qrCodeUrl}
        qrTokenId={qrTokenId}
        modalAmount={modalAmount}
        modalType={modalType}
        timeLeft={timeLeft}
        copied={copied}
        onCopy={copyQrLink}
        onClose={handleCloseModal}
      />
      
    </div>
  );
}
