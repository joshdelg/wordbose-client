import React from 'react';
import { Grid } from "@material-ui/core";

import Routes from "./Routes";
import Header from "./components/Header";
import AuthContextProvider from "./contexts/AuthContext";

function App() {

  return (
    <AuthContextProvider>
      <div className="App">
        <Grid container direction="column">
          <Grid item>
            <Header />
          </Grid>
          <Grid item container>
            <Grid item xs={2}></Grid>
            <Grid item container xs={8}>
              <Routes />
            </Grid>
            <Grid item xs={2}></Grid>
          </Grid>
        </Grid>
      </div>
    </AuthContextProvider>
  );
}

export default App;