import React, { useState, useContext, useEffect } from 'react';
import { Grid, createMuiTheme, ThemeProvider, Typography, Container } from "@material-ui/core";
import Routes from "./Routes";
import Header from "./components/Header";
import { AuthContext } from './contexts/AuthContext';
import { Auth } from "aws-amplify";
import { deepPurple, amber } from '@material-ui/core/colors';
import config from "./config";
import LoadingScreen from "./components/LoadingScreen";
import ErrorBoundary from './components/ErrorBoundary';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const globalTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#311b92',
    },
    secondary: {
      main: '#ffca28',
    },
  },
  typography: {
    fontFamily: '"Mulish", sans-serif;'
  }
});

function App() {

  const { dispatch } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  // Stripe loaded with publishable key
  const promise = loadStripe(config.STRIPE_KEY);

  const elementOptions = {
      fonts: [
          {
              cssSrc: "https://fonts.googleapis.com/css2?family=Mulish&display=swap"
          }
      ]
  };

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
          <Elements stripe={promise} options={elementOptions}>
            <div style={{overflow: "hidden"}} className="App">
              <Grid container direction="column">
                <Grid item>
                  <Header />
                </Grid>
                <Grid item container>
                  <Grid item xs={1} sm={2}></Grid>
                  <Grid item container xs={10} sm={8}>
                    <ErrorBoundary>
                      <Routes />
                    </ErrorBoundary>
                  </Grid>
                  <Grid item xs={1} sm={2}></Grid>
                </Grid>
              </Grid>
            </div>
          </Elements>
        </ThemeProvider>
      )}
    </>
  );
}

export default App;