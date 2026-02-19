Formalisasi Canonicalizer + Internal OHLC Builder
Ini fondasi determinism. Kalau ini bersih → semua layer di atas stabil.
Gue akan tulis dalam bentuk spec arsitektural, bukan kode dulu.
🧱 PART 1 — CANONICALIZER SPEC
🎯 Tujuan Canonicalizer
Canonicalizer harus memastikan:
Semua event terurut deterministik
Tidak ada race condition antar stream
Tidak ada duplicate
Tidak ada event hilang saat reconnect
Replay menghasilkan urutan identik
Target kita:
Deterministic event batch per micro-cycle.
🔹 1️⃣ Input Streams (Hybrid)
WebSocket
trades
bookTicker
markPrice
liquidation
Polling
Open Interest (adaptive interval)
Funding rate (interval tetap)
Snapshot sync (saat reconnect)
🔹 2️⃣ Event Normalization Contract
Semua event masuk diubah ke format internal:
Ts
Salin kode
CanonicalEvent {
  token: string
  source: 'trade' | 'book' | 'mark' | 'liq' | 'oi' | 'funding'
  exchangeTs: number
  localSeq: number
  payload: object
}
Rules:
exchangeTs selalu prioritas
localSeq increment per token (anti tie ambiguity)
Tidak ada processing di layer ini
🔹 3️⃣ Ordering Rule (Deterministic)
Per token:
Sort by:
exchangeTs ascending
source priority (fixed order)
localSeq ascending
Source priority harus fix, contoh:
Salin kode

trade → book → mark → liq → oi → funding
Jangan random. Jangan berubah.
🔹 4️⃣ Micro-Cycle Batch Output
Setiap 150–250ms:
Canonicalizer mengeluarkan:
Salin kode

CanonicalBatch(token)
  events: CanonicalEvent[]
  batchStartTs
  batchEndTs
FSM & feature extractor hanya boleh baca batch ini. Tidak boleh baca raw WS callback.
🔹 5️⃣ Reconnect Recovery Rule
Saat WS reconnect:
Pause state mutation
Ambil depth snapshot (opsional)
Ambil OI snapshot
Sinkronisasi timestamp
Resume batch processing
Tidak boleh:
langsung lanjut tanpa re-anchor
inject event tanpa ordering ulang
🔹 6️⃣ Replay Determinism Rule
Replay engine harus:
baca log CanonicalBatch
feed ulang ke FSM
hasil state timeline identik
Kalau tidak identik → canonical layer salah.
🧱 PART 2 — INTERNAL OHLC BUILDER SPEC
Sekarang kita buat OHLC internal.
Tidak boleh pakai Binance kline endpoint.
🎯 Tujuan
Bangun 1m & 5m candle dari canonical trade stream
Deterministic
Tidak tergantung external close time
Replay-identical
🔹 1️⃣ Time Bucket Rule
Untuk 1m:
Salin kode

bucket = floor(exchangeTs / 60_000)
Untuk 5m:
Salin kode

bucket = floor(exchangeTs / 300_000)
Tidak pakai local clock. Selalu exchangeTs.
🔹 2️⃣ Candle Structure
Ts
Salin kode
Candle {
  token: string
  timeframe: '1m' | '5m'
  bucketId: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  tradeCount: number
}
🔹 3️⃣ Update Rule
Saat trade event masuk batch:
If bucket belum ada:
open = price
high = price
low = price
close = price
If bucket ada:
high = max(high, price)
low = min(low, price)
close = price
volume += qty
tradeCount++
🔹 4️⃣ Candle Close Rule
Candle dianggap close jika:
Salin kode

currentBucket > bucketId
Close event harus deterministic. Tidak boleh berdasarkan timeout local.
🔹 5️⃣ OHLC Output Layer
OHLC builder hanya menghasilkan:
Current forming candle
Last closed candle
FSM boleh baca:
✔ 1m compression
✔ 5m compression
✔ wick ratio
✔ range expansion
Tidak boleh baca: ❌ unfinished future bucket
🧠 Layer Separation Final
Salin kode

WS + Polling
→ Canonicalizer
→ CanonicalBatch
→ Feature Extractor
→ OHLC Builder
→ Interpretation Layer
→ FSM
OHLC builder tidak boleh baca WS langsung. Harus baca CanonicalBatch.
🔒 Determinism Checklist
Engine dianggap deterministic jika:
✔ Batch ordering selalu sama
✔ OHLC bucket selalu sama
✔ Replay state timeline identik
✔ Adaptive cycle dipicu state, bukan event rate
✔ Tier update punya hysteresis
🎯 Status Engine Setelah Ini
Kalau canonicalizer + OHLC builder benar:
Engine lu naik dari 90–95%
→ mendekati deterministic maksimal yang mungkin di CEX.
Hidden exchange state tetap ada, tapi internal state stabil.
