🔥 Oke. Sekarang kita desain Snapshot Schema Detail dengan mindset:
Deterministic
Per-token
Fixed-size
Versioned
Replay cepat
DePIN-trust ready
Tidak boros storage
Kita buat snapshot itu sebagai:
Checkpoint deterministik state engine pada waktu tertentu
Bukan dump sembarang object.
🎯 TUJUAN SNAPSHOT
Snapshot harus memungkinkan:
Load state tanpa replay dari awal hari
Resume engine dengan hasil identik
Validasi integritas
Cocok dengan binary event log
🧱 SNAPSHOT FILE STRUKTUR
Per-token file:
Salin kode

/snapshots/FCT1/2026-02-16_12-00.snap
📦 1️⃣ Snapshot Header (Fixed 64 Byte)
Ukuran: 64 byte
Offset
Size
Field
0
4
Magic (0x534E4150 = "SNAP")
4
2
Schema Version (uint16)
6
2
Snapshot Type (uint16)
8
8
GlobalTickId (uint64)
16
8
ExchangeTimestamp (uint64)
24
8
TokenId (uint64)
32
8
EventLogOffset (uint64)
40
8
StateChecksum (uint64)
48
16
Reserved
Penting:
EventLogOffset = posisi byte terakhir yang sudah diproses
Ini bikin replay resume presisi.
🧠 2️⃣ FSM STATE BLOCK (32 Byte)
Field
Size
Current FSM State (uint8)
1
Tier State (uint8)
1
TriggerCost Level (uint8)
1
Cooldown Subtype (uint8)
1
Reserved
4
State Entry TickId (uint64)
8
State Duration (uint64)
8
ReasonFlags (uint32)
4
Padding
4
Total: 32 byte
🌡 3️⃣ HEAT ENGINE STATE (64 Byte)
Kita simpan ring buffer minimal.
Field
Size
Current HeatScore (int32)
4
Heat Window Mode (uint8)
1
Reserved
3
RollingSum (int64)
8
RollingCount (uint32)
4
HysteresisCounter (uint32)
4
LastHeatUpdateTick (uint64)
8
HeatBuffer (array fixed 8 entries int32)
32
Total: 64 byte
📊 4️⃣ TIER ENGINE STATE (48 Byte)
Field
Size
VolatilityTier (uint8)
1
OIDensityTier (uint8)
1
LiquidityTier (uint8)
1
Reserved
5
VolatilityMetric (int32)
4
OIDensityMetric (int32)
4
LiquidityMetric (int32)
4
TierHysteresisCounter (uint32)
4
LastTierUpdateTick (uint64)
8
Reserved
16
Total: 48 byte
💥 5️⃣ TRIGGER COST ENGINE STATE (32 Byte)
Field
Size
CurrentTriggerScore (int32)
4
LiquidityStressScore (int32)
4
CompressionScore (int32)
4
DivergenceScore (int32)
4
OIVelocityScore (int32)
4
LastUpdateTick (uint64)
8
Reserved
4
Total: 32 byte
🕯 6️⃣ OHLC BUILDER STATE (Per Timeframe)
Untuk 1m dan 5m kita simpan:
Per timeframe = 48 byte
Field
Size
CurrentBucketId (uint64)
8
Open (int32 scaled)
4
High (int32 scaled)
4
Low (int32 scaled)
4
Close (int32 scaled)
4
Volume (int64 scaled)
8
TradeCount (uint32)
4
Reserved
12
Total per timeframe: 48 byte
Total untuk 2 timeframe: 96 byte
📏 TOTAL SNAPSHOT SIZE (Approx)
Header: 64
FSM: 32
Heat: 64
Tier: 48
Trigger: 32
OHLC: 96
Total ≈ 336 byte per snapshot
Sangat kecil.
🔒 Determinism Rules
Snapshot hanya valid jika:
GlobalTickId align dengan log
EventLogOffset cocok
Checksum valid
No async mutation saat snapshot dibuat
Snapshot dibuat:
Tepat setelah batch flush 250ms selesai.
Bukan saat event masuk.
🔁 RECOVERY FLOW
Saat engine start:
Load snapshot terbaru
Seek ke EventLogOffset
Replay log dari offset
Resume live
Tidak perlu replay dari awal hari.
🧠 DePIN Trust Layer
Karena snapshot:
Fixed-size
Checksum
Versioned
Token isolated
Lu bisa hash snapshot dan publish hash.
Audit jadi kuat.
🔒 Sekarang Kita Lock Snapshot Design
