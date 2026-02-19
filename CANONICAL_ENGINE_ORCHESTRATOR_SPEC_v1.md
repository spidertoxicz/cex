CANONICAL ENGINE — ORCHESTRATOR SPEC v1.0
🎯 Tujuan
CanonicalEngine bertugas:
Menerima CanonicalEvent dari Normalizer
Mengelola CanonicalQueue per token
Flush per-token batch saat GlobalTick
Mengirim CanonicalBatch ke layer berikutnya
Tidak tahu FSM logic
Tidak tahu cluster
Tidak tahu storage
Pure ingestion orchestrator.
🧱 1️⃣ Dependency Direction
Salin kode

GlobalClock
      ↓
CanonicalEngine
      ↓
Feature Layer (next stage)
CanonicalEngine boleh depend ke:
GlobalClock
CanonicalQueue
EventNormalizer
Tidak boleh depend ke:
FSM
Cluster
Storage
Heat
Tier
🧠 2️⃣ Core Responsibility
A) Register Token
Ts
Salin kode
registerToken(tokenId: number): void;
Membuat CanonicalQueue per token.
Tidak boleh auto-create saat ingest (untuk safety).
B) Ingest Event
Ts
Salin kode
ingest(rawEvent: RawEvent, tokenId: number): void;
Flow internal:
Salin kode

1. normalize(rawEvent)
2. if null → ignore
3. queue[tokenId].ingest(canonicalEvent)
Tidak boleh:
Trigger flush
Trigger tick
Trigger feature
C) Tick Flush Handler
CanonicalEngine harus subscribe ke GlobalClock:
Ts
Salin kode
onTick(tickId: bigint)
Saat tick:
Salin kode

for each tokenId:
    batch = queue.flush(tickId)
    if batch != null:
        emit(batch)
Emit bisa berupa callback injection.
🧱 3️⃣ Public Contract
Ts
Salin kode
export interface CanonicalEngine {
  registerToken(tokenId: number): void;

  ingest(rawEvent: RawEvent, tokenId: number): void;

  onBatch(listener: (batch: CanonicalBatch) => void): void;

  bindClock(clock: GlobalClock): void;
}
🧠 4️⃣ Internal State
CanonicalEngine menyimpan:
Salin kode

Map<number, CanonicalQueue>
Map<number, localSeqCounter>
batchListener: function
localSeqCounter harus:
Per token
Monotonic increment
Tidak boleh reset saat runtime
🧠 5️⃣ Determinism Rules
CanonicalEngine tidak boleh:
❌ Flush di luar tick
❌ Sort lintas token
❌ Gabung batch token
❌ Mutasi event payload
❌ Baca FSM state
🧠 6️⃣ Flush Order Rule
Token iteration order harus deterministic.
Jika pakai Map:
⚠️ Map iteration order berdasarkan insertion order.
Untuk safety, gunakan:
Array tokenId terdaftar
Iterate sesuai urutan registerToken()
Atau sort tokenId ASC saat flush.
Disarankan:
✔ Sort tokenId ASC saat flush.
Agar restart tidak mempengaruhi ordering.
🧠 7️⃣ Failure Handling
Jika:
Queue tidak ada untuk token → throw error
normalize return null → ignore
flush error → fail-fast
Canonical layer tidak boleh silent corruption.
🧠 8️⃣ Performance Rule
Per tick:
Complexity:
Salin kode

O(T × N log N)
T = jumlah token
N = event per token dalam 250ms
Untuk 30 token dan N kecil → aman.
🔒 9️⃣ Strict Isolation Clause
CanonicalEngine tidak boleh:
Memanggil Feature layer langsung
Mengetahui OHLC
Mengetahui FSM state
Mengetahui snapshot
Ia hanya emit CanonicalBatch.
🎯 10️⃣ Example Tick Flow
Tick #120
Salin kode

GlobalClock → CanonicalEngine.onTick(120)

Token 1 → flush → batch
Token 2 → flush → batch
Token 3 → empty → skip

Emit batch1
Emit batch2
Urutan emit harus konsisten.
🧠 11️⃣ Replay Behavior
Saat replay mode:
CanonicalEngine tidak menerima WS.
Ia menerima event dari ReplayReader, lalu tetap flush per tick.
Tidak boleh beda behavior live vs replay.
🎯 Status Sekarang
Ingest backbone blueprint sudah lengkap:
✔ GlobalClock
✔ EventNormalizer
✔ CanonicalQueue
✔ CanonicalEngine
Layer 0 & 1 ingest deterministic sudah solid.
