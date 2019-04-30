import React from "react";
import { Provider } from "react-redux";
import App, { Container, NextAppContext } from "next/app";
import withRedux from "next-redux-wrapper";
import { initStore } from "../modules/store";

export default withRedux(initStore)(
  class ReduxContainer extends App<{ store: ReturnType<typeof initStore> }> {
    static async getInitialProps({ Component, ctx }: NextAppContext) {
      return {
        pageProps: Component.getInitialProps
          ? await Component.getInitialProps(ctx)
          : {}
      };
    }

    render() {
      const { Component, pageProps, store } = this.props;
      return (
        <Container>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </Container>
      );
    }
  }
);
