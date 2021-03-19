import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import NewCardDialog from './NewCardDialog';

function BillingDashboard(props) {

    const [open, setOpen] = useState(false);

    const handleAddNewPayment = () => {

        // Make API request to /createSetupIntent

        setOpen(true);
    }

    return (
        <>
            <Button color="primary" variant="contained" onClick={handleAddNewPayment}>Add New Payment Method</Button>
            <NewCardDialog isOpen={open} handleClose={() => setOpen(false)} />
        </>
    );
}

export default BillingDashboard;