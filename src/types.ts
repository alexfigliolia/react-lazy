import type { ComponentType, ErrorInfo, ReactNode } from "react";

export interface LazyComponent<P> {
  default: ComponentType<P>;
}

export type ErrorCallback = (
  error: Error,
  errorInfo: ErrorInfo,
) => void | Promise<void>;

export interface ILazyComponent<P> extends SchedulerPostTaskOptions {
  fallback?: ReactNode;
  onError?: ErrorCallback;
  errorBoundary?: ReactNode;
  loader: () => Promise<LazyComponent<P>>;
}

export interface OptionalChildren {
  children?: ReactNode;
}

export type EmptyObject = Record<string, never>;

export type Loader<T = any> = () => Promise<T> | T;
