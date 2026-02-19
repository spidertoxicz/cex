Cluster FSM Spec v1.0 (FCT Mode) yang deterministic dan scalable.
🧠 1️⃣ Event Phase Model (Cluster Context)
Cluster harus tahu fase event:
Salin kode

0 = EVENT_PREP
1 = EVENT_START
2 = EVENT_MID
3 = EVENT_END
4 = EVENT_POST
Sumber fase:
Config event schedule (deterministic)
Bisa di-override jika UNWIND breadth dominan lebih cepat
Event phase bukan hasil probabilitas. Harus deterministic (timestamp-based + rule-based).
🧱 2️⃣ Cluster FSM Enum (Level 2)
Salin kode

0 = CLUSTER_CALM
1 = CLUSTER_HEATING
2 = CLUSTER_FRAGILE
3 = CLUSTER_UNWIND
4 = CLUSTER_COOLDOWN
Cluster membaca distribusi state token, bukan metric mentah.
🧮 3️⃣ Dynamic Threshold Formula (Deterministic)
Misal:
N = jumlah token aktif
F = jumlah token dalam FRAGILE
T = jumlah token dalam TRIGGER_READY
U = jumlah token dalam UNWIND
🔹 Base Threshold (by token count)
Salin kode

HeatingBase  = ceil(N × 0.5)
FragileBase  = ceil(N × 0.7)
UnwindBase   = ceil(N × 0.6)
🔹 Phase Adjustment
EVENT_START (pump prone)
HeatingThreshold  = ceil(N × 0.4)
FragileThreshold  = ceil(N × 0.6)
UnwindThreshold   = ceil(N × 0.7)
→ Lebih sensitif build, lebih ketat unwind
EVENT_MID (stabilisasi)
HeatingThreshold  = ceil(N × 0.5)
FragileThreshold  = ceil(N × 0.7)
UnwindThreshold   = ceil(N × 0.6)
→ Netral
EVENT_END (dump prone)
HeatingThreshold  = ceil(N × 0.6)
FragileThreshold  = ceil(N × 0.7)
UnwindThreshold   = ceil(N × 0.5)
→ Lebih sensitif unwind
EVENT_POST
Semua threshold naik (sulit heating)
Fokus cooldown
🔄 4️⃣ Transition Rule (Sequential Only)
CALM → HEATING
Jika:
Salin kode

F >= HeatingThreshold
Persist ≥ X cluster tick
HEATING → FRAGILE
Jika:
Salin kode

T >= FragileThreshold
Persist ≥ Y tick
FRAGILE → UNWIND
Jika:
Salin kode

U >= UnwindThreshold
Tidak perlu persist lama (cascade cepat).
UNWIND → COOLDOWN
Jika:
Salin kode

U menurun
dan ≥ Z tick stabil
COOLDOWN → CALM
Jika: Semua token kembali BUILD/PRESSURE
🔒 Determinism Rules
Cluster update tiap 1 detik (fixed)
Tidak membaca WS langsung
Hanya membaca token FSM state
Tidak override token FSM
Hanya memodifikasi:
Sensitivitas threshold token
TriggerCost multiplier
Alert escalation
⚙️ 5️⃣ Interaction With Token Layer
Cluster boleh:
✔ Turunkan TriggerCost global multiplier
✔ Aktifkan fast-mode micro-cycle sensitivity
✔ Emit systemic alert
Cluster tidak boleh:
❌ Paksa token lompat state
❌ Reset token state
🧠 Kenapa Ini Cocok Untuk FCT?
Karena:
Pump di start → Heating cepat naik
Dump di end → Unwind cepat terdeteksi
Breadth manipulatif tetap terkontrol
Tidak over-sensitive saat mid event
Ini kontekstual tapi deterministic.
🎯 Status Sekarang
Kita sudah punya:
Token FSM Spec v1.0
Cluster FSM Spec v1.0
Event phase adaptive threshold
Sequential deterministic model
Blueprint sekarang sudah konsisten.
