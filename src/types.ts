import type { ComponentType, ErrorInfo, ReactNode } from "react";

export interface LazyComponent<P> {
  default: ComponentType<P>;
}

export type ErrorCallback = (
  error: Error,
  errorInfo: ErrorInfo,
) => void | Promise<void>;

export interface ILazyComponent<P> {
  fallback?: ReactNode;
  errorBoundary?: ReactNode;
  loader: () => Promise<LazyComponent<P>>;
  onError?: ErrorCallback;
}

export interface OptionalChildren {
  children?: ReactNode;
}

export type EmptyObject = Record<string, never>;
