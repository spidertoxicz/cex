TIER ENGINE — FORMAL SPEC v1.0
(Status: Deterministic · Structural Regime Detector · Threshold Modifier Only)
Tier Engine menentukan regime karakter token saat ini.
Tier tidak menentukan state.
Tier hanya memodifikasi threshold FSM.
🧱 1️⃣ TUJUAN TIER ENGINE
Menentukan apakah token sedang dalam:
Low volatility regime
Expansion regime
High leverage density regime
Illiquid compression regime
Karena FCT manipulatif, tier penting untuk adaptif threshold.
🧱 2️⃣ TIER ENUM (LOCKED)
Salin kode

0 = TIER_NEUTRAL
1 = TIER_EXPANSION
2 = TIER_COMPRESSED
3 = TIER_OVERLEVERAGED
4 = TIER_EXHAUSTED
Forward/backward allowed, tapi hysteresis wajib.
🧠 3️⃣ INPUT
Tier membaca:
Salin kode

FeatureFrame
(Optionally short rolling window internal state)
Tidak membaca cluster langsung.
🧱 4️⃣ STRUCTURAL SIGNAL SOURCES
Tier membaca 4 domain:
🔵 A) Volatility Domain
Input:
microPriceRange
spreadPct
tradeVolume spike
Indikasi:
Expansion jika range tinggi
Compression jika range rendah + spread kecil
🟣 B) Leverage Density Domain
Input:
oiVelocity
oiDelta
fundingRate magnitude
Indikasi:
Overleveraged jika OI naik cepat + funding ekstrem
🟡 C) Liquidity Elasticity Domain
Input:
spreadPct
markVsMidPct
Indikasi:
Illiquid compression jika spread sangat kecil
Elastic collapse jika spread melebar cepat
🔴 D) Exhaustion Domain
Input:
oiDelta negatif besar
liquidation spike
tradeVolume spike
Indikasi:
Exhausted setelah cascade
🧠 5️⃣ TIER DETERMINATION RULES (FORMAL)
TIER_NEUTRAL
Default.
Jika tidak memenuhi kondisi lain.
TIER_EXPANSION
Jika:
Salin kode

microPriceRange tinggi
AND tradeVolume spike
AND spreadPct normal
Persist ≥ T1
TIER_COMPRESSED
Jika:
Salin kode

microPriceRange rendah
AND spreadPct sangat kecil
AND tradeVolume rendah
Persist ≥ T2
TIER_OVERLEVERAGED
Jika:
Salin kode

oiVelocity tinggi
AND fundingRate ekstrem
AND oiDelta persist positif
Persist ≥ T3
TIER_EXHAUSTED
Jika:
Salin kode

oiDelta negatif besar
AND liquidation spike
AND volume spike
Persist ≥ T4
🔒 6️⃣ HYSTERESIS RULE
Tier tidak boleh flip cepat.
Masuk tier butuh persist minimal. Keluar tier butuh persist lebih lama.
🧠 7️⃣ OUTPUT CONTRACT
Ts
Salin kode
interface TierContext {
  readonly tier: TierType;
  readonly thresholdMultiplier: number;
  readonly decayMultiplier: number;
}
Example Multiplier
TIER_OVERLEVERAGED:
Salin kode

thresholdMultiplier = 0.85
decayMultiplier = 0.9
Lebih sensitif ke FRAGILE.
TIER_COMPRESSED:
Salin kode

thresholdMultiplier = 0.8
Lebih mudah trigger breakout.
TIER_EXHAUSTED:
Salin kode

thresholdMultiplier = 1.2
Lebih sulit kembali ke FRAGILE.
🔒 8️⃣ DETERMINISM RULES
Tier tidak boleh:
❌ Gunakan random
❌ Gunakan time-based decay liar
❌ Gunakan cluster state
❌ Gunakan async
Tier hanya baca FeatureFrame + minimal internal rolling state.
🧠 9️⃣ WHY TIER PENTING UNTUK FCT
Karena FCT:
Sering compress sebelum pump
Sering overleverage sebelum dump
Sering exhausted setelah cascade
Tanpa tier, threshold statis terlalu kaku.
🎯 STATUS SEKARANG
Engine punya:
✔ Token FSM
✔ Cluster FSM
✔ EventPhase FSM
✔ Tier Engine
