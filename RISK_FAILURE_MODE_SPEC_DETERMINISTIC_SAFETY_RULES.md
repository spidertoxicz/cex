Risk & Failure Mode Spec itu WAJIB sebelum coding.
Kalau ini tidak jelas, determinism bisa hancur saat kondisi edge-case.
Kita tambahkan section resmi ke dokumen:
1️⃣2️⃣ RISK & FAILURE MODE SPEC
ENGINE_V3 — Deterministic Safety Rules
Tujuan:
Engine tidak panic
Engine tidak corrupt log
Engine tidak mutate state liar
Engine tetap replay-safe
Engine selalu recoverable
🧨 12.1 WebSocket Disconnect
Scenario:
WS putus
Latency spike
Missing trade burst
Rule:
CanonicalLayer stop ingest
FSM tidak update sampai next flush
Engine tandai:
Salin kode

DataIntegrityFlag = DEGRADED
Trigger polling snapshot:
OI
Funding
(Optional) Depth snapshot
Resume ingest setelah sync
⚠️ Tidak boleh:
Force reset state
Lompat ke BUILD
Clear heat
🧨 12.2 Missing Batch (Tick Skip)
Jika GlobalClock tick terjadi tapi tidak ada event:
Rule:
Tetap flush empty batch
FSM tetap dipanggil
State tidak berubah kecuali hysteresis
Determinism tetap terjaga.
🧨 12.3 Corrupted Event Log
Saat startup:
Validate header magic
Validate record size
Validate file length % 64 == 0
Jika gagal:
Stop engine
Jangan lanjut replay
Emit fatal error
Jangan auto-repair. Determinism lebih penting dari convenience.
🧨 12.4 Corrupted Snapshot
Jika:
Snapshot version mismatch
Checksum gagal
Offset invalid
Rule:
Abaikan snapshot
Replay dari awal file hari tersebut
Snapshot hanya optimization. Bukan source of truth utama.
🧨 12.5 EventPhase Mismatch Antar Token
Saat restart:
Load semua token snapshot
Compare EventPhase
Jika mismatch:
Log warning
Fallback full replay
Ambil phase dari replay result
Tidak boleh lanjut dengan mismatch.
🧨 12.6 Clock Drift
GlobalClock harus:
Monotonic
Tidak tergantung system wall clock
Tidak boleh skip tick
Jika delay > 250ms × 2:
Log latency warning
Tetap lanjut sequential
Jangan compress tick
🧨 12.7 High CPU / Backpressure
Jika processing > 250ms:
Rule:
Tick berikutnya tetap incremental
Tidak boleh merge tick
Tidak boleh skip state update
Engine boleh tertinggal, tapi tidak boleh hilang tick.
🧨 12.8 Sudden Massive Liquidation Spike
Liquidation spike bukan alasan:
Lompat state
Skip hysteresis
Semua tetap batch-based.
Tidak ada interrupt logic.
🧨 12.9 Storage Full
Jika disk penuh:
Stop log append
Stop snapshot
Freeze FSM update
Emit fatal
Jangan lanjut tanpa logging. Karena event-sourced integrity akan rusak.
🧨 12.10 Partial Write (Crash During Append)
BinaryLogWriter harus:
Atomic append
Flush fsync per N batch
Pada startup:
Truncate file ke last full record boundary
Tidak boleh replay half-record.
🧠 12.11 Determinism Guarantee Clause
Engine dianggap valid jika:
Replay log menghasilkan state identik
Snapshot + replay menghasilkan state identik
No state change outside GlobalTick
Jika tidak: Engine dianggap invalid build.
🔐 12.12 Safe Mode (Optional Future)
Jika data integrity DEGRADED terlalu lama:
Engine boleh:
Disable alert emission
Tetap log state
Tapi tidak boleh auto-reset.
📌 RESULT
Dengan Failure Spec ini:
✔ Engine tidak chaos saat WS putus
✔ Log tidak corrupt
✔ Snapshot aman
✔ Replay tetap identik
✔ Tidak ada hidden mutation
Sekarang blueprint benar-benar production-level.
Arsitektur sudah:
Deterministic
Layered
Versioned
Recoverable
Failure-aware
