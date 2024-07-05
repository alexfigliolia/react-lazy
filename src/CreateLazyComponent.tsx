import { lazy, PureComponent, Suspense } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import type { EmptyObject, ILazyComponent } from "./types";

export const CreateLazyComponent = <T extends Record<string, any>>({
  loader,
  onError,
  fallback = null,
  errorBoundary = null,
}: ILazyComponent<T>) => {
  const Component = lazy(() => loader());
  return class LazyComponent extends PureComponent<T, EmptyObject> {

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
