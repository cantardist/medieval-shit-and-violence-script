# Narrative Violence & Intimidation Engine

A separate JanitorAI Script/lorebook for improving variety in fictional confrontations. It exists because models often fall into repetitive beats such as chin-grabbing, generic shoves, slaps, or the same stomach strike.

The engine does **not** make a character violent. The character card still determines temperament, intent, competence, morality, strength, relationships, and whether escalation is appropriate. When a confrontation is already present, the script supplies a small ranked menu of alternative narrative beats.

## What it varies

It can surface categories such as proximity/intimidation, blocking exits, clothing grabs, wall or floor pins, grappling/clinch beats, fictional chokeholds/neck restraints, takedowns, throws, trips, body checks, open-hand or close-range strikes, forced movement, environmental intimidation, environmental control, and disengagement/repositioning.

Descriptions deliberately stay at choreography level. They do not explain how to execute fighting techniques against a real person.

## Runtime defaults

- scans the last 5 messages
- activates only around confrontation/violence/intimidation signals
- injects at most 4 beats
- targets about 180 tokens
- penalizes recently repetitive patterns
- keeps direct user requests high priority
- does not invent weapons; weapon-related beats require a weapon to already be established in the text

## Using it with the Historical Equipment module

Install each file as its own Script lorebook entry. They are intentionally independent because JanitorAI does not guarantee script execution order.

If both activate in one scene, their appended context is cumulative, so the practical cost is the sum of what each script injects. With the current defaults, their hard caps are approximately 220 + 180 tokens, although ordinary generations may use less.

For several lorebooks, consider adding a shared Context Control/budget system later so all modules adapt to one total budget.
