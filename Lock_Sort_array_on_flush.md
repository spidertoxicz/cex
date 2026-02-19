✅ Lock: Sort array on flush (A)
❌ Tidak pakai priority queue
🎯 Fokus determinism + simplicity
Dan lu benar:
Token masih sedikit
CPU i3 cukup
Overengineering sekarang = buang waktu
Risiko bug lebih mahal dari micro-optimization
🧠 Kenapa Ini Keputusan Profesional?
Karena:
Deterministic system itu lebih sensitif terhadap:
Complexity
Edge-case bug
Ordering ambiguity
Bukan terhadap O(n log n) kecil.
Sorting 10–30 event tiap 250ms itu hampir nol cost.
🔒 Final Canonical Strategy (Locked)
Per token:
Salin kode

eventBuffer: CanonicalEvent[]
Saat ingest:
Salin kode

push(event)
Saat flush (250ms tick):
Salin kode

sort by:
  1. exchangeTs ASC
  2. sourcePriority ASC
  3. localSeq ASC

emit CanonicalBatch
clear buffer
Selesai.
🧱 Ordering Comparator (Deterministic Rule)
Urutan source priority harus FIXED dan tidak boleh berubah:
Salin kode

0 = trade
1 = book
2 = mark
3 = liquidation
4 = oi
5 = funding
Ini harus jadi constant enum, bukan dynamic.
🧠 Determinism Guarantee
Dengan:
Fixed tick cadence
Stable comparator
No async mutation
No mid-tick processing
→ Replay akan identik.
🎯 Sekarang Kita Siap Implement GlobalClock + Canonical
Langkah implementasi berikut:
1️⃣ Buat GlobalClock class
2️⃣ Buat CanonicalQueue per token
3️⃣ Buat CanonicalEngine orchestrator
4️⃣ Buat minimal test harness (tanpa FSM dulu)
Kita uji dulu:
Tick berjalan konsisten
Batch flush konsisten
Ordering konsisten
Tidak ada drift
