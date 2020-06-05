import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

function LoginSnackbar(props) {

  return (
    <Snackbar open={props.open} autoHideDuration={6000} onClose={props.setOpen(false)}>
      <Alert severity="success" onClose={props.setOpen(false)}>
        Login Successful!
      </Alert>
    </Snackbar>
  );
}

export default LoginSnackbar;