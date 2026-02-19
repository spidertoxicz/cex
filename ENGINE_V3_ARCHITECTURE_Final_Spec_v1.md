ENGINE_V3_ARCHITECTURE.md (Final Spec v1.0).
Dokumen ini akan jadi:
Sumber kebenaran (source of truth)
Referensi implementasi TS/Go
Guardrail agar tidak chaos lagi
Dokumen jualan DePIN nanti
Gue tulis dalam format formal & clean.
ENGINE_V3_ARCHITECTURE.md
Status: LOCKED v1.0 — Deterministic Hybrid CEX Engine (FCT Mode)
1️⃣ DESIGN PRINCIPLES
1.1 Determinism First
Engine harus:
Replay-identical
No async mutation
No probabilistic transition
No state jump
Fixed execution order
Semua state mutation hanya terjadi pada GlobalTick.
1.2 Sequential State Machines
Engine terdiri dari:
Token FSM (Level 1)
Cluster FSM (Level 2)
EventPhase FSM (Level 3)
Semua sequential. Semua forward-only. Tidak ada lompat state.
1.3 Layer Isolation
Dependency hanya satu arah (top-down).
Tidak ada circular reference.
WS adapter tidak boleh tahu FSM. FSM tidak boleh tahu WS.
1.4 Event-Sourced Core
Engine menyimpan:
Fixed-size binary event log (per token)
Per-token snapshot
Versioned schema
Hard reset per major version
2️⃣ TIME BACKBONE
2.1 GlobalClock
Fixed 250ms interval
Hard flush
Shared oleh semua token
TickId = incrementing uint64.
2.2 Execution Order per Tick
Salin kode

1. Canonical flush
2. Feature extraction
3. Token FSM update
4. Cluster update (1s cadence internal)
5. Log append
6. Snapshot (if scheduled)
Tidak boleh diubah.
3️⃣ CANONICAL LAYER
3.1 Input Sources
WebSocket trades
WebSocket bookTicker
WebSocket markPrice
WebSocket liquidation
Polling OI
Polling funding
3.2 Canonical Rules
Per-token queue
Sort by exchangeTs
Source priority fixed
Flush per 250ms
No mutation allowed here.
4️⃣ FEATURE LAYER
4.1 FeatureExtractor
Output: FeatureFrame
Contains:
OI velocity
Funding skew
Divergence score
Compression score
Liquidity stress
Pure function.
4.2 OHLC Builder
Timeframes:
1m
5m
Built from canonical trade stream only.
OHLC used as context only. Never as primary trigger authority.
5️⃣ TOKEN FSM (LEVEL 1)
Enum:
Salin kode

BUILD
PRESSURE
FRAGILE
TRIGGER_READY
UNWIND
COOLDOWN
Rules:
Sequential only
Hysteresis required
Tier-adjusted thresholds
No skip
Logged on every transition
6️⃣ CLUSTER FSM (LEVEL 2)
Enum:
Salin kode

CLUSTER_CALM
CLUSTER_HEATING
CLUSTER_FRAGILE
CLUSTER_UNWIND
CLUSTER_COOLDOWN
Trigger basis:
% token in FRAGILE
% token in TRIGGER_READY
% token in UNWIND
Threshold:
Dynamic
Tier-adjusted
EventPhase-aware
Cluster cannot override token state.
7️⃣ EVENT PHASE ENGINE (LEVEL 3)
Enum:
Salin kode

EVENT_PREP
EVENT_START
EVENT_MID
EVENT_END
EVENT_POST
Primary source:
Config timestamps
Override:
Early collapse detection
Forward-only
Persist-based
Stored per-token (phase 1 design). Must match across tokens.
8️⃣ STORAGE ARCHITECTURE
8.1 Event Log
Fixed 64-byte record
Per-token file
Per-day rotation
Append-only
Versioned header
8.2 Snapshot
Per-token
Fixed-size
Versioned
Contains:
FSM state
Tier state
Heat state
Trigger state
OHLC state
EventPhase
Log offset
8.3 Versioning Strategy
Semantic:
Major.Minor.Patch
Major:
Breaking change
Archive old logs
Hard reset allowed
Minor:
Additive
Backward compatible
Patch:
Internal fix
9️⃣ DETERMINISM RULES
No mutation outside GlobalTick
No random
No time.now() inside logic
All thresholds formula-based
All multipliers tier-based
All transitions logged
Snapshot only after tick completion
🔟 SCALABILITY TARGET
Phase 1:
2–5 FCT tokens
Phase 2:
30 tokens (ontology-based clusters)
Architecture must scale without rewrite.
1️⃣1️⃣ DEPIN READINESS
Engine guarantees:
Replay consistency
State traceability
Append-only log
Deterministic snapshot
Schema versioning
Hashable daily logs
Suitable for trust-layer validation.
STATUS: ARCHITECTURE LOCKED v1.0
🔥 Blueprint sekarang solid.
