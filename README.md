# next.js + typescript + redux (2019/4)

以下を参考に手習いしたもの。

- https://fiveteesixone.lackland.io/2018/12/09/nextjs-with-typescript-1/

## セットアップ

```
$ npm init -y
$ git init .
```

`vi .gitignore` して以下を追加。

```
node_modules/*
.next/*
```

## ライブラリのインストール

```sh
$ npm install --save react react-dom next redux react-redux next-redux-wrapper redux-devtools-extension typescript
$ npm install --save-dev @zeit/next-typescript
$ npm install --save-dev @types/react @types/{next,react-dom,react-redux,redux,styled-jsx,next-redux-wrapper}
```

## next.config.js の作成

```next.config.js
const withTypescript = require("@zeit/next-typescript")
module.exports = withTypescript();
```

## babel.config.js の作成

```babel.config.js
module.exports = {
  presets: ["next/babel", "@zeit/next-typescript/babel"]
};
```

## tsc --init する

```sh
$ npx tsc --init
```

`jsx": "preserve"` の行のコメントアウトを外しておく。

## pages, components, modules, static ディレクトリを作成する

```sh
$ mkdir pages components modules static
```

- pages : next.js のページを置くディレクトリ
- static : next.js の静的ファイルを配置するディレクトリ
- components : 慣習的に React コンポーネントを作成して置く
- modules : reducer や store 周りを置く

## package.json に script を追加する

公式の通り。

```package.json
 "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
 }
```

## modules/store.ts を作成し、redux の store を作成する

ここでは適当に app.counter を持つ store を定義する。

このあたりの実装は基本的に公式の JS の例を参考にしている。

```modules/store.ts
import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

export type State = {
  app: {
    counter: number;
  };
};

const defaultinitialState = {
  counter: 0
};

export const reducer = (
  state = defaultinitialState,
  action: { type: string }
) => {
  switch (action.type) {
    default:
      return state;
  }
};

const rootReducer = combineReducers({ app: reducer });

export const initStore = (initialState = { app: defaultinitialState }) => {
  return createStore(rootReducer, initialState, composeWithDevTools());
};
```

## pages/\_app.tsx を作成し全ページで redux の初期化を行うようにする

公式の JS の例を typescript に移植しただけ。

`getInitialProps` の戻りが `{}` になりえるのが気持ちが悪い。

```pages/_app.tsx
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
```

## pages/index.tsx を作成する

特に何もしていない。

```pages/index.tsx
import { State } from "../modules/store";
import { connect } from "react-redux";
import Head from "next/head";
import { NextContext } from "next";

type IndexProps = {
  counter: number;
  title: string;
  ua: string;
};

const Index = (props: IndexProps) => (
  <>
    <Head>
      <title>{props.title}</title>
    </Head>
    <ul>
      <li>
        user-agent: <span>{props.ua}</span>
      </li>
      <li>
        hello counter: <span>{props.counter}</span>
      </li>
    </ul>
    <style jsx>{`
      span {
        color: red;
      }
    `}</style>
  </>
);

Index.getInitialProps = async ({ req }: NextContext) => {
  return {
    title: "INDEX",
    ua: req ? req.headers["user-agent"] : navigator.userAgent
  };
};

const mapStateToProps = (state: State) => {
  return {
    counter: state.app.counter
  };
};
export default connect(mapStateToProps)(Index);

```

## ローカルサーバで起動する

```
npm run dev
```

で `http://localhost:3000/` でローカルサーバが立ち上がる。公式にも説明があるが、typescript のビルドは babel を通しているので型チェックは行われない。

## ビルドする

```
npm run build
```

.next/ 以下にいろいろ出力される。
