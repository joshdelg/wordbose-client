import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

function CustomSnackbar(props) {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={props.autoHideDuration || 6000}
      onClose={props.onClose}
    >
      <Alert severity={props.severity} onClose={props.onClose}>
        {props.message}
      </Alert>
    </Snackbar>
  );
}

export default CustomSnackbar;
