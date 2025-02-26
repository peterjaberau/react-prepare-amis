/**
 * @file ErrorBoundary
 * @description Captures JavaScript errors that occur anywhere in its child component tree and prints them
 * @author wibetter
 */
import React from 'react';

interface ErrorBoundaryProps {
// Custom error message, console output
  customErrorMsg?: string;
  fallback?: () => void;
  children: any;
}

interface ErrorBoundaryStates {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryStates
> {
  constructor(props: any) {
    super(props);
    this.state = {hasError: false};
  }

  componentDidCatch(error: any, errorInfo: any) {
    const {customErrorMsg} = this.props;
    if (customErrorMsg) {
      console.warn(customErrorMsg);
    }

    console.warn('Error object:', error);
    console.warn('Error information:', errorInfo);
    this.setState({
      hasError: true
    });
  }

  render() {
    const {fallback} = this.props;
    if (this.state.hasError) {
      if (fallback) {
        return fallback();
      }

// Default rendering error message
      return (
        <div className="renderer-error-boundary">
          Rendering error, please check the console output for detailed error information.
        </div>
      );
    }

    return this.props.children;
  }
}
