📜 INGEST LAYER — INVARIANTS & TEST PLAN v1.0
Cakupan:
GlobalClock
EventNormalizer
CanonicalQueue
CanonicalEngine
Belum masuk FSM.
🧱 1️⃣ HARD INVARIANTS (TIDAK BOLEH DILANGGAR)
🔒 I1 — Monotonic TickId
Untuk setiap tick:
Salin kode

tickId[n] > tickId[n-1]
Tidak boleh:
Skip
Decrement
Duplicate
🔒 I2 — Flush Only On Tick
CanonicalQueue.flush hanya boleh dipanggil oleh:
Salin kode

GlobalClock.onTick
Tidak boleh:
Dipanggil dari ingest
Dipanggil manual
Dipanggil async
🔒 I3 — Deterministic Ordering
Untuk event dengan:
exchangeTs sama
source sama
Urutan harus ditentukan oleh:
Salin kode

localSeq ASC
Tidak boleh tergantung insertion randomness.
🔒 I4 — No Cross-Token Mixing
Batch:
Salin kode

CanonicalBatch.tokenId = X
Tidak boleh ada event token lain di batch.
🔒 I5 — No Mutation After Ingest
Setelah CanonicalEvent dibuat:
Salin kode

readonly
Payload tidak boleh diubah.
🔒 I6 — Stable Token Flush Order
Jika token register:
Salin kode

1,2,3
Flush order harus:
Salin kode

1 → 2 → 3
Tidak boleh random Map iteration.
🔒 I7 — Null Normalization Safety
Jika normalize return null:
Tidak masuk queue
Tidak increment localSeq
Tidak crash engine
🔒 I8 — Queue Clear After Flush
Setelah flush:
Salin kode

queue.size() == 0
Tidak boleh ada residual event.
🔒 I9 — No Wall Clock Usage
Ingest layer tidak boleh pakai:
Salin kode

Date.now()
Semua timestamp dari exchange.
🔒 I10 — Deterministic Replay Guarantee
Jika:
Input event stream identik
Interval identik
Output CanonicalBatch sequence harus identik.
🧪 2️⃣ TEST PLAN — UNIT LEVEL
🧪 T1 — Tick Monotonic Test
Simulasi 10 tick:
Assert:
Salin kode

tickId strictly increasing
🧪 T2 — Ordering Test (Basic)
Masukkan event:
Salin kode

exchangeTs:
1002
1001
1003
Flush.
Assert order:
Salin kode

1001
1002
1003
🧪 T3 — Tie-Break Test
Masukkan event:
Salin kode

exchangeTs = 1000
source = TRADE
localSeq = 3

exchangeTs = 1000
source = TRADE
localSeq = 1
Assert:
Salin kode

localSeq 1 first
🧪 T4 — Source Priority Test
Masukkan event:
Salin kode

exchangeTs = 1000
TRADE

exchangeTs = 1000
BOOK
Assert:
TRADE (0) before BOOK (1)
🧪 T5 — Cross-Token Isolation
Token 1 & 2.
Ingest masing-masing.
Flush.
Assert:
Batch 1 only token 1
Batch 2 only token 2
🧪 T6 — Null Normalization Test
Normalizer return null.
Assert:
Queue size tetap sama.
🧪 T7 — Replay Determinism Test
Simulasi:
Record input events
Run engine
Capture batch sequence
Restart engine
Replay same input
Compare batch sequence
Harus identical.
🧪 T8 — Overrun Warning Test
Simulasi handler delay > interval.
Assert:
Warning muncul
Tick tetap jalan
🧪 T9 — Burst Test
Simulasi 500 event dalam 1 tick.
Flush.
Assert:
Sorted correctly
No drop
No reorder beyond comparator rule
🧪 T10 — Flush Empty Test
Jika queue kosong saat tick:
Assert:
Tidak emit batch
Tidak crash
🔥 3️⃣ CHAOS PREVENTION TEST
Simulasi:
WS event datang saat flush berlangsung.
Karena Node single-thread:
Ingest akan masuk setelah flush selesai.
Pastikan:
Tidak ada race
Tidak ada partial flush
🧠 4️⃣ REPLAY EQUALITY HASH TEST (Advanced)
Hash:
Salin kode

tickId + event.exchangeTs + source + localSeq
Bandingkan hash sequence live vs replay.
Harus 100% sama.
🎯 Blueprint Status Sekarang
Ingest layer sekarang punya:
✔ Formal invariants
✔ Determinism guarantee
✔ Unit test plan
✔ Replay test plan
✔ Chaos prevention plan
Ini foundation yang jarang banget orang bikin.
