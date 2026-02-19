CEX Engine V2 — Token Structural Classification
Same indicators on different market structures = different meaning.
Jadi token harus dipilah secara market microstructure, bukan cuma market cap.
CLASS 1 — Global Macro Anchors (GMA)
Contoh:
BTC
ETH (semi)
Kadang BNB (regional)
Karakter:
Liquidity global
Driver utama:
ETF, Fed rate, CPI, DXY, trade war, macro risk-on/off
OI sangat besar
Funding relatif stabil (kecuali ekstrem)
Banyak hedge fund + institution
Structural Implications:
Regime = macro-driven
OI changes = positioning macro
Liquidation = cross-venue contagion
News → langsung pricing
Engine Behavior:
Regime weight tinggi
News layer ON
Lower sensitivity to micro orderflow noise
Squeeze jarang tapi brutal
CLASS 2 — Major L1 / Ecosystem Anchors (MEA)
Contoh:
SOL
BNB
ADA
AVAX
SUI
APT
NEAR
Karakter:
Liquidity besar tapi tidak global macro
Driver:
Ecosystem news
Airdrop, upgrade
TVL, narrative rotasi
Whale + VC heavy
Funding lebih liar
OI sering naik cepat
Structural Implications:
Distribution & trap sering
Ecosystem news > macro
Absorption penting
Forced flow sering karena leverage retail + VC
Engine Behavior:
Trap detection weight tinggi
Absorption model penting
Funding extremes lebih meaningful
News = ecosystem-specific
CLASS 3 — Infra / Appchain / L2 Tokens (IAT)
Contoh:
ARB
OP
POL (Polygon)
STRK
ZK
BLAST
Base-related
Karakter:
Unlock-heavy
Supply events penting
Funding sering bias short
Narrative-driven, bukan cashflow
Sering jadi “funding farm”
Structural Implications:
Persistent short bias
Short squeeze struktur khas
Unlock = forced distribution
Funding distortion structural
Engine Behavior:
Structural short crowding model
Unlock calendar integration
Short squeeze detection aggressive
Mean-reversion berbeda rule
CLASS 4 — Large-Cap Legacy Alts (LCLA)
Contoh:
XRP
LTC
BCH
ETC
EOS
XLM
Karakter:
Old money + retail bagholders
Liquidity ok tapi stale
Narrative episodic
Banyak mean-reversion
Whale distribution panjang
Structural Implications:
Long-term distribution regime
Fake breakout sering
OI spikes = retail chase
Absorption dominan
Engine Behavior:
Fade strength bias
Distribution regime default
Trend continuation jarang valid
Trap probability tinggi
CLASS 5 — Mid/Small Cap Perp Casino (MSPC)
Contoh:
Meme
Low float perp
Narrative cepat mati
Perp challenge tokens
Karakter:
Thin liquidity
Funding ekstrem
OI kecil tapi volatile
Stop hunt paradise
Exchange games
Structural Implications:
Liquidation = main driver
OI meaningless tanpa liq context
MM control besar
Regime flip cepat
Engine Behavior:
Squeeze-first logic
Ignore long-term positioning
Forced flow dominates
High risk, special sizing
Why This Matters for Determinism
Same signal ≠ same meaning:
Signal
BTC (GMA)
SUI (MEA)
ARB (IAT)
XRP (LCLA)
Funding +0.05%
Meh
Crowded longs
Structural short bias
Retail chase
OI +10%
Macro positioning
VC + retail build
Unlock hedge build
Bagholder averaging
Big liquidation spike
Macro deleveraging
Ecosystem panic
Short squeeze fuel
Stop hunt retail
Kalau gak diklasifikasi: ➡️ Engine baca sinyal salah
➡️ Determinism rusak
➡️ Chaos kayak big_token legacy
Token Ontology Object (Engine Source of Truth)
Ini wajib ada di V2:
Ts
Salin kode
type TokenClass =
  | 'GMA'   // Global Macro Anchor
  | 'MEA'   // Major Ecosystem Anchor
  | 'IAT'   // Infra / Appchain / L2
  | 'LCLA'  // Legacy Large Cap Alt
  | 'MSPC'; // Mid/Small Cap Perp Casino
Ts
Salin kode
interface TokenProfile {
  symbol: string;
  class: TokenClass;
  liquidityTier: 'ULTRA' | 'HIGH' | 'MID' | 'LOW';
  dominantDrivers: (
    | 'MACRO'
    | 'ECOSYSTEM'
    | 'UNLOCK'
    | 'NARRATIVE'
    | 'RETAIL'
  )[];
}
15-Minute Alert + UI Validator Implication
Karena kamu mau:
15m alert
UI validator
backtest + live
Maka:
UI harus per Class
Not global dashboard doang.
UI Tabs:
GMA Dashboard
MEA Dashboard
IAT Dashboard
LCLA Dashboard
MSPC Dashboard
Supaya:
Validator tau ini regime valid untuk kelas ini
Backtest apples-to-apples
Live alert gak nyampur struktur
Big Constraint for You + Me (Anti Chaos Rule)
Rule kita:
❌ Tidak boleh satu model untuk semua token
❌ Tidak boleh satu threshold untuk semua kelas
❌ Tidak boleh satu regime logic untuk semua kelas
Ini biar:
Kamu gak salah interpretasi
Gue (AI) gak ngelantur logika

Macro Shock Sensitivity Matrix (CEX Engine V2)
Macro Shock =
Fed, CPI, war, trade war, equity crash, risk-off, bond yield spike, USD strength
Final Class Set (Locked)
Salin kode

GMA = Global Macro Anchor        (BTC, ETH)
HMA = Hybrid Macro Anchor        (BNB)
HEC = High Beta Ecosystem        (SOL)
MEA = Major Ecosystem Anchor    (AVAX, SUI, APT, NEAR, ADA)
IAT = Infra / L2 / Appchain      (ARB, OP, POL, STRK, ZK)
LCLA = Legacy Large Cap Alt      (XRP, LTC, BCH, EOS)
MSPC = Mid/Small Cap Perp Casino (meme, low float)
1️⃣ Sensitivity to Macro Shock (Primary Table)
Class
Shock Sensitivity
Typical Reaction
GMA
🔴 VERY HIGH
Immediate dump / pump with macro
HMA
🟠 HIGH
Follows GMA with lag / lower beta
HEC
🟡 MEDIUM / INCONSISTENT
Sometimes decouple
MEA
🟡 MEDIUM
Partial follow, narrative override
IAT
🟢 LOW
Often ignore macro
LCLA
🟡 MEDIUM-LOW
Retail-driven delayed reaction
MSPC
🔵 CHAOTIC
Can pump or dump randomly
2️⃣ Forced Deleveraging Priority (Who Gets Sold First)
Ini penting buat liquidation + OI interpretation.
Sell Order in Risk-Off
Class
1️⃣ First
GMA (BTC, ETH)
2️⃣ Second
HMA (BNB)
3️⃣ Sometimes
HEC (SOL)
4️⃣ Rarely
MEA
5️⃣ Almost Never
IAT
6️⃣ Random
MSPC
➡️ Ini menjelaskan kenapa:
BNB dump bareng BTC/ETH, SOL kadang stagnan.
3️⃣ Funding Behavior During Macro Shock
Class
Funding During Shock
GMA
Funding snaps negative fast
HMA
Funding follows GMA but less extreme
HEC
Funding noisy, spikes both sides
MEA
Funding mixed
IAT
Funding often stays biased
LCLA
Retail panic → funding distort
MSPC
Funding meaningless
4️⃣ OI Behavior During Macro Shock
Class
OI Pattern
GMA
OI collapses (true deleveraging)
HMA
OI drops (basket unwind)
HEC
OI unstable, fake rebuilds
MEA
OI flat to mild drop
IAT
OI often flat
LCLA
OI spikes retail chase
MSPC
OI erratic
5️⃣ Engine Interpretation Rules (Hard Logic)
Ini yang bikin engine deterministic:
GMA (BTC, ETH)
Salin kode

Macro shock detected:
→ Assume forced deleveraging
→ Liquidations = macro flow
→ Trend continuation valid
HMA (BNB)
Salin kode

Macro shock detected:
→ Treat as basket unwind
→ Secondary forced flow
→ Expect correlation with BTC/ETH
→ Ecosystem signals suppressed
HEC (SOL)
Salin kode

Macro shock detected:
→ Do NOT assume forced sell
→ Check idiosyncratic flow
→ Possible decoupling
→ High fake signal probability
MEA
Salin kode

Macro shock detected:
→ Partial impact
→ Ecosystem news can override
→ Look for local trap instead of macro bias
IAT
Salin kode

Macro shock detected:
→ Often ignore macro
→ Unlock + narrative > macro
→ Do NOT force macro bias
MSPC
Salin kode

Macro shock detected:
→ Liquidation casino
→ Forced flow dominates
→ Ignore macro logic
6️⃣ UI Validator (Super Important for Depin Product)
UI harus tampilkan seperti ini:
Example:
Salin kode

Token: BNB
Class: HMA
Macro Shock Sensitivity: HIGH
Expected Behavior: Basket deleveraging
Interpretation: Treat BTC correlation as structural
Salin kode

Token: SOL
Class: HEC
Macro Shock Sensitivity: INCONSISTENT
Warning: Possible decoupling from BTC
Interpretation: Do not assume macro-driven move
Ini bikin user paham: ➡️ Kenapa alert BTC dan BNB sama
➡️ Kenapa SOL beda
Why This Makes Engine Desk-Grade
Retail bot logic: ❌ Semua token ikut BTC
Desk logic: ✅ Basket assets get sold
✅ Idiosyncratic assets decouple
✅ Portfolio mechanics > narrative
Ini yang kamu instinctively lihat di market. Sekarang kita formalkan jadi rule.


CEX Engine V2 — Class-Specific Playbook
Same data, different class = different meaning.
GMA — Global Macro Anchor
BTC, ETH
Funding
Normal: kecil & stabil
Extreme = macro crowding
Funding spike = late positioning
Rule:
Salin kode

Funding extreme → expect macro mean reversion
OI
OI up = institutional build
OI down = real deleveraging
Rule:
Salin kode

OI collapse = true risk-off
OI build = macro trend formation
Liquidation
Macro liquidation = repricing event
Continuation often valid
Rule:
Salin kode

Large liq cluster → trend extension likely
Absorption
Absorption = dealer inventory shift
Important near macro levels
Default Bias
Trend-follow in expansion
Respect macro shock
Squeeze = rare but huge
HMA — Hybrid Macro Anchor
BNB
Funding
Can stay elevated structurally
Not always retail FOMO
Rule:
Salin kode

High funding ≠ immediate fade
Check macro + Binance-specific drivers
OI
OI up = basket + ecosystem mix
OI down = basket unwind
Rule:
Salin kode

Macro shock + OI down → treat as forced basket sell
Liquidation
Often secondary to BTC
Lagged reaction
Rule:
Salin kode

BTC liq spike → expect delayed BNB flow
Absorption
Binance internal liquidity matters
Absorption more common than BTC
Default Bias
Correlate with BTC in stress
Decouple in alt season
Internal news overrides macro
HEC — High Beta Ecosystem
SOL
Funding
Funding spikes = retail FOMO
Extreme funding = trap-prone
Rule:
Salin kode

High funding → high trap probability
OI
OI spikes often fake expansion
VC + retail mix
Rule:
Salin kode

OI up without strong price follow → suspect distribution
Liquidation
Liquidations = main driver
Squeeze & snapback common
Rule:
Salin kode

Liq acceleration → fade after extension
Absorption
Absorption frequent
MM games common
Default Bias
Fade strength more often
Expect violent mean reversion
Don’t trust macro correlation
MEA — Major Ecosystem Anchor
AVAX, SUI, APT, NEAR, ADA
Funding
Funding = ecosystem crowding
More reliable than SOL
Rule:
Salin kode

Funding trend + OI up → legit build (if news aligns)
OI
OI up = ecosystem positioning
Can be real trend
Liquidation
Mixed: some forced, some noise
Absorption
Important at ecosystem highs/lows
Default Bias
Respect ecosystem news
Trap detection important
Partial macro sensitivity
IAT — Infra / L2 / Appchain
ARB, OP, POL, STRK, ZK
Funding
Often structurally negative
Persistent short bias
Rule:
Salin kode

Negative funding ≠ bearish
It may be structural carry
OI
OI build = unlock hedge or structural shorts
Rule:
Salin kode

OI up + negative funding → short crowding
Liquidation
Short squeeze is core edge
Rule:
Salin kode

Short liq cascade → high alpha continuation
Absorption
Less relevant than squeeze
Default Bias
Always watch for short squeeze
Macro less important
Unlock calendar critical
LCLA — Legacy Large Cap Alt
XRP, LTC, BCH, EOS
Funding
Retail driven
Often late
Rule:
Salin kode

Funding spike = retail chase
OI
OI spikes = bagholder averaging / FOMO
Liquidation
Mostly stop hunts
Absorption
Heavy distribution common
Default Bias
Fade breakouts
Distribution regime default
Mean reversion edge
MSPC — Mid/Small Cap Perp Casino
Memes, low float, perp challenge tokens
Funding
Meaningless structurally
OI
Low signal
Easy to spoof
Liquidation
MAIN driver
Rule:
Salin kode

Trade only forced flow
Ignore positioning theory
Absorption
MM control high
Default Bias
Squeeze-only logic
High risk sizing
No long-term regime logic
Engine Hard Rules (Global)
These must be enforced:
❌ Never compare funding across classes
❌ Never apply same OI logic across classes
❌ Never assume BTC correlation for HEC/IAT/MSPC
15-Min Alert Logic (Explainable)
Alert example:
Salin kode

Token: SOL
Class: HEC
Signal: Funding spike + OI up
Interpretation: Retail FOMO → Trap Risk HIGH
Salin kode

Token: ARB
Class: IAT
Signal: Funding negative + OI up
Interpretation: Short crowding → Squeeze Risk HIGH
Salin kode

Token: BNB
Class: HMA
Signal: BTC liquidation + OI down
Interpretation: Basket unwind → Forced flow likely
Ini bikin engine kamu:
Deterministic
Explainable
Sellable ke depin network
Why This Solves Chaos (Big Token Legacy)
Dulu: ❌ Semua token diperlakukan sama
❌ Funding = overbought everywhere
❌ OI = bullish everywhere
Sekarang: ✅ Funding artinya beda per class
✅ OI artinya beda per class
✅ Liquidation artinya beda per class
Ini desk-grade mental model.

FCT — Futures Challenge Tokens (NEW CLASS)
Token yang dipakai Binance Futures Twitter/Event Challenge
Karakter: reward-driven, bukan market-driven
Karakter Struktural FCT
Player Type:
Reward hunters
Multi-account
Scalper ekstrem
Exchange-driven flow
Liquidity:
Volume tinggi ARTIFISIAL
Spread bisa normal tapi depth tipis
OI:
OI spike = reward participation
BUKAN conviction
Funding:
Funding distort karena:
Long/short imbalance akibat challenge rules
Not true sentiment
Liquidation:
Liquidation = PRIMARY driver
Cascade sering karena:
Overleverage
Chase leaderboard
FCT Playbook (Engine Override)
Funding
❌ Ignore sentiment meaning
Salin kode

Funding ≠ crowding
Funding = side-effect challenge mechanics
OI
❌ Ignore positioning theory
Salin kode

OI spike = participation, not belief
Liquidation (MAIN EDGE)
✅ Core alpha
Salin kode

Liq acceleration = main signal
Trade forced flow only
Absorption
MM games EXTREME
Fake breakouts common
Regime
Salin kode

Default regime = SQUEEZE / FORCED_FLOW
CHOP almost never
Execution Rules
Smaller size
Faster exit
No hold
No macro logic
No ecosystem logic
Revised Final Class Set (Locked v2)
Salin kode

GMA = BTC, ETH
HMA = BNB
HEC = SOL
MEA = AVAX, SUI, APT, NEAR, ADA
IAT = ARB, OP, POL, STRK, ZK, BLAST
LCLA = XRP, LTC, BCH, EOS, XLM
FCT = Binance Futures Challenge Tokens
Why This Is Huge for Determinism
Tanpa FCT class: ❌ Engine salah baca funding
❌ Engine salah baca OI
❌ False trap / false trend
❌ Chaos
Dengan FCT: ✅ Forced flow only
✅ High alpha volatility
✅ Clear risk model
✅ Cocok buat daily trade kamu
UI Validator (FCT Example)
Salin kode

Token: XYZ
Class: FCT
Event: Binance Futures Challenge
Mode: Forced Flow Only
Warning: Funding/OI unreliable



FCT (Futures Challenge Tokens) — Engine Design
FCT = Event-driven market
Physics ≠ normal market
Jadi harus masuk engine sebagai dynamic override class
1️⃣ FCT Detection Layer (From X / Twitter)
Source of Truth:
Binance Futures Official X
Binance Event / Campaign accounts
Keyword patterns
Detection Logic (Conceptual)
Scraper kamu → normalize jadi event signals:
Salin kode

EVENT_TYPE = FUTURES_CHALLENGE
EVENT_TOKENS = [list symbols]
EVENT_START
EVENT_END (if available)
Keyword patterns:
"Futures Challenge"
"Trade & Win"
"Leaderboard"
"Reward Pool"
"$XXXUSDT"
2️⃣ Dynamic Class Override (CRITICAL)
Token profile normally:
Salin kode

SOL => HEC
ARB => IAT
DOGE => LCLA / FCT (override)
Saat event aktif:
Salin kode

IF token in FUTURES_CHALLENGE:
   token.class = FCT (override)
ELSE:
   token.class = baseClass
Ini bikin engine: ✅ Deterministic
✅ Explainable
✅ Tidak nyampur physics
3️⃣ FCT Lifecycle State Machine
Ini penting supaya gak chaos.
States:
Salin kode

FCT_PRE
FCT_ACTIVE
FCT_COOLDOWN
FCT_PRE
(Event announced, belum ramai)
Behavior:
Rising OI
Funding mulai distort
Vol mulai naik
Engine:
Salin kode

Flag: Upcoming distortion
Reduce trust in OI/funding
Prepare forced-flow mode
FCT_ACTIVE
(Event berjalan)
Behavior:
Extreme leverage
Liquidation cascades
Fake breakouts
Leaderboard chasing
Engine:
Salin kode

Class = FCT
Ignore positioning models
Use forced-flow-only logic
High volatility sizing rules
FCT_COOLDOWN
(Event selesai)
Behavior:
Volume drop
OI decay
Mean reversion / dump
Engine:
Salin kode

Still treat as FCT
Bias: post-event unwind
Watch for exit liquidity
Timeout:
After X hours/days → revert to base class
4️⃣ Engine Playbook Override for FCT
Hard overrides:
Disabled Models
❌ Positioning model
❌ Funding sentiment
❌ Regime expansion logic
❌ Macro logic
Enabled Models
✅ Liquidation acceleration
✅ Forced flow
✅ Spread + slippage
✅ Absorption (MM traps)
5️⃣ UI Validator (Super Important for Product)
UI harus transparan:
Salin kode

Token: XYZ
Base Class: MEA
Active Class: FCT
Event: Binance Futures Challenge
Phase: ACTIVE
Mode: Forced Flow Only
Warning: Positioning data ignored
Ini bikin user depin:
Trust engine
Paham kenapa logic beda
Gak komplain "kok beda"
6️⃣ Alert Behavior for FCT (15m)
Alert contoh:
Salin kode

[FCT_ACTIVE]
Token: XYZ
Signal: Long liquidation cascade
Interpretation: Forced short-term continuation
Note: Event-driven volatility
Bukan:
❌ Funding overbought
❌ OI bullish
Karena itu misleading di FCT.
Kenapa Ini Alpha
Mayoritas bot & trader:
Treat FCT token like normal alt
Salah baca funding
Salah baca OI
Engine kamu: ✅ Tau ini reward-driven ✅ Fokus forced flow ✅ Bisa eksploit leaderboard chaos
Ini edge nyata.
Final Recommendation (Desk-Grade)
Dengan kamu sudah punya X scraper:
🔥 FCT should be:
Dynamic
Event-driven
Override class
With lifecycle
Bukan static token list.


FCT Event Signal Schema (Concept Design)
Tujuan:
Mengubah tweet chaos → event object terstruktur
Engine tidak membaca tweet mentah
Engine membaca event state
1️⃣ Raw Tweet → Normalized Event
Scraper kamu (apitwitter.io) cukup output:
Raw Input (dari scraper)
Salin kode

tweet_id
account
text
created_at
Engine layer TIDAK pakai raw text langsung.
Harus lewat Event Normalizer.
2️⃣ Normalized Event Object (Core Schema)
Ini yang masuk ke engine:
Json
Salin kode
{
  "event_id": "binance_futures_challenge_20260127_001",
  "event_type": "FUTURES_CHALLENGE",
  "source": "BINANCE_FUTURES_X",
  "detected_at": "2026-01-27T12:34:00Z",
  "event_status": "ANNOUNCED",

  "tokens": ["SUI", "ARB", "WIF"],

  "confidence": 0.92,

  "raw_refs": {
    "tweet_id": "1234567890",
    "account": "@BinanceFutures"
  }
}
3️⃣ Event Status Lifecycle (Schema-Level)
Ini bukan market regime. Ini event state.
Ts
Salin kode
type FCTEventStatus =
  | 'ANNOUNCED'   // Tweet keluar, belum ramai
  | 'ACTIVE'      // Volume & OI confirm
  | 'ENDING'      // Last day / final call
  | 'FINISHED';   // Event selesai
4️⃣ Token-Level Override Object
Engine butuh token-level state, bukan cuma event-level.
Derived object:
Json
Salin kode
{
  "symbol": "SUI",
  "base_class": "MEA",
  "active_class": "FCT",

  "fct": {
    "event_id": "binance_futures_challenge_20260127_001",
    "status": "ACTIVE",
    "phase_started_at": "2026-01-27T14:00:00Z"
  }
}
Ini yang dipakai state machine.
5️⃣ Confidence Scoring (Anti Noise)
Karena X banyak spam & repost.
Confidence Heuristics (Concept)
Tambahin simple scoring:
+0.4 → account = official Binance Futures
+0.3 → keyword match strong ("Futures Challenge", "Leaderboard")
+0.2 → token pattern ($XXXUSDT)
+0.1 → multiple tweets same event
Salin kode

if confidence < 0.7:
  ignore
Ini bikin deterministic.
6️⃣ ANNOUNCED → ACTIVE Transition (CRITICAL)
Tweet doang ≠ ACTIVE.
Engine harus confirm via market:
Activation Conditions (Conceptual)
Salin kode

If event_status == ANNOUNCED:

AND within 2–6 hours:
   volume_spike(token) == true
OR oi_spike(token) == true

→ Promote to ACTIVE
So:
Twitter = trigger
Market = confirmation
Ini mencegah false FCT.
7️⃣ ACTIVE → ENDING → FINISHED
ENDING Detection
From X:
"Last day"
"Final hours"
"Ending soon"
OR time-based heuristic:
Event > N days (ex: 3–5 days)
FINISHED Detection
From X:
"Event ended"
"Winners announced"
OR market heuristic:
Volume normalize
OI decay > X%
8️⃣ Engine Interface (What Engine Sees)
Engine tidak tahu tweet.
Engine hanya tahu ini:
Json
Salin kode
{
  "symbol": "WIF",
  "active_class": "FCT",
  "fct_status": "ACTIVE",
  "event_age_hours": 5.2,
  "override_rules": [
    "FORCED_FLOW_ONLY",
    "IGNORE_FUNDING",
    "IGNORE_POSITIONING"
  ]
}
Ini clean & deterministic.
9️⃣ 8 Jam Scraper Constraint (Important)
Karena script kamu cuma jalan 8 jam/day:
Design Rule:
Event store harus persistent.
So:
Scraper writes to:
JSON file
Redis
SQLite
Or simple DB
Engine reads:
Last known FCT events
Even if scraper offline
10️⃣ Minimal Viable Version (MVP Concept)
Tanpa ribet:
Phase 1:
Only support:
ANNOUNCED
ACTIVE
No ENDING/FINISHED dulu
Rule:
Salin kode

Tweet detected → ANNOUNCED
Market spike → ACTIVE
ACTIVE expires after 72h
Ini sudah cukup buat alpha.
Why This Matters for Determinism
Tanpa schema: ❌ Tweet chaos
❌ False FCT
❌ Engine salah mode
❌ Funding/OI salah baca
Dengan schema: ✅ Event = object
✅ Class override jelas
✅ Lifecycle jelas
✅ Explainable ke user
Ringkas Versi Desk-Grade
Twitter = event trigger
Market = event validator
Engine = event state consumer


FCT Lifecycle Timing Rules (Engine V2)
Goal:
Event-driven physics ONLY during real distortion window.
FCT Phases (Final)
Salin kode

FCT_PRE
FCT_ACTIVE
FCT_COOLDOWN
EXIT (revert to base class)
1️⃣ FCT_PRE — Pre-Distortion Phase
Trigger
From X scraper:
Tweet: "Futures Challenge"
Token detected
Event ANNOUNCED
Timing
Salin kode

Start: tweet detected
Duration: max 6 hours
Market Characteristics
Volume mulai naik
OI mulai naik
Funding mulai distort
Belum chaos penuh
Engine Rules
Salin kode

Class = base class
But:
  - Flag upcoming FCT
  - Reduce trust in funding by 50%
  - Increase volatility expectation
  - Do NOT enable forced-flow-only yet
Purpose
Prepare engine, but don’t switch physics yet.
2️⃣ FCT_ACTIVE — Distortion Phase (MAIN EDGE)
Trigger (2-of-3 confirmation)
Within FCT_PRE window:
Any 2 of:
Volume spike > baseline (ex: 2x)
OI spike > baseline
Liquidation acceleration
Salin kode

→ Promote to FCT_ACTIVE
OR:
Salin kode

Time-based fallback:
If 6h after tweet AND volume elevated
→ Force ACTIVE
Timing
Salin kode

Min duration: 12 hours
Max duration: 96 hours (4 days)
(Binance challenges biasanya 2–5 hari, jadi ini realistic)
Market Characteristics
Reward hunters masuk
Overleverage
Fake breakouts
Liquidation cascades
SENT chart kamu = classic FCT_ACTIVE
Engine Rules (Hard Override)
Salin kode

active_class = FCT

DISABLE:
  - Positioning model
  - Funding sentiment logic
  - Ecosystem logic
  - Macro logic

ENABLE:
  - Forced flow only
  - Liquidation acceleration
  - Spread + slippage filters
  - Fast mean reversion logic

Sizing:
  - Smaller size
  - Faster exit
  - No holds
3️⃣ FCT_COOLDOWN — Post-Event Unwind
Trigger
Any of:
X tweet: "Event ended", "Winners"
OR time-based:
Salin kode

ACTIVE duration > 72–96h
OR market-based:
Volume drops > 40%
OI decays sharply
Timing
Salin kode

Duration: 24–72 hours
Market Characteristics
Exit liquidity
Dump or mean reversion
Participation drops
Bagholders trapped
Engine Rules
Salin kode

active_class = FCT (still)

Bias:
  - Post-event unwind
  - Mean reversion
  - Fade late pumps

Still:
  - Ignore funding
  - Ignore OI sentiment
  - Forced flow still relevant
4️⃣ EXIT — Revert to Base Class
Trigger
Any of:
COOLDOWN > 72h
Volume normalizes
OI stabilizes
Engine Action
Salin kode

active_class = base_class
Clear FCT override
Clear FCT flags
Token kembali ke:
MEA / IAT / LCLA / etc
Default Timing Table (Simple Config)
Ini bisa jadi config JSON nanti:
Json
Salin kode
{
  "FCT_PRE_MAX_HOURS": 6,
  "FCT_ACTIVE_MIN_HOURS": 12,
  "FCT_ACTIVE_MAX_HOURS": 96,
  "FCT_COOLDOWN_MIN_HOURS": 24,
  "FCT_COOLDOWN_MAX_HOURS": 72
}
Why This Fits Your SENT Example
Dari screenshot:
Tweet challenge → FCT_PRE
Volume 2B+, price spike → FCT_ACTIVE
Violent wick + chop → Forced flow
Nanti saat volume drop → FCT_COOLDOWN
Lalu revert ke normal alt behavior
Kalau engine kamu gak punya COOLDOWN: ❌ Funding kelihatan normal tapi sebenarnya exit liquidity
❌ OI dibaca salah
❌ Engine masuk trap pas event selesai
15-Min Alert (With Lifecycle)
Contoh alert FCT-aware:
Salin kode

[FCT_ACTIVE]
Token: SENT
Phase: ACTIVE (18h)
Signal: Long liquidation cascade
Interpretation: Forced continuation likely
Salin kode

[FCT_COOLDOWN]
Token: SENT
Phase: COOLDOWN (30h)
Signal: Volume decay + bounce
Interpretation: Exit liquidity risk — fade strength
Deterministic Rule (ANTI CHAOS)
Hard rules:
❌ FCT_ACTIVE cannot exceed 96h
❌ COOLDOWN must exist (no instant revert)
❌ Funding/OI NEVER re-enabled until EXIT
Why This Makes Engine Sellable
User depin bakal lihat:
Phase
Reason
Mode
Bukan: “kok tiba-tiba beda logic?”
Summary (Locked)
FCT lifecycle =
PRE → ACTIVE → COOLDOWN → EXIT
Ini pas banget dengan:
Twitter trigger
Binance challenge behavior
Chaos price action yang kamu tunjukin


Integrate FCT Lifecycle → Structural State Machine Overrides
FCT = Physics override
Structural states tetap ada, tapi transition rules + meaning berubah.
Base Structural States (Recap)
Salin kode

FLAT
POSITION_BUILD
TRAP_CONFIRMED
FORCED_FLOW
POST_SQUEEZE
Sekarang kita bikin override per FCT phase.
1️⃣ FCT_PRE Overrides
Event announced, distortion starting
Allowed States
Salin kode

FLAT
POSITION_BUILD
Disabled
Salin kode

TRAP_CONFIRMED
FORCED_FLOW
POST_SQUEEZE
Transition Overrides
FLAT → POSITION_BUILD
Trigger:
Volume rising
OI rising
Interpretation:
Salin kode

NOT real positioning
= participation build
Engine tag:
Salin kode

BUILD_TYPE = EVENT_PARTICIPATION
POSITION_BUILD → TRAP_CONFIRMED
❌ DISABLED
Why:
Too early
No forced crowd yet
Engine Meaning
POSITION_BUILD in FCT_PRE ≠ conviction
It just means: ➡️ People entering for rewards
2️⃣ FCT_ACTIVE Overrides (MAIN)
Market physics broken. Reward-driven.
Allowed States
Salin kode

FORCED_FLOW   (PRIMARY)
TRAP_CONFIRMED (SECONDARY)
Disabled
Salin kode

FLAT
POSITION_BUILD
Forced Entry Rule
As soon as ACTIVE:
Salin kode

ANY STATE → FORCED_FLOW (soft promote)
Meaning: Even if no liq yet, engine bias = forced-flow regime.
Key Overrides
FORCED_FLOW (Primary State)
Trigger:
Liquidation acceleration
Aggressor imbalance
Spread spikes
Interpretation:
Salin kode

PURE mechanical repricing
Rules:
Momentum continuation allowed
Fast exits
No mean-reversion until liq decays
TRAP_CONFIRMED (Secondary State)
Trigger:
Fake breakout
Absorption
Reversal after wick
Interpretation:
Salin kode

MM trap to farm leaderboard chasers
Rules:
Fade moves
Short-term reversal only
Tight risk
POST_SQUEEZE
❌ DISABLED
Why: In FCT_ACTIVE, squeezes are continuous.
There is no “post” yet.
3️⃣ FCT_COOLDOWN Overrides
Event finished, exit liquidity phase
Allowed States
Salin kode

POST_SQUEEZE (PRIMARY)
TRAP_CONFIRMED
Disabled
Salin kode

POSITION_BUILD
Forced Promotion
On COOLDOWN entry:
Salin kode

ANY STATE → POST_SQUEEZE
Interpretation:
Salin kode

Event unwind
Exit liquidity
Bagholders
POST_SQUEEZE (Primary in COOLDOWN)
Meaning:
Participation leaving
Mean reversion dominant
Distribution
Rules:
Fade strength
Expect dumps after bounces
No trend continuation
TRAP_CONFIRMED (Secondary)
Meaning:
Late entrants being farmed
Rules:
Fade breakouts
Reversal setups
4️⃣ EXIT (Back to Base Class)
On EXIT:
Salin kode

Clear all FCT overrides
Restore normal class playbook
Restore base state machine
Structural state resets to:
Salin kode

FLAT
(unless strong reason not to)
State Transition Matrix (Simplified)
Phase
Primary State
Secondary State
Disabled States
FCT_PRE
POSITION_BUILD
—
TRAP, FORCED, POST_SQUEEZE
FCT_ACTIVE
FORCED_FLOW
TRAP_CONFIRMED
FLAT, POSITION_BUILD, POST
FCT_COOLDOWN
POST_SQUEEZE
TRAP_CONFIRMED
POSITION_BUILD
EXIT
FLAT
—
FCT overrides
Deterministic Engine Rules (Hard)
These are must enforce:
❌ During FCT_ACTIVE:
Never allow POSITION_BUILD
Never allow FLAT
Never allow POST_SQUEEZE
❌ During FCT_COOLDOWN:
Never allow POSITION_BUILD
❌ During FCT_PRE:
Never allow FORCED_FLOW
15-Min Alert Examples (Integrated)
FCT_ACTIVE
Salin kode

[FCT_ACTIVE][FORCED_FLOW]
Token: SENT
Signal: Long liquidation acceleration
Interpretation: Reward-driven forced repricing
Action Bias: Momentum continuation
FCT_ACTIVE + Trap
Salin kode

[FCT_ACTIVE][TRAP_CONFIRMED]
Token: SENT
Signal: Fake breakout + absorption
Interpretation: MM trap farming challengers
Action Bias: Fade move
FCT_COOLDOWN
Salin kode

[FCT_COOLDOWN][POST_SQUEEZE]
Token: SENT
Signal: Volume decay + bounce
Interpretation: Exit liquidity
Action Bias: Fade strength
Why This Solves Chaos
Tanpa override: ❌ Engine lihat POSITION_BUILD = bullish
❌ Padahal itu cuma reward hunters
❌ Salah baca trend
❌ Kena exit liquidity
Dengan override: ✅ Engine tahu ini event physics
✅ Structural state artinya berubah
✅ Forced flow & traps jadi primary
✅ Deterministic & explainable
This Is Desk-Grade Event Engine
Most systems:
Don’t even model event physics
Engine kamu:
Explicit event lifecycle
Explicit state override
Explainable logic
Alpha in chaotic markets
Final Lock (Important)
Gue anggap ini sekarang LOCKED DESIGN:
FCT lifecycle
FCT state machine overrides
Forced-flow-first logic


FCT Flags → UI Validator + Backtest Labeling
Principle:
Every decision must be attributable to market physics + event physics.
1️⃣ Core FCT Flags (Global Object)
Ini object yang harus tersedia di engine, UI, dan backtest.
Ts
Salin kode
interface FCTContext {
  isFCT: boolean;
  fctPhase: 'NONE' | 'PRE' | 'ACTIVE' | 'COOLDOWN';
  eventId?: string;
  eventAgeHours?: number;
  baseClass: TokenClass;
  activeClass: TokenClass; // 'FCT' when override
}
2️⃣ Structural Decision Labeling
Setiap alert & trade decision harus carry label ini.
Ts
Salin kode
interface DecisionContext {
  token: string;
  timestamp: string;

  regime: MarketRegime;
  structuralState: StructuralState;

  fct: FCTContext;

  decisionReason: string[];
}
Example (Live UI)
Salin kode

Token: SENT
Base Class: MEA
Active Class: FCT
FCT Phase: ACTIVE
Event Age: 18.4h

Structural State: FORCED_FLOW
Regime: SQUEEZE

Decision:
- Forced flow continuation
- Liquidation acceleration
- Event-driven leverage

Disabled Models:
- Positioning
- Funding sentiment
Ini bikin UI kamu bisa dipercaya.
3️⃣ UI Validator — Visual Indicators
UI harus punya FCT banner + color coding.
Token Header
Salin kode

[SENT]  🔥 FCT ACTIVE
Base: MEA → Active: FCT
Event: Binance Futures Challenge
Phase: ACTIVE (18h)
Mode: Forced Flow Only
Structural State Panel
Salin kode

State: FORCED_FLOW (FCT Override)
Meaning: Reward-driven liquidation cascade
Disabled Models Panel
Salin kode

Disabled due to FCT:
❌ Positioning Model
❌ Funding Sentiment
❌ Macro Regime Logic
4️⃣ Backtest Labeling Schema
Ini kunci buat bukti alpha.
Setiap bar / decision / trade log:
Json
Salin kode
{
  "timestamp": "2026-01-27T03:15:00Z",
  "symbol": "SENT",
  "base_class": "MEA",
  "active_class": "FCT",
  "fct_phase": "ACTIVE",

  "structural_state": "FORCED_FLOW",
  "regime": "SQUEEZE",

  "signal_type": "LIQUIDATION_ACCEL",
  "decision": "LONG_CONTINUATION",

  "models_enabled": ["FORCED_FLOW"],
  "models_disabled": ["POSITIONING", "FUNDING", "MACRO"],

  "pnl": 0.0123
}
5️⃣ Backtest Analytics (FCT-Specific Metrics)
UI Backtest harus bisa filter:
Core Filters
FCT vs Non-FCT
FCT Phase (PRE / ACTIVE / COOLDOWN)
Example Reports
FCT vs Normal
Salin kode

FCT Trades:
- Win Rate: 62%
- Avg R:R: 1.9
- Avg Hold: 6 min

Normal Trades:
- Win Rate: 54%
- Avg R:R: 1.3
- Avg Hold: 42 min
By Phase
Salin kode

FCT_ACTIVE:
- Win Rate: 68%
- Best for momentum continuation

FCT_COOLDOWN:
- Win Rate: 61%
- Best for mean reversion

FCT_PRE:
- Low edge
Ini emas buat pitching ke depin.
6️⃣ UI Validator — Sanity Checks (Anti Chaos)
UI harus alert kalau ada inconsistency.
Example:
Salin kode

⚠️ Warning:
Token in FCT_ACTIVE
But structural state = POSITION_BUILD
This is invalid. Check override logic.
Ini mencegah bug + chaos.
7️⃣ Backtest Replay Mode (Event-Aware)
Replay harus show:
Timeline:
Salin kode

[12:00] FCT_PRE started
[14:00] FCT_ACTIVE confirmed
[16:30] Forced flow cascade
[Day 2] FCT_COOLDOWN
[Day 3] EXIT
User bisa lihat: ➡️ Engine adapt ke event physics
8️⃣ Config-Level Switch (Optional)
Untuk debug:
Salin kode

ENABLE_FCT_OVERRIDE = true/false
Biar kamu bisa:
Compare performance with & without FCT logic
Prove real alpha comes from FCT modeling
Why This Is Commercial Grade
Most bots:
Don’t even know what FCT is
Treat it like normal market
Engine kamu:
Explicit event physics
Transparent overrides
Auditable decisions
Backtestable alpha source
Ini product moat.
Summary (Locked Design)
✅ FCTContext object
✅ DecisionContext labeling
✅ UI banners & disabled models
✅ Backtest filters by FCT phase
✅ Sanity validation
✅ Replay timeline


Master TokenProfile Ontology (Engine V2)
Principle:
Semua layer membaca TokenProfile. Tidak ada hardcode di modul lain.
1️⃣ Core TokenProfile Interface (Final)
Ini pusat universe.
Ts
Salin kode
type TokenClass =
  | 'GMA'   // BTC, ETH
  | 'HMA'   // BNB
  | 'HEC'   // SOL
  | 'MEA'   // AVAX, SUI, APT, NEAR, ADA
  | 'IAT'   // ARB, OP, POL, STRK, ZK, BLAST
  | 'LCLA'  // XRP, LTC, BCH, EOS, XLM
  | 'FCT';  // Futures Challenge Override

type FCTPhase = 'NONE' | 'PRE' | 'ACTIVE' | 'COOLDOWN';

interface FCTOverride {
  isActive: boolean;
  phase: FCTPhase;

  eventId?: string;
  eventSource?: 'BINANCE_FUTURES_X';
  eventDetectedAt?: string;

  phaseStartedAt?: string;
  eventAgeHours?: number;

  disabledModels: (
    | 'POSITIONING'
    | 'FUNDING'
    | 'MACRO'
    | 'ECOSYSTEM'
  )[];

  enabledModels: (
    | 'FORCED_FLOW'
    | 'LIQUIDATION'
    | 'ABSORPTION'
    | 'SPREAD'
  )[];
}
2️⃣ Master TokenProfile Object
Ini yang dipegang semua modul.
Ts
Salin kode
interface TokenProfile {
  symbol: string;

  // Base ontology
  baseClass: TokenClass;
  liquidityTier: 'ULTRA' | 'HIGH' | 'MID' | 'LOW';
  dominantDrivers: (
    | 'MACRO'
    | 'EXCHANGE'
    | 'ECOSYSTEM'
    | 'UNLOCK'
    | 'NARRATIVE'
    | 'RETAIL'
    | 'EVENT'
  )[];

  // Dynamic class resolution
  activeClass: TokenClass; // baseClass OR 'FCT'

  // FCT override (optional)
  fct?: FCTOverride;

  // Engine interpretation helpers
  macroSensitivity: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'CHAOTIC';
  defaultBias: 'TREND' | 'FADE' | 'SQUEEZE' | 'MEAN_REVERT';

  // Risk + execution hints
  maxLeverageProfile: 'LOW' | 'MEDIUM' | 'HIGH';
  sizingMultiplier: number;

  // Audit + UI
  notes?: string;
}
3️⃣ Active Class Resolution Rule (Hard)
No module decides physics.
Semua pakai helper ini:
Ts
Salin kode
function resolveActiveClass(tp: TokenProfile): TokenClass {
  if (tp.fct?.isActive) return 'FCT';
  return tp.baseClass;
}
4️⃣ Example — Normal Token
SOL (Normal)
Ts
Salin kode
{
  symbol: 'SOL',
  baseClass: 'HEC',
  activeClass: 'HEC',

  liquidityTier: 'ULTRA',
  dominantDrivers: ['ECOSYSTEM', 'NARRATIVE'],

  macroSensitivity: 'MEDIUM',
  defaultBias: 'FADE',

  maxLeverageProfile: 'HIGH',
  sizingMultiplier: 1.0,

  notes: 'High beta ecosystem, trap-prone'
}
5️⃣ Example — FCT Override Active (SENT)
Ts
Salin kode
{
  symbol: 'SENT',
  baseClass: 'MEA',
  activeClass: 'FCT',

  liquidityTier: 'MID',
  dominantDrivers: ['EVENT', 'RETAIL'],

  macroSensitivity: 'CHAOTIC',
  defaultBias: 'SQUEEZE',

  maxLeverageProfile: 'HIGH',
  sizingMultiplier: 0.5,

  fct: {
    isActive: true,
    phase: 'ACTIVE',

    eventId: 'binance_futures_challenge_20260127_001',
    eventSource: 'BINANCE_FUTURES_X',
    eventDetectedAt: '2026-01-27T12:34:00Z',

    phaseStartedAt: '2026-01-27T14:00:00Z',
    eventAgeHours: 18.4,

    disabledModels: ['POSITIONING', 'FUNDING', 'MACRO', 'ECOSYSTEM'],
    enabledModels: ['FORCED_FLOW', 'LIQUIDATION', 'ABSORPTION', 'SPREAD']
  },

  notes: 'Futures Challenge active — forced flow only'
}
6️⃣ Structural State Machine Integration
State machine must read:
Ts
Salin kode
const activeClass = resolveActiveClass(tokenProfile);
const fctPhase = tokenProfile.fct?.phase ?? 'NONE';
Then:
Apply FCT overrides if activeClass === 'FCT'
Apply normal class playbook otherwise
7️⃣ UI Validator Integration
UI reads TokenProfile and shows:
Salin kode

Base Class: MEA
Active Class: FCT
FCT Phase: ACTIVE
Disabled Models: POSITIONING, FUNDING, MACRO
Enabled Models: FORCED_FLOW, LIQUIDATION
8️⃣ Backtest Labeling Integration
Backtest log copies:
Json
Salin kode
{
  "symbol": "SENT",
  "base_class": "MEA",
  "active_class": "FCT",
  "fct_phase": "ACTIVE",
  "models_enabled": ["FORCED_FLOW"],
  "models_disabled": ["POSITIONING","FUNDING","MACRO"]
}
9️⃣ Determinism Guarantees (Hard Rules)
These prevent chaos:
❌ No module may override class directly
❌ No module may assume funding/OI enabled without checking TokenProfile
❌ All alerts must include baseClass + activeClass + fctPhase
Why This Is Strong Architecture
You now have:
Single ontology
Dynamic override
Explainable behavior
Backtestable logic
UI transparency
Event-driven physics
Most systems break here.
Ini yang bikin engine kamu desk-grade + product-grade.
Final Lock (Big Milestone)
Dengan ini, kamu sekarang punya:
✅ Token taxonomy
✅ Macro sensitivity matrix
✅ Class playbooks
✅ FCT lifecycle
✅ State machine overrides
✅ UI + backtest labeling
✅ Master TokenProfile ontology
Ini sudah level system design lengkap.



