EVENT PHASE FSM — FINAL FORMAL SPEC v1.0
(Status: Deterministic · Hybrid Config + Structural Override · Forward-Only)
EventPhase adalah context layer, bukan trading logic layer.
Ia mengontrol sensitivitas Cluster FSM.
Tidak pernah membaca FeatureFrame langsung.
Tidak pernah override Token FSM.
🧱 1️⃣ ENUM (LOCKED)
Salin kode

0 = EVENT_PREP
1 = EVENT_START
2 = EVENT_MID
3 = EVENT_END
4 = EVENT_POST
Forward-only.
Tidak boleh mundur state.
🧠 2️⃣ INPUT
EventPhase menerima:
Salin kode

currentTick
ClusterState
ClusterDistribution
ConfigEventSchedule
Ia tidak membaca FeatureFrame atau TokenFSM langsung.
🧱 3️⃣ CONFIG STRUCTURE
Ts
Salin kode
interface EventScheduleConfig {
  readonly startTs: number;
  readonly midTs: number;
  readonly endTs: number;
  readonly postTs: number;
}
Timestamp dari config.
Tidak boleh dynamic.
🧠 4️⃣ PRIMARY PHASE RULE (TIME-BASED)
Jika override tidak aktif:
Salin kode

if now < startTs → PREP
if startTs ≤ now < midTs → START
if midTs ≤ now < endTs → MID
if endTs ≤ now < postTs → END
if now ≥ postTs → POST
Deterministic.
🧠 5️⃣ STRUCTURAL OVERRIDE RULE (HYBRID)
Override hanya boleh:
Forward
Persist-based
Berbasis ClusterState
🔥 EARLY COLLAPSE OVERRIDE
Jika:
Salin kode

ClusterState == CLUSTER_UNWIND
AND
unwindCount >= ceil(N × 0.6)
AND
persist >= E1
Maka:
Salin kode

EventPhase → EVENT_END
Walaupun waktu belum masuk endTs.
🔥 POST-COLLAPSE OVERRIDE
Jika:
Salin kode

ClusterState == CLUSTER_COOLDOWN
AND
≥ 70% token BUILD
AND
persist >= E2
Maka:
Salin kode

EventPhase → EVENT_POST
🔒 6️⃣ FORWARD-ONLY RULE
EventPhase tidak boleh:
Dari END kembali ke MID
Dari POST kembali ke START
Dari START kembali ke PREP
Ini penting untuk determinism.
🧠 7️⃣ HYSTERESIS
Override butuh persist minimal.
Misal:
Salin kode

E1 = 10 cluster tick (10 detik)
E2 = 20 cluster tick
Mencegah flip karena 1 spike.
🧠 8️⃣ INTERACTION WITH CLUSTER
EventPhase memodifikasi:
HeatingThreshold
FragileThreshold
UnwindThreshold
Tidak langsung modifikasi token.
🧠 9️⃣ FAILURE MODE SAFETY
Jika:
Config timestamp invalid
Timestamp tidak urut
Engine harus fail-fast saat startup.
Tidak boleh lanjut dengan schedule salah.
🔒 10️⃣ DETERMINISM GUARANTEE
EventPhase hanya boleh bergantung pada:
Config
ClusterState snapshot
Persist counter
Tidak boleh:
❌ Gunakan Date.now() langsung di logic
❌ Gunakan random
❌ Gunakan asynchronous check
Tick-based evaluation only.
🧠 11️⃣ WHY THIS MATTERS FOR FCT
FCT:
Pump saat START
Stabilisasi di MID
Dump saat END
Dead di POST
Hybrid override memastikan:
Jika dump datang lebih cepat → phase adapt
Jika event mati lebih cepat → phase tidak stuck
Tanpa membuat engine probabilistik.
🎯 FINAL STATUS — CORE ENGINE STRUCTURE
Sekarang engine punya:
✔ GlobalClock
✔ CanonicalEngine
✔ FeatureLayer v1.1
✔ Token FSM
✔ Cluster FSM
✔ EventPhase FSM
✔ Deterministic guardrails
✔ Failure spec
✔ Performance spec
Blueprint arsitektur sudah lengkap secara struktur.
