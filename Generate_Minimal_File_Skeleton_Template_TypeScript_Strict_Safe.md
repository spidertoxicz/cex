generate MINIMAL FILE SKELETON TEMPLATE (TypeScript strict-safe)
Semua class kosong tapi sesuai dependency graph.
Belum ada logic. Hanya contract & wiring.
Ini siap langsung jadi scaffold awal.
🧱 1️⃣ /src/app/engine-runner.ts
Ts
Salin kode
export class EngineRunner {
  public start(): void {
    // TODO: load config
    // TODO: build dependency container
    // TODO: start clock
  }
}
🧱 2️⃣ /src/app/engine-coordinator.ts
Ts
Salin kode
import { GlobalClock } from "../core/global-clock";

export class EngineCoordinator {
  constructor(private readonly clock: GlobalClock) {}

  public bind(): void {
    this.clock.onTick((tickId) => {
      this.handleTick(tickId);
    });
  }

  private handleTick(tickId: bigint): void {
    // 1. flush canonical
    // 2. feature extraction
    // 3. tier update
    // 4. trigger cost update
    // 5. token fsm update
    // 6. cluster update
    // 7. event phase update
    // 8. alert evaluate
    // 9. log append
  }
}
🧱 3️⃣ /src/core/global-clock.ts
Ts
Salin kode
export interface GlobalClock {
  start(): void;
  stop(): void;
  onTick(listener: (tickId: bigint) => void): void;
}
(Implementation nanti)
🧱 4️⃣ /src/canonical/canonical-event.ts
Ts
Salin kode
export enum SourceType {
  TRADE = 0,
  BOOK = 1,
  MARK = 2,
  LIQUIDATION = 3,
  OPEN_INTEREST = 4,
  FUNDING = 5,
}

export interface CanonicalEvent {
  readonly tokenId: number;
  readonly source: SourceType;
  readonly exchangeTs: number;
  readonly localSeq: number;
  readonly payload: unknown;
}

export interface CanonicalBatch {
  readonly tokenId: number;
  readonly tickId: bigint;
  readonly events: readonly CanonicalEvent[];
}
🧱 5️⃣ /src/canonical/canonical-queue.ts
Ts
Salin kode
import { CanonicalEvent, CanonicalBatch } from "./canonical-event";

export interface CanonicalQueue {
  ingest(event: CanonicalEvent): void;
  flush(tickId: bigint): CanonicalBatch | null;
  size(): number;
}
🧱 6️⃣ /src/canonical/event-normalizer.ts
Ts
Salin kode
import { CanonicalEvent } from "./canonical-event";
import { RawEvent } from "../adapter/raw-event";

export interface EventNormalizer {
  normalize(
    raw: RawEvent,
    tokenId: number,
    nextLocalSeq: () => number
  ): CanonicalEvent | null;
}
🧱 7️⃣ /src/canonical/canonical-engine.ts
Ts
Salin kode
import { CanonicalBatch } from "./canonical-event";
import { RawEvent } from "../adapter/raw-event";

export interface CanonicalEngine {
  registerToken(tokenId: number): void;
  ingest(raw: RawEvent, tokenId: number): void;
  onBatch(listener: (batch: CanonicalBatch) => void): void;
}
🧱 8️⃣ /src/feature/feature-frame.ts
Ts
Salin kode
export interface FeatureFrame {
  readonly tokenId: number;
  readonly tickId: bigint;
  readonly tradeVolume: number;
  readonly tradeDelta: number;
}
(Expanded fields nanti)
🧱 9️⃣ /src/feature/feature-extractor.ts
Ts
Salin kode
import { CanonicalBatch } from "../canonical/canonical-event";
import { FeatureFrame } from "./feature-frame";

export interface FeatureExtractor {
  extract(batch: CanonicalBatch): FeatureFrame;
}
🧠 10️⃣ TOKEN FSM /src/fsm/token/structural-fsm.ts
Ts
Salin kode
import { FeatureFrame } from "../../feature/feature-frame";

export enum FSMState {
  BUILD = 0,
  PRESSURE = 1,
  FRAGILE = 2,
  TRIGGER_READY = 3,
  UNWIND = 4,
  COOLDOWN = 5,
}

export interface TokenFSMState {
  readonly state: FSMState;
}

export interface StructuralFSM {
  update(feature: FeatureFrame): TokenFSMState;
}
🟣 11️⃣ TIER ENGINE
Ts
Salin kode
export interface TierContext {
  readonly thresholdMultiplier: number;
}

export interface TierEngine {
  update(feature: unknown): TierContext;
}
🔴 12️⃣ TRIGGER COST ENGINE
Ts
Salin kode
export interface TriggerCostEngine {
  update(feature: unknown): number;
}
🌐 13️⃣ CLUSTER FSM
Ts
Salin kode
import { TokenFSMState } from "../token/structural-fsm";

export enum ClusterState {
  CALM = 0,
  HEATING = 1,
  FRAGILE = 2,
  UNWIND = 3,
  COOLDOWN = 4,
}

export interface ClusterFSM {
  update(states: readonly TokenFSMState[]): ClusterState;
}
🕒 14️⃣ EVENT PHASE FSM
Ts
Salin kode
export enum EventPhase {
  PREP = 0,
  START = 1,
  MID = 2,
  END = 3,
  POST = 4,
}

export interface EventPhaseFSM {
  update(clusterState: number): EventPhase;
}
🚨 15️⃣ ALERT ENGINE
Ts
Salin kode
export interface StructuralAlert {
  readonly tokenId?: number;
  readonly type: number;
}

export interface AlertEngine {
  evaluate(): StructuralAlert | null;
}
💾 16️⃣ BINARY LOG WRITER
Ts
Salin kode
export interface BinaryLogWriter {
  append(record: Buffer): void;
}
🌊 17️⃣ ADAPTER RAW EVENT
Ts
Salin kode
export type RawEvent = unknown;
✅ SCAFFOLD STATUS
Sekarang project:
✔ Compilable (empty logic)
✔ Layer separation enforced
✔ Circular dependency minim
✔ Siap isi step-by-step
✔ Deterministic architecture preserved
