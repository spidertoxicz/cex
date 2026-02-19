ENGINE V3 — DEPENDENCY GRAPH & DATA FLOW MAP
Status: LOCKED · Deterministic · Single-Thread Core
1️⃣ GLOBAL DESIGN PRINCIPLE
🔒 One-Way Dependency Rule
Dependency hanya boleh mengalir ke bawah.
Salin kode

App Layer
   ↓
Orchestration
   ↓
Canonical
   ↓
Feature
   ↓
Token FSM
   ↓
Cluster FSM
   ↓
EventPhase
   ↓
Alert Engine
   ↓
Storage
Tidak boleh ada reverse reference.
2️⃣ LAYER HIERARCHY (FINAL)
🥇 L0 — Application Layer
Modules:
EngineRunner
ConfigLoader
DependencyWiring
Responsibilities:
Boot system
Inject config
Bind modules
Start GlobalClock
May depend on: Everything
Nothing depends on this layer
🥈 L1 — Orchestration Layer
Modules:
GlobalClock
EngineCoordinator
Responsibilities:
Tick scheduling
Execution order enforcement
Call canonical flush
Trigger feature → FSM → cluster → alert → log
Cannot contain business logic.
🥉 L2 — Canonical Layer
Modules:
EventNormalizer
CanonicalQueue
CanonicalEngine
Input: RawEvent
Output: CanonicalBatch
Cannot depend on:
FSM
Tier
TriggerCost
Cluster
Alert
Pure ingestion & ordering.
🧮 L3 — Feature Layer
Modules:
FeatureExtractor
OHLCBuilder
Input: CanonicalBatch
Output: FeatureFrame
Stateless except minimal rolling (OHLC + OI delta).
Cannot depend on FSM or cluster.
🧠 L4 — Token FSM Layer
Modules:
StructuralFSM
TierEngine
TriggerCostEngine
Input: FeatureFrame ClusterContext
Output: TokenFSMState
Cannot access canonical or storage.
🌐 L5 — Cluster FSM Layer
Modules:
ClusterFSM
Input: Array EventPhase
Output: ClusterContext
Cannot modify token state.
🕒 L6 — EventPhase Layer
Modules:
EventPhaseFSM
Input: ClusterState ConfigSchedule
Output: EventPhase
Forward-only.
🚨 L7 — Alert Engine Layer
Modules:
AlertEngine
Input: TokenFSMState ClusterState EventPhase
Output: StructuralAlert
Deterministic evaluation only.
💾 L8 — Storage Layer
Modules:
BinaryLogWriter
SnapshotWriter
SnapshotReader
ReplayReader
Input: TokenFSMState ClusterState EventPhase Alert
Append-only.
Cannot trigger logic.
🌊 External Layer — Data Adapter
Modules:
BinanceWSAdapter
BinancePollingAdapter
Push raw events to CanonicalEngine.
Cannot know FSM or storage.
3️⃣ EXECUTION ORDER PER TICK (FINAL)
GlobalClock tick (250ms):
Salin kode

1. CanonicalEngine.flush()
2. FeatureExtractor.process()
3. TierEngine.update()
4. TriggerCostEngine.update()
5. TokenFSM.update()
6. ClusterFSM.update() (1s cadence)
7. EventPhaseFSM.update()
8. AlertEngine.evaluate()
9. BinaryLogWriter.append()
10. Snapshot if scheduled
No deviation allowed.
4️⃣ DATA FLOW MAP
Salin kode

RawEvent
   ↓
EventNormalizer
   ↓
CanonicalQueue
   ↓ (tick)
CanonicalBatch
   ↓
FeatureFrame
   ↓
Tier + TriggerCost
   ↓
TokenFSMState
   ↓
ClusterFSM
   ↓
EventPhaseFSM
   ↓
AlertEngine
   ↓
BinaryLog
Replay uses same path but raw source replaced by ReplayReader.
5️⃣ REPLAY FLOW MAP
Salin kode

ReplayReader
   ↓
Reconstructed TickId
   ↓
Reconstructed FSM State
   ↓
Cluster + EventPhase
   ↓
AlertEngine
Replay must produce identical alerts.
6️⃣ FORBIDDEN DEPENDENCIES
❌ Feature → CanonicalQueue
❌ FSM → CanonicalQueue
❌ Cluster → FeatureFrame
❌ EventPhase → FeatureFrame
❌ Alert → CanonicalQueue
❌ Storage → FSM mutation
❌ Adapter → FSM
Violation = architecture breach.
7️⃣ CONCURRENCY MODEL
Single-thread logic core.
Optional worker only for:
WS parsing
Compression
IO batching
FSM must remain single-threaded.
8️⃣ DETERMINISM GUARANTEE MODEL
Engine deterministic if:
Same raw event stream
Same config
Same interval
Same schema version
Then:
Same log
Same state
Same alerts
9️⃣ SCALE MODEL (UP TO 30 TOKEN)
Scaling impacts:
CanonicalQueue count
FSM iteration count
Cluster aggregation count
Does not change architecture.
No layer redesign needed.
🔟 DEPİN READINESS CLAUSE
Node verification possible by:
Hash daily log
Replay log
Compare final state
Compare alert history
No hidden state allowed.
✅ FINAL STATUS
Blueprint is now:
✔ Layer-isolated
✔ Deterministic
✔ Event-sourced
✔ Replay-safe
✔ DePIN-ready
✔ Scalable to 30 token
✔ Single-thread core
✔ Strict TS friendly
