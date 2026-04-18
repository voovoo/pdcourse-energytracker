// Experiment registry — values are rollout percentages (0–100).
// Use experimentIsRunning() to gate features behind an experiment.
const EXPERIMENTS = {
  'monthly-savings': 100,
}

export function experimentIsRunning(name) {
  return EXPERIMENTS[name] ?? 0
}
