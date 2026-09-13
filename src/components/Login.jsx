import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('Juda koʻp urinishlar! Iltimos, birozdan soʻng qayta urinib koʻring.');
        }
        throw new Error('Email yoki parol notoʻgʻri');
      }

      const data = await res.json();
      
      const token = data.accessToken || (data.data && data.data.accessToken) || data.token || (data.data && data.data.token);
      const refreshToken = data.refreshToken || (data.data && data.data.refreshToken);
      
      if (token) {
        localStorage.setItem('admin_access_token', token);
        if (refreshToken) {
          localStorage.setItem('admin_refresh_token', refreshToken);
        }
        onLoginSuccess();
      } else {
        console.error('Serverdan kelgan toliq javob:', data);

        throw new Error(`Token topilmadi. Server javobi: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Kassir Login</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f7b4c] outline-none"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f7b4c] outline-none pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#0f7b4c] hover:bg-[#0c623d] text-white rounded-xl font-bold transition-colors disabled:opacity-70"
          >
            {loading ? 'Kirilmoqda...' : 'Tizimga kirish'}
          </button>
        </form>
      </div>
    </div>
  );
}
