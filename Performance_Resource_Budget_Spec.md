Performance & Resource Budget Spec khusus untuk spek lu:
💻 i3 Gen 12
8 core (4P+4E logical)
16GB RAM
Local server
Target awal 2–5 token → scale 30 token
Kita desain supaya:
Deterministic tetap aman
Tidak CPU spike
Tidak memory leak
Tidak IO choke
Bisa jalan 24/7
1️⃣ TARGET OPERATING MODE
Phase 1 (2–5 token FCT)
250ms tick
1s cluster update
Snapshot tiap 5–15 menit
Binary append-only log
Single-thread engine
Target CPU usage:
≤ 20%
Phase 2 (30 token ontology)
Tetap 250ms tick
Tetap single-thread FSM
IO optimized
Log per-token
Heat aggregation per 1 detik
Target CPU usage:
≤ 50%
2️⃣ CPU BUDGET ESTIMATION
Tick Frequency
250ms → 4 tick/detik
4 × 60 × 60 = 14,400 tick/jam
Per token per tick:
Canonical flush
Feature extraction
FSM eval
Log write
Misal 30 token:
30 × 4 = 120 FSM eval per detik
Itu sangat ringan untuk i3 Gen 12.
Heavy Operations
Yang berat bukan FSM.
Yang berat:
JSON parsing WS
IO write
Snapshot serialization
Compression (kalau ada)
Makanya:
✔ No JSON log
✔ No dynamic allocation besar
✔ No deep copy object
3️⃣ MEMORY BUDGET
Per Token Runtime State
Estimasi:
FSM state: <1KB
Heat buffer: <1KB
OHLC builder: <2KB
Canonical queue: <10KB burst
Total per token runtime:
~20KB
Untuk 30 token:
600KB
Plus engine overhead:
<200MB total runtime cukup aman.
16GB RAM sangat cukup.
4️⃣ IO BUDGET
Log Size
Per token per hari: ~22MB
30 token: ~660MB/hari
Masih aman untuk SSD.
Write Pattern
Append-only sequential write → sangat cepat.
i3 + SSD bisa handle ini tanpa masalah.
5️⃣ SAFE LIMIT DESIGN
Untuk menjaga stabilitas:
Limit WS subscription:
≤ 30 pair per engine instance
Jangan:
Subscribe full orderbook depth
Jangan process tick-level micro trades terlalu granular
Canonical batch sudah cukup.
6️⃣ OPTIMIZATION RULES (WAJIB)
✔ Gunakan pre-allocated buffer untuk binary record
✔ Hindari object recreation tiap tick
✔ Gunakan typed arrays / buffer
✔ Hindari async await dalam loop tick
✔ Jangan gunakan setInterval untuk FSM
✔ GlobalClock pakai monotonic timer
7️⃣ SCALING STRATEGY
Kalau nanti 30 token mulai berat:
Step 1:
Pisahkan WS parsing thread (worker)
FSM tetap single-thread
Step 2:
Pisahkan IO writer thread
Step 3:
Cluster tetap di main thread
Jangan lompat ke multi-thread FSM dulu.
8️⃣ PERFORMANCE RED FLAGS
Jika terjadi:
Tick processing > 250ms
Heap growth terus naik
Log append delay
Snapshot > 50ms blocking
Maka perlu profiling.
9️⃣ EXPECTED PERFORMANCE REALITY
Dengan desain ini:
2–5 token: CPU < 10%
30 token: CPU 20–40%
Masih sangat aman untuk i3 Gen 12.
Engine ini jauh lebih ringan dibanding HFT bot.
🔟 WHAT NOT TO DO
❌ Jangan pakai heavy ORM
❌ Jangan pakai database untuk log tick
❌ Jangan simpan JSON metric
❌ Jangan bikin deep nested object
❌ Jangan pakai random UUID tiap tick
Semua harus numeric + fixed layout.
🎯 Kesimpulan
Spek PC lu:
✔ Sangat cukup
✔ Bisa jalan 30 token
✔ Tidak perlu Go sekarang
✔ TypeScript cukup aman
Determinism lebih penting dari micro-optimization.
Sekarang kita sudah punya:
Architecture spec
FSM spec
Cluster spec
EventPhase spec
Storage spec
Failure spec
Performance spec
Blueprint sudah matang bang
