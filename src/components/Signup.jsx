import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { Auth } from "aws-amplify";

function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

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

  return (
    <>
      <form>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <Button onClick={onSubmit}>Submit</Button>
      </form>
      <form>
        <TextField label="Confirmation Code" value={code} onChange={(e) => setCode(e.target.value)}/>
        <Button onClick={submitCode}>Submit Code</Button>
      </form>
    </>
  );
}

export default Signup;