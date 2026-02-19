📦 EVENT NORMALIZER — CONTRACT v1.0
🎯 Tujuan
EventNormalizer bertugas:
Menerima raw event dari adapter (WS / polling)
Validasi minimal schema
Mapping ke CanonicalEvent
Menjamin field wajib ada
Tidak boleh mutasi state
Tidak boleh baca FSM
Tidak boleh tahu tick
Normalizer itu pure transformation layer.
🧱 1️⃣ Input Types
Normalizer menerima:
Ts
Salin kode
export type RawEvent =
  | RawTradeEvent
  | RawBookEvent
  | RawMarkPriceEvent
  | RawLiquidationEvent
  | RawOpenInterestEvent
  | RawFundingEvent;
RawEvent berasal dari Data Adapter.
Adapter bertugas parsing JSON → RawEvent. Normalizer tidak parsing JSON string.
🧱 2️⃣ Output Type
Ts
Salin kode
export interface CanonicalEvent {
  readonly tokenId: number;
  readonly source: SourceType;
  readonly exchangeTs: number;
  readonly localSeq: number;
  readonly payload: unknown;
}
Normalizer tidak boleh generate tickId. TickId hanya dari GlobalClock.
🧠 3️⃣ EventNormalizer Contract
Ts
Salin kode
export interface EventNormalizer {
  normalize(
    raw: RawEvent,
    tokenId: number,
    nextLocalSeq: () => number
  ): CanonicalEvent | null;
}
🧠 Kenapa nextLocalSeq() Diinject?
Supaya:
Local sequence tetap dikontrol per token
Normalizer tidak menyimpan counter internal
Determinism tetap di CanonicalEngine layer
localSeq bukan tanggung jawab normalizer.
🧱 4️⃣ Validation Rules (Strict)
Normalizer harus reject jika:
❌ exchange timestamp missing
❌ exchange timestamp bukan number
❌ exchange timestamp <= 0
❌ payload null
❌ source tidak dikenali
Return null jika invalid.
CanonicalQueue tidak boleh menerima invalid event.
🧠 5️⃣ Mapping Rules Per Source
TRADE
source = SourceType.TRADE
exchangeTs = raw.tradeTime
payload = { price, qty, side }
BOOK
source = SourceType.BOOK
exchangeTs = raw.updateTime
payload = { bestBid, bestAsk }
MARK
source = SourceType.MARK
exchangeTs = raw.markTime
payload = { markPrice }
LIQUIDATION
source = SourceType.LIQUIDATION
exchangeTs = raw.eventTime
payload = { side, qty, price }
OPEN_INTEREST
source = SourceType.OPEN_INTEREST
exchangeTs = raw.timestamp
payload = { oiValue }
FUNDING
source = SourceType.FUNDING
exchangeTs = raw.fundingTime
payload = { fundingRate }
🔒 6️⃣ Determinism Constraints
Normalizer tidak boleh:
❌ Pakai Date.now()
❌ Tambah timestamp lokal
❌ Generate random ID
❌ Mutasi payload
❌ Buat side effect
Normalizer harus pure function.
🧠 7️⃣ Error Handling Strategy
Jika invalid:
Return null
Jangan throw error
Logging dilakukan di adapter layer
Kenapa?
Karena malformed WS event tidak boleh mematikan engine.
🧱 8️⃣ CanonicalEngine Interaction
Flow:
Salin kode

WS Adapter → RawEvent
RawEvent → EventNormalizer
CanonicalEvent → CanonicalQueue.ingest()
CanonicalQueue tidak tahu raw format. EventNormalizer tidak tahu tick.
Layer clean.
🔥 9️⃣ Security & Integrity Clause
Normalizer harus:
Validate numeric ranges (optional later)
Ensure exchangeTs integer
Ensure tokenId valid
Jika tidak: Replay bisa corrupt.
🎯 Blueprint Status Sekarang
✔ GlobalClock spec
✔ CanonicalQueue spec
✔ Comparator rule
✔ EventNormalizer contract
Ingest backbone sudah lengkap secara blueprint.
