✅ Schema_Deterministic_CEX_V2 (FINAL)
🌊 ASYNC INGEST ZONE (NON-DETERMINISTIC)
Tujuan: hanya mengumpulkan data mentah.
Salin kode

Binance WS + REST Polling
        ↓
EventNormalizer.normalize(rawEvent)
        ↓
CanonicalQueue[tokenId].buffer (async)
Invariant keras
❌ tidak boleh ubah state engine
❌ tidak boleh jalan FSM
❌ tidak boleh hitung feature
✅ hanya enqueue CanonicalEvent
🧠 DETERMINISTIC CORE (TICK-LOCKED)
Semua logic di bawah hanya dieksekusi saat GlobalClock tick (250ms).
STEP 1 — GLOBAL CLOCK ENTRY
Salin kode

GlobalClock.tick(tickId)
        ↓
EngineCoordinator.handleTick(tickId)
✅ Single time authority = tickId
STEP 2 — CANONICAL FLUSH
Untuk setiap token (urut tetap):
Salin kode

CanonicalQueue.flush(tickId)
    → CanonicalBatch {
         tokenId,
         tickId,
         events[]
      }
Deterministic guarantees
sort: (exchangeTs, localSeq)
buffer dikosongkan setelah flush
batch kosong tetap diproses
STEP 3 — FEATURE EXTRACTION (MICROSTRUCTURE DOMAIN)
Salin kode

FeatureExtraction.extract(canonicalBatch)
    → FeatureFrame
Contract (dipertegas)
Feature hanya boleh berbasis:
trade flow
orderbook snapshot
liquidation flow
OI/funding snapshot
rolling berbasis tick
Dilarang
❌ candle inference
❌ timeframe logic
❌ baca FSM
❌ baca cluster
❌ wall clock
✅ Feature = pure event-domain
STEP 4 — TIER ENGINE
Salin kode

TierEngine.update(featureFrame)
    → TierContext
Contract
pure function dari FeatureFrame
decay berbasis tick
tidak mutate feature
tidak baca FSM
STEP 5 — TRIGGER COST ENGINE
Salin kode

TriggerCostEngine.update(featureFrame, tierContext)
    → triggerCost (0–100)
Contract
deterministic
tidak pakai wall time
tidak baca cluster
tidak simpan hidden state liar
STEP 6 — TOKEN STRUCTURAL FSM
Salin kode

StructuralFSM.update(
    featureFrame,
    tierContext,
    triggerCost
)
    → TokenFSMState
FSM invariants
forward-safe transitions
persist berbasis tick
decay berbasis tick
tidak baca cluster
STEP 7 — CLUSTER FSM (1s CADENCE)
Salin kode

if (tickId % 4 == 0):
    ClusterFSM.update(Array<TokenFSMState>)
        → ClusterState
Contract
read-only terhadap token FSM
tidak mutate token
cadence terkunci (1s)
STEP 8 — EVENT PHASE FSM
Salin kode

EventPhaseFSM.update(clusterState)
    → EventPhase
Invariant
forward only
boleh override unwind persist
tidak baca token langsung
STEP 9 — ALERT ENGINE (PURE CLASSIFIER)
Salin kode

AlertEngine.evaluate(
    tokenFSMState,
    tierContext,
    triggerCost,
    clusterState,
    eventPhase
)
    → AlertType
Contract keras
❌ tidak buat state baru
❌ tidak smoothing
❌ tidak aggregation
❌ tidak wall time
✅ hanya klasifikasi deterministik
STEP 10 — BINARY LOG (FINAL AUTHORITY)
Per token per tick:
Salin kode

BinaryLog.append({
  tickId,
  tokenId,
  fsmState,
  tierState,
  clusterState,
  eventPhase,
  triggerCost,
  ...
})
Hard guarantees
fixed-size record
append-only
checksum
replay harus bit-exact
🔒 GLOBAL ENGINE INVARIANTS (WAJIB)
Ini pagar besi engine kamu sekarang.
✅ Single time source
Salin kode

time = tickId
Tidak boleh ada:
Date.now()
elapsed ms
wall clock
✅ Empty batch tetap advance state
Walau:
Salin kode

events.length == 0
Semua tetap jalan:
Feature decay
Tier decay
FSM persist
✅ Tidak ada candle domain
Engine kamu sekarang murni microstructure deterministic.
🧾 VERDICT
Blueprint lamamu sekarang sudah:
🟢 structurally clean
🟢 deterministic-safe
🟢 tanpa layer leakage
🟢 tanpa candle contamination
🟢 siap masuk fase tuning threshold
