import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@material-ui/core";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";

function PaymentForm(props) {

    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    
    const stripe = useStripe();
    const elements = useElements();

    let history = useHistory();

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
        } catch (err) {
            alert("Error creating payment intent. Please reload and try again.");
        }
    };

    // Generate payment intent on load
    useEffect(() => {
        fetchIntent();
    }, []);

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
      <form onSubmit={handleSubmit}>
        <CardElement />
        <Button type="submit" variant="contained" color="primary" disabled={processing}>
          Upload and Pay
        </Button>
      </form>
    );
}

export default PaymentForm;