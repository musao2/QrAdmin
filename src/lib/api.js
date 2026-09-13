// API Service File
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Odatda login qilingandan so'ng token localStorage'da saqlanadi
function getAuthHeaders() {
  const token = localStorage.getItem('admin_access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

/**
 * Avtomatik token yangilash imkoniyatiga ega yordamchi fetch funksiyasi
 */
async function fetchWithAuth(url, options = {}) {
  let response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  });

  // Agar 401 kelsa va bizda refresh token bo'lsa
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('admin_refresh_token');
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/admin/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          const newAccessToken = data.accessToken || (data.data && data.data.accessToken) || data.token || (data.data && data.data.token);
          const newRefreshToken = data.refreshToken || (data.data && data.data.refreshToken);

          if (newAccessToken) {
            localStorage.setItem('admin_access_token', newAccessToken);
            if (newRefreshToken) localStorage.setItem('admin_refresh_token', newRefreshToken);
            
            // Asl so'rovni yangi token bilan qayta jo'natamiz
            response = await fetch(url, {
              ...options,
              headers: {
                ...getAuthHeaders(),
                ...(options.headers || {})
              }
            });
          }
        }
      } catch (refreshErr) {
        console.error('Tokenni yangilashda xatolik:', refreshErr);
      }
    }
  }

  return response;
}

/**
 * Backenddan joriy stansiya (yoki asosiy) keshbek foizini oladi
 * @returns {Promise<number>} - Keshbek foizi
 */
export async function fetchCashbackPercent() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/station`);
    if (response.status === 401) throw new Error('401 Unauthorized');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const body = await response.json();
    console.log("Station response (keshbek uchun):", body);

    const data = body.data || body;
    
    // Backenddan keshbek foizini olamiz (cashbackPercent yoki cashback_percent nomi bilan kelishi mumkin)
    const percent = data.cashbackPercent !== undefined ? data.cashbackPercent : data.cashback_percent;
    console.log("Qabul qilingan foiz:", percent);
    return percent !== undefined ? percent : 0;
  } catch (err) {
    if (err.message && err.message.includes('401')) throw err;
    console.error('fetchCashbackPercent xatolik:', err);
    return 0; // Fallback
  }
}

/**
 * Backenddan bugungi QR tokenlar sonini olamiz (statistikadan)
 * @returns {Promise<number>}
 */
export async function fetchTodayQrCount() {
  try {
    // const response = await fetchWithAuth(`${API_BASE_URL}/admin/dashboard/stats`);
    // if (response.status === 401) throw new Error('401 Unauthorized');
    // if (!response.ok) return 0;
    // const data = await response.json();
    // // Aytaylik, stats ichida todayQrCount qaytadi (agar yo'q bo'lsa 0)
    // return data.todayQrCount || 0;
    return 0;
  } catch (err) {
    if (err.message.includes('401')) throw err;
    console.error('fetchTodayQrCount xatolik:', err);
    return 0;
  }
}

/**
 * QR token yaratish
 * @param {Object} payload 
 * @returns {Promise<string>} - tokenning UUID/id si
 */
export async function createQrToken({ type, amount, cashbackPercent }) {
  // tip nomi API doc bo'yicha: "CASHBACK" | "WITHDRAW"
  const formattedType = type.toUpperCase(); 

  const response = await fetchWithAuth(`${API_BASE_URL}/admin/qr-tokens`, {
    method: 'POST',
    body: JSON.stringify({
      type: formattedType,
      amount: amount,
      cashbackPercent: cashbackPercent
    })
  });

  if (response.status === 401) throw new Error('401 Unauthorized');
  
  const body = await response.json().catch(() => ({}));
  
  if (!response.ok || body.success === false) {
    const errorMessage = body.error?.message || body.message || 'QR token yaratishda xatolik';
    throw new Error(errorMessage);
  }

  // Server yangi yaratilgan token ma'lumotlarini to'liq qaytaradi
  return body.data || body;
}

/**
 * QR token ishlatilgan yoki yo'qligini tekshirish
 * @param {string} tokenId
 * @returns {Promise<boolean>}
 */
export async function checkQrTokenStatus(tokenId) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/qr-tokens/${tokenId}`);
    if (response.status === 401) throw new Error('401 Unauthorized');
    if (!response.ok) return false;
    
    const body = await response.json();
    const token = body.data || body;
    // Agar serverda status "USED" bo'lsa, mijoz kodni o'qitib pulni yechib olgan degani
    return token.status === 'USED';
  } catch (err) {
    if (err.message.includes('401')) throw err;
    console.error('checkQrTokenStatus xatolik:', err);
    return false;
  }
}

/**
 * Admin sessiyasini yopish (Logout)
 */
export async function adminLogout() {
  const refreshToken = localStorage.getItem('admin_refresh_token');
  if (refreshToken) {
    try {
      await fetch(`${API_BASE_URL}/admin/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
    } catch (err) {
      console.error('Logout xatolik:', err);
    }
  }
  // Mahalliy saqlangan tokenlarni tozalash
  localStorage.removeItem('admin_access_token');
  localStorage.removeItem('admin_refresh_token');
}
