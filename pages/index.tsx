import { State } from "../modules/store";
import { connect } from "react-redux";

type IndexProps = {
  counter: number;
};

const Index = (props: IndexProps) => (
  <>
    <p>
      hello counter: <span>{props.counter}</span>
    </p>
    <style jsx>{`
      span {
        color: red;
      }
    `}</style>
  </>
);

const mapStateToProps = (state: State) => {
  return {
    counter: state.app.counter
  };
};
export default connect(mapStateToProps)(Index);
