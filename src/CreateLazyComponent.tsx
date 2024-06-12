import { lazy, PureComponent, Suspense } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import type { EmptyObject, ILazyComponent } from "./types";

export const CreateLazyComponent = <T extends Record<string, any>>({
  loader,
  onError,
  fallback = null,
  errorBoundary = null,
}: ILazyComponent<T>) => {
  return class LazyComponent extends PureComponent<T, EmptyObject> {
    public Component = lazy(() => loader());

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
