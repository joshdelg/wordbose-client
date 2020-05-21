import React from 'react';
import './App.css';
import { Grid, Typography } from "@material-ui/core";

import Routes from "./Routes";
import Header from "./components/Header";

function App() {
  return (
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
  );
}

export default App;