import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import './Header.css';

function Header() {

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className="brand">Wordbose</Typography>
        <Button className="loginButton" component={Link} to="/login" color="inherit">Log In</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;