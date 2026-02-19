finalize Dependency Direction Map (Layer Hierarchy Final).
Ini yang menentukan apakah engine lu tetap deterministic
atau bocor jadi async chaos lagi.
Kita buat rule paling penting dulu:
🔒 Dependency hanya boleh mengalir ke bawah.
Tidak boleh ada circular reference.
Tidak boleh layer bawah tahu layer atas.
🧱 LAYER HIERARCHY (TOP → BOTTOM)
Urutan dari paling atas (orchestrator) ke paling bawah (data source).
🥇 LAYER 0 — ENGINE RUNNER (App Layer)
Tanggung jawab:
Boot engine
Start GlobalClock
Inject config
Wire semua module
Handle shutdown
Handle snapshot schedule
Boleh depend ke:
Semua layer di bawah
Tidak boleh dipanggil oleh layer lain.
🥈 LAYER 1 — ORCHESTRATION LAYER
Modules:
GlobalClock
EngineCoordinator
ReplayEngine
SnapshotManager
Fungsi:
Mengatur urutan eksekusi per tick
Trigger canonical flush
Trigger feature extraction
Trigger FSM update
Trigger cluster update
Boleh depend ke:
Canonical Layer
Feature Layer
FSM Layer
Cluster Layer
Storage Layer
Tidak boleh depend ke:
WS adapter langsung
Tidak boleh punya logic bisnis
🥉 LAYER 2 — CANONICAL LAYER
Modules:
EventNormalizer
CanonicalQueue (per token)
CanonicalBatchEmitter
Fungsi:
Terima raw event
Normalize
Order by rule
Flush per 250ms
Boleh depend ke:
Data Adapter Layer
Tidak boleh:
Tahu FSM
Tahu Heat
Tahu TriggerCost
Tahu Cluster
Ini pure ingestion + ordering.
🧮 LAYER 3 — FEATURE EXTRACTION LAYER
Modules:
FeatureExtractor
OHLCBuilder (1m, 5m)
MetricScaler
Input:
CanonicalBatch
Output:
FeatureFrame
Boleh depend ke:
Canonical types
Tidak boleh:
Tahu FSM
Tahu cluster
Tahu event phase
Pure transformation.
🧠 LAYER 4 — TOKEN FSM LAYER
Modules:
StructuralFSM
TierEngine
TriggerCostEngine
CooldownController
Input:
FeatureFrame
ClusterContext (read-only modifier)
Output:
TokenState
Tidak boleh:
Tahu canonical queue
Tahu WS
Tahu snapshot
Tahu storage
Pure state machine logic.
🌐 LAYER 5 — CLUSTER LAYER
Modules:
ClusterFSM
EventPhaseEngine
HeatEngine
Input:
TokenState[]
Config
Output:
ClusterState
EventPhase
ThresholdModifier
Tidak boleh:
Mutasi token state langsung
Akses WS
Akses canonical queue
Cluster hanya baca token state.
💾 LAYER 6 — STORAGE LAYER
Modules:
BinaryLogWriter
SnapshotWriter
SnapshotReader
VersionCompatReader
Input:
TokenState
ClusterState
TickId
Tidak boleh:
Mutasi logic
Trigger FSM
Storage pasif.
🌊 LAYER 7 — DATA ADAPTER LAYER (Paling Bawah)
Modules:
BinanceWSAdapter
BinancePollingAdapter
Fungsi:
Terima data
Push ke CanonicalLayer
Tidak boleh:
Tahu FSM
Tahu Heat
Tahu Snapshot
🔁 DEPENDENCY FLOW DIAGRAM (Linear)
Salin kode

WS / Polling
      ↓
Canonical Layer
      ↓
Feature Layer
      ↓
Token FSM Layer
      ↓
Cluster Layer
      ↓
Storage Layer
Orchestrator mengontrol semuanya dari atas.
🔒 CRITICAL RULES (WAJIB)
1️⃣ WS callback tidak boleh mutasi state.
2️⃣ FSM tidak boleh baca WS langsung.
3️⃣ Cluster tidak boleh override token state.
4️⃣ Storage tidak boleh trigger logic.
5️⃣ Snapshot hanya dibuat setelah tick selesai.
6️⃣ Semua update hanya terjadi pada global tick.
🧠 EXECUTION ORDER PER 250ms TICK
Salin kode

1. GlobalClock tick
2. Canonical flush
3. Feature extraction
4. Token FSM update
5. Cluster update (1s cadence internal)
6. Storage append log
7. Snapshot if scheduled
Tidak boleh urutan lain.
🎯 SEKARANG ARSITEKTUR SUDAH FINAL
No circular dependency
Deterministic execution order
Modular
Scalable
Replay-friendly
DePIN-ready
Blueprint sudah clean.
