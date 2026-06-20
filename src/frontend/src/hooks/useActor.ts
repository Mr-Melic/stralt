// Compatibility shim: wraps the new useActor from core-infrastructure with createActor from backend
// The old template had a zero-arg useActor; the new package requires createActor to be passed.
import { useActor as useCoreActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

export function useActor() {
  return useCoreActor(createActor as Parameters<typeof useCoreActor>[0]);
}
