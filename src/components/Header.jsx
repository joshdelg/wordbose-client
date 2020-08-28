import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, makeStyles } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Auth } from "aws-amplify";
import { onError } from "../libs/errorLib";

const useStyles = makeStyles({
  brand: {
    flex: "1",
    color: "inherit",
    textDecoration: "none"
  }
});


function Header() {

  const { authData, dispatch } = useContext(AuthContext);
  const classes = useStyles();
  let history = useHistory();

  const renderUnauthButtons = () => {
    return (
      <>
        <Button color="inherit" component={Link} to="/signup">Sign Up</Button> 
        <Button color="inherit" component={Link} to="/login">Log In</Button> 
      </>
    )
  };

  const handleSignOut = async() => {
    try {
      await Auth.signOut();
      dispatch({type: 'SIGN_OUT'});
      history.push("/");

    } catch (e) {
      onError(e);
      alert("Error signing out. Please try again.");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography className={classes.brand} variant="h6" component={Link} to="/">Wordbose</Typography>
        {
          (authData.isAuthenticated)
          ? <Button color="inherit" onClick={handleSignOut}>Sign Out</Button> 
          : renderUnauthButtons()
        }
      </Toolbar>
    </AppBar>
  );
}

export default Header;