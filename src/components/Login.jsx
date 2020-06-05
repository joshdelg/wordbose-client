import React, { useState, useContext } from "react";
import { TextField, Button, makeStyles, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Auth } from "aws-amplify";
import { AuthContext } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
//import LoginSnackbar from "./LoginSnackbar";

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
  const [open, setOpen] = useState(false);
  const [loginState, setLoginState] = useState(null);

  const { dispatch } = useContext(AuthContext);

  const classes = useStyles();

  let history = useHistory();

  const attemptSignIn = async () => {

    setIsLoading(true);

    try {
      await Auth.signIn(email, password);
      //alert("Signed In!");
      dispatch({type: 'LOG_IN'});
      setLoginState(true);
    } catch (err) {
      setLoginState(err.message);
    }

    setOpen(true);
    setIsLoading(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    attemptSignIn();
  }

  const handleClose = () => {
    setOpen(false);
    if(loginState === true) history.push("/");
  }

  return (
    <>
      <div className={classes.formContainer}>
        <form className={classes.loginForm} onSubmit={handleSubmit}>
            <TextField className={classes.formItem} label="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <TextField type="password" className={classes.formItem} label="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <Button disabled={isLoading} className={classes.formItem} variant="contained" color="primary" type="submit">Submit</Button>
        </form>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity={loginState === true ? "success" : "error"} onClose={handleClose}>
          {loginState === true? "Login Successful!" : loginState}
        </Alert>
      </Snackbar>
    </>
  );

}

export default Login;