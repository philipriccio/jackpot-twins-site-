# Seana scratch-card cross centring — October 10

Local-only fix from production signup release 6d03dac. No push/deploy.

Philip's iPhone Instagram screenshot shows the purple emoji tile shifted right. Desktop Chrome live baseline does not reproduce the offset; platform emoji ink/font metrics are suspected, not independently diagnosed on iOS. Replace only the cross emoji with a geometric purple rounded tile and white cross, centred on the existing scratch canvas. Other cast icons, artwork, handlers, analytics and signup remain unchanged. Purple is now consistent on desktop too (old Chrome canvas filter rendered the emoji grey).

Production Turbopack build PASS after using a local dependency copy: initial symlink was rejected by Turbopack; webpack fallback failed in existing Google font loader. No dependencies added/changed. Independent tsc PASS; scoped ESLint zero errors/four existing warnings; diff check PASS.

Chromium browser proof at 320/390/430/1440 widths: purple-pixel bounds exactly centred (zero pixel error), no horizontal overflow/page errors, scratch erases the symbol, reveal all and replay work, three ticket links preserved. Mobile screenshot visually reviewed. See proof.json and screenshots. Exact iPhone Instagram verification remains pending; no claim of device proof. Graph rebuilt locally, not committed.
