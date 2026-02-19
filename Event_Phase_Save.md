EventPhase disimpan di per-token snapshot dulu
Dan untuk fase sekarang (2–5 token), itu masuk akal dan aman.
Tapi gue akan jelaskan konsekuensi supaya nanti saat scale 30 token kita tidak kaget.
🧠 Kenapa A Masih Aman Sekarang?
Karena:
Token sedikit (2–5)
Cluster kecil
Restart jarang
Infrastruktur masih single-node
Replay cost kecil
Menyimpan EventPhase di snapshot per-token:
✔ Simpel
✔ Tidak perlu dependency global snapshot
✔ Recovery cepat
✔ Tidak bikin arsitektur kompleks
Untuk fase FCT mini cluster, itu sehat.
⚠️ Tapi Ini Bukan Desain Final Jangka Panjang
Kenapa?
EventPhase itu cluster-level context, bukan token-level state.
Kalau nanti 30 token:
Token A snapshot jam 12:00
Token B snapshot jam 12:01
Token C snapshot jam 12:00:30
Kalau EventPhase ikut di masing-masing file, ada potensi mismatch saat recovery.
Untuk sekarang kecil risikonya. Untuk 30 token bisa messy.
🧠 Jadi Kenapa Kita Tetap Izinkan A Sekarang?
Karena:
GlobalClock sudah sinkron
Snapshot dibuat di tick yang sama
Token sedikit
Recovery masih simpel
Overengineering sekarang tidak perlu
Dan lu sudah bilang:
Fokus intraday dulu.
Itu benar.
🔒 Jadi Kita Lock Model Ini
Saat ini:
✔ EventPhase disimpan di per-token snapshot
✔ Nilai harus identik antar token
✔ Snapshot dibuat setelah global tick flush
✔ Recovery load dari token pertama → validasi konsistensi
Tambahkan safety rule:
Saat restart:
Salin kode

Load snapshot semua token
Assert(EventPhase semua sama)
Jika beda → fallback ke replay
Ini mencegah silent corruption.
🚀 Roadmap Saat Scale 30 Token
Nanti kita migrasi ke:
✔ Global cluster snapshot file
✔ Token snapshot tidak simpan EventPhase
✔ EventPhase jadi pure cluster state
Itu clean untuk skala besar.
📌 Status Sekarang
Engine blueprint sudah:
Token FSM locked
Cluster FSM locked
EventPhase FSM locked
Canonical layer locked
Binary log locked
Snapshot schema locked
Versioning strategy locked
Hard reset strategy locked
Blueprint backbone sudah konsisten.
