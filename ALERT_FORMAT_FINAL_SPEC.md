ALERT FORMAT FINAL SPEC v1.0
Status: LOCKED · DETERMINISTIC · HASHABLE · REPLAY-SAFE
🧱 1️⃣ TOP-LEVEL STRUCTURE
JSON
Salin kode
{
  "engine_version": "3.0.0",
  "schema_version": 1,
  "mode": "LIVE",
  "timestamp_tick": 184392,
  "event_phase": "EVENT_START",
  "cluster_state": "CLUSTER_FRAGILE",
  "alert": { ... },
  "integrity": { ... }
}
🧠 2️⃣ ALERT OBJECT STRUCTURE
JSON
Salin kode
{
  "type": "STRUCTURAL_TRIGGER_READY",
  "scope": "TOKEN",
  "token_id": 3,
  "symbol": "TOKEN_A",
  "direction": "SHORT",
  "fsm_state": "TRIGGER_READY",
  "tier": "TIER_OVERLEVERAGED",
  "trigger_cost": 24.7,
  "confidence": 81,
  "metrics": {
    "oi_velocity": 12800.5,
    "trade_delta": -5400.2,
    "spread_pct": 0.0008,
    "mark_vs_mid_pct": 0.0031,
    "liquidation_imbalance": 0.67
  }
}
🧠 3️⃣ ALERT TYPES ENUM (LOCKED)
Salin kode

NO_ALERT
STRUCTURAL_BUILD
STRUCTURAL_FRAGILE
STRUCTURAL_TRIGGER_READY
STRUCTURAL_UNWIND
SYSTEMIC_ALERT
STABLE_15M_ALERT
🧠 4️⃣ SCOPE FIELD
Salin kode

"TOKEN"     → Single token alert
"CLUSTER"   → Multi-token systemic
"GLOBAL"    → Event-level alert
🧠 5️⃣ DIRECTION RULE
Direction derived deterministically:
Salin kode

if tradeDelta > 0 and OI rising → LONG
if tradeDelta < 0 and OI rising → SHORT
if liquidation dominance sell → SHORT
if liquidation dominance buy → LONG
No probability.
Enum:
Salin kode

LONG
SHORT
NEUTRAL
🧠 6️⃣ STABLE 15M ALERT FORMAT
JSON
Salin kode
{
  "type": "STABLE_15M_ALERT",
  "scope": "TOKEN",
  "token_id": 2,
  "symbol": "TOKEN_B",
  "direction": "LONG",
  "dominance_ratio": 0.72,
  "avg_trigger_cost": 29.4,
  "cluster_state": "CLUSTER_HEATING",
  "confidence": 76
}
dominance_ratio = ratio of tick in FRAGILE/TRIGGER_READY within 15m window.
🧠 7️⃣ SYSTEMIC ALERT FORMAT
JSON
Salin kode
{
  "type": "SYSTEMIC_ALERT",
  "scope": "CLUSTER",
  "affected_tokens": 4,
  "total_tokens": 5,
  "cluster_state": "CLUSTER_UNWIND",
  "event_phase": "EVENT_END",
  "confidence": 89
}
🧠 8️⃣ INTEGRITY OBJECT
Critical for DePIN.
JSON
Salin kode
{
  "log_file_hash": "0xabc123...",
  "record_offset": 928374,
  "schema_version": 1,
  "engine_hash": "sha256(binary)",
  "replay_hash": "optional"
}
This allows:
Node verification
Replay validation
Tamper detection
🧠 9️⃣ HASH RULE
Daily:
Salin kode

SHA256(binary_log_file)
Alert payload hash:
Salin kode

SHA256(JSON.stringify(alert_without_integrity))
Integrity object not included in alert hash.
🧠 10️⃣ CONFIDENCE SCORE (LOCKED FORMULA)
Confidence deterministic:
Salin kode

confidence =
  w1 * statePersistenceRatio +
  w2 * (100 - triggerCost) +
  w3 * clusterWeight
Rounded integer 0–100.
No ML. No randomness.
🧠 11️⃣ PUBLISH CHANNEL
Recommended publish layers:
WebSocket feed
REST endpoint
Kafka (optional)
IPFS hash broadcast
DePIN gossip node
Core rule:
Alert emitted only on tick boundary.
🧠 12️⃣ EXAMPLE FULL PAYLOAD
JSON
Salin kode
{
  "engine_version": "3.0.0",
  "schema_version": 1,
  "mode": "LIVE",
  "timestamp_tick": 184392,
  "event_phase": "EVENT_MID",
  "cluster_state": "CLUSTER_FRAGILE",
  "alert": {
    "type": "STRUCTURAL_TRIGGER_READY",
    "scope": "TOKEN",
    "token_id": 3,
    "symbol": "TOKEN_A",
    "direction": "SHORT",
    "fsm_state": "TRIGGER_READY",
    "tier": "TIER_OVERLEVERAGED",
    "trigger_cost": 22.8,
    "confidence": 84,
    "metrics": {
      "oi_velocity": 14321.5,
      "trade_delta": -8200.3,
      "spread_pct": 0.0006,
      "mark_vs_mid_pct": 0.0042,
      "liquidation_imbalance": 0.71
    }
  },
  "integrity": {
    "log_file_hash": "0x6fae...",
    "record_offset": 938472,
    "schema_version": 1
  }
}
🔥 WHY THIS IS DEPİN-GRADE
✔ Deterministic fields
✔ No hidden computation
✔ Hash-verifiable
✔ Replay-reconstructable
✔ Directional clarity
✔ Structural clarity
✔ No probabilistic language
✔ Machine-consumable
🎯 FINAL STATUS
Engine V3 sekarang punya:
Blueprint final
Lifecycle spec
Logging contract
Alert format spec
Scalability model
Observability model
DePIN-ready payload
Secara arsitektur?
Selesai.
