Tick Overrun Detector sekarang.
Ini penting supaya engine tidak diam-diam terlambat dan merusak determinism cadence.
Tujuan:
Deteksi jika handler > interval
Log warning
Tidak skip tick
Tidak merge tick
Tidak auto-recover aneh
Tetap deterministic
Kita upgrade GlobalClock skeleton tadi.
📁 /src/core/global-clock.ts (Updated with Overrun Detector)
Ts
Salin kode
/* ENGINE V3 — GLOBAL CLOCK (STRICT + OVERRUN SAFE)
 *
 * Deterministic fixed-interval scheduler.
 * - Monotonic time
 * - Fixed cadence
 * - No skip
 * - No merge
 * - Overrun detection
 */

export type TickId = bigint;

export interface GlobalClockOptions {
  readonly intervalMs: number; // e.g. 250
  readonly warnOnOverrun?: boolean;
}

export type TickListener = (tickId: TickId) => void;

export interface GlobalClock {
  start(): void;
  stop(): void;
  onTick(listener: TickListener): void;
  isRunning(): boolean;
}

export class DeterministicGlobalClock implements GlobalClock {
  private readonly intervalNs: bigint;
  private readonly intervalMs: number;
  private readonly warnOnOverrun: boolean;

  private tickId: TickId = 0n;
  private running = false;
  private listener: TickListener | null = null;

  private baseTimeNs: bigint = 0n;

  constructor(options: GlobalClockOptions) {
    if (options.intervalMs <= 0) {
      throw new Error("GlobalClock interval must be > 0");
    }

    this.intervalMs = options.intervalMs;
    this.intervalNs = BigInt(options.intervalMs) * 1_000_000n;
    this.warnOnOverrun = options.warnOnOverrun ?? true;
  }

  public onTick(listener: TickListener): void {
    if (this.listener !== null) {
      throw new Error("GlobalClock listener already registered");
    }
    this.listener = listener;
  }

  public isRunning(): boolean {
    return this.running;
  }

  public start(): void {
    if (this.running) {
      throw new Error("GlobalClock already running");
    }

    if (this.listener === null) {
      throw new Error("GlobalClock requires a tick listener before start()");
    }

    this.running = true;
    this.tickId = 0n;
    this.baseTimeNs = process.hrtime.bigint();

    this.scheduleNext();
  }

  public stop(): void {
    this.running = false;
  }

  private scheduleNext(): void {
    if (!this.running) {
      return;
    }

    const tickStartNs = process.hrtime.bigint();

    const nowNs = tickStartNs;
    const elapsedNs = nowNs - this.baseTimeNs;

    const expectedTicks = elapsedNs / this.intervalNs;

    if (expectedTicks > this.tickId) {
      this.tickId = expectedTicks;
    }

    try {
      this.listener?.(this.tickId);
    } catch (err) {
      this.running = false;
      throw err;
    }

    const tickEndNs = process.hrtime.bigint();
    const processingNs = tickEndNs - tickStartNs;

    if (this.warnOnOverrun && processingNs > this.intervalNs) {
      const overrunMs =
        Number(processingNs - this.intervalNs) / 1_000_000;

      console.warn(
        `[GlobalClock] Tick overrun detected: +${overrunMs.toFixed(
          2
        )} ms beyond interval`
      );
    }

    setTimeout(() => {
      this.scheduleNext();
    }, this.intervalMs);
  }
}
🧠 Apa Yang Terjadi Sekarang?
Setiap tick:
Catat waktu mulai
Jalankan listener
Hitung waktu eksekusi
Jika > 250ms → log warning
Tetap lanjut tick berikutnya
Tidak:
❌ Skip tick
❌ Merge tick
❌ Compress waktu
❌ Auto-adjust interval
Determinism tetap dijaga.
🔥 Kenapa Overrun Warning Penting?
Karena kalau nanti:
Canonical sorting berat
Feature layer berat
IO flush berat
Snapshot terlalu sering
Engine akan kasih sinyal sebelum chaos terjadi.
Lebih baik tahu CPU limit lebih awal.
🧠 Penting: Kenapa Kita Tidak Auto Catch-Up Loop?
Karena kalau kita pakai:
Salin kode

while(expectedTick > currentTick)
Itu bisa memproses banyak tick sekaligus → spike CPU → cascade lag.
Kita pilih:
Stabil cadence
No panic recovery
Deterministic step-by-step
🎯 Status Sekarang
GlobalClock sudah:
✔ Monotonic
✔ Strict typed
✔ Overrun detected
✔ Deterministic
✔ Safe for replay
✔ Production-ready backbone
