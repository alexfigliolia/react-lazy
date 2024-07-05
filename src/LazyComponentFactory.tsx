import { lazy, PureComponent, Suspense } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import type { PriorityQueue } from "./PriorityQueue";
import type { EmptyObject, ILazyComponentFactory } from "./types";

export const LazyComponentFactory = (Queue: PriorityQueue) => {
  return <T extends Record<string, any>>({
    loader,
    onError,
    priority,
    fallback = null,
    errorBoundary = null,
  }: ILazyComponentFactory<T>) => {
    const Component = lazy(() => loader());
    return class PrioritizedLazyComponent extends PureComponent<
      T,
      EmptyObject
    > {
      constructor(props: T) {
        super(props);
        Queue.push(priority, loader);
      }

      public static preload() {
        return loader();
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
