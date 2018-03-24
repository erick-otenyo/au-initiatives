import React from "react";
import {
  CSSTransition,
  CSSTransitionGroup,
  transit
} from "react-css-transition";
import { Card, CardHeader } from "material-ui";

const SelectedFeatures = props => (
  <CSSTransition
    {...props}
    defaultStyle={{ opacity: 0 }}
    enterStyle={{ opacity: transit(1.0, 50, "ease-in-out") }}
    leaveStyle={{ opacity: transit(0, 50, "ease-in-out") }}
    activeStyle={{ opacity: 1.0 }}
  />
);

const SelectedFeaturesGroup = props => (
  <CSSTransitionGroup {...props}>
    {React.Children.map(props.children, child => (
      <SelectedFeatures>{child}</SelectedFeatures>
    ))}
  </CSSTransitionGroup>
);

const SidePop = props => {
  let feature;
  if (props.Selected) {
    const dest = props.Selected;
    feature = (
      <a href="/facility/40035" key={i}>
        <div
          className="facilities-list-item"
          style={{ borderLeft: "5px solid rgb(186, 104, 200);]" }}
        >
          <div className="title" />
          <div className="subtitle">{dest.name}</div>
          <div className="subtitle">{dest.name}</div>
          <i className="fa fa-chevron-right" />
        </div>
      </a>
    );
  }

  return (
    <div>
      <SelectedFeaturesGroup>{feature}</SelectedFeaturesGroup>
    </div>
  );
};

export default SidePop;
