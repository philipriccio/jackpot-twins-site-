# Scratch browser regression

Run against an enabled local production/dev preview (default `http://127.0.0.1:3395`). All Scratch API responses are synthetic; tracking vendors are blocked. Never generates real accounts, messages, awards or bookings.

Requires an existing Playwright Core installation and Chrome. No test dependency is added to production.

```sh
PLAYWRIGHT_MODULE=/path/to/playwright-core node tests/browser/scratch-replay.cjs
PLAYWRIGHT_MODULE=/path/to/playwright-core HIT_TOUCH=1 node tests/browser/scratch-replay.cjs
PLAYWRIGHT_MODULE=/path/to/playwright-core RETRY=1 node tests/browser/scratch-replay.cjs
PLAYWRIGHT_MODULE=/path/to/playwright-core POPUP=1 node tests/browser/scratch-replay.cjs
```

Optional `BASE` changes preview origin. Checks three consecutive five-choice losing cards without reload, actual canvas alpha erasure before release, exactly three starts/fifteen completions, result dismissal/reopening and resize. Default touch uses independent native TouchEvents without PointerEvents; `HIT_TOUCH` uses Chrome's hit-tested touch input. `RETRY` injects one HTTP503 completion and exercises recovery. `POPUP` exercises homepage modal plus close/reopen/body unlock. Physical Safari/device keyboard acceptance is separate.
