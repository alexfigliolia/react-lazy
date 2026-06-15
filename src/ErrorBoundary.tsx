import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

import type { ErrorCallback, OptionalChildren } from "./types";

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { error: false };

  public static getDerivedStateFromError() {
    return { error: true };
  }

  public override componentDidCatch?(error: Error, errorInfo: ErrorInfo) {
    void this.props?.onError?.(error, errorInfo);
  }

  public override render() {
    const { children, fallback } = this.props;
    if (this.state.error && fallback) {
      return fallback;
    }
    return children;
  }
}

interface State {
  error: boolean;
}

interface Props extends OptionalChildren {
  fallback?: ReactNode;
  onError?: ErrorCallback;
}
