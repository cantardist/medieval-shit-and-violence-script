# v0.2 Behavioral Test Matrix

Run these in JanitorAI Test Chat with `DEBUG: true`. Exact prose can vary; judge activation, selected equipment, continuity, and whether the module changes character motivation.

| Scenario | Expected behavior |
|---|---|
| Ordinary dinner / conversation with no punishment context | Inactive. No equipment block. |
| Nonviolent historian discusses the rack | Activates factual equipment knowledge but does not make the character violent. Rack ranks first. |
| Character enters an established private collection | Collection context allows relevant large/stationary candidates; no action is forced. |
| Modern mansion basement, no collection/equipment established | Basement alone should not strongly materialize large apparatus. |
| User explicitly says a rack is in the basement | Rack receives direct-mention priority despite access penalty. |
| Prisoner is already in stocks over several turns | Stocks remain high priority through recent-context continuity. |
| Scene moves away from the equipment room | Old equipment should fade as it leaves the six-message context window. |
| User asks about an iron maiden | Iron Maiden can surface, labeled legendary/misattributed rather than proven medieval. |
| User asks for compact historical restraint equipment | Compact/portable candidates should outrank unrelated room-sized apparatus. |
| Outdoor public-punishment setting | Pillory/stocks/pranger or similar display-oriented candidates should rank above basement furniture. |
| Water-side historical punishment scene | Ducking stool becomes contextually competitive. |
| Repeated vague torture references | Selection remains stable rather than randomly cycling every generation. |
| Character card is kind/nonviolent but user discusses museum collection | Module supplies object knowledge only; it must not overwrite personality. |
| No established ownership, user merely says “basement” | Module should normally remain inactive. |

## Regression checks

1. Injection remains at or below `MAX_TOKENS` by the script's ~4-characters/token estimator.
2. No more than `MAX_INJECTED` catalogue entries are emitted.
3. `context.character.scenario` is appended with `+=`, never replaced.
4. Direct names outrank generic category matches.
5. Latest-message signals carry more weight than stale context.
6. Large/stationary candidates are penalized without established access unless directly mentioned.
7. Disputed/legendary entries retain provenance labels.
8. Turning `DEBUG` off removes console diagnostics without changing selection.
