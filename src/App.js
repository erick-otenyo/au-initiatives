import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import TopBar from "./components/TopBar";
import Initiative from "./components/Initiative";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <TopBar />
        <div style={{ marginTop: 60 }}>
          <Switch>
            <Route exact path={`${process.env.PUBLIC_URL}/`} component={Home} />
            <Route
              path={`${process.env.PUBLIC_URL}/:id`}
              component={Initiative}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
