import React, { Component, ErrorInfo, ReactNode } from "react";

interface FederatedWrapperProps {
  error?: ReactNode;
  delayed?: ReactNode;
  children?: ReactNode;
}

interface FederatedWrapperState {
  hasError: boolean;
}

class FederatedWrapper extends Component<
  FederatedWrapperProps,
  FederatedWrapperState
> {
  constructor(props: FederatedWrapperProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): FederatedWrapperState {
    return { hasError: true };
  }

  componentDidCatch(_: Error, errorInfo: ErrorInfo) {
    console.log("Log error", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.error || <div>Something went wrong.</div>;
    }

    return (
      <React.Suspense fallback={this.props.delayed || <div />}>
        {this.props.children}
      </React.Suspense>
    );
  }
}

const wrapFederationModule =
  <P extends object>(Component: React.ComponentType<P>) =>
  // eslint-disable-next-line react/display-name
  (props: P & FederatedWrapperProps) =>
    (
      <FederatedWrapper error={props.error} delayed={props.delayed}>
        <Component {...props} />
      </FederatedWrapper>
    );

export default wrapFederationModule;
