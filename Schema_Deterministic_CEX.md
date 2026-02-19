alur deterministic CEX Futures Engine end-to-end, dari:
Binance WS + Polling → Canonicalizer → Feature → FSM stack → Alert → Binary Log
Tanpa filosofis.
Tanpa tambahan ide baru.
Murni alur final sesuai ENGINE_V3_ARCHITECTURE_FINAL.
🎯 OVERVIEW BESAR (SINGLE THREAD CORE)
Engine punya 2 dunia:
🌊 Dunia Eksternal (Async, Tidak Deterministic)
Binance WebSocket (trade, book, mark, liquidation)
Binance REST Polling (OI, funding snapshot)
🧠 Dunia Core (Deterministic)
Semua diproses hanya saat GlobalClock tick (250ms).
Tidak ada logic jalan di luar tick.
🔁 FULL STEP-BY-STEP FLOW
Sekarang kita masuk detail presisi.
STEP 0 — RAW DATA MASUK (ASYNC ZONE)
Dari Binance WebSocket:
trade stream
bookTicker
liquidation
mark price
Dari Binance Polling:
open interest
funding rate
⚠️ Penting: Adapter tidak boleh langsung mengubah state engine.
Adapter hanya melakukan:
Salin kode

RawEvent → push ke CanonicalEngine.ingest()
Belum ada FSM. Belum ada feature. Belum ada alert.
STEP 1 — EVENT NORMALIZATION
EventNormalizer.normalize(rawEvent)
Tujuan:
Tambah tokenId
Tambah exchangeTs
Tambah localSeq
Klasifikasi SourceType
Output:
Salin kode

CanonicalEvent
{
  tokenId,
  source,
  exchangeTs,
  localSeq,
  payload
}
Masuk ke:
Salin kode

CanonicalQueue[tokenId].buffer
Masih async. Belum diproses.
STEP 2 — GLOBAL CLOCK TICK (250ms)
Sekarang kita masuk deterministic core.
GlobalClock memanggil:
Salin kode

EngineCoordinator.handleTick(tickId)
Semua logic hanya terjadi di sini.
STEP 3 — CANONICAL FLUSH
Untuk setiap token (urut tetap):
Salin kode

CanonicalQueue.flush(tickId)
Flush melakukan:
Sort buffer by:
exchangeTs
localSeq
Produce CanonicalBatch
Clear buffer
Output:
Salin kode

CanonicalBatch {
  tokenId,
  tickId,
  events[]
}
Kalau tidak ada event → batch kosong tetap valid.
Deterministic point #1: Urutan event selalu sama jika input sama.
STEP 4 — FEATURE EXTRACTION
Untuk setiap token:
Salin kode

FeatureExtractor.extract(batch)
Menghasilkan:
Salin kode

FeatureFrame {
  tokenId,
  tickId,
  tradeVolume,
  tradeDelta,
  oiVelocity,
  spreadPct,
  markVsMidPct,
  liquidationImbalance,
  ...
}
Feature layer:
Tidak tahu FSM
Tidak tahu cluster
Tidak tahu alert
Tidak tahu log
Deterministic point #2: Feature murni fungsi dari CanonicalBatch + previous internal rolling state.
STEP 5 — TIER ENGINE
Salin kode

TierEngine.update(featureFrame)
Menentukan regime:
TIER_NEUTRAL
TIER_EXPANSION
TIER_OVERLEVERAGED
TIER_EXHAUSTED
Output:
Salin kode

TierContext
Tidak mengubah feature. Tidak mengubah FSM langsung.
STEP 6 — TRIGGER COST ENGINE
Salin kode

TriggerCostEngine.update(featureFrame, tierContext)
Menghitung:
densityScore
compressionScore
divergenceScore
elasticityScore
Output:
Salin kode

triggerCost (0–100)
Deterministic point #3: TriggerCost hanya fungsi feature + tier.
STEP 7 — TOKEN FSM UPDATE
Salin kode

StructuralFSM.update(featureFrame, tierContext, triggerCost)
FSM transisi:
Salin kode

BUILD
→ PRESSURE
→ FRAGILE
→ TRIGGER_READY
→ UNWIND
→ COOLDOWN
Persist rule + decay rule diterapkan.
Output:
Salin kode

TokenFSMState
Deterministic point #4: FSM hanya baca input layer bawah. Tidak baca cluster.
STEP 8 — CLUSTER FSM (1s cadence)
Hanya jika:
Salin kode

tickId % 4 == 0
Cluster membaca:
Salin kode

Array<TokenFSMState>
Cluster menentukan:
Salin kode

CLUSTER_CALM
CLUSTER_HEATING
CLUSTER_FRAGILE
CLUSTER_UNWIND
CLUSTER_COOLDOWN
Tidak mengubah token state.
Deterministic point #5: Cluster update hanya berdasarkan token states saat tick itu.
STEP 9 — EVENT PHASE FSM
Salin kode

EventPhaseFSM.update(clusterState)
EventPhase:
Salin kode

PREP
START
MID
END
POST
Rule:
Forward only
Bisa override jika cluster UNWIND persist
Deterministic point #6: EventPhase tidak pernah mundur.
STEP 10 — ALERT ENGINE
AlertEngine membaca:
TokenFSMState
TierContext
TriggerCost
ClusterState
EventPhase
Menentukan:
Salin kode

STRUCTURAL_FRAGILE
STRUCTURAL_TRIGGER_READY
STRUCTURAL_UNWIND
SYSTEMIC_ALERT
STABLE_15M_ALERT
NO_ALERT
15m window berbasis tickId:
Salin kode

bucketId = floor(tickId / ticksPer15m)
Deterministic point #7: Alert tidak pernah pakai Date.now().
STEP 11 — BINARY LOG APPEND
Untuk setiap token:
Serialize:
Salin kode

{
  tickId,
  fsmState,
  tierState,
  clusterState,
  eventPhase,
  pressureScore,
  fragileScore,
  triggerScore,
  unwindScore,
  triggerCost,
  ...
}
→ 64 byte fixed record
→ append
→ checksum
Log adalah authority replay.
Deterministic point #8: Replay log → harus menghasilkan alert identik.
🔄 REPLAY MODE
Replay:
Read log sequentially
Reconstruct state per tick
Re-run alert engine
Compare hash
Jika berbeda → determinism breach.
🧠 RANGKUMAN ALUR FINAL (BERSIH)
Salin kode

Raw WS + Polling
    ↓
EventNormalizer
    ↓
CanonicalQueue (async buffer)
    ↓ (tick boundary)
CanonicalFlush
    ↓
FeatureExtraction
    ↓
Tier
    ↓
TriggerCost
    ↓
Token FSM
    ↓
Cluster FSM (1s)
    ↓
EventPhase
    ↓
AlertEngine
    ↓
BinaryLog
Tidak ada lompat layer. Tidak ada reverse read. Tidak ada async mutation.
🧘 Sekarang Soal Chaos
