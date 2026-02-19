📊 FEATURE EXTRACTION LAYER SPEC v1.0
(Status: Deterministic · Pure · No Side Effect)
Layer ini menerima:
Salin kode

CanonicalBatch
Dan menghasilkan:
Salin kode

FeatureFrame
Tanpa tahu FSM. Tanpa tahu cluster. Tanpa tahu storage.
Pure transformation.
🎯 1️⃣ TUJUAN FEATURE LAYER
Ubah raw canonical events → numeric structural signals
Agregasi per tick
Tidak simpan state jangka panjang (kecuali OHLC builder)
Tidak punya logic transisi
Tidak punya threshold
Tidak punya hysteresis
FSM nanti yang pakai output ini.
🧱 2️⃣ INPUT CONTRACT
Ts
Salin kode
export interface CanonicalBatch {
  readonly tokenId: number;
  readonly tickId: bigint;
  readonly events: readonly CanonicalEvent[];
}
Feature layer tidak boleh baca queue langsung.
🧠 3️⃣ OUTPUT CONTRACT — FeatureFrame
Ts
Salin kode
export interface FeatureFrame {
  readonly tokenId: number;
  readonly tickId: bigint;

  // Core structural metrics
  readonly tradeVolume: number;
  readonly tradeDelta: number;
  readonly tradeCount: number;

  readonly bestBid?: number;
  readonly bestAsk?: number;
  readonly spread?: number;

  readonly markPrice?: number;

  readonly liquidationBuyVolume: number;
  readonly liquidationSellVolume: number;

  readonly openInterest?: number;
  readonly fundingRate?: number;
}
Tidak boleh ada undefined liar kecuali memang source belum muncul.
Strict TS akan bantu ini.
🧠 4️⃣ FEATURE RULES PER SOURCE
🔹 TRADE
Aggregate per tick:
tradeVolume += qty
tradeCount += 1
tradeDelta += signedQty (buy positive, sell negative)
Tidak simpan individual trade.
🔹 BOOK
Ambil last event dalam tick:
bestBid = last.bestBid
bestAsk = last.bestAsk
spread = ask - bid
🔹 MARK
Ambil last markPrice dalam tick.
🔹 LIQUIDATION
Aggregate:
liquidationBuyVolume
liquidationSellVolume
🔹 OPEN_INTEREST
Ambil last OI dalam tick.
🔹 FUNDING
Ambil last fundingRate dalam tick.
🔒 5️⃣ Determinism Rules
Feature layer tidak boleh:
❌ Gunakan Date.now()
❌ Gunakan random
❌ Gunakan state dari tick sebelumnya (kecuali OHLC builder)
❌ Gunakan async
FeatureFrame harus pure function dari CanonicalBatch.
🧠 6️⃣ OHLC BUILDER (STATEFUL EXCEPTION)
OHLC builder adalah satu-satunya stateful bagian feature layer.
Timeframe:
1m
5m
Builder menerima:
trade events only
Rules:
BucketId = floor(exchangeTs / timeframeMs)
Open = first trade price in bucket
High = max price
Low = min price
Close = last price
Volume aggregate
OHLC builder state disimpan di memory, dan di-serialize ke snapshot nanti.
🔥 7️⃣ No Threshold In Feature Layer
Feature layer tidak boleh:
Menentukan FRAGILE
Menentukan PRESSURE
Menentukan TRIGGER_READY
Mengubah heat
Hanya mengeluarkan angka mentah.
🧠 8️⃣ Deterministic Guarantee
Jika:
CanonicalBatch sama
Urutan event sama
Maka FeatureFrame harus identik.
🧪 9️⃣ Test Plan Singkat
Empty batch → FeatureFrame zeroed
Trade-only batch → volume & delta benar
Mixed source batch → semua metric benar
Tie ordering tidak mempengaruhi agregasi
Replay identical batch → identical FeatureFrame
🎯 10️⃣ Layer Isolation
Dependency flow:
Salin kode

CanonicalEngine
        ↓
FeatureExtractor
        ↓
Token FSM
Feature layer tidak boleh tahu FSM. FSM tidak boleh tahu CanonicalQueue.
🔥 Blueprint Status Sekarang
✔ Ingest deterministic
✔ Feature deterministic
✔ OHLC builder scoped
✔ No cross-layer leak
Backbone menuju FSM sudah siap.
