import { lazy, PureComponent, Suspense } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import type { PriorityQueue } from "./PriorityQueue";
import {
  type EmptyObject,
  type ILazyComponentFactory,
  PriorityLevel,
} from "./types";

export const LazyComponentFactory = (Queue: PriorityQueue) => {
  return <T extends Record<string, any>>({
    loader,
    onError,
    fallback = null,
    errorBoundary = null,
    priority = PriorityLevel.Immediate,
  }: ILazyComponentFactory<T>) => {
    const Component = lazy(() => loader());
    return class PrioritizedLazyComponent extends PureComponent<
      T,
      EmptyObject
    > {
      public static preload() {
        Queue.enqueue(priority, loader);
      }

      public override render() {
        return (
          <ErrorBoundary fallback={errorBoundary} onError={onError}>
            <Suspense fallback={fallback}>
              {/* @ts-ignore */}
              <Component {...this.props} />
            </Suspense>
          </ErrorBoundary>
        );
      }
    };
  };
};
