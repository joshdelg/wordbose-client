import React, { useState, useContext } from "react";
import { TextField, Button, makeStyles } from "@material-ui/core";

import { Auth } from "aws-amplify";
import { AuthContext } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  formContainer: {
    width: "100%",
    padding: "10%",
    margin: "auto"
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    maxWidth: "500px"
  },
  formItem: {
    margin: "10px"
  }
});

function Login() {

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { dispatch } = useContext(AuthContext);

  const classes = useStyles();

  let history = useHistory();

  const attemptSignIn = async () => {

    setIsLoading(true);

    try {
      await Auth.signIn(email, password);
      alert("Signed In!");
      dispatch({type: 'LOG_IN'});
      history.push("/");
    } catch (err) {
      alert(err.message);
    }

    setIsLoading(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    attemptSignIn();
  }

  return (
    <div className={classes.formContainer}>
      <form className={classes.loginForm} onSubmit={handleSubmit}>
          <TextField className={classes.formItem} label="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <TextField type="password" className={classes.formItem} label="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <Button disabled={isLoading} className={classes.formItem} variant="contained" color="primary" type="submit">Submit</Button>
      </form>
    </div>
  );

}

export default Login;