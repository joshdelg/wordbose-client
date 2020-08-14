import React, { useState, useContext } from "react";
import { TextField, Button, makeStyles, Typography, Link } from "@material-ui/core";
import { Auth, API } from "aws-amplify";
import CustomBreadcrumbs from "./CustomBreadcrumbs";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const useStyles = makeStyles({
  formContainer: {
    width: "100%",
    padding: "10%",
    margin: "auto"
  },
  flexForm: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    maxWidth: "500px"
  },
  formItem: {
    margin: "0.75em",
    width: "100%"
  },
  link: {
    //margin: "0 0.5em"
  }
});

function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);

  const classes = useStyles();
  let history = useHistory();

  const { dispatch } = useContext(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await Auth.signUp({username: email, password: password});
      alert("Sign Up Successful");
      // Move to confirmation stage
      setStep(2);
    } catch (e) {
      if(e.code == "UsernameExistsException") {
        // Move to confirmation stage
        setStep(2);
        alert('An account already exists with this email. Try logging in or requesting another confirmation code.');
      } else {
        alert(e.message);
      }
    }
  };

  const resendCode = async() => {
    await Auth.resendSignUp(email);
    alert('Confirmation code resent');
  };

  const submitCode = async (e) => {
    e.preventDefault();

    console.log(email, code);
    try {
      // Use confirmation code
      await Auth.confirmSignUp(email, code);

      // Sign in user
      await Auth.signIn(email, password);
      dispatch({type: 'LOG_IN'});

      // Make post request to update users table
      await API.post("transcripts", "/newUser", {
        body: {
          email: email
        }
      });

      alert("Confirmation Successful");

      // Redirect to home page
      history.push("/");
    } catch (e) {
      if(e.message == "User cannot be confirmed. Current status is CONFIRMED") {
        alert('User is already confirmed. Try logging in.');
        history.push("/login");
      } else {
        console.log(e);
        alert(e.message);
      }
    }
  };

  const renderSignInForm = () => {
    return (
      <form className={classes.flexForm}>
        <TextField className={classes.formItem} label="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <TextField className={classes.formItem} label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <Button className={classes.formItem} variant="contained" color="primary" onClick={onSubmit}>Submit</Button>
        <Typography className={classes.formItem} variant="body1">
          By creating an account you agree to Wordbose's&nbsp;
          <Link className={classes.link} variant="inherit" color="secondary" href="http://wordbose.com/terms.html" target="_blank" rel="noopener noreferrer">Terms and Conditions</Link>,&nbsp;
          <Link className={classes.link} variant="inherit" color="secondary" href="http://wordbose.com/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>, and&nbsp;
          <Link className={classes.link} variant="inherit" color="secondary" href="http://wordbose.com/refund.html" target="_blank" rel="noopener noreferrer">Refund Policy</Link>
        </Typography>
      </form>
    );
  };

  const renderConfirmationForm = () => {
    return (
      <form className={classes.flexForm}>
        <TextField className={classes.formItem} label="Confirmation Code" value={code} onChange={(e) => setCode(e.target.value)}/>
        <Button className={classes.formItem} variant="contained" color="primary" onClick={submitCode}>Submit Code</Button>
        <Button className={classes.formItem} variant="text" color="secondary" onClick={resendCode}>Resend Confimation Code</Button>
      </form>
    );
  };

  return (
    <>
      <CustomBreadcrumbs steps={[{url: "/", text: "Wordbose"}]} final="Signup" />
      <div className={classes.formContainer}>
        {step === 1 ? renderSignInForm() : renderConfirmationForm()}
      </div>
    </>
  );
}

export default Signup;