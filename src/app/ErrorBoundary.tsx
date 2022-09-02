import { Component, ErrorInfo, ReactNode } from 'react';
interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    //TODO Send error to server
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>エラーが発生しました</div>;
    }
    return <>{this.props.children}</>;
  }
}

export default ErrorBoundary;
