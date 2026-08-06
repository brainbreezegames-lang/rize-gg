#!/usr/bin/env node
/**
 * Factory CLI — capture → draft → curate → status
 *
 *   node factory/scripts/run-pipeline.mjs capture --input=factory/fixtures/sample-journeys.json
 *   node factory/scripts/run-pipeline.mjs draft --flow=fintech-onboarding
 *   node factory/scripts/run-pipeline.mjs curate --approve=path --tier=pro
 *   node factory/scripts/run-pipeline.mjs curate --reject=id --reason="..."
 *   node factory/scripts/run-pipeline.mjs status
 */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FACTORY_ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(FACTORY_ROOT, "..");
const PIPELINES = join(FACTORY_ROOT, "pipelines");

function usage() {
  console.log(`Design Process Engine — Factory

Usage:
  node factory/scripts/run-pipeline.mjs <command> [options]

Commands:
  capture --input=<path>     Normalize + stack journeys into queue/
  draft   --flow=<flowType>  Draft playbook (+ top patterns) for a flow
  curate  --approve=<path> [--tier=free|pro] [--notes=...]
          --reject=<id> [--reason=...]
  status                     Show queue / pipeline status

Examples:
  node factory/scripts/run-pipeline.mjs capture --input=factory/fixtures/sample-journeys.json
  node factory/scripts/run-pipeline.mjs draft --flow=fintech-onboarding
  node factory/scripts/run-pipeline.mjs curate --approve=factory/queue/drafts/fintech-onboarding.playbook.json --tier=pro
  node factory/scripts/run-pipeline.mjs status
`);
}

function findTsx() {
  const require = createRequire(join(REPO_ROOT, "package.json"));
  try {
    const pkg = require.resolve("tsx/package.json");
    const bin = join(dirname(pkg), "dist", "cli.mjs");
    if (existsSync(bin)) return bin;
  } catch {
    /* fall through */
  }
  const local = join(REPO_ROOT, "node_modules", "tsx", "dist", "cli.mjs");
  if (existsSync(local)) return local;
  return null;
}

function runTsx(scriptPath, extraArgs) {
  const tsxCli = findTsx();
  const args = tsxCli
    ? [tsxCli, scriptPath, ...extraArgs]
    : ["--import", "tsx", scriptPath, ...extraArgs];

  const result = spawnSync(process.execPath, args, {
    cwd: REPO_ROOT,
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
}

function getFlag(argv, name) {
  const prefix = `--${name}=`;
  const hit = argv.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
}

const [, , command, ...rest] = process.argv;

if (!command || command === "-h" || command === "--help") {
  usage();
  process.exit(command ? 0 : 1);
}

switch (command) {
  case "capture": {
    const input =
      getFlag(rest, "input") ??
      join(FACTORY_ROOT, "fixtures", "sample-journeys.json");
    runTsx(join(PIPELINES, "capture.ts"), [`--input=${input}`]);
    break;
  }
  case "draft": {
    const flow = getFlag(rest, "flow") ?? "fintech-onboarding";
    runTsx(join(PIPELINES, "draft.ts"), [`--flow=${flow}`]);
    break;
  }
  case "curate": {
    const approve = getFlag(rest, "approve");
    const reject = getFlag(rest, "reject");
    if (approve) {
      const tier = getFlag(rest, "tier") ?? "pro";
      const notes = getFlag(rest, "notes") ?? "";
      runTsx(join(PIPELINES, "curate.ts"), [
        `--approve=${approve}`,
        `--tier=${tier}`,
        `--notes=${notes}`,
      ]);
    } else if (reject) {
      const reason = getFlag(rest, "reason") ?? "rejected";
      runTsx(join(PIPELINES, "curate.ts"), [
        `--reject=${reject}`,
        `--reason=${reason}`,
      ]);
    } else {
      console.error("curate requires --approve=<path> or --reject=<id>");
      usage();
      process.exit(1);
    }
    break;
  }
  case "status": {
    runTsx(join(PIPELINES, "curate.ts"), []);
    break;
  }
  default: {
    console.error(`Unknown command: ${command}`);
    usage();
    process.exit(1);
  }
}
