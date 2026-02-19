ENGINE EXECUTION LIFECYCLE — FORMAL SPEC v1.0
Status: LOCKED · SINGLE-THREAD CORE · REPLAY-SAFE · CRASH-SAFE
1️⃣ ENGINE MODES (LOCKED)
Engine hanya boleh berjalan dalam salah satu mode:
Salin kode

0 = LIVE_MODE
1 = REPLAY_MODE
2 = SNAPSHOT_RECOVERY_MODE
Tidak boleh campur mode.
Mode ditentukan saat startup dan immutable.
2️⃣ STARTUP FLOW (LIVE_MODE)
Urutan wajib, tidak boleh lompat.
Step 1 — Load Config
EngineConfig
ThresholdConfig
EventScheduleConfig
Token list
SchemaVersion check
Jika invalid → fail-fast.
Step 2 — Validate Environment
Log directory exists
Snapshot directory exists
Disk writable
SchemaVersion match
Fail-fast jika mismatch.
Step 3 — Snapshot Recovery Check
Untuk setiap token:
Salin kode

if snapshot exists:
    load snapshot
    validate snapshot checksum
else:
    initialize clean state
Snapshot harus menyimpan:
LastTickId
TokenFSMState
TierState
ClusterState
EventPhase
LogOffset
Step 4 — Log Integrity Check
Untuk setiap token log file:
Validate header
Validate record size
Truncate partial record
Validate last checksum
Jika corrupted beyond repair → fail-fast.
Step 5 — Restore Runtime State
Reconstruct:
TokenFSMState
TierState
ClusterState
EventPhase
TriggerCost state
Rolling alert buffers
From snapshot.
Do NOT replay full log in live startup.
Snapshot is source of resume.
Step 6 — Bind Modules
Bind:
GlobalClock
CanonicalEngine
FeatureExtractor
FSM
Cluster
EventPhase
AlertEngine
BinaryLogWriter
Dependency injection only once.
No runtime mutation of wiring.
Step 7 — Start GlobalClock
Engine enters steady loop.
3️⃣ LIVE TICK EXECUTION FLOW (STRICT ORDER)
Every 250ms:
Salin kode

1. CanonicalEngine.flush()
2. FeatureExtractor.extract()
3. TierEngine.update()
4. TriggerCostEngine.update()
5. TokenFSM.update()
6. ClusterFSM.update() (1s cadence)
7. EventPhaseFSM.update()
8. AlertEngine.evaluate()
9. BinaryLogWriter.append()
No async await inside core loop.
Single-thread only.
4️⃣ SNAPSHOT CYCLE
Snapshot cadence:
Every 5 minutes OR
Every 15m boundary OR
Graceful shutdown
Snapshot must include:
All FSM states
All Tier states
Cluster state
EventPhase
TriggerCost internal memory
Rolling alert counters
LastTickId
LastLogOffset
Snapshot write procedure:
Serialize snapshot to temp file
Compute checksum
fsync
Rename atomic replace
Never overwrite directly.
5️⃣ GRACEFUL SHUTDOWN FLOW
Triggered by:
SIGINT
SIGTERM
Sequence:
Salin kode

1. Stop GlobalClock
2. Finish current tick
3. Write final snapshot
4. Flush log buffer
5. Close file handles
6. Exit
Never shutdown mid-tick.
6️⃣ CRASH RECOVERY FLOW
If crash happens:
On next startup:
Validate snapshot
Validate log
Truncate incomplete record
Resume from snapshot
Never try to “guess” last state.
Snapshot is authority.
7️⃣ REPLAY_MODE FLOW
Used for:
Audit
DePIN verification
Debug
Flow:
Salin kode

1. Load config
2. Load log file
3. Do NOT load snapshot
4. Reconstruct state from log sequentially
5. Re-run AlertEngine
6. Compare hash output
Replay must produce:
Identical FSM transitions
Identical cluster states
Identical alerts
If mismatch → determinism broken.
8️⃣ TOKEN REGISTRATION FLOW
Token list loaded at startup.
During runtime:
No dynamic token addition
No dynamic token removal
Scale requires restart.
This keeps determinism stable.
9️⃣ MEMORY OWNERSHIP MODEL
Ownership table:
Layer
Owns State
Mutable
Canonical
Queue buffer
Yes (ephemeral)
Feature
OHLC builder
Yes
Tier
TierState
Yes
TriggerCost
Cost memory
Yes
TokenFSM
FSMState
Yes
Cluster
ClusterState
Yes
EventPhase
PhaseState
Yes
Alert
Rolling counters
Yes
Storage
None
No logic
No shared mutable object across layers.
All state flows downward only.
🔟 CONCURRENCY MODEL
Single-thread deterministic core.
Allowed parallel:
WebSocket parsing
Log compression (future)
Metrics export
Core FSM loop must remain single-thread.
1️⃣1️⃣ FAILURE POLICY
If any invariant breaks:
Corrupted record
Invalid checksum
Unexpected state transition
Config mismatch
Engine must fail-fast.
Never auto-heal logic.
1️⃣2️⃣ SCALE MODEL (30 TOKEN)
Per tick complexity:
Salin kode

O(T)
Cluster complexity:
Salin kode

O(T)
Memory:
Linear with token count.
No architectural redesign required.
1️⃣3️⃣ DEPİN VERIFICATION FLOW
Verifier node can:
Download log
Replay
Compute daily hash
Compare with published hash
Verify alerts
No hidden state allowed.
🎯 FINAL ARCHITECTURAL STATUS
Now engine architecture is:
✔ Layer-isolated
✔ Deterministic
✔ Event-sourced
✔ Crash-safe
✔ Replay-safe
✔ Snapshot-safe
✔ DePIN-verifiable
✔ Scale-ready
✔ Single-thread pure core
At this point:
Blueprint is complete
