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
    return class LazyComponent extends PureComponent<T, EmptyObject> {
      public Component = lazy(() => loader());
      constructor(props: T) {
        super(props);
        if (typeof priority !== "undefined") {
          Queue.push(priority, loader);
        }
      }

      public static preload() {
        return loader();
      }

      public override render() {
        const { Component, props } = this;
        return (
          <ErrorBoundary fallback={errorBoundary} onError={onError}>
            <Suspense fallback={fallback}>
              {/* @ts-ignore */}
              <Component {...props} />
            </Suspense>
          </ErrorBoundary>
        );
      }
    };
  };
};
