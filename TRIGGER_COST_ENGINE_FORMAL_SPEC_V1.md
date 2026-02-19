TRIGGER COST ENGINE — FORMAL SPEC v1.0
(Status: Deterministic · Structural Break Detector · Cost-of-Move Model)
Ini bukan indikator.
Ini model sederhana untuk menjawab:
“Seberapa mahal market digerakkan sekarang?”
Kalau mahal → sulit trigger.
Kalau murah → siap cascade.
TriggerCost tidak menentukan state.
Ia memberi sinyal ke FSM.
🧱 1️⃣ TUJUAN TRIGGER COST ENGINE
Mengukur 3 hal utama:
Liquidity Elasticity
Leverage Imbalance
Break Sensitivity
Output:
Salin kode

TriggerCostScore (0–100)
Semakin rendah → semakin murah trigger.
🧠 2️⃣ INPUT
TriggerCost membaca:
Salin kode

FeatureFrame
TierContext
ClusterContext (optional modifier)
Tidak membaca state langsung.
🧱 3️⃣ INTERNAL COMPONENTS
TriggerCost terdiri dari 4 komponen numerik:
🔵 A) Liquidity Compression Component
Jika:
spreadPct sangat kecil
microPriceRange kecil
volume rendah
Maka:
Salin kode

compressionScore naik
Compression tinggi → cost rendah (mudah break).
🟣 B) OI Density Component
Jika:
oiVelocity tinggi
oiDelta persist positif
fundingRate ekstrem
Maka:
Salin kode

densityScore naik
Leverage padat → cost rendah.
🔴 C) Divergence Pre-Break Component
Jika:
markVsMidPct menyimpang
deltaAbsRatio ekstrem
netLiquidation mulai muncul
Maka:
Salin kode

divergenceScore naik
Pre-break tension meningkat.
🟡 D) Elasticity Spike Component
Jika:
spreadPct melebar cepat
microPriceRange tiba-tiba naik
Maka:
Salin kode

elasticityScore naik
Ini biasanya awal unwind.
🧠 4️⃣ TRIGGER COST FORMULA
Gabungkan komponen:
Salin kode

rawScore =
  w1 * compressionScore +
  w2 * densityScore +
  w3 * divergenceScore +
  w4 * elasticityScore
Normalisasi ke 0–100.
Kemudian:
Salin kode

TriggerCost = 100 - rawScore
Semakin tinggi rawScore → semakin murah trigger.
🧠 5️⃣ TIER & CLUSTER MODIFIER
Final:
Salin kode

TriggerCost =
  TriggerCost × tier.thresholdMultiplier
  × cluster.triggerCostMultiplier
Cluster boleh membuat trigger lebih murah saat systemic fragile.
🧠 6️⃣ INTERACTION WITH FSM
FSM membaca:
Salin kode

if TriggerCost <= T1
  AND FragileScore tinggi
→ TRIGGER_READY
Dan:
Salin kode

if TriggerCost <= T2
  AND UnwindComponent tinggi
→ UNWIND
TriggerCost tidak boleh langsung ubah state.
🔒 7️⃣ DETERMINISM RULES
TriggerCost tidak boleh:
❌ Gunakan EMA liar
❌ Gunakan smoothing window panjang
❌ Gunakan random
❌ Gunakan time.now
Jika ada decay, harus fixed formula:
Salin kode

score = score * 0.9 + contribution
🧠 8️⃣ PERSISTENCE MODEL
TriggerCost boleh menyimpan:
Salin kode

previousScore
previousCompression
previousDensity
Tapi tidak lebih dari 1–2 tick memory.
🧠 9️⃣ FCT-SPECIFIC TUNING
Karena FCT manipulatif:
densityScore bobot lebih tinggi
divergenceScore bobot lebih tinggi
elasticityScore bobot sedang
compressionScore bobot rendah
Karena leverage stacking lebih penting dari liquidity depth.
🔥 10️⃣ TRIGGER COST INTERPRETATION
Salin kode

80–100 → mahal digerakkan
60–80  → normal
40–60  → fragile
20–40  → murah
0–20   → sangat murah (cascade zone)
Ini bukan probabilitas. Ini cost model.
🎯 STATUS SEKARANG — ENGINE CORE COMPLETE
Engine sekarang punya:
✔ Ingest deterministic
✔ Feature v1.1
✔ Token FSM
✔ Tier Engine
✔ TriggerCost Engine
✔ Cluster FSM
✔ EventPhase FSM
Semua layer formal.
Arsitektur inti selesai.
