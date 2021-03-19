import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, useTheme, makeStyles, Paper, Typography, useMediaQuery } from "@material-ui/core";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";
import config from "../config";
import { onError } from "../libs/errorLib";

const useStyles = makeStyles({
    formPaper: {
        margin: "64px 16px",
        padding: "32px"
    },
    formContainer: {
        display: "flex",
        flexDirection: "column",
        height: "100%"
    },
    cardContainer: {
        width: "100%",
        margin: "16px 0"
    },
    submitButton: {
        maxWidth: "350px",
        margin: "32px auto 16px auto"
    }
});

function PaymentForm(props) {

    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [fetchAttempts, setFetchAttempts] = useState(0);

    const stripe = useStripe();
    const elements = useElements();

    let history = useHistory();

    const theme = useTheme();
    const classes = useStyles();
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

    const calculatePrice = (fileDuration) => {
        const dollarDisplay = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });

        const mins = Math.floor(fileDuration / 60);
        const chargedMins = mins - 15;
        const cents = Math.max(chargedMins * 10, 50);
        return dollarDisplay.format(cents / 100);
    }

    const fetchIntent = async() => {
        setFetchAttempts(fetchAttempts + 1);

        try {
            const secs = props.fileDuration;
            const response = await API.post("transcripts", "/billing", {
                body: {
                    duration: secs
                }
            });
            setClientSecret(response.clientSecret);
            setError("");
            setFetchAttempts(0);
        } catch (err) {
            if(fetchAttempts < 2) {
                fetchIntent();
            } else {
                setError("Error creating payment intent. Please reload and try again.")
                onError(err);
                alert("Error creating payment intent. Please reload and try again.");
            }
        }
    };

    // Generate payment intent on load
    useEffect(() => {
        fetchIntent();
    }, []);

    const handleChange = (event) => {
        if(event.empty) {
            setError("Your card number is blank.");
        } else if(event.error) {
            setError(event.error.message);
        } else {
            setError("");
        }
    }

    const handleSubmit = async(event) => {
        event.preventDefault();

        if(!processing && error === "") {
            setProcessing(true);

            // Confirm payment
            console.log(event);
            const payload = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    //billing_details: event.target.name.value
                },
                setup_future_usage: "on_session"
            });

            if(payload.error) {
                alert("There was an error processing your payment, please try again. Your card was not charged.");
                fetchIntent()
                setProcessing(false);
            } else {
                alert("Your file is now being uploaded. You will be redirected when this is complete.");

                try {
                    // Upload files from new transcript form
                    await props.uploadFile();

                    // Redirect to home page
                    history.push("/");

                } catch (e) {
                    onError(e);
                    fetchIntent();
                    alert("There was an error uploading your file. Please try again.");
                    setProcessing(false);
                }
            }
        }
    }

    return (
        <Paper className={classes.formPaper}>
            <form className={classes.formContainer} onSubmit={handleSubmit}>
                <Typography variant="h4">{`Price: ${calculatePrice(props.fileDuration)}`}</Typography>
                {error && <Typography variant="subtitle1" color="secondary">{error}</Typography>}
                <CardElement className={classes.cardContainer} options={cardStyle} onChange={handleChange} />
                <Button className={classes.submitButton} type="submit" variant="contained" color="primary" disabled={processing || (error !== "")}>
                    Upload and Pay
                </Button>
            </form>
        </Paper>
    );
}

export default PaymentForm;