import { lazy, Suspense } from "react";

import type { ILazyComponent } from "./types";
import { ErrorBoundary } from "./ErrorBoundary";

export const CreateLazyComponent = <T extends Record<string, any>>({
  loader,
  onError,
  fallback = null,
  errorBoundary = undefined,
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
  function renderLazyNodes(props: T) {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
  }
  function LazyComponent(props: T) {
    if (typeof errorBoundary !== "undefined" || typeof onError !== "undefined") {
      return (
        <ErrorBoundary fallback={errorBoundary} onError={onError}>
          {renderLazyNodes(props)}
        </ErrorBoundary>
      );
    }
    return renderLazyNodes(props);
  }
  LazyComponent.preload = loader;
  return LazyComponent;
};
