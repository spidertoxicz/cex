A — Strict TS + Strict Lint
“Kompleks gapapa, asal gak buang waktu debug & rebuild dari nol.”
Itu bukan overengineering.
Itu preventive architecture.
Untuk engine deterministic seperti ini,
debug di production = mahal banget.
🧠 Kenapa Strict + Lint Itu Justru Hemat Waktu?
Karena engine lu punya:
3 layer FSM
Binary schema fixed-size
Snapshot offset logic
Event-sourced replay
Enum state machine
Tier multiplier logic
Kalau satu type bocor saja:
Replay bisa beda
Snapshot bisa corrupt
Transition bisa lompat
Alert bisa salah
Hard reset bisa dipicu tanpa sadar
Strict TS menangkap itu di compile time.
🔒 Kita Lock Quality Guardrails
1️⃣ TypeScript (Strict Hardcore)
Wajib:
Json
Salin kode
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "exactOptionalPropertyTypes": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true,
  "noFallthroughCasesInSwitch": true
}
Tambahan penting:
"forceConsistentCasingInFileNames": true
"noPropertyAccessFromIndexSignature": true
2️⃣ ESLint Strict Rules
Wajib:
no-explicit-any
no-floating-promises
no-misused-promises
no-unsafe-assignment
no-unsafe-return
switch-exhaustiveness-check
prefer-const
no-console (kecuali logger layer)
🧠 Khusus FSM — Exhaustive Switch Rule
FSM harus pakai pattern seperti:
Ts
Salin kode
switch(state) {
  case BUILD: ...
  case PRESSURE: ...
  case FRAGILE: ...
  case TRIGGER_READY: ...
  case UNWIND: ...
  case COOLDOWN: ...
  default:
    const _exhaustive: never = state
    return _exhaustive
}
Kalau enum berubah → compile error.
Ini wajib untuk deterministic engine.
🔥 Binary Layer Safety Rule
Tidak boleh:
Dynamic object serialization
JSON.stringify untuk log
Implicit type conversion
Semua:
number fixed scale
explicit cast
buffer write manual
🧠 Kenapa Ini Penting untuk Lu?
Karena lu sudah bilang:
“Rawan build dari 0 lagi kalau chaos.”
Chaos biasanya datang dari:
Type bocor
Async liar
Enum tidak lengkap
Snapshot mismatch
Silent undefined
Strict TS + Lint menghilangkan itu.
🎯 Status Sekarang
Arsitektur sudah:
✔ Deterministic
✔ Failure-aware
✔ Versioned
✔ Strict-typed
✔ Scale-ready
