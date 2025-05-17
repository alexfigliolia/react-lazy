import { lazy, Suspense } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import type { PriorityQueue } from "./PriorityQueue";
import { type ILazyComponentFactory, PriorityLevel } from "./types";

export const LazyComponentFactory = (Queue: PriorityQueue) => {
  return <T extends Record<string, any>>({
    loader,
    onError,
    fallback = null,
    errorBoundary = null,
    priority = PriorityLevel.Immediate,
  }: ILazyComponentFactory<T>) => {
    const Component = lazy(() => Queue.enqueue(priority, loader));
    function PrioritizedLazyComponent(props: T) {
      return (
        <ErrorBoundary fallback={errorBoundary} onError={onError}>
          <Suspense fallback={fallback}>
            {/* @ts-ignore */}
            <Component {...props} />
          </Suspense>
        </ErrorBoundary>
      );
    }
    PrioritizedLazyComponent.preload = (preloadPriority = priority) => {
      return Queue.enqueue(preloadPriority, loader);
    };
    return PrioritizedLazyComponent;
  };
};
