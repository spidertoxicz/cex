Hard Reset per Major Version.
Itu paling rasional untuk engine lu.
Dan lu benar:
FCT event itu lifecycle 1–2 minggu.
Setelah selesai → archive.
Tidak perlu backward compatibility selamanya.
Fokus utama sekarang:
Intraday deterministic engine stabil dulu.
Itu prioritas yang benar.
🧠 Kenapa Lock B Sangat Cocok Dengan FCT?
Karena FCT:
Event-based
Time-bounded
Tidak perpetual seperti BTC
Siklus jelas (start → build → unwind → selesai)
Kalau event selesai:
Log bisa di-archive
Snapshot final bisa di-hash
Engine lanjut ke event berikutnya
Tidak perlu membawa legacy schema lama.
🔒 Strategi Final Versioning (Locked)
✔ Minor & patch tetap backward compatible
✔ Major bump → archive & reset
✔ Snapshot final sebelum upgrade
✔ Log lama immutable & hashable
✔ Engine hanya baca versi aktif
Clean. Tidak ada debt jangka panjang.
🧱 Status Arsitektur Sekarang
Storage Layer:
Fixed-size binary log
Per-token per-day file
Per-token snapshot
Versioned header
Major reset strategy
Canonical Layer:
Per-token queue
Global 250ms hard flush
Deterministic ordering
Logic Layer:
Sequential FSM
Tier auto + cluster-aware
Weighted breadth
Adaptive heat window
TriggerCost physics-driven
OHLC 1m + 5m context only
Runtime:
Single-thread deterministic
Event-sourced
Snapshot recovery
Ini sudah backbone production-grade.
