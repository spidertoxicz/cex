🧱 STEP 1 — GLOBAL CLOCK SPEC (IMPLEMENTATION READY)
Tujuan:
Satu sumber waktu
Fixed 250ms
Monotonic
Tidak tergantung wall clock
Tidak boleh skip tick
Tidak boleh merge tick
🧠 Design Rules
Pakai process.hrtime.bigint() (monotonic)
TickId = incrementing uint64
Jangan pakai setInterval langsung untuk logic
Scheduler hanya trigger tick callback
Semua logic jalan di tick handler
🧾 GlobalClock Contract
Ts
Salin kode
interface GlobalClock {
  start(): void
  stop(): void
  onTick(cb: (tickId: bigint) => void): void
}
🔒 Execution Model
Pseudo flow:
Salin kode

start()
  schedule nextTick()
    tickId++
    call listeners
    schedule nextTick()
Tidak boleh:
Tick dipanggil dari WS event
Logic jalan di luar tick
Async mutate state di tengah tick
🧱 STEP 2 — CANONICAL LAYER IMPLEMENTATION PLAN
Ini layer paling krusial.
📦 2.1 Event Normalizer
WS event → CanonicalEvent
Ts
Salin kode
type CanonicalEvent = {
  tokenId: number
  source: SourceType
  exchangeTs: number
  localSeq: number
  payload: unknown
}
localSeq increment per token.
📦 2.2 Per-Token CanonicalQueue
Struktur:
Salin kode

Map<tokenId, CanonicalEvent[]>
Saat ingest:
Push event
Tidak sort langsung
Saat flush (dipanggil GlobalClock):
Sort by exchangeTs
Tie-break by source priority
Tie-break by localSeq
Emit CanonicalBatch
📦 2.3 CanonicalBatch
Ts
Salin kode
type CanonicalBatch = {
  tokenId: number
  tickId: bigint
  events: CanonicalEvent[]
}
FSM hanya boleh baca batch ini. Tidak boleh baca queue langsung.
🔒 CRITICAL SAFETY RULES
✔ Ingest tidak boleh mutate FSM
✔ Flush hanya boleh dipanggil GlobalClock
✔ No async inside canonical flush
✔ No direct WS → FSM path
🧠 Determinism Guarantee
Jika:
TickId sama
Event log sama
Sorting rule sama
→ FSM output akan identik.
Itu backbone replay stability.
🚦 IMPLEMENTATION ORDER
1️⃣ Buat folder:
Salin kode

/src/core/global-clock.ts
/src/canonical/event-normalizer.ts
/src/canonical/canonical-queue.ts
/src/canonical/canonical-engine.ts
2️⃣ Implement GlobalClock dulu
3️⃣ Implement CanonicalQueue
4️⃣ Test flush ordering
5️⃣ Baru lanjut Feature layer
⚠️ Jangan Lakukan Ini Sekarang
❌ Jangan buat FSM dulu
❌ Jangan buat Heat dulu
❌ Jangan buat Storage dulu
❌ Jangan buat Cluster dulu
Kalau canonical salah, semua salah.
