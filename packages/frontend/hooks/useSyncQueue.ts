import { useCallback, useRef } from "react";

export interface QueuedSync {
  promise: Promise<void>;
  resolve: () => void;
}

export const useSyncQueue = () => {
  const syncQueueRef = useRef<QueuedSync[]>([]);
  const isSyncingRef = useRef(false);

  const processSyncQueue = useCallback(async () => {
    if (isSyncingRef.current || syncQueueRef.current.length === 0) return;

    isSyncingRef.current = true;
    const currentSync = syncQueueRef.current[0];

    try {
      await currentSync.promise;
    } finally {
      isSyncingRef.current = false;
      syncQueueRef.current.shift();
      currentSync.resolve();

      // Process next item in queue if any
      if (syncQueueRef.current.length > 0) {
        processSyncQueue();
      }
    }
  }, []);

  const queueSync = useCallback(
    (syncFn: () => Promise<void>) => {
      return new Promise<void>((resolve) => {
        const syncPromise = new Promise<void>(async (resolveSync) => {
          await syncFn();
          resolveSync();
        });

        syncQueueRef.current.push({
          promise: syncPromise,
          resolve,
        });

        processSyncQueue();
      });
    },
    [processSyncQueue],
  );

  return queueSync;
};
