import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./components/Home";

function Routes() {
  return (
    <Switch>
      <Route path="/login">Log In</Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
}

export default Routes;