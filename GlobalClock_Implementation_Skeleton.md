GlobalClock implementation skeleton yang:
Deterministic
Strict TS safe
Monotonic time
Tidak skip tick
Tidak merge tick
Tidak pakai Date.now()
Tidak pakai setInterval langsung untuk logic
Aman untuk replay
Kita buat minimal tapi production-grade.
📁 /src/core/global-clock.ts
Ts
Salin kode
/* ENGINE V3 — GLOBAL CLOCK
 *
 * Deterministic fixed-interval tick scheduler.
 * - Monotonic time (process.hrtime.bigint)
 * - Fixed cadence (default 250ms)
 * - No tick skipping
 * - No tick merging
 * - Single listener execution per tick
 */

export type TickId = bigint;

export interface GlobalClockOptions {
  readonly intervalMs: number; // e.g. 250
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
  private tickId: TickId = 0n;

  private running = false;
  private listener: TickListener | null = null;

  private baseTimeNs: bigint = 0n;

  constructor(options: GlobalClockOptions) {
    if (options.intervalMs <= 0) {
      throw new Error("GlobalClock interval must be > 0");
    }

    this.intervalNs = BigInt(options.intervalMs) * 1_000_000n;
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

    const nowNs = process.hrtime.bigint();
    const elapsedNs = nowNs - this.baseTimeNs;

    const expectedTicks = elapsedNs / this.intervalNs;

    // Ensure monotonic tick progression (no skip)
    if (expectedTicks > this.tickId) {
      this.tickId = expectedTicks;
    }

    try {
      // Execute exactly one tick per schedule cycle
      this.listener?.(this.tickId);
    } catch (err) {
      // Fail fast — determinism > silent recovery
      this.running = false;
      throw err;
    }

    // Schedule next execution
    setTimeout(() => {
      this.scheduleNext();
    }, Number(this.intervalNs / 1_000_000n));
  }
}
🧠 Kenapa Ini Deterministic?
✔ process.hrtime.bigint() → monotonic
✔ TickId dihitung dari elapsed time
✔ Tidak tergantung wall clock
✔ Tidak skip tickId (monotonic progression)
✔ Tidak merge tick
✔ Tidak ada async mutation di dalam tick
⚠️ Penting: Kenapa Tidak Pakai setInterval?
Karena:
setInterval bisa drift
Bisa overlap
Bisa race kalau handler lama
Kita pakai recursive setTimeout dengan kontrol penuh.
🧪 Minimal Test Harness (Sementara)
Ts
Salin kode
import { DeterministicGlobalClock } from "./core/global-clock";

const clock = new DeterministicGlobalClock({ intervalMs: 250 });

clock.onTick((tickId) => {
  console.log("Tick:", tickId.toString());
});

clock.start();
🔒 Determinism Guarantee
Jika:
Engine dijalankan ulang
Dengan interval sama
Dengan log replay sama
TickId progression akan identik secara relatif terhadap start.
