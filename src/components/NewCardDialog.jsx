import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, useTheme, useMediaQuery } from "@material-ui/core";
import { CardElement } from "@stripe/react-stripe-js";
import React, { useState } from "react";

function NewCardDialog(props) {

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const cardStyle = {
        style: {
            base: {
                color: theme.palette.primary.main,
                fontFamily: '"Mulish", sans-serif',
                fontSmoothing: "antialiased",
                fontSize: (isSmall) ? "16px" : "24px",
                "::placeholder": {
                    color: "#32325d"
                }
            },
            invalid: {
                color: theme.palette.secondary.main,
                iconColor: theme.palette.secondary.main
            }
        }
    };

    return (
        <Dialog open={props.isOpen} onClose={props.handleClose} fullWidth={true}>
            <DialogTitle>Add New Card</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Card Details
                </DialogContentText>
                <CardElement options={cardStyle} />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary" variant="contained">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default NewCardDialog;