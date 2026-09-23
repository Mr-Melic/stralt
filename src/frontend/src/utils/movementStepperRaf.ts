/**
 * The player movement stepper is a requestAnimationFrame chain inside a
 * useEffect that lists `currentStepIndex` in its deps. React re-enters that
 * effect after every committed tile. Without cancelling the previous frame,
 * leftover closures keep `targetStepIndex > closedOverStepIndex` true and
 * re-apply lava / spikes / ice on a tile the live loop already processed.
 */

export function leftoverMovementStepperReappliesTile(opts: {
  leftoverLoopRunning: boolean;
  closedOverStepIndex: number;
  liveStepIndex: number;
  targetStepIndex: number;
}): boolean {
  if (!opts.leftoverLoopRunning) return false;
  return (
    opts.targetStepIndex > opts.closedOverStepIndex &&
    opts.targetStepIndex <= opts.liveStepIndex
  );
}

export function cancelExclusiveMovementRaf(
  rafId: number,
  cancelFn: (id: number) => void = cancelAnimationFrame,
): void {
  if (rafId > 0) cancelFn(rafId);
}

/**
 * Schedule a self-rescheduling rAF whose stop() cancels the pending frame.
 * The stepper effect must return this stop from its cleanup.
 */
export function startExclusiveRafLoop(
  step: () => boolean,
  schedule: (cb: () => void) => number = (cb) => requestAnimationFrame(cb),
  cancel: (id: number) => void = cancelAnimationFrame,
): () => void {
  let rafId = 0;
  const tick = () => {
    rafId = 0;
    if (step()) rafId = schedule(tick);
  };
  rafId = schedule(tick);
  return () => {
    cancelExclusiveMovementRaf(rafId, cancel);
    rafId = 0;
  };
}
