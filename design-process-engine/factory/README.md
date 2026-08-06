# Factory — Knowledge Production Pipeline

Semi-automated capture → draft → curate pipeline for the Design Process Engine.

The Factory turns real app journeys into **playbook** and **pattern** drafts, then a human taste gate promotes them into `knowledge/`.

## Prerequisites

From the repo root (`design-process-engine/`):

```bash
npm install   # provides tsx
```

No separate build step — pipelines run with `tsx` via the CLI.

## Quick start (sample data)

```bash
npm run factory:capture   # normalize + stack fixtures
npm run factory:draft     # draft fintech-onboarding playbook + patterns
npm run factory:status    # queue snapshot
```

Or invoke the CLI directly:

```bash
node factory/scripts/run-pipeline.mjs capture --input=factory/fixtures/sample-journeys.json
node factory/scripts/run-pipeline.mjs draft --flow=fintech-onboarding
node factory/scripts/run-pipeline.mjs status
```

## Operator workflow

### 1. Capture

Drop raw journeys (JSON array) somewhere on disk, then:

```bash
node factory/scripts/run-pipeline.mjs capture --input=path/to/journeys.json
```

What happens:

- Each journey is **normalized** (`normalizeJourney`) into a comparable structure
- Journeys are **stacked** by `flowType` (`stackJourneys`)
- Output lands in `factory/queue/captured.json`
- Status updates in `factory/queue/status.json`

Schema: [`schemas/journey.schema.json`](./schemas/journey.schema.json)  
Fixtures: [`fixtures/sample-journeys.json`](./fixtures/sample-journeys.json) (3 fintech onboarding journeys)

### 2. Draft

```bash
node factory/scripts/run-pipeline.mjs draft --flow=fintech-onboarding
```

What happens:

- `draftPlaybookFromStack` builds a playbook draft (structure, strategies, forgotten states, prevalence)
- Top patterns get `draftPatternFromExamples` drafts
- Files write to `factory/queue/drafts/*.playbook.json` and `*.pattern.json`

Schemas:

- [`schemas/playbook-draft.schema.json`](./schemas/playbook-draft.schema.json)
- [`schemas/pattern-draft.schema.json`](./schemas/pattern-draft.schema.json)

### 3. Curate (human taste gate)

Approve into `knowledge/` with a tier tag:

```bash
node factory/scripts/run-pipeline.mjs curate \
  --approve=factory/queue/drafts/fintech-onboarding.playbook.json \
  --tier=pro \
  --notes="Tightened never-do list"
```

Reject (logged only):

```bash
node factory/scripts/run-pipeline.mjs curate \
  --reject=fintech-onboarding \
  --reason="Too thin — need more journeys"
```

- Approvals → `knowledge/playbooks/` or `knowledge/patterns/` + `factory/queue/approved.jsonl`
- Rejections → `factory/queue/rejected.jsonl`

### 4. Status

```bash
node factory/scripts/run-pipeline.mjs status
# or
npm run factory:status
```

## Layout

```
factory/
  README.md
  schemas/           JSON schemas for journeys + drafts
  fixtures/          Sample captured journeys
  pipelines/
    capture.ts       CaptureJob, normalizeJourney, stackJourneys
    draft.ts         draftPlaybookFromStack, draftPatternFromExamples
    curate.ts        approveArtifact, rejectArtifact, queue status
  scripts/
    run-pipeline.mjs CLI entry
  queue/
    .gitkeep
    captured.json    (generated)
    status.json      (generated)
    drafts/          (generated)
    approved.jsonl
    rejected.jsonl
```

## Regenerating bulk knowledge

The separate generator (seed playbooks/patterns) lives at:

```bash
npm run knowledge:generate
```

That script is independent of the Factory capture loop; Factory is the path for evidence-backed updates.
