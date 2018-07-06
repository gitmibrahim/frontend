import React, { Component } from 'react';
import ErrorPage from 'shared_components/ErrorPage';

export default ChildComponent => {
  return class ErrorBoundary extends Component {
    state = {
      showErrorPage: false,
    };

    componentDidCatch(error, info) {
      this.setState({ showErrorPage: true });
      console.log({ error, info });
      // TODO: @jaydp send the error to sentry
    }

    render() {
      if (this.state.showErrorPage) {
        return <ErrorPage />;
      }
      return <ChildComponent {...this.props} />;
    }
  };
};
