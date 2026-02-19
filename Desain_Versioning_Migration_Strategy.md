desain Versioning & Migration Strategy yang:
Deterministic
Backward-compatible
Tidak merusak replay
Aman untuk DePIN audit
Siap scale 30 token
🎯 PRINCIPLE BESAR
1️⃣ Event log tidak boleh diubah setelah ditulis.
2️⃣ Snapshot tidak boleh diinterpretasi dengan schema berbeda tanpa version check.
3️⃣ Schema evolution harus additive atau version-bump major.
4️⃣ Replay harus selalu tahu cara baca versi lama.
🧱 1️⃣ VERSIONING STRATEGY
Kita pakai Semantic Engine Schema Versioning:
Salin kode

Major.Minor.Patch
Contoh:
Salin kode

1.0.0
1.1.0
2.0.0
🔹 MAJOR (Breaking change)
Naik MAJOR jika:
Record layout berubah
Field dihapus
Enum berubah
FSM state berubah
Snapshot struct berubah incompatible
Contoh:
Salin kode

1.x.x → 2.0.0
Rule:
Tidak boleh replay log versi lama tanpa migrator
Snapshot lama harus dimigrasi atau invalid
🔹 MINOR (Backward compatible addition)
Naik MINOR jika:
Tambah field di reserved area
Tambah enum baru tanpa ubah lama
Tambah metric baru di record
Contoh:
Salin kode

1.0.0 → 1.1.0
Rule:
Reader lama masih bisa baca record lama
Reader baru bisa baca lama & baru
🔹 PATCH (Bugfix internal)
Naik PATCH jika:
Perbaikan internal
Tidak ubah layout
Tidak ubah enum
Contoh:
Salin kode

1.1.0 → 1.1.1
Replay tetap aman.
🧾 2️⃣ EVENT LOG VERSION HANDLING
Di header file log sudah ada:
Salin kode

SchemaVersion (uint16)
RecordSize (uint16)
Replay engine harus:
Salin kode

if file.schemaVersion != engine.supportedVersion:
    run compatibility layer
Jangan silent fail.
🔄 3️⃣ MIGRATION STRATEGY
Ada 2 pendekatan:
A) Lazy Migration (Recommended)
Saat replay:
Engine baca schema lama
Mapping field lama → struct baru
Field baru diisi default
Tidak rewrite file.
Ini lebih aman dan tidak boros storage.
B) Offline Migration Tool
Tool khusus:
Salin kode

migrate-log v1 → v2
Rewrite file ke format baru.
Dipakai jika:
Breaking change besar
Perlu optimasi record
🧠 4️⃣ ENUM IMMUTABILITY RULE
Enum tidak boleh diubah urutannya.
Contoh FSM:
Salin kode

0 BUILD
1 PRESSURE
2 FRAGILE
3 TRIGGER_READY
4 UNWIND
5 COOLDOWN
Kalau mau tambah:
Tambahkan di akhir:
Salin kode

6 NEW_STATE
Jangan ubah mapping lama.
Ini krusial untuk replay.
🧱 5️⃣ SNAPSHOT VERSIONING
Snapshot header sudah punya:
Salin kode

SchemaVersion
SnapshotType
Rule:
Snapshot hanya boleh dipakai jika versi kompatibel
Kalau tidak, fallback ke replay log
Snapshot tidak boleh dipaksakan load kalau versi beda.
🔒 6️⃣ COMPATIBILITY LAYER DESIGN
Buat folder:
Salin kode

/engine/compat
  v1-reader.ts
  v2-reader.ts
Replay engine pilih reader sesuai schema.
Jangan bikin if-else besar dalam core engine.
🧠 7️⃣ FORWARD COMPATIBILITY STRATEGY
Karena kita pakai fixed-size + reserved field:
Kalau mau tambah metric:
Pakai reserved space dulu
Baru bump minor version
Ini bikin log lama tetap valid.
🔐 8️⃣ DEPIN TRUST STRATEGY
Untuk DePIN audit:
Hash include:
Salin kode

SchemaVersion
FileHeader
AllRecordBytes
Kalau schema berubah, hash otomatis beda.
Audit tetap kuat.
🎯 REALITY CHECK
Dengan strategi ini:
✔ Engine bisa upgrade tanpa rewrite semua log
✔ Snapshot tetap aman
✔ Replay tetap deterministic
✔ Storage tidak meledak
✔ 30 token scale tidak ribet
🔒 LOCK CHECK
Sekarang fondasi storage layer sudah:
Fixed-size binary log
Per-token file per hari
Per-token snapshot
Global heat snapshot
Versioned schema
Lazy migration ready
Backbone sudah production-level.
