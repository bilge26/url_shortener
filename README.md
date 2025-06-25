# 🔗 URL Shortener API

Basit ve güvenli bir link kısaltma servisi.  
JWT tabanlı kullanıcı yönetimi, URL istatistikleri, rate limiting ve Redis cache içerir.

---

## 🚀 Özellikler

- ✅ Uzun URL'leri kısa linke çevirme
- ✅ Özel (custom) alias belirleme
- ✅ URL süresi belirleme (expiration)
- ✅ Tıklama sayısı ve lokasyon istatistikleri
- ✅ Kullanıcı kayıt/giriş sistemi (JWT)
- ✅ Rate limiting (IP bazlı)
- ✅ Redis cache desteği
- ✅ Malicious URL engelleme

---

## 📦 Kurulum

```bash
git clone https://github.com/kullaniciAdi/url-shortener.git
cd url-shortener
npm install

.env dosyası örneği:
PORT=3000
DATABASE_URL=postgresql://kullanici:sifre@localhost:5432/urlshortener
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=benimGizliAnahtarim
Veritabanı tablolarını oluşturmak için:

node src/initDb.js
🧪 Çalıştırma

npm run dev
🔐 Auth API
POST /auth/register

{
  "email": "test@example.com",
  "password": "sifre123"
}
POST /auth/login

{
  "email": "test@example.com",
  "password": "sifre123"
}
➡ Response:

{ "token": "..." }
🔗 URL API
🔒 POST /shorten
Authorization: Bearer <token>

{
  "original_url": "https://example.com",
  "custom_alias": "ornek",          // opsiyonel
  "expires_at": "2025-12-31T23:59:59Z" // opsiyonel
}
➡ Response:

{
  "short_url": "http://localhost:3000/ornek",
  "short_code": "ornek",
  "original_url": "...",
  "expires_at": "..."
}
🔁 GET /:shortCode
Kısaltılmış URL’ye gidildiğinde orijinal URL’ye yönlendirir.

📊 GET /api/shorten/stats/:shortCode
Authorization: Bearer <token>

➡ Sadece link sahibine açık. Tıklama detaylarını döner.

⚙ Teknik Yığın
Node.js + Express

PostgreSQL (veritabanı)

Redis (cache, rate limit)

JWT (kimlik doğrulama)

bcrypt (şifreleme)

Jest + Supertest (testler)

geoip-lite (lokasyon çözümleme)

📂 Proje Yapısı
src/
├── controllers/
├── routes/
├── models/
├── middleware/
├── utils/
├── config/
├── tests/
✨ Geliştirici Notları
rateLimiter.js ile IP bazlı 60 saniyede 10 istek sınırı var.

urlValidator.js ile zararlı URL’ler engellenir.

Tüm kritik işlemler loglanır, hata durumları yönetilir.
