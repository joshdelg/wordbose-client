import React, { useState, useContext } from "react";
import { TextField, Button, makeStyles } from "@material-ui/core";
import { Auth } from "aws-amplify";
import { AuthContext } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import CustomSnackbar from "./CustomSnackbar";
import CustomBreadcrumbs from "./CustomBreadcrumbs";

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
    margin: "0.75em"
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
      dispatch({type: 'LOG_IN'});
      setLoginState(true);
      // TODO Temporary solution until login toasts fixed?
      setTimeout(() => history.push("/"), 1000);
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
      <CustomBreadcrumbs steps={[{url: "/", text: "Wordbose"}]} final="Login" />
      <div className={classes.formContainer}>
        <form className={classes.loginForm} onSubmit={handleSubmit}>
          <TextField
            className={classes.formItem}
            label="Email"
            helperText="Emails are not case sensitive"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
          />
          <TextField
            type="password"
            className={classes.formItem}
            label="Password"
            helperText="Passwords must contain upper and lowercase letters, a number, and a symbol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            disabled={isLoading}
            className={classes.formItem}
            variant="contained"
            color="primary"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </div>
      <CustomSnackbar
        open={open}
        onClose={handleClose}
        severity={loginState === true ? "success" : "error"}
        message={loginState === true ? "Login Successful!" : loginState}
      />
    </>
  );

}

export default Login;