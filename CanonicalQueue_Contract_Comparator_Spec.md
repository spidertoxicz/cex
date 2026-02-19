CanonicalQueue Contract & Comparator Spec.
Ini layer paling krusial setelah GlobalClock. Kalau ini bocor → semua FSM salah.
Ini masih blueprint-level contract, bukan final production optimization.
📦 CANONICAL QUEUE — CONTRACT v1.0
🎯 Tujuan
CanonicalQueue bertugas:
Menampung event mentah (sudah dinormalisasi)
Mengisolasi per-token
Menjaga ordering deterministik
Menghasilkan CanonicalBatch per tick
Tidak boleh tahu FSM
Tidak boleh tahu cluster
Tidak boleh tahu storage
🧱 1️⃣ DATA MODEL
1.1 SourceType (Locked Enum Order)
Urutan ini tidak boleh berubah tanpa MAJOR version bump.
Ts
Salin kode
export enum SourceType {
  TRADE = 0,
  BOOK = 1,
  MARK = 2,
  LIQUIDATION = 3,
  OPEN_INTEREST = 4,
  FUNDING = 5,
}
Urutan ini jadi secondary ordering rule.
1.2 CanonicalEvent
Ts
Salin kode
export interface CanonicalEvent {
  readonly tokenId: number;
  readonly source: SourceType;
  readonly exchangeTs: number; // milliseconds from exchange
  readonly localSeq: number;   // per-token increment
  readonly payload: unknown;   // still raw, parsed later
}
Rules:
exchangeTs = primary ordering key
localSeq = tie-break terakhir
payload tidak boleh diproses di layer ini
1.3 CanonicalBatch
Ts
Salin kode
export interface CanonicalBatch {
  readonly tokenId: number;
  readonly tickId: bigint;
  readonly events: readonly CanonicalEvent[];
}
Batch immutable. FSM hanya boleh membaca batch ini.
🧱 2️⃣ CanonicalQueue Contract
Ts
Salin kode
export interface CanonicalQueue {
  ingest(event: CanonicalEvent): void;

  flush(tickId: bigint): CanonicalBatch | null;

  size(): number;

  clear(): void;
}
🧠 Behavioral Rules
ingest()
O(1) push
Tidak sort
Tidak mutate event
Tidak trigger logic
flush(tickId)
Jika empty → return null
Sort internal buffer
Create CanonicalBatch
Clear internal buffer
Return batch
Sorting hanya terjadi di flush.
🧠 3️⃣ Comparator Spec (Deterministic Ordering Rule)
Comparator harus strict dan total-order.
Ordering priority:
1️⃣ exchangeTs ASC
2️⃣ source ASC
3️⃣ localSeq ASC
Formal Comparator Logic
Pseudo-code:
Salin kode

if a.exchangeTs < b.exchangeTs → a first
if a.exchangeTs > b.exchangeTs → b first

if a.source < b.source → a first
if a.source > b.source → b first

if a.localSeq < b.localSeq → a first
if a.localSeq > b.localSeq → b first

else equal
🔒 Important Determinism Notes
Comparator tidak boleh pakai payload
Tidak boleh pakai Date.now()
Tidak boleh pakai floating time
exchangeTs harus dari exchange
localSeq harus increment-only per token
🧠 4️⃣ Local Sequence Rule
Setiap token punya counter:
Salin kode

tokenLocalSeq[tokenId]++
Ini memastikan:
Kalau exchangeTs sama & source sama, urutan tetap stabil.
Tanpa ini, JS sort bisa unstable behavior jika key identical.
🧱 5️⃣ Internal Storage Model
Per token:
Ts
Salin kode
private buffer: CanonicalEvent[] = []
Tidak perlu Map di dalam queue. Map token → queue ada di CanonicalEngine layer.
🧠 6️⃣ CanonicalEngine (Blueprint Level)
CanonicalEngine bertugas:
Salin kode

Map<tokenId, CanonicalQueue>
Saat tick:
Salin kode

for each token:
   batch = queue.flush(tickId)
   if batch != null:
       emit(batch)
Tidak boleh:
Cross-token sort
Gabung token dalam satu batch
Mutasi antar token
🔥 7️⃣ Edge Case Rules
Case: exchangeTs future timestamp
Tidak ditolak. Tetap masuk ordering.
FSM layer yang bisa validasi anomaly.
Case: exchangeTs missing
EventNormalizer harus reject sebelum masuk CanonicalQueue.
CanonicalQueue tidak validasi schema.
Case: Huge burst event
Sorting cost tetap kecil karena 250ms flush.
Kalau >1000 event per token per tick: itu anomaly.
🧠 8️⃣ Determinism Guarantee Clause
Jika:
Event log sama
exchangeTs sama
source priority sama
localSeq increment sama
flush cadence sama
→ CanonicalBatch identik.
🎯 Blueprint Status
Sekarang kita punya:
✔ GlobalClock contract
✔ CanonicalQueue contract
✔ Comparator deterministic rule
✔ SourceType fixed ordering
✔ No cross-layer dependency
Backbone ingest layer sudah formal.
