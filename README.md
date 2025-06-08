# Backend Trading‑Simulator (Node.js + Express)

Dokumentasi singkat, praktis, dan berbahasa **Indonesia** untuk backend yang menerima sinyal TradingView, mengambil harga dari Binance Testnet, mensimulasikan order beserta TP/SL & leverage, lalu menyimpan log‑nya.

---
## 1. Ringkasan Teknologi
| Lapisan | Library | Fungsi |
|---------|---------|--------|
| Routing | **Express 4** | Endpoint `/config`, `/webhook`, `/orders` |
| Validasi | **Joi 17** | Memastikan payload & config benar |
| Service  | **Axios** | Panggil API Binance & logika strategi |
| Penyimpanan | `fs/promises` | Simpan config dan orders ke file JSON |
| Env | **dotenv** | Baca variabel lingkungan |

Arsitektur mengikuti pola *Clean Architecture* (routes → controllers → services → repositories) agar mudah diuji dan dikembangkan.

---
## 2. Struktur Folder
```text
backend/
├─ src/
│  ├─ app.js                # Inisialisasi Express
│  ├─ server.js             # Jalankan & shutdown server
│  ├─ config/defaultConfig.json  # Config strategi aktif
│  ├─ controllers/*.js      # Logika HTTP
│  ├─ routes/*.js           # Definisi endpoint
│  ├─ services/*.js         # Logika bisnis (strategi, Binance)
│  ├─ repositories/*.js     # Baca/tulis JSON
│  ├─ utils/*.js            # Helper perhitungan & validasi
│  └─ middlewares/errorHandler.js
├─ models/orders.json       # File log order (dibuat otomatis)
├─ .env.example             # Contoh env
└─ package.json             # Dependensi & script
```

---
## 3. Instalasi Cepat
```bash
# clone repo
$ git clone <repo-url>
$ cd trading-simulator-backend

# pasang dependensi
$ npm install

# salin & edit env
$ cp .env.example .env      # ubah PORT / BINANCE_TESTNET_URL jika perlu

# jalankan mode dev (reload otomatis)
$ npm run dev               # http://localhost:4000
```

---
## 4. Variabel Lingkungan Penting (`.env`)
| Nama | Default | Keterangan |
|------|---------|------------|
| `PORT` | `4000` | Port server |
| `BINANCE_TESTNET_URL` | `https://testnet.binance.vision` | Endpoint harga spot |
| `BINANCE_API_KEY` & `BINANCE_API_SECRET` | (kosong) | Hanya perlu bila ingin mengeksekusi order sungguhan di testnet |

---
## 5. Endpoint API
| Method & Path | Deskripsi Singkat |
|---------------|-------------------|
| **POST `/config`** | Simpan / perbarui parameter strategi |
| **GET  `/config`** | Ambil config aktif |
| **POST `/webhook`** | Terima sinyal TradingView, validasi, hitung TP/SL, log order |
| **GET  `/orders`** | Ambil seluruh order simulasi |

### Payload Contoh
**POST `/config`**
```json
{
  "symbol": "BTCUSDT",
  "timeframe": "5m",
  "plusDIThreshold": 25,
  "minusDIThreshold": 20,
  "adxMinimum": 20,
  "takeProfitPercent": 2,
  "stopLossPercent": 1,
  "leverage": 10
}
```

**POST `/webhook`**
```json
{
  "symbol": "BTCUSDT",
  "plusDI": 27.5,
  "minusDI": 15,
  "adx": 25,
  "timeframe": "5m"
}
```

---
## 6. Alur `/webhook`
1. **Validasi** payload dengan Joi.
2. **Bandingkan** nilai +DI/–DI/ADX dengan ambang batas pada config.
3. Jika BUY/SELL:
   * Ambil harga terkini dari Binance Testnet.
   * Hitung `tp_price` dan `sl_price` (rumus: `entry ± persen`).
   * Simpan objek order ke `models/orders.json`.
4. Balikkan respons `201 Created` berisi data order.
5. Jika tidak memenuhi syarat ➜ `200 OK` pesan "Signal diabaikan".

---
## 7. Contoh cURL
```bash
# simpan konfigurasi
curl -X POST http://localhost:4000/config \
  -H 'Content-Type: application/json' \
  -d '{"symbol":"BTCUSDT","timeframe":"5m","plusDIThreshold":25,"minusDIThreshold":20,"adxMinimum":20,"takeProfitPercent":2,"stopLossPercent":1,"leverage":10}'

# kirim sinyal BUY
curl -X POST http://localhost:4000/webhook \
  -H 'Content-Type: application/json' \
  -d '{"symbol":"BTCUSDT","plusDI":30,"minusDI":10,"adx":28,"timeframe":"5m"}'

# lihat order yang tersimpan
curl http://localhost:4000/orders | jq
```

---
## 8. Langkah Berikutnya (Opsional)
- Tambah **unit test** dengan Jest.
- Ganti penyimpanan file ke database (MongoDB/PostgreSQL).
- Deploy ke **Vercel, Render, Fly.io**, atau serverless (AWS Lambda).
- Tambah autentikasi JWT & WebSocket untuk feed realtime.

---
Selamat mencoba! 🚀
