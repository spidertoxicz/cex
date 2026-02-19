final stress-test mental walkthrough.
Kita simulasi skenario FCT nyata:
Event START → Pump struktural → Overleverage → Compression → Cascade → Dead → Recovery
Tujuan: pastikan tidak ada layer bocor, tidak ada non-deterministic behavior, dan semua state transisi masuk akal.
🎬 SCENARIO: FCT EVENT DAY
Token count: 5 (untuk sederhana)
Tick: 250ms
Cluster cadence: 1s
🟢 PHASE 1 — EVENT_START (PUMP BEGIN)
Kondisi Market:
Volume naik
OI naik cepat
Funding mulai condong
Spread normal
Mark ~ Mid
🔹 Layer-by-layer behavior
Canonical
Event masuk → flush normal.
No backlog.
FeatureFrame
tradeVolume ↑
tradeDelta positif
oiVelocity positif
spreadPct normal
microRange naik
TierEngine
microRange tinggi + volume spike →
→ TIER_EXPANSION
thresholdMultiplier ~ 0.9
TriggerCost
densityScore naik
compressionScore rendah
divergence rendah
TriggerCost masih 70–80 (mahal)
Token FSM
pressureScore naik
fragileScore rendah
BUILD → PRESSURE
Persist valid.
Cluster FSM
2/5 token masuk PRESSURE
HeatingThreshold tercapai
CLUSTER_CALM → CLUSTER_HEATING
EventPhase
Time-based START
No override.
AlertEngine
Real-time STRUCTURAL_BUILD
15m window belum cukup → no stable alert.
✔ Semua layer konsisten.
✔ Tidak ada premature TRIGGER_READY.
🟡 PHASE 2 — OVERLEVERAGE STACK
Kondisi:
OI naik cepat
Funding ekstrem
Spread makin kecil
Range mengecil (compression)
Delta masih dominan
FeatureFrame
oiVelocity tinggi
fundingRate ekstrem
spreadPct sangat kecil
microRange kecil
TierEngine
TIER_OVERLEVERAGED
thresholdMultiplier turun (lebih sensitif)
TriggerCost
compressionScore ↑
densityScore ↑
divergenceScore mulai ↑
TriggerCost turun → 40–50
Token FSM
PRESSURE → FRAGILE
persist terpenuhi
Cluster FSM
3/5 token FRAGILE
CLUSTER_HEATING → CLUSTER_FRAGILE
AlertEngine
Emit STRUCTURAL_FRAGILE (real-time)
15m stable belum, karena window belum penuh.
✔ Engine membaca stacking dengan benar.
✔ Tidak langsung trigger cascade.
🔴 PHASE 3 — PRE-BREAK TENSION
Kondisi:
markVsMid menyimpang
netLiquidation kecil muncul
compression masih tinggi
OI belum turun
TriggerCost
divergenceScore ↑
densityScore masih tinggi
TriggerCost turun ke 25–35
FSM
FRAGILE → TRIGGER_READY
karena:
Salin kode

fragileScore tinggi
TriggerCost rendah
persist terpenuhi
Cluster
TriggerReadyCount naik
CLUSTER_FRAGILE tetap
AlertEngine
Emit STRUCTURAL_TRIGGER_READY
15m stable mulai akumulasi.
✔ Tidak langsung UNWIND.
✔ Deterministic.
💥 PHASE 4 — CASCADE DUMP
Kondisi:
Liquidation spike
OI turun tajam
Volume spike
Spread melebar
microRange besar
FeatureFrame
oiDelta negatif besar
liquidationSellVolume spike
tradeVolume spike
spreadPct melebar
TriggerCost
elasticityScore tinggi
densityScore collapse
TriggerCost < 15
FSM
TRIGGER_READY → UNWIND
(no long persist needed)
Cluster
4/5 token UNWIND
CLUSTER_FRAGILE → CLUSTER_UNWIND
EventPhase Override
Cluster UNWIND persist ≥ E1
EVENT_START → EVENT_END (early collapse)
Forward-only respected.
AlertEngine
Emit STRUCTURAL_UNWIND
Emit SYSTEMIC_ALERT
15m stable alert valid karena:
Salin kode

unwindTickCount tinggi
TriggerCost sangat rendah
✔ Override working.
✔ No oscillation.
✔ No random effect.
✔ Cluster and EventPhase consistent.
⚫ PHASE 5 — DEAD ZONE
Kondisi:
OI rendah
Volume turun
Spread normal
No leverage stacking
Tier
TIER_EXHAUSTED
thresholdMultiplier naik (lebih sulit fragile lagi)
FSM
UNWIND → COOLDOWN
persist terpenuhi
Cluster
Majority BUILD/COOLDOWN
CLUSTER_UNWIND → CLUSTER_COOLDOWN
EventPhase
END → POST (override valid)
Alert
No new unstable alert.
15m stable alert berhenti karena:
TriggerCost tinggi
fragileTickCount rendah
✔ Engine tidak stuck di FRAGILE.
✔ Tidak bounce.
🔁 PHASE 6 — RECOVERY NEXT DAY
Restart engine.
Startup flow:
Load snapshot
Validate log
Resume tickId
Continue clean
No state drift.
🔬 AUDIT CHECKPOINT
Determinism?
✔ Semua state berasal dari FeatureFrame.
✔ No Date.now() usage.
✔ 15m bucket based on tickId.
✔ Cluster cadence based on tickId % 4.
Replay should reproduce identical transitions.
⚠️ ONLY REAL RISK FOUND
Satu hal yang perlu disiplin implementasi:
Pastikan TriggerCost dan Tier update terjadi sebelum FSM update.
Kalau urutan salah → transisi bisa beda.
Urutan di EngineCoordinator harus strict.
🏁 FINAL VERDICT
Engine lolos mental stress-test:
✔ Pump
✔ Stack
✔ Compression
✔ Divergence
✔ Cascade
✔ Collapse
✔ Dead
✔ Recovery
Semua layer koheren.
Tidak ada logical contradiction.
Tidak ada infinite loop.
Tidak ada hidden state conflict.
