🧠 ENGINE STATE MACHINE — LEVEL 1 (TOKEN LEVEL)
FSM ini berlaku per token.
Sequential only.
No jump.
No randomness.
No probabilistic transition.
🧱 STATE ENUM (LOCKED)
Salin kode

0 = BUILD
1 = PRESSURE
2 = FRAGILE
3 = TRIGGER_READY
4 = UNWIND
5 = COOLDOWN
Tidak boleh diubah tanpa MAJOR version bump.
🧭 STATE DESCRIPTION (Formal)
🟢 BUILD
Definisi: Leverage belum padat. Struktur masih netral.
Kondisi umum:
OI velocity rendah / netral
Funding tidak ekstrem
Divergence lemah
Compression belum matang
Tujuan state: Deteksi awal akumulasi tekanan.
🔁 BUILD → PRESSURE
Transition jika:
OI_velocity > threshold_tiered
Compression_score meningkat
Funding_skew condong satu sisi
HeatScore >= Heating
Dan kondisi persist ≥ X tick (hysteresis)
🟡 PRESSURE
Definisi: Leverage mulai terkonsentrasi.
Ciri:
OI velocity persist
Compression meningkat
Divergence mulai muncul
HeatScore meningkat
🔁 PRESSURE → FRAGILE
Transition jika:
OI_density tinggi
Funding skew ekstrem
Divergence prep align
TriggerCost <= Moderate
HeatScore >= Hot
Persist ≥ Y tick
🔴 FRAGILE
Definisi: Sistem rapuh. Trigger murah.
Ciri:
OI padat
Funding ekstrem
Divergence kuat
Liquidity elasticity lemah
TriggerCost rendah
🔁 FRAGILE → TRIGGER_READY
Transition jika:
TriggerCost <= LOW
Divergence confirmed
Compression matang
HeatScore >= Hot
Persist ≥ Z tick
🟣 TRIGGER_READY
Definisi: Sistem siap unwind.
Menunggu katalis mikro.
🔁 TRIGGER_READY → UNWIND
Transition jika:
Aggression spike
Liquidation spike
Structure level break (micro + OHLC context valid)
Tidak perlu persist panjang. Ini event-driven tapi tetap batch-based.
🔥 UNWIND
Definisi: Cascade berlangsung.
Ciri:
OI drop cepat
Liquidation breadth
Volatility spike
🔁 UNWIND → COOLDOWN
Transition jika:
OI drop selesai
Funding reset
Volatility stabilisasi awal
TriggerCost naik kembali
❄ COOLDOWN
Definisi: Post-unwind stabilization.
Ciri:
Leverage flush
Volatility tinggi tapi netral
Funding normalize
🔁 COOLDOWN → PRESSURE
Jika leverage rebuild cepat.
🔁 COOLDOWN → BUILD
Jika sistem kembali netral.
Tidak boleh langsung ke FRAGILE.
🧠 HYSTERESIS RULE (WAJIB)
Masuk state:
Butuh persist >= N tick
Keluar state:
Butuh persist >= M tick
M > N
Mencegah flip-flop.
🧠 STATE TRANSITION TABLE (Deterministic Matrix)
From
To
Allowed
Direct?
BUILD
PRESSURE
✔
Yes
PRESSURE
FRAGILE
✔
Yes
FRAGILE
TRIGGER_READY
✔
Yes
TRIGGER_READY
UNWIND
✔
Yes
UNWIND
COOLDOWN
✔
Yes
COOLDOWN
PRESSURE
✔
Yes
COOLDOWN
BUILD
✔
Yes
Any
Skip state
❌
Never
No jump. No reverse. No random.
🧠 INTERACTION WITH HEAT & TIER
FSM membaca:
Tier-adjusted thresholds
HeatScore
TriggerCost
FSM tidak tahu cluster global.
Cluster layer hanya memodifikasi input threshold.
🧠 INTERACTION WITH OHLC
OHLC hanya:
Validasi compression
Validasi break structure
Validasi exhaustion
Tidak pernah jadi primary transition.
🧠 STATE OUTPUT CONTRACT
Setiap transition harus log:
Salin kode

StateFrom
StateTo
GlobalTickId
ReasonFlags
MetricsSnapshot
Tidak boleh silent transition.
🔒 Determinism Rules
Transition hanya dipanggil di akhir batch flush
Tidak boleh transition di tengah batch
Tidak boleh async mutation
Semua threshold berbasis fixed formula
Semua multiplier berasal dari Tier engine
🎯 FSM SPEC v1.0 LOCKED
Ini token-level FSM.
Cluster/global nanti layer di atas ini.
