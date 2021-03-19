//!!! DEPRECATED DO NOT USE THIS ONE LOL
//!!! DEPRECATED DO NOT USE THIS ONE LOL
//!!! DEPRECATED DO NOT USE THIS ONE LOL
//!!! DEPRECATED DO NOT USE THIS ONE LOL

import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { API } from "aws-amplify";
import { Button, Typography, makeStyles } from "@material-ui/core";
import { onError } from "../libs/errorLib";

const cardStyle = {
    style: {
        base: {
            color: "#311b92",
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#32325d"
            }
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
        }
    }
};

const useStyles = makeStyles({
    formContainer: {
        margin: "1em",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center"
    },
    cardElementStyle: {
        width: "100%",
        margin: "0.5em 0"
    },
    submitButton: {
        margin: "0.5em 0"
    }
});

function CheckoutForm(props) {

    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');

    const stripe = useStripe();
    const elements = useElements();

    const classes = useStyles();

    useEffect(() => {
        const fetchIntent = async() => {
            try {
                // Create a payment intent on page load
                const secs = props.fileDuration;
                const response = await API.post("transcripts", "/billing", {
                    body: {
                        duration: secs
                    }
                });
                setClientSecret(response.clientSecret);
            } catch (err) {
                onError(err);
                alert(err.message);
            }
        };

        fetchIntent();
    }, [props.fileDuration]);

    const handleChange = async(e) => {
        setDisabled(e.empty);
        setError(e.error ? e.error.message : "");
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setProcessing(true);
        console.log("Hello,m world2@");
        if(props.validateForm()) {
            console.log(e.target.name.value);
            console.log("Hello");
            const payload = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: e.target.name.value
                },
                setup_future_usage: "on_session"
            });

            if(payload.error) {
                setError(null);
                setProcessing(false);
            } else {

                alert("Success! Your files are now being uploaded");

                setError("");
                setProcessing(false);
                setSucceeded(true);

                // Upload files from new transcript dialog
                props.upload(e);
            }
        } else {
            setDisabled(true);
            setProcessing(false);
        }
    };

    return (
        <form className={classes.formContainer} id="payment-form" onSubmit={handleSubmit}>
            {error && <Typography variant="subtitle1">{error}</Typography>}
            <CardElement className={classes.cardElementStyle} id="card-element" options={cardStyle} onChange={handleChange}/>
            <Button className={classes.submitButton} type="submit" color="primary" variant="contained" disabled={processing || disabled || succeeded || error}>Pay and Upload</Button>
        </form>
    );
}

export default CheckoutForm;