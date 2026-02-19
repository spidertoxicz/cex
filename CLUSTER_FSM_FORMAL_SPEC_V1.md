CLUSTER FSM — FORMAL SPEC v1.0
(Status: Deterministic · State-Aggregator · Event-Aware · Non-Override)
Cluster FSM adalah Level 2 di atas Token FSM.
Ia membaca distribusi state token dan mengatur konteks sistemik.
Cluster tidak pernah memaksa token lompat state.
🧱 1️⃣ CLUSTER ENUM (LOCKED)
Salin kode

0 = CLUSTER_CALM
1 = CLUSTER_HEATING
2 = CLUSTER_FRAGILE
3 = CLUSTER_UNWIND
4 = CLUSTER_COOLDOWN
Sequential only.
No jump backward kecuali via COOLDOWN.
🧠 2️⃣ INPUT
Cluster menerima:
Salin kode

Array<TokenFSMState>
EventPhase
Config (threshold base)
Cluster tidak membaca FeatureFrame langsung.
🧱 3️⃣ INTERNAL STATE STRUCTURE
Ts
Salin kode
interface ClusterState {
  readonly state: ClusterFSMState;
  readonly stateEnterTick: bigint;

  readonly heatingCount: number;
  readonly fragileCount: number;
  readonly triggerReadyCount: number;
  readonly unwindCount: number;

  readonly breadthRatio: number;
  readonly hysteresisCounter: number;
}
breadthRatio = % token dalam state aktif tertentu.
🧠 4️⃣ TOKEN STATE AGGREGATION
Per tick (1s cadence):
Hitung:
Salin kode

N = total active token
P = count PRESSURE
F = count FRAGILE
T = count TRIGGER_READY
U = count UNWIND
🧠 5️⃣ DYNAMIC THRESHOLD (EVENT-AWARE)
Threshold berbasis:
N
EventPhase
EVENT_START
Salin kode

HeatingThreshold = ceil(N × 0.4)
FragileThreshold = ceil(N × 0.6)
UnwindThreshold  = ceil(N × 0.7)
EVENT_MID
Salin kode

HeatingThreshold = ceil(N × 0.5)
FragileThreshold = ceil(N × 0.7)
UnwindThreshold  = ceil(N × 0.6)
EVENT_END
Salin kode

HeatingThreshold = ceil(N × 0.6)
FragileThreshold = ceil(N × 0.7)
UnwindThreshold  = ceil(N × 0.5)
🧠 6️⃣ TRANSITION RULES (FORMAL)
CALM → HEATING
Jika:
Salin kode

F >= HeatingThreshold
AND persist >= C1
HEATING → FRAGILE
Jika:
Salin kode

T >= FragileThreshold
AND persist >= C2
FRAGILE → UNWIND
Jika:
Salin kode

U >= UnwindThreshold
Cascade cepat. Persist minimal.
UNWIND → COOLDOWN
Jika:
Salin kode

U menurun
AND persist >= C3
COOLDOWN → CALM
Jika:
Salin kode

Mayoritas token kembali BUILD/PRESSURE
AND persist >= C4
🔒 7️⃣ CLUSTER MODIFIER OUTPUT
Cluster tidak override token.
Ia mengeluarkan:
Ts
Salin kode
interface ClusterContext {
  readonly thresholdMultiplier: number;
  readonly triggerCostMultiplier: number;
  readonly systemicAlertLevel: number;
}
Example Multiplier
CLUSTER_HEATING → thresholdMultiplier = 0.9
CLUSTER_FRAGILE → thresholdMultiplier = 0.8
CLUSTER_UNWIND → triggerCostMultiplier = 0.7
Ini membuat token lebih sensitif.
🧠 8️⃣ DETERMINISM RULES
Cluster FSM tidak boleh:
❌ Mengubah token state
❌ Membaca FeatureFrame
❌ Gunakan random
❌ Gunakan wall clock
Semua berbasis state snapshot saat tick.
🧠 9️⃣ PERSISTENCE MODEL
Cluster tick cadence: 1 detik.
Hysteresis lebih panjang dari token FSM.
Ini mencegah flip systemic.
🧠 10️⃣ SYSTEMIC ALERT LOGIC
Jika:
Salin kode

ClusterState >= FRAGILE
Emit systemic alert meskipun individual token score kecil.
Ini cocok untuk DePIN model.
🔥 11️⃣ FCT-SPECIFIC BEHAVIOR
Karena FCT manipulatif:
FRAGILE cluster bisa muncul cepat saat start
UNWIND cluster bisa override EventPhase lebih cepat
Cooling harus lebih lambat untuk hindari false calm
🎯 STATUS SEKARANG
Engine sudah punya:
✔ Token FSM formal
✔ Cluster FSM formal
✔ EventPhase dynamic
✔ Deterministic ingest
✔ Deterministic feature
Struktur inti hampir lengkap.
