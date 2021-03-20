import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, useTheme, useMediaQuery } from "@material-ui/core";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { API } from "aws-amplify";

function NewCardDialog(props) {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const [loading, setLoading] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

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

    const handleAddCard = async() => {
        if(!stripe || !elements) {
            return;
        }

        try {
            setLoading(true);
            const response = await API.post("transcripts", "/createSetupIntent");

            const result = await stripe.confirmCardSetup(response.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                }
            });

            if(result.error) {
                alert("There was a problem with stripe :(");
            } else {
                alert("Everything worked!");
                console.log(result.setupIntent.payment_method);
            }
        } catch(e) {
            alert("Something failed with the API request l boa :(");
        }
        setLoading(false);
        props.handleClose();
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
                <Button onClick={props.handleClose} color="primary" variant="contained" disabled={loading}>Cancel</Button>
                <Button onClick={handleAddCard} color="primary" variant="contained" disabled={!stripe || loading}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default NewCardDialog;