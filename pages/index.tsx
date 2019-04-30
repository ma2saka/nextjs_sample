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
