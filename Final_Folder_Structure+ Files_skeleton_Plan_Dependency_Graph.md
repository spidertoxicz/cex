FINAL FOLDER STRUCTURE + FILE SKELETON PLAN sesuai Dependency Graph yang sudah kita lock.
Ini bukan kode penuh.
Ini implementasi scaffold plan yang 100% konsisten dengan blueprint.
🧱 ROOT STRUCTURE
Salin kode

engine-v3/
│
├── src/
│   ├── app/
│   ├── core/
│   ├── canonical/
│   ├── feature/
│   ├── fsm/
│   │   ├── token/
│   │   ├── tier/
│   │   ├── trigger-cost/
│   │   ├── cluster/
│   │   └── event-phase/
│   ├── alert/
│   ├── storage/
│   ├── adapter/
│   ├── types/
│   ├── config/
│   └── utils/
│
├── logs/
├── snapshots/
├── tests/
├── package.json
├── tsconfig.json
└── ENGINE_V3_ARCHITECTURE.md
🥇 1️⃣ APP LAYER (/src/app)
Salin kode

app/
├── engine-runner.ts
├── engine-coordinator.ts
└── dependency-container.ts
engine-runner.ts
Boot sequence
Load config
Bind modules
Start GlobalClock
engine-coordinator.ts
Enforce execution order per tick
Orchestrate layer calls
🥈 2️⃣ CORE LAYER (/src/core)
Salin kode

core/
└── global-clock.ts
Already designed earlier.
🥉 3️⃣ CANONICAL LAYER (/src/canonical)
Salin kode

canonical/
├── event-normalizer.ts
├── canonical-event.ts
├── canonical-queue.ts
└── canonical-engine.ts
canonical-event.ts
SourceType enum
CanonicalEvent interface
CanonicalBatch interface
event-normalizer.ts
normalize(rawEvent)
canonical-queue.ts
ingest()
flush()
comparator()
canonical-engine.ts
registerToken()
ingest()
bindClock()
onBatch()
🧮 4️⃣ FEATURE LAYER (/src/feature)
Salin kode

feature/
├── feature-frame.ts
├── feature-extractor.ts
└── ohlc-builder.ts
feature-frame.ts
FeatureFrame v1.1 contract
feature-extractor.ts
CanonicalBatch → FeatureFrame
ohlc-builder.ts
1m & 5m builder
Internal state only
🧠 5️⃣ TOKEN FSM LAYER (/src/fsm/token)
Salin kode

fsm/token/
├── fsm-state.ts
├── structural-fsm.ts
└── state-transition.ts
structural-fsm.ts
update(featureFrame, tierContext, clusterContext)
🟣 6️⃣ TIER ENGINE (/src/fsm/tier)
Salin kode

fsm/tier/
└── tier-engine.ts
🔴 7️⃣ TRIGGER COST ENGINE (/src/fsm/trigger-cost)
Salin kode

fsm/trigger-cost/
└── trigger-cost-engine.ts
🌐 8️⃣ CLUSTER FSM (/src/fsm/cluster)
Salin kode

fsm/cluster/
└── cluster-fsm.ts
🕒 9️⃣ EVENT PHASE FSM (/src/fsm/event-phase)
Salin kode

fsm/event-phase/
└── event-phase-fsm.ts
🚨 10️⃣ ALERT LAYER (/src/alert)
Salin kode

alert/
├── alert-types.ts
└── alert-engine.ts
alert-engine.ts:
evaluate()
rolling 15m buffer
real-time + stable alert
💾 11️⃣ STORAGE LAYER (/src/storage)
Salin kode

storage/
├── binary-log-writer.ts
├── binary-log-reader.ts
├── snapshot-writer.ts
├── snapshot-reader.ts
└── replay-engine.ts
binary-log-writer.ts:
append(record)
checksum
rotate file
replay-engine.ts:
read log
reconstruct tick flow
🌊 12️⃣ ADAPTER LAYER (/src/adapter)
Salin kode

adapter/
├── binance-ws-adapter.ts
├── binance-polling-adapter.ts
└── raw-event.ts
Push only to CanonicalEngine.
No direct FSM access.
📦 13️⃣ TYPES (/src/types)
Salin kode

types/
├── raw-event-types.ts
├── fsm-types.ts
├── cluster-types.ts
├── tier-types.ts
├── alert-types.ts
└── event-phase-types.ts
Centralized types to avoid circular dependency.
⚙️ 14️⃣ CONFIG (/src/config)
Salin kode

config/
├── engine-config.ts
├── event-schedule-config.ts
└── threshold-config.ts
No config logic in FSM directly.
🧰 15️⃣ UTILS (/src/utils)
Salin kode

utils/
├── checksum.ts
├── math.ts
└── ring-buffer.ts
No business logic.
🧪 16️⃣ TEST STRUCTURE
Salin kode

tests/
├── canonical.test.ts
├── feature.test.ts
├── fsm.test.ts
├── cluster.test.ts
├── alert.test.ts
└── replay.test.ts
Replay test mandatory.
🔁 EXECUTION ORDER ENFORCED IN
Salin kode

engine-coordinator.ts
Single function:
Salin kode

handleTick()
Inside:
Salin kode

flush canonical
extract feature
update tier
update trigger cost
update token FSM
update cluster
update event phase
evaluate alert
append log
Strict order. No deviation.
🧠 DEPENDENCY SAFETY RULE
We enforce:
No relative import across layers upward
Types only imported from /types
Storage never imported into FSM
Canonical never imports FSM
Strict TS config + ESLint rule recommended.
🏁 FINAL STATE
Dengan struktur ini:
✔ Deterministic
✔ Layer-isolated
✔ Replay-safe
✔ DePIN-ready
✔ Scalable ke 30 token
✔ Debug-friendly
✔ No chaos dependency
