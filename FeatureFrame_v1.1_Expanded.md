🎯 FeatureFrame v1.1 (Expanded but Controlled)
Tambahan derived metric yang masuk akal:
📊 Price Structure
✔ midPrice = (bestBid + bestAsk) / 2
✔ spreadPct = spread / midPrice
✔ markVsMidDelta = markPrice - midPrice
📈 OI Structure
✔ oiDelta = currentOI - previousOI (stateful minimal)
✔ oiVelocity = oiDelta / tick
💥 Liquidation Pressure
✔ netLiquidation = buyLiq - sellLiq
✔ liquidationImbalanceRatio
📉 Trade Flow
✔ deltaAbsRatio = abs(tradeDelta) / tradeVolume
✔ aggressionRatio
⚠️ Tapi Jangan Tambah Ini di Feature Layer
❌ Divergence score final
❌ Compression score final
❌ TriggerCost
❌ Tier multiplier
❌ Heat scoring
Itu FSM layer.
🧠 Hidden State Datangnya Dari Layer Atas
FCT manipulatif itu:
Leverage stacking
OI trap
Funding skew trap
Coordinated unwind
Itu interaksi waktu + breadth.
Feature layer hanya menyediakan bahan mentah yang kaya dan bersih.
FSM yang mengekstrak struktur.
🔒 Jadi Gue Setuju Dengan Lu, Tapi Dengan Guardrail
✔ Tambah derived metric ringan
✔ Tetap pure
✔ Tetap deterministic
✔ Tidak over-engineer
✔ Tidak bawa logic threshold
🧠 Kenapa Ini Penting?
Kalau lu masukkan terlalu banyak kalkulasi kompleks di feature:
Nanti waktu debugging anomali:
Lu tidak tahu bug di mana.
Feature layer harus:
Matematis, jelas, dan kecil.
FSM layer boleh kompleks.
