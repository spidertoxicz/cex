formal-kan FeatureFrame v1.1 — Expanded Controlled Spec.
Status:
Deterministic · Stateless (kecuali minimal delta cache) · No Threshold · No Hysteresis · No Cluster Logic
Tujuan:
Memberikan bahan mentah kaya untuk FSM
Tanpa membuat feature layer jadi mini-engine kedua
📊 FEATURE FRAME v1.1 — CONTRACT
🎯 Input
Ts
Salin kode
CanonicalBatch
🎯 Output
Ts
Salin kode
FeatureFrame
Pure mapping + lightweight derived metric.
🧱 1️⃣ Core Identity
Ts
Salin kode
export interface FeatureFrame {
  readonly tokenId: number;
  readonly tickId: bigint;
🟢 2️⃣ Trade Metrics (Per Tick Aggregate)
Ts
Salin kode
readonly tradeVolume: number;          // sum qty
  readonly tradeDelta: number;           // signed qty
  readonly tradeCount: number;
  readonly tradeAvgPrice?: number;       // volume-weighted avg
Derived:
Salin kode

tradeAvgPrice = sum(price * qty) / tradeVolume
🔹 Derived Trade Pressure
Ts
Salin kode
readonly deltaAbsRatio?: number;       // |delta| / volume
  readonly aggressionRatio?: number;     // aggressive trades ratio (if available)
deltaAbsRatio memberi insight dominasi side.
🟡 3️⃣ Book Structure
Ts
Salin kode
readonly bestBid?: number;
  readonly bestAsk?: number;
  readonly spread?: number;
  readonly midPrice?: number;
  readonly spreadPct?: number;
Derived:
Salin kode

midPrice = (bid + ask) / 2
spreadPct = spread / midPrice
SpreadPct penting untuk liquidity elasticity.
🟠 4️⃣ Mark & Spot Relationship
Ts
Salin kode
readonly markPrice?: number;
  readonly markVsMidDelta?: number;
  readonly markVsMidPct?: number;
Derived:
Salin kode

markVsMidDelta = markPrice - midPrice
markVsMidPct = markVsMidDelta / midPrice
Ini penting untuk divergence pre-detection.
🔴 5️⃣ Liquidation Pressure
Ts
Salin kode
readonly liquidationBuyVolume: number;
  readonly liquidationSellVolume: number;
  readonly netLiquidation: number;
  readonly liquidationImbalanceRatio?: number;
Derived:
Salin kode

netLiquidation = buy - sell
imbalance = |net| / totalLiquidation
Memberi early cascade signal.
🟣 6️⃣ Open Interest Structure (Minimal Stateful Cache)
Feature layer boleh menyimpan:
Salin kode

previousOI per token
Lalu:
Ts
Salin kode
readonly openInterest?: number;
  readonly oiDelta?: number;
  readonly oiVelocity?: number;
Derived:
Salin kode

oiDelta = currentOI - previousOI
oiVelocity = oiDelta / tickInterval
No smoothing di sini.
🔵 7️⃣ Funding Structure
Ts
Salin kode
readonly fundingRate?: number;
No transform. FSM akan baca skew.
🟤 8️⃣ Volatility Micro Signal (Optional Lightweight)
Tanpa full indicator:
Ts
Salin kode
readonly microPriceRange?: number;   // high-low in tick
Dari trade prices dalam batch.
Ini membantu detect compression vs expansion.
🧠 9️⃣ OHLC Builder (1m + 5m)
Disimpan terpisah:
Ts
Salin kode
export interface OHLCSnapshot {
  readonly timeframeMs: number;
  readonly bucketId: number;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly volume: number;
}
FeatureFrame boleh include reference:
Ts
Salin kode
readonly ohlc1m?: OHLCSnapshot;
  readonly ohlc5m?: OHLCSnapshot;
🔒 10️⃣ Determinism Rules
FeatureFrame tidak boleh:
❌ Pakai random
❌ Pakai Date.now()
❌ Gunakan smoothing EMA
❌ Gunakan window rolling > 1 tick
❌ Gunakan threshold
Semua itu FSM domain.
🧠 11️⃣ Apa Yang Sengaja Tidak Ada
Tidak ada:
DivergenceScore
CompressionScore
TriggerCost
Tier
HeatScore
Cluster awareness
FeatureFrame hanya menyediakan bahan.
🎯 12️⃣ Kenapa Ini Cocok Untuk FCT Manipulatif?
Karena FCT manipulasi muncul dari:
OI spike + delta imbalance
Mark vs spot drift
Spread compression
Liquidation imbalance
Funding skew
Semua bahan mentah sudah tersedia.
FSM nanti yang membaca pattern strukturalnya.
🔥 Blueprint Status Sekarang
Ingest deterministic ✔
Feature deterministic ✔
Derived metric terkendali ✔
No overengineering ✔
Hidden state bahan mentah cukup ✔
