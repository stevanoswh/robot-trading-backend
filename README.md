# Trading‑Simulator

Aplikasi sederhana untuk **menguji strategi crypto** berbasis indikator **DMI / ADX**.

* **Backend** : Node + Express (file orders.json sebagai "database")
* **Frontend** : Next.js 14 + Tailwind (form konfigurasi + log order)
* **Webhook** : Alert TradingView ➜ /webhook ➜ simulasi BUY / SELL

---

## 1. Fitur Utama

| Lapisan  | Fungsi                                                                                                                |
| -------- | --------------------------------------------------------------------------------------------------------------------- |
| Frontend | Form konfigurasi (symbol, timeframe, +DI, −DI, ADX, TP, SL, leverage) · Tampilan konfigurasi aktif · Tabel order live |
| Backend  | API REST /config, /orders, /webhook · Tarik harga Binance Testnet · Hitung TP / SL · Simpan order                     |

---

## 2. Prasyarat

* Node >= 20
* npm
* Akun TradingView (Free cukup)

> Jika ingin deploy Cloud Run ► butuh **gcloud CLI** (lihat bagian 6).

---

## 3. Jalankan Lokal

```bash
# kloning repo
$ git clone <repo-url>
$ cd trading-simulator

# install dependensi
$ (cd backend  && npm install)
$ (cd frontend && npm install)

# salin env contoh
$ cp backend/.env.example  backend/.env
$ cp frontend/.env.example frontend/.env.local

# jalankan backend
$ cd backend && npm run dev
# jalankan frontend di terminal lain
$ cd frontend && npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) – isi formulir, simpan, lihat tabel order.

---

## 4. Menghubungkan TradingView

1. **Webhook URL** : `http://localhost:4000/webhook?token=verySecret`
   (ganti domain produksi setelah deploy)
2. **Pesan (Message)** :

```json
{
  "symbol": "BTCUSDT",
  "plusDI": {{plot_0}},
  "minusDI": {{plot_1}},
  "adx": {{plot_2}},
  "timeframe": "15m"
}
```

3. Buat dua alert (BUY & SELL) memakai indikator DMI atau skrip PineScript.
4. Saat kondisi terpenuhi, TradingView mengirim POST → backend → order muncul.

> **Plan gratis** : biarkan tab chart terbuka agar alert aktif.

---

## 5. End‑point API

| Method | URL              | Kegunaan                            |
| ------ | ---------------- | ----------------------------------- |
| GET    | /config          | Ambil konfigurasi aktif             |
| POST   | /config          | Simpan konfigurasi baru (JSON body) |
| GET    | /orders          | Daftar order simulasi               |
| POST   | /webhook?token=… | Dipanggil oleh TradingView          |

Contoh order tersimpan:

```json
{
  "symbol": "BTCUSDT",
  "action": "BUY",
  "price_entry": "27123.12",
  "tp_price": "27665.58",
  "sl_price": "26851.89",
  "leverage": "10x",
  "timeframe": "15m",
  "timestamp": "2025-06-09T01:23:45Z"
}
```

---

## 6. Deploy Cepat (Cloud Run + Vercel)

### Backend – Cloud Run (tanpa Dockerfile)

```bash
# dari folder backend
$ gcloud run deploy tsim-api \
    --source . \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars \
        BINANCE_TESTNET_URL=https://testnet.binance.vision,\
        TV_TOKEN=verySecret,\
        FRONTEND_ORIGIN=https://trading-sim.vercel.app
```

### Frontend – Vercel

* Import repo `frontend/`
* Env: `NEXT_PUBLIC_API_BASE=https://tsim-api-uc.a.run.app`
* Deploy – dapat URL mis. `https://trading-sim.vercel.app`

Perbarui `FRONTEND_ORIGIN` di Cloud Run jika URL berubah.

---

## 7. Lisensi

MIT

---

> **Ringkas:** Jalankan backend & frontend, tempel Webhook URL di TradingView, lihat order simulasi muncul otomatis. Selesai.
