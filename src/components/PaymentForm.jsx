import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, useTheme, makeStyles, Paper, Typography, useMediaQuery } from "@material-ui/core";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";

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
        const mins = Math.round(fileDuration / 60);
        const chargedMins = mins - 15;
        const cents = Math.max(chargedMins * 10, 50);
        return cents / 100;
    }
    
    const fetchIntent = async() => {
        console.log("Fetching payment intent...");

        try {
            const secs = props.fileDuration;
            const response = await API.post("transcripts", "/billing", {
                body: {
                    duration: secs
                }
            });
            console.log("Successfully fetched intent", response.clientSecret);
            setClientSecret(response.clientSecret);
            setError("");
        } catch (err) {
            setError("Error creating payment intent. Please reload and try again.")
            alert("Error creating payment intent. Please reload and try again.");
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
        setProcessing(true);
        console.log("Payment form submitted");

        // Confirm payment
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: event.target.name.value
            }
        });

        if(payload.error) {
            alert("There was an error processing your payment, please try again.");
            fetchIntent()
            setProcessing(false);
        } else {
            alert("Your file is now being uploaded. You will be redirected when this is complete");

            try {
                // Upload files from new transcript form
                await props.uploadFile();

                // Redirect to home page
                history.push("/");
                
            } catch (err) {
                alert(err);
                fetchIntent();
                setProcessing(false);
            }
        }
    }

    return (
        <Paper className={classes.formPaper}>
            <form className={classes.formContainer} onSubmit={handleSubmit}>
                <Typography variant="h4">{`Fee: $${calculatePrice(props.fileDuration)}`}</Typography>
                {error && <Typography variant="subtitle1" color="secondary">{error}</Typography>}
                <CardElement className={classes.cardContainer} options={cardStyle} onChange={handleChange} />
                <Button className={classes.submitButton} type="submit" variant="contained" color="primary" disabled={processing || error}>
                    Upload and Pay
                </Button>
            </form>
        </Paper>
    );
}

export default PaymentForm;