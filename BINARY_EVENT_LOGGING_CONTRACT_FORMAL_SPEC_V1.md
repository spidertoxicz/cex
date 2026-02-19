BINARY EVENT LOGGING CONTRACT — FORMAL SPEC v1.0
Ini akan mengunci:
Record layout
File rotation
Append atomicity
Replay reader spec
Hash model

Ini layer yang membuat engine lu:
Replayable
Auditable
Hashable
Deterministic
Trust-grade

BINARY EVENT LOGGING CONTRACT — FORMAL SPEC v1.0
(Status: LOCKED · APPEND-ONLY · FIXED-SIZE · VERSIONED)
🧱 1️⃣ DESIGN PRINCIPLES
Append-only
Fixed-size record
No JSON
No dynamic schema
No partial write
Per-token isolated
Versioned header
Replay-first design
🧠 2️⃣ FILE STRUCTURE
Per token, per day:
Salin kode

/logs/{tokenId}/YYYY-MM-DD.bin
No multi-token mixing.
🧱 3️⃣ FILE HEADER (FIXED 64 BYTES)
Offset map:
Offset
Size
Field
0
4
Magic: 0x454E4733 ("ENG3")
4
2
SchemaVersion (uint16)
6
2
RecordSize (uint16)
8
8
TokenId (uint64)
16
8
DayEpoch (uint64)
24
8
Reserved
32
32
Reserved future
Header total: 64 bytes
🧠 4️⃣ RECORD STRUCTURE (FIXED 64 BYTES)
Every tick per token produces exactly 1 record.
Offset
Size
Field
0
8
TickId (uint64)
8
4
FSMState (uint32)
12
4
TierState (uint32)
16
4
ClusterState (uint32)
20
4
EventPhase (uint32)
24
4
PressureScore (float32)
28
4
FragileScore (float32)
32
4
TriggerScore (float32)
36
4
UnwindScore (float32)
40
4
TriggerCost (float32)
44
4
TradeDelta (float32)
48
4
OIVelocity (float32)
52
4
SpreadPct (float32)
56
4
MarkVsMidPct (float32)
60
4
Checksum (uint32)
Total: 64 bytes
🧠 5️⃣ WHY FIXED 64 BYTES?
Easy seek
Easy truncate
Easy replay
Easy hash per record
Easy integrity validation
File length rule:
Salin kode

(fileSize - 64 header) % 64 == 0
Else → corrupted.
🔒 6️⃣ CHECKSUM RULE
Checksum per record:
Salin kode

CRC32 over first 60 bytes
On replay:
Validate checksum
If invalid → truncate file to last valid record
Never auto-correct data.
🧠 7️⃣ APPEND RULE
Append sequence:
Serialize record to Buffer(64)
Compute checksum
Write buffer
Optional fsync (configurable batch)
Never modify previous bytes
No in-place edit.
🧠 8️⃣ SNAPSHOT OFFSET RELATION
Snapshot must store:
Salin kode

LastTickId
ByteOffset
On recovery:
Salin kode

Seek to offset
Resume replay from there
🧠 9️⃣ REPLAY CONTRACT
ReplayReader must:
Validate header
Validate record size
Sequentially read records
Validate checksum per record
Emit reconstructed state
Replay must produce identical FSM result.
🔥 10️⃣ HASH MODEL FOR DEPİN
Daily hash:
Salin kode

SHA256(fileBytes)
Optional:
Merkle root per 1000 record chunk.
For now: full file hash enough.
Publish:
Salin kode

tokenId
date
fileHash
schemaVersion
Node can verify.
🧠 11️⃣ CRASH SAFETY RULE
If crash mid-write:
File may end with partial record.
On startup:
Salin kode

Truncate to nearest valid 64-byte boundary
Validate checksum of last record
Never trust partial.
🧠 12️⃣ STORAGE ESTIMATION
Per token per day:
~14,400 tick × 64 bytes = 921,600 bytes (~0.9MB)
30 token:
~27MB/day
Sangat kecil.
Ini jauh lebih ringan dari event log raw.
🔒 13️⃣ VERSIONING STRATEGY
SchemaVersion uint16.
If schema change:
Major bump
New file
Archive old
No mixed record in one file.
🧠 14️⃣ WHAT IS NOT LOGGED
Tidak log:
Raw trades
Raw OI
Raw funding
FeatureFrame full
Karena log adalah structural state log, bukan raw event log.
Raw event log bisa layer terpisah kalau perlu.
🎯 FINAL STATUS
Dengan Binary Logging Contract ini:
✔ Replay-safe
✔ Deterministic
✔ Hashable
✔ Lightweight
✔ DePIN-ready
✔ Crash-safe
✔ Scale 30 token ready
Engine sekarang benar-benar event-sourced.
