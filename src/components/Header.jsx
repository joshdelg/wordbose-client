import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import './Header.css';
import { AuthContext } from "../contexts/AuthContext";

function Header() {

  const { authData } = useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography className="brand" variant="h6" component={Link} to="/">Wordbose</Typography>
        {
          (authData.isAuthenticated)
          ? <Typography variant="subtitle1">Hello, User!</Typography>
          : <Button className="loginButton"component={Link} to="/login" color="inherit">Log In</Button> 
        }
      </Toolbar>
    </AppBar>
  );
}

export default Header;