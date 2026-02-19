TOKEN FSM — FORMAL SPEC v1.0
(Status: Deterministic · Sequential · Tier-Ready · No Random)
Ini bukan cuma enum.
Ini formal rule engine.
🧱 1️⃣ FSM ENUM (LOCKED)
Salin kode

0 = BUILD
1 = PRESSURE
2 = FRAGILE
3 = TRIGGER_READY
4 = UNWIND
5 = COOLDOWN
Tidak boleh skip state.
Tidak boleh reverse kecuali melalui path resmi.
🧠 2️⃣ FSM INPUT
FSM menerima:
Salin kode

FeatureFrame
ClusterContext (read-only modifier)
ClusterContext hanya berisi:
thresholdMultiplier
triggerCostMultiplier
regimeModifier
FSM tidak tahu token lain.
🧱 3️⃣ FSM INTERNAL STATE STRUCTURE
Ts
Salin kode
interface TokenFSMState {
  readonly state: FSMState;
  readonly stateEnterTick: bigint;

  readonly pressureScore: number;
  readonly fragileScore: number;
  readonly unwindScore: number;

  readonly hysteresisCounter: number;

  readonly lastOI?: number;
  readonly lastMidPrice?: number;
}
FSM boleh menyimpan minimal internal memory.
🧠 4️⃣ CORE STRUCTURAL COMPONENTS
FSM membaca FeatureFrame dan menghitung 4 struktur utama:
🔵 A) Pressure Component
Terbentuk jika:
oiVelocity > 0
deltaAbsRatio tinggi
spreadPct menyempit
funding skew mulai condong
PressureScore meningkat jika kondisi persist.
🟠 B) Fragility Component
Terbentuk jika:
oiDelta besar
fundingRate ekstrem
markVsMidPct menyimpang
spreadPct sangat kecil
liquidation imbalance satu sisi
FragileScore meningkat jika persist.
🔴 C) Trigger Readiness Component
Terbentuk jika:
FragileScore tinggi
microPriceRange menyempit
netLiquidation mulai muncul
aggressionRatio ekstrem
TriggerScore meningkat cepat tapi decay juga cepat.
🟣 D) Unwind Component
Terbentuk jika:
oiDelta negatif besar
liquidation spike
microPriceRange melebar
tradeVolume spike
delta berbalik tajam
UnwindScore naik cepat.
🧠 5️⃣ STATE TRANSITION RULES (FORMAL)
Semua threshold nanti Tier-adjusted.
BUILD → PRESSURE
Jika:
Salin kode

pressureScore >= P1
AND persist >= H1
PRESSURE → FRAGILE
Jika:
Salin kode

fragileScore >= F1
AND persist >= H2
FRAGILE → TRIGGER_READY
Jika:
Salin kode

triggerScore >= T1
AND persist >= H3
TRIGGER_READY → UNWIND
Jika:
Salin kode

unwindScore >= U1
Tidak perlu persist lama. Ini cascade.
UNWIND → COOLDOWN
Jika:
Salin kode

unwindScore menurun
AND oiVelocity stabil
AND persist >= H4
COOLDOWN → BUILD
Jika:
Salin kode

pressureScore rendah
fragileScore rendah
persist >= H5
🔒 6️⃣ HYSTERESIS RULE
Masuk state butuh persist kecil.
Keluar state butuh persist lebih besar.
Ini mencegah flip-flop.
🧠 7️⃣ DECAY MODEL (IMPORTANT)
Score tidak langsung reset.
Gunakan:
Salin kode

score = score * decayFactor + newContribution
DecayFactor tetap (misal 0.8).
Tidak boleh dynamic random.
🧠 8️⃣ TIER INTEGRATION
Threshold:
Salin kode

P1 = baseP1 × tierMultiplier
F1 = baseF1 × tierMultiplier
T1 = baseT1 × tierMultiplier
U1 = baseU1 × tierMultiplier
Tier ditentukan layer lain.
FSM hanya baca multiplier.
🔒 9️⃣ DETERMINISM CLAUSE
FSM tidak boleh:
❌ Gunakan Math.random
❌ Gunakan Date.now
❌ Gunakan smoothing time-based non-deterministic
❌ Gunakan async
Semua pure numeric.
🧠 10️⃣ STATE LOG EVENT (WAJIB)
Saat transisi:
Log:
Salin kode

tickId
fromState
toState
pressureScore
fragileScore
triggerScore
unwindScore
Untuk audit & replay debug.
🔥 11️⃣ FCT-SPECIFIC BEHAVIOR
Karena FCT manipulatif:
triggerScore boleh naik cepat
unwindScore boleh spike tajam
fragile decay lebih lambat dari pressure
Ini memberi karakter “event-driven token”.
🎯 STATUS SEKARANG
Engine sudah punya:
✔ Ingest deterministic
✔ Feature deterministic
✔ FSM formal structure
✔ Hysteresis rule
✔ Tier integration hook
✔ No skip state
