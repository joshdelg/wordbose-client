import React, { useState, useEffect } from 'react';
import { Button, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { API } from "aws-amplify";
import NewCardDialog from './NewCardDialog';
import CustomBreadcrumbs from './CustomBreadcrumbs';
import { onError } from '../libs/errorLib';

const useStyles = makeStyles({
    paperContainer: {
        width: '100%'
    },
    paper: {
        margin: "1.5rem 0 0.5rem 0"
    }
});

function BillingDashboard(props) {
    const [open, setOpen] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);

    const classes = useStyles();

    useEffect(() => {
        updatePaymentMethods();
    }, [])

    const updatePaymentMethods = async() => {
        try {
            const response = await API.post("transcripts", "/listPaymentMethods");
            const paymentMethods = response.paymentMethods;
            setPaymentMethods(paymentMethods);
        } catch (e) {
            onError(e);
            alert("Error fetching user payment methods. Please reload.");
        }
    }

    const handleAddNewPayment = () => {
        setOpen(true);
    }

    return (
        <div className={classes.paperContainer}>
            <CustomBreadcrumbs steps={[{url: "/", text: "Wordbose"}]} final="Billing Dashboard" />
            <Typography variant="h2">Billing Dashboard</Typography>
            <Typography variant="h5">Payment Methods</Typography>
            <TableContainer className={classes.paper} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Brand</TableCell>
                            <TableCell>Number</TableCell>
                            <TableCell>Zip Code</TableCell>
                            <TableCell>Expiration</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                        paymentMethods.length == 0
                        ? "No Payment Methods Detected"
                        : paymentMethods.map((method) => (
                            <TableRow key={method.id}>
                                <TableCell>{method.card.brand.toUpperCase()}</TableCell>
                                <TableCell>{`**** **** **** ${method.card.last4}`}</TableCell>
                                <TableCell>{method.billing_details.address.postal_code}</TableCell>
                                <TableCell>{`${method.card.exp_month}/${method.card.exp_year % 100}`}</TableCell>
                            </TableRow>
                        ))
                    }
                    </TableBody>
                </Table>
            </TableContainer>
            <Button color="primary" variant="contained" onClick={handleAddNewPayment}>Add New Payment Method</Button>
            <NewCardDialog isOpen={open} handleClose={() => setOpen(false)} updatePaymentMethods={updatePaymentMethods} />
        </div>
    );
}

export default BillingDashboard;