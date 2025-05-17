import { lazy, Suspense } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import type { ILazyComponent } from "./types";

export const CreateLazyComponent = <T extends Record<string, any>>({
  loader,
  onError,
  fallback = null,
  errorBoundary = null,
}: ILazyComponent<T>) => {
  const Component = lazy(() => loader());
  function LazyComponent(props: T) {
    return (
      <ErrorBoundary fallback={errorBoundary} onError={onError}>
        <Suspense fallback={fallback}>
          {/* @ts-ignore */}
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  }
  LazyComponent.preload = loader;
  return LazyComponent;
};
