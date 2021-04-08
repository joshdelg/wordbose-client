import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, useTheme, makeStyles, Paper, Typography, useMediaQuery, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
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

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedCard, setSelectedCard] = useState("newCard");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [paymentId, setPaymentId] = useState("");
    const [fetchAttempts, setFetchAttempts] = useState(0);
    const [open, setOpen] = useState(false);

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
            setPaymentId(response.paymentId);
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

    const fetchPaymentMethods = async() => {
        try {
            const response = await API.post("transcripts", "/listPaymentMethods");
            setPaymentMethods(response.paymentMethods);
        } catch(e) {
            alert("Error fetching payment methods :(");
        }
    };

    // Generate payment intent on load
    useEffect(() => {
        fetchPaymentMethods();
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
            const paymentMethod = (selectedCard === "newCard") ? {card: elements.getElement(CardElement)} : selectedCard;

            const payload = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod
            });

            if(payload.error) {
                alert("There was an error processing your payment, please try again. Your card was not charged.");
                fetchIntent()
                setProcessing(false);
            } else {
                alert("Your file is now being uploaded. You will be redirected when this is complete.");
                console.log("ID at upload is", paymentId);
                try {
                    // Upload files from new transcript form
                    await props.uploadFile();

                    // Redirect to home page
                    history.push("/");

                } catch (e) {
                    onError(e);
                    setProcessing(false);
                    setOpen(true);
                }
            }
        }
    }

    const handleCardChange = (event) => {
        setSelectedCard(event.target.value);
    }

    const handleRefund = async () => {
        try {
            setProcessing(true);
            console.log("refunded client secret", paymentId);
            const refund = await API.post("transcripts", "/refund", {
                body: {
                    paymentId: paymentId
                }
            });

            setOpen(false);
            alert("Card successfully refunded!");
        } catch(e) {
            onError(e);
            setOpen(false);
            alert("Card could not be refunded. Please email contact@wordbose.com with the date, time, and email used for your purchase for a manual refund.");
        }
        setProcessing(false);
        history.push("/");
    }

    const handleCloseRefund = () => {
        setOpen(false);
        history.push("/");
    }

    return (
        <>
            <Paper className={classes.formPaper}>
                <form className={classes.formContainer} onSubmit={handleSubmit}>
                    <Typography variant="h4">{`Price: ${calculatePrice(props.fileDuration)}`}</Typography>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Select Card:</FormLabel>
                        <RadioGroup value={selectedCard} onChange={handleCardChange}>
                            {
                                paymentMethods.map((method) => (
                                    <FormControlLabel
                                        key={method.id}
                                        value={method.id}
                                        control={<Radio />}
                                        label={`${method.card.brand.charAt(0).toUpperCase() + method.card.brand.substr(1)} ending in ${method.card.last4}`} />
                                ))
                            }
                            <FormControlLabel value="newCard" control={<Radio />} label="New Card" />
                        </RadioGroup>
                    </FormControl>
                    {error && <Typography variant="subtitle1" color="secondary">{error}</Typography>}
                    {selectedCard === "newCard" && <CardElement className={classes.cardContainer} options={cardStyle} onChange={handleChange} />}
                    <Button className={classes.submitButton} type="submit" variant="contained" color="primary" disabled={processing || (error !== "")}>
                        Upload and Pay
                    </Button>
                </form>
            </Paper>
            <Dialog open={open} onClose={() => setOpen(false)} disableBackdropClick disableEscapeKeyDown>
                <DialogTitle>Refund Payment?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your file upload failed, please try again. Would you like to refund your payment?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" onClick={handleCloseRefund} disabled={processing}>No</Button>
                    <Button color="primary" variant="contained" onClick={handleRefund} disabled={processing}>Yes</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default PaymentForm;