import React, { useState, useContext, useEffect } from 'react';
import { Grid, createMuiTheme, ThemeProvider, Typography, Container } from "@material-ui/core";
import Routes from "./Routes";
import Header from "./components/Header";
import { AuthContext } from './contexts/AuthContext';
import { Auth } from "aws-amplify";
import { deepPurple, amber } from '@material-ui/core/colors';
import LoadingScreen from "./components/LoadingScreen";

const globalTheme = createMuiTheme({
  palette: {
    primary: deepPurple,
    secondary: amber
  }
});

function App() {

  const { dispatch } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
    }

    onLoad();
  }, [dispatch]);

  return (
    <>
      {(isLoading) ? <LoadingScreen />
         : (
        <ThemeProvider theme={globalTheme}>
          <div style={{overflow: "hidden"}} className="App">
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
        </ThemeProvider>
      )}
    </>
  );
}

export default App;