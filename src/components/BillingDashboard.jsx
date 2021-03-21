import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { API } from "aws-amplify";
import NewCardDialog from './NewCardDialog';

function BillingDashboard(props) {

    const [open, setOpen] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);

    useEffect(() => {
        updatePaymentMethods();
    }, [])

    const updatePaymentMethods = async() => {
        const response = await API.post("transcripts", "/listPaymentMethods");
        const paymentMethods = response.paymentMethods;
        setPaymentMethods(paymentMethods);
        console.log(paymentMethods);
    }

    const handleAddNewPayment = () => {
        setOpen(true);
    }

    return (
        <>
            <div>
                {
                    paymentMethods.length == 0
                    ? "None :("
                    : paymentMethods.map((method) => (<p key={method.id}>{method.id}</p>))
                }
            </div>
            <Button color="primary" variant="contained" onClick={handleAddNewPayment}>Add New Payment Method</Button>
            <NewCardDialog isOpen={open} handleClose={() => setOpen(false)} updatePaymentMethods={updatePaymentMethods} />
        </>
    );
}

export default BillingDashboard;