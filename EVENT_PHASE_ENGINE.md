🧠 EVENT PHASE ENGINE — SPEC v1.0
EventPhase adalah cluster-level context state, bukan probabilitas.
Enum (locked):
Salin kode

0 = EVENT_PREP
1 = EVENT_START
2 = EVENT_MID
3 = EVENT_END
4 = EVENT_POST
🧱 1️⃣ Primary Phase Source (Deterministic)
EventPhase dasar berasal dari:
Config:
eventStartTimestamp
eventMidTimestamp
eventEndTimestamp
eventPostTimestamp
Rule:
Salin kode

if now < eventStart → PREP
if eventStart ≤ now < eventMid → START
if eventMid ≤ now < eventEnd → MID
if eventEnd ≤ now < eventPost → END
if now ≥ eventPost → POST
Ini deterministic, tidak ambigu.
🔥 2️⃣ Auto-Detect Override Layer (Controlled)
Override hanya boleh terjadi jika kondisi kuat terpenuhi.
Override Condition: Early Collapse
Jika:
Salin kode

ClusterState == CLUSTER_UNWIND
AND
U (token UNWIND count) ≥ ceil(N × 0.6)
AND
persist ≥ K detik
Maka:
Salin kode

EventPhase → EVENT_END (override)
Walaupun waktu belum masuk eventEndTimestamp.
Override Condition: Post-Collapse
Jika:
Salin kode

ClusterState == CLUSTER_COOLDOWN
AND
≥ 70% token kembali BUILD
AND
persist ≥ M detik
Maka:
Salin kode

EventPhase → EVENT_POST
⚠️ RULES AGAR TETAP DETERMINISTIC
Override hanya boleh maju (tidak boleh mundur).
Override harus persist minimal K detik (misal 10–30 detik).
Tidak boleh flip bolak-balik.
Semua override harus di-log sebagai EventPhaseTransition event.
🧠 Kenapa Hybrid Ini Penting?
Karena FCT:
Kadang event “mati” sebelum jadwal
Dump bisa datang lebih cepat
Manipulasi bisa membuat event gagal
Kalau hanya config-based:
Engine bisa tetap di START padahal market sudah collapse.
Kalau hanya auto-detect:
Engine tidak punya struktur waktu jelas.
Hybrid = stabil + adaptif.
🧱 3️⃣ Interaction Dengan Cluster FSM
EventPhase mempengaruhi:
HeatingThreshold
FragileThreshold
UnwindThreshold
Cluster FSM membaca EventPhase, tapi tidak bisa mengubah config timeline secara random.
🔒 Deterministic Guarantee
Karena:
Override berbasis state + persist
Threshold jelas
No random
No score-only trigger
Hanya sequential forward
Replay akan identik.
🎯 Engine Sekarang Sudah Punya 3 Layer FSM
1️⃣ Token FSM
2️⃣ Cluster FSM
3️⃣ EventPhase FSM
Semua sequential. Semua deterministic. Semua bisa di-log.
Blueprint engine sekarang sudah sangat matang.
