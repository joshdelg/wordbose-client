import React from 'react';
import { Switch, Route } from 'react-router-dom';

function Routes() {
  return (
    <Switch>

      <Route path="/about">
        <p>About</p>
      </Route>
      <Route path="/login">
        <p>Log In</p>
      </Route>
      <Route path="/signup">
        <p>Sign Up</p>
      </Route>
      <Route path="/" exact>
        <p>Home</p>
      </Route>
      {/* Catch-all 404 route */}
      <Route>
        <p>404</p>
      </Route>
    </Switch>
  );
}

export default Routes;