import { useMutation, useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = Record<string, any>;

/** Wraps a backend promise with a 10-second timeout so slow responses never hang UI */
function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Query timed out after ${ms}ms`)), ms),
    ),
  ]);
}

export interface ShopPackage {
  id: string;
  dokaAmount: number;
  priceEur: number;
  paymentLink: string;
}

export interface PurchaseRecord {
  id: string;
  packageId: string;
  dokaAmount: number;
  priceEur: number;
  timestamp: string;
  status: string;
  customerData: Record<string, string>;
  proofOfAddressBase64?: string;
  proofOfAddressName?: string;
  userId?: string;
}

export function useGetShopPackages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ShopPackage[]>({
    queryKey: ["shopPackages"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await withTimeout((actor as ActorAny).getShopPackages());
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 60000,
    gcTime: 300000,
  });
}

export function useInitiatePurchase() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      packageId,
      customerData,
    }: { packageId: string; customerData: Record<string, string> }) => {
      if (!actor) throw new Error("Actor not available");
      if (!actor)
        throw new Error("Not connected — please log in before purchasing");
      return (actor as ActorAny).initiatePurchase(packageId, customerData);
    },
  });
}

export function useGetPurchaseRecords() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PurchaseRecord[]>({
    queryKey: ["purchaseRecords"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = (await withTimeout(
          (actor as ActorAny).getPurchaseRecords(),
        )) as PurchaseRecord[] | null | undefined;
        return (result ?? []) as PurchaseRecord[];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30000,
    gcTime: 120000,
  });
}
