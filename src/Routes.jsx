import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Checkout from "./components/Checkout";
import TranscriptDetail from "./components/TranscriptDetail";
import NewTranscript from "./components/NewTranscript";

function Routes() {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/checkout">
        <Checkout />
      </Route>
      <Route path="/new">
        <NewTranscript />
      </Route>
      <Route path="/:transcriptId">
        <TranscriptDetail />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
}

export default Routes;