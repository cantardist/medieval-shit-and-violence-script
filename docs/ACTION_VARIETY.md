# Action Variety Engine

A separate JanitorAI Script/lorebook for reducing repetitive confrontation writing.

It does **not** make characters violent. It activates only when recent context already supports confrontation, threats, restraint, fighting, or similar action. It supplies a small rotating-by-relevance vocabulary of cinematic action beats: spatial intimidation, grappling, pins, tackles, clothing grabs, interception, environmental interaction, striking variety, and related beats.

The script intentionally keeps dangerous actions non-instructional: it suggests narrative categories and beats, not anatomy, optimized targeting, timing, or step-by-step fighting/choking technique.

## Why separate from the equipment module?

They solve different problems. Historical Equipment is object/prop knowledge. Action Variety is prose/action diversity. Keeping them separate lets users enable either one and makes debugging easier.

JanitorAI does not guarantee script execution order, so neither script depends on the other. They can coexist independently.

## Default footprint

- 4-message history
- maximum 4 action suggestions
- approximately 150 injected tokens
- latest message weighted more strongly than older context
- no forced escalation

## Testing

Test calm scenes first: ordinary conversation should not turn violent. Then test intimidation, a close-range struggle, an established fight, an escape attempt, and a scene with an already-established weapon. Confirm the character's card still determines whether they are restrained, theatrical, impulsive, cruel, reluctant, etc.


## v0.2 safeguards

The engine now infers confrontation intensity from 0–4 and gates higher-intensity narrative beats behind stronger scene evidence. It does not climb the intensity ladder merely to create variety.

It also detects several common repetitive RP beat families in the recent window (including chin-grabbing, wall-pinning, repeated body-strike language, smirking, and leaning in). Matching action families receive a ranking penalty, and the injected guidance asks for a materially different beat unless continuity requires repetition.

If a Context Control-style `[CONTEXT BUDGET: ... per_script=N]` marker is present in scenario context, the engine respects the smaller per-script budget instead of blindly using its normal 150-token ceiling.
