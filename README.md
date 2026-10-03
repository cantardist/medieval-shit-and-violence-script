# Universal Historical Equipment Module for JanitorAI

A reusable JanitorAI Script that gives characters context-sensitive knowledge of a broad catalogue of historical, early-modern, later penal, reconstructed, and famous disputed/legendary torture or punishment equipment.

## Design goals

- **Character-agnostic:** does not make a character evil or change their motives.
- **Modern-setting compatible:** a mansion, basement, private collection, gallery, prison-like room, fantasy dungeon, etc. can plausibly contain antique or replica equipment.
- **Large catalogue, small prompt footprint:** the database stays inside JavaScript; only a ranked shortlist (default: up to 5 entries) is appended to the model context.
- **Token-capped:** default injection cap is approximately 520 tokens.
- **Context-sensitive:** recent messages are scanned for scene, category, setting, and direct device-name signals.
- **Continuity-friendly:** directly mentioned devices receive a large relevance bonus.
- **Historically labeled:** entries distinguish documented objects from mixed-provenance, disputed, legendary, reconstructed, and later-period objects.
- **Non-procedural:** entries identify and describe props for fiction without serving as a real-world injury manual.

## Installation

1. Open the character in JanitorAI and create/add a Script lorebook entry.
2. Paste the contents of `historical_equipment.js`.
3. Configure the Script to run for the character. The module internally decides whether the current scene is relevant.
4. Test in JanitorAI Test Chat.
5. Turn `CONFIG.DEBUG` to `true` while troubleshooting. The debug panel will show whether the module activated, approximate injected tokens, selected IDs, and top scores.

## Performance

The script intentionally does **not** inject the entire catalogue. JanitorAI Scripts run before each generation, so the expensive resource is usually model context, not having a moderate JavaScript array in the sandbox. This module scans only the last 8 messages by default, scores the local catalogue with simple string operations, selects at most 5 entries, and caps injected text at ~520 estimated tokens.

Important settings:

```js
HISTORY_DEPTH: 8,
MAX_INJECTED: 5,
MAX_TOKENS: 520,
MIN_ACTIVATION_SCORE: 2
```

For a smaller-context model, try `MAX_INJECTED: 3` and `MAX_TOKENS: 300`.

## Historical accuracy

"Torture device" lists on the internet often mix real judicial/penal equipment with later museum inventions and folklore. The catalogue therefore uses a `status` field. For example, the rack, pillory, stocks, thumbscrew, Scavenger's Daughter, bilboes, and various shackles/restraints have documentary histories; the famous iron maiden is primarily a later construction falsely marketed as medieval, while several museum staples have uncertain provenance.

The module still allows a modern fictional collector to own replicas of disputed objects; it simply tells the model not to present those objects as unquestionably medieval.

## Catalogue scope

The initial catalogue includes roughly fifty entries spanning:
- restraints, shackles, stocks, pillories and cages
- large stationary apparatus
- suspension and confinement equipment
- punishment/display furniture
- penal-labor devices
- execution/display structures
- portable historical implements
- disputed or legendary torture-museum objects
- generic reconstructed restraint furniture useful in fictional modern collections

## JanitorAI sandbox assumptions

The script uses ES6+ with `"use worker";`, guards character context fields, reads recent chat messages, and appends only to `context.character.scenario`. It does not use imports, network calls, storage, timers, DOM APIs, or filesystem access.

## Version

v0.1.0 — initial functional catalogue + relevance engine + token cap + debug mode.
