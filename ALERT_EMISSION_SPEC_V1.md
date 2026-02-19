ALERT EMISSION SPEC — v1.0
(Status: Deterministic · Log-Backed · 15m Stable · DePIN-Ready)
Ini bukan “signal cepat scalping”.
Ini adalah structural alert layer untuk:
Intraday decision
DePIN distribution
Audit & replay verification
Low-noise systemic signal
🧱 1️⃣ DESIGN PRINCIPLES
1️⃣ Alert tidak boleh berbasis probabilitas
2️⃣ Alert hanya keluar pada tick boundary
3️⃣ Alert bisa direplay dari log
4️⃣ Alert tidak boleh async-trigger
5️⃣ Alert harus deterministik
6️⃣ Alert 15m cadence wajib stabil
🧠 2️⃣ ALERT ENGINE POSITION
Layering:
Salin kode

FSM
   ↓
Cluster
   ↓
EventPhase
   ↓
AlertEngine
AlertEngine membaca:
TokenFSMState
TierState
TriggerCost
ClusterState
EventPhase
Tidak membaca FeatureFrame langsung.
🧱 3️⃣ ALERT TYPES (FCT MODE)
Enum:
Salin kode

0 = NO_ALERT
1 = STRUCTURAL_BUILD
2 = STRUCTURAL_FRAGILE
3 = STRUCTURAL_TRIGGER_READY
4 = STRUCTURAL_UNWIND
5 = SYSTEMIC_ALERT
🧠 4️⃣ ALERT CADENCE MODEL
Ada dua layer:
🔹 A) Real-Time Alert (Event-Based)
Trigger saat state transition terjadi:
FRAGILE enter
TRIGGER_READY enter
UNWIND enter
Cluster >= FRAGILE
Emit immediately.
Tapi tetap tick-boundary.
🔹 B) 15-Min Stable Alert (Primary DePIN Output)
Setiap 15 menit (aligned to engine tick cycle):
Engine melakukan evaluasi stabilitas struktur.
Rule:
Salin kode

Take last 15m window state distribution
If ≥ X% tick in FRAGILE/TRIGGER_READY
AND TriggerCost <= threshold
AND not in COOLDOWN
→ emit stable alert
🧠 5️⃣ 15M WINDOW MODEL
15 menit = 900 detik
Tick = 250ms
3600 tick per 15m
Engine menyimpan rolling counter:
Salin kode

fragileTickCount
triggerReadyTickCount
unwindTickCount
No sliding window expensive.
Gunakan bucket 15m ring buffer.
🔒 6️⃣ STABILITY RULE
Stable alert hanya keluar jika:
Salin kode

(triggerReadyTickCount / totalTick) ≥ S1
AND
avgTriggerCost ≤ C1
AND
not in COOLDOWN
Ini menghindari noise spike.
🧠 7️⃣ SYSTEMIC ALERT RULE
Jika:
Salin kode

ClusterState >= CLUSTER_FRAGILE
AND
persist ≥ 5 detik
Emit SYSTEMIC_ALERT meski individual score kecil.
Ini cocok dengan:
PSFS tinggi meski token score kecil tetap alert
🧠 8️⃣ ALERT PAYLOAD CONTRACT
Ts
Salin kode
interface StructuralAlert {
  readonly tokenId?: number; // null for systemic
  readonly alertType: AlertType;
  readonly tickId: bigint;
  readonly fsmState: FSMState;
  readonly clusterState: ClusterFSMState;
  readonly eventPhase: EventPhase;
  readonly triggerCost: number;
  readonly confidenceScore: number; // 0–100 deterministic formula
}
confidenceScore bukan probabilitas. Itu derived structural consistency score.
🧠 9️⃣ CONFIDENCE SCORE MODEL
Salin kode

confidence =
  w1 * statePersistenceRatio +
  w2 * triggerCostInversion +
  w3 * clusterWeight
Bounded 0–100.
No random.
🔒 10️⃣ DETERMINISM GUARANTEE
AlertEngine hanya boleh:
Evaluasi saat tick
Gunakan stored state counters
Gunakan deterministic math
Tidak boleh:
❌ Pakai timer terpisah
❌ Async delay
❌ External API check
❌ Random
Replay log harus menghasilkan alert identik.
🧠 11️⃣ DEPIN STRENGTH
Karena:
Alert bisa direkonstruksi dari log
15m stable bukan spike
Systemic alert berbasis cluster
Semua threshold documented
Engine bisa diverifikasi node lain.
🧠 12️⃣ ALERT VS SCALPING
Real-time alert bisa dipakai scalping.
15m stable alert untuk:
Intraday trade
Publish ke DePIN
Konsumsi publik
Dua layer berbeda, tetap deterministic.
🎯 FINAL STATUS ENGINE
Sekarang engine memiliki:
✔ Deterministic ingest
✔ Feature v1.1
✔ Tier Engine
✔ TriggerCost Engine
✔ Token FSM
✔ Cluster FSM
✔ EventPhase FSM
✔ Binary logging contract
✔ Alert emission spec
Arsitektur sudah lengkap end-to-end.
