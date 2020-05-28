import React, { useState, useContext } from "react";
import { TextField, Button } from "@material-ui/core";
import "./Login.css";

import { Auth } from "aws-amplify";
import { AuthContext } from "../contexts/AuthContext";

function Login() {

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const user = await Auth.signIn(email, password);
      alert("Signed In!");
      setIsLoading(false);
      dispatch({type: 'LOG_IN'});
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="formContainer">
      <form className="loginForm" onSubmit={handleSubmit}>
          <TextField className="formItem" label="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <br />
          <TextField type="password" className="formItem" label="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <br />
          <Button disabled={isLoading} className="formItem" variant="contained" color="primary" type="submit">Submit</Button>
      </form>
    </div>
  );

}

export default Login;