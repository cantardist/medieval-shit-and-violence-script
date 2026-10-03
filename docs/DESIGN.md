# Design notes

## Pipeline

**Detect → score → rank → diversify → choose detail level → budget → append.**

JanitorAI Scripts run fresh for each generation, so v0.2 deliberately avoids pretending ordinary JavaScript variables persist. Continuity is reconstructed cheaply from the recent chat window.

## Scoring

Direct mentions in the latest message dominate. Older direct mentions provide a continuity bonus. Category and setting signals provide smaller bonuses. Room-sized/stationary equipment is penalized when the recent scene has not established plausible access.

The deterministic index fraction is only a stable tiebreaker; it does not create random rotation.

## Adaptive detail

A high score receives the visual + summary form, a medium score receives the summary, and a lower qualifying score receives name/provenance only. If a line would exceed the remaining budget, it is downgraded to bullet form; if even that will not fit, selection stops.

This is intentionally similar to the full/summary/bullet strategy used by adaptive JanitorAI lorebooks, but the budget is smaller because these entries are supplemental props.

## Why not inject the whole catalogue?

The JavaScript catalogue and the model context are different resources. Keeping dozens of compact objects in the script is cheap compared with appending all their prose to every model request. The shortlist therefore stays small even as the catalogue grows.

## Tuning

Raise `MAX_TOKENS` before raising `MAX_INJECTED` if selected entries feel too terse. Raise `HISTORY_DEPTH` only when continuity is genuinely being lost; a deeper window increases stale matches. Adjust keyword lists before simply lowering `MIN_ACTIVATION_SCORE`, because broad activation increases false positives.

## Historical scope

The database intentionally mixes documented apparatus with later penal equipment, reconstructions, and famous disputed museum objects. The `status` field tells the model which is which rather than silently treating every popular internet “medieval torture device” as authentic.
