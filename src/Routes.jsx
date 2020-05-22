import React from "react";
import { Switch, Route } from "react-router-dom";
import { Container } from "@material-ui/core";
import Home from "./components/Home";
import Login from "./components/Login";

function Routes() {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
}

export default Routes;