import { lazy, Suspense } from "react";

import type { ILazyComponent } from "./types";
import { ErrorBoundary } from "./ErrorBoundary";

export const CreateLazyComponent = <T extends Record<string, any>>({
  loader,
  onError,
  fallback = null,
  errorBoundary = null,
  ...schedulerOptions
}: ILazyComponent<T>) => {
  let loaderPromise: ReturnType<typeof loader> | null = null;
  const loadFN = () => {
    if (!loaderPromise) {
      loaderPromise = window.scheduler.postTask(loader, schedulerOptions);
    }
    return loaderPromise;
  };
  const Component = lazy(loadFN);
  function LazyComponent(props: T) {
    return (
      <ErrorBoundary fallback={errorBoundary} onError={onError}>
        <Suspense fallback={fallback}>
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  }
  LazyComponent.preload = loader;
  return LazyComponent;
};
