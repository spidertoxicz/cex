🔥 STEP 1 — ENGINE CORE CONTRACT DESIGN
Kita akan desain 6 contract utama dulu.
Tanpa ini, folder structure akan chaos lagi.
🧱 1️⃣ Canonical Engine Contract
Tujuan
Menjamin event ordering + batch consistency.
Interface Konseptual
Salin kode

interface CanonicalEngine {
  ingest(event: RawEvent): void
  flush(globalTick: number): CanonicalBatch[]
}
Rules:
ingest tidak boleh mutate state logic
flush hanya dipanggil oleh GlobalClock
output per-token batch terisolasi
tidak ada async race di dalamnya
🧱 2️⃣ Global Clock Contract
Salin kode

interface GlobalClock {
  start(intervalMs: number): void
  onTick(callback: (tickId: number) => void): void
}
Rules:
interval tetap (250ms)
tidak adaptive
semua module sync ke clock ini
GlobalClock = backbone determinism.
🧱 3️⃣ Feature Extraction Contract
Salin kode

interface FeatureExtractor {
  process(batch: CanonicalBatch): FeatureFrame
}
Rules:
pure function
no side effect
no async
deterministic
Output = raw metrics (OI delta, funding delta, spread, etc.)
🧱 4️⃣ OHLC Builder Contract
Salin kode

interface OHLCBuilder {
  update(batch: CanonicalBatch): void
  getCurrent(tf: '1m' | '5m'): Candle
  getClosed(tf: '1m' | '5m'): Candle
}
Rules:
build from canonical trade only
bucket by exchangeTs
deterministic close rule
🧱 5️⃣ Structural FSM Contract
Salin kode

interface StructuralFSM {
  update(frame: FeatureFrame, context: EngineContext): FSMState
}
Rules:
sequential state only
no jump
no async
no randomness
state transition must log reason
🧱 6️⃣ Heat & Tier Module Contract
Salin kode

interface HeatEngine {
  update(tokenState: TokenState[]): ClusterHeatScore
}
Rules:
interval-based (1 detik)
weighted breadth
hysteresis
window adaptive by FSM state
🧱 7️⃣ TriggerCost Contract
Salin kode

interface TriggerCostEngine {
  evaluate(tokenContext: TokenContext): TriggerCostLevel
}
Rules:
leverage physics only
no OHLC authority
deterministic formula
🔥 STEP 2 — STRUCTURE FOLDER (SCALABLE KE 30 TOKEN)
Sekarang kita desain struktur clean.
Salin kode

/engine
  /core
    global-clock.ts
    canonical-engine.ts
    replay-engine.ts

  /data
    ws-adapter.ts
    polling-adapter.ts
    event-normalizer.ts

  /features
    feature-extractor.ts
    ohlc-builder.ts

  /fsm
    structural-fsm.ts
    cooldown-controller.ts

  /heat
    heat-engine.ts
    tier-engine.ts

  /risk
    trigger-cost.ts

  /config
    token-profile.ts
    ontology.ts

  /app
    engine-runner.ts
    telemetry.ts
Semua pure layer. No circular dependency. Dependency direction satu arah.
🧠 Kenapa Ini Penting Sebelum Coding?
Karena kalau lu coding dulu:
Node async bisa masuk ke logic
Canonicalizer bisa bocor ke FSM
Heat bisa baca WS langsung
OHLC bisa jadi liar
Contract design mencegah itu.
🔥 TypeScript vs Go
Karena kita design contract dulu:
TypeScript bisa implement cepat
Go bisa port tanpa ubah logic
FSM tetap pure
Engine tetap portable
Bahasa jadi secondary.
🎯 Status Sekarang
Engine kita sudah punya:
✔ Deterministic time backbone
✔ Deterministic canonical layer
✔ Pure FSM
✔ Tier + Heat isolated
✔ OHLC contextual only
✔ TriggerCost physics only
Ini foundation serius.
