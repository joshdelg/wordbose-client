import React, { useState } from "react";
import { TextField, Button, makeStyles } from "@material-ui/core";
import { Auth } from "aws-amplify";
import CustomBreadcrumbs from "./CustomBreadcrumbs";

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
  }
});

function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);

  const classes = useStyles();

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log(email, password);

    try {
      const user = await Auth.signUp({username: email, password: password});
      console.log(user);
      alert("Sign Up Successful");
    } catch (e) {
      alert(e.message);
    }


    // Move to confirmation stage
    setStep(2);
  };

  const submitCode = async (e) => {
    e.preventDefault();

    console.log(email, code);
    try {
      await Auth.confirmSignUp(email, code);
      alert("Confirmation Successful");
    } catch (e) {
      alert(e.message);
    }
  };

  const renderSignInForm = () => {
    return (
      <form className={classes.flexForm}>
        <TextField className={classes.formItem} label="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <TextField className={classes.formItem} label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <Button className={classes.formItem} variant="contained" color="primary" onClick={onSubmit}>Submit</Button>
      </form>
    );
  };

  const renderConfirmationForm = () => {
    return (
      <form className={classes.flexForm}>
        <TextField className={classes.formItem} label="Confirmation Code" value={code} onChange={(e) => setCode(e.target.value)}/>
        <Button className={classes.formItem} variant="contained" color="primary" onClick={submitCode}>Submit Code</Button>
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