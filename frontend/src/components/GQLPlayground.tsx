import React from "react";
import { Provider } from "react-redux";
import { Playground, store } from "graphql-playground-react";

export interface IGQLPlaygroundProps {}

export default class GQLPlayground extends React.Component<
  IGQLPlaygroundProps,
  any
> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="gql-playground">
        <Provider store={store}>
          <Playground endpoint="http://localhost:4000/graphql" />
        </Provider>
      </div>
    );
  }
}
