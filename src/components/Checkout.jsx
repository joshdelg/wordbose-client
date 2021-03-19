//!!! DEPRECATED DO NOT USE THIS ONE LOL
//!!! DEPRECATED DO NOT USE THIS ONE LOL
//!!! DEPRECATED DO NOT USE THIS ONE LOL
//!!! DEPRECATED DO NOT USE THIS ONE LOL

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// Stripe loaded with publishable key
const promise = loadStripe('pk_test_51HFB3hDCRuX8vF0ZAk8LZZxDyJdaqwGbSS0ugMcIIvAgoZxPu47YN3kOuKgP1ZfFkK7GKt3AbZIHT28oA5HbFocX00HiejHI65');

function Checkout(props) {
    return (
        <Elements stripe={promise}>
            <CheckoutForm validateForm={props.validateForm} upload={props.upload} fileDuration={props.fileDuration} />
        </Elements>
    )
}

export default Checkout;