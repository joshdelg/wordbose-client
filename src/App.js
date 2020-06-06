import React, { useContext, useEffect } from 'react';
import { Grid } from "@material-ui/core";
import Routes from "./Routes";
import Header from "./components/Header";
import { AuthContext } from './contexts/AuthContext';
import { Auth } from "aws-amplify";

function App() {

  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    const onLoad = async() => {
      try {
        await Auth.currentSession();
        dispatch({type: 'LOG_IN'});
      } catch (e) {
        if (e !== 'No current user') {
          alert(e);
        }
      }
    }

    onLoad();
  }, [dispatch]);

  return (
      <div className="App">
        <Grid container direction="column">
          <Grid item>
            <Header />
          </Grid>
          <Grid item container>
            <Grid item xs={1} sm={2}></Grid>
            <Grid item container xs={10} sm={8}>
              <Routes />
            </Grid>
            <Grid item xs={1} sm={2}></Grid>
          </Grid>
        </Grid>
      </div>
  );
}

export default App;