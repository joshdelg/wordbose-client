import React, { useState } from "react";
import { Typography, TextField, Input, makeStyles, Button } from "@material-ui/core";
import CustomBreadcrumbs from "./CustomBreadcrumbs";
import config from "../config";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import { API, Storage, Auth } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";

const useStyles = makeStyles({
    container: {
        width: "100%"
    },
    heading: {
        margin: "16px 0px"
    },
    transcriptForm: {
        margin: "16px auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center"
    },
    transcriptFormItem: {
        margin: "16px 0",
        maxWidth: "450px"
    },
    transcriptSubmitButton: {
        margin: "24px 0"
    }
});

function NewTranscript(props) {

    const [step, setStep] = useState(1);

    const [transcriptName, setTranscriptName] = useState("");
    const [file, setFile] = useState("");
    const [numSpeakers, setNumSpeakers] = useState(1);
    const [fileDuration, setFileDuration] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [requiresPayment, setRequiresPayment] = useState(false);

    let history = useHistory();

    const classes = useStyles();

    const handleChangeTranscriptName = (e) => {
        setTranscriptName(e.target.value);
    }

    const handleFileSelect = (e) => {
        let reset = false;

        // If a file was selected at all
        if(e.target.files[0]) {
            const currentFile = e.target.files[0];

            // Check file type
            if(currentFile.type.startsWith("audio/") || currentFile.type.startsWith("video/")) {
                setFile(currentFile);

                // Automatically set transcript name
                if(!transcriptName) setTranscriptName(currentFile.name);

                // Determine audio duration
                const player = document.createElement(currentFile.type.substring(0, currentFile.type.indexOf("/")));
                player.preload = 'metadata';
                player.onloadedmetadata = () => {
                    setFileDuration(player.duration);
                    
                    // Ensure file is under 4 hours, and set require payment if over threshold
                    if(player.duration >= config.MAX_FILE_DURATION) {
                        reset = true;
                        alert("Please select a file shorter than " + (Math.round(config.MAX_FILE_DURATION / (60 * 60))) + " hours");
                    } else {
                        if(player.duration >= config.DURATION_FREE_THRESHOLD) {
                            setRequiresPayment(true);
                        } else {
                            setRequiresPayment(false);
                        }   
                    }
                }
                player.src = URL.createObjectURL(e.target.files[0]);
            } else {
                reset = true;
            }
        } else {
            reset = true;
        }

        if(reset) {
            setFile("");
            e.target.value = "";
            setFileDuration(0);
        }
    }

    const handleChangeNumSpeakers = (e) => {
        const num = e.target.value;
        if(num < 1) {
            setNumSpeakers(1);
        } else if(num > 10) {
            setNumSpeakers(10);
        } else {
            setNumSpeakers(num);
        }
    }

    const validateForm = () => {
        if(transcriptName !== "" && file && fileDuration < config.MAX_FILE_DURATION) {
            return true;
        } else {
            return false;
        }
    }

    const uploadFile = () => {
        return new Promise(async(resolve, reject) => {
            setProcessing(true);

            // Generate transciptId client side
            const transcriptId = uuidv4();
            const extension = file.name.substring(file.name.lastIndexOf('.'));
            
            try {
                const user = await Auth.currentAuthenticatedUser();

                // Call create route
                const newTranscript = await API.post("transcripts", '/transcript', {
                    body: {
                        transcriptId: transcriptId,
                        transcriptName: transcriptName,
                        date: moment(),
                        fileName: file.name,
                        email: user.attributes.email,
                        numSpeakers: numSpeakers,
                        fileDuration: fileDuration,
                        isPaid: requiresPayment
                    }
                });
                
                // Store attached file in S3 with name of transriptId
                // ! Filename: {transcriptId}.{ext} is necessary for backend
                const stored = await Storage.vault.put(transcriptId + extension, file, {
                    contentType: file.type
                });

                resolve();
            } catch (e) {
                reject(e);
            }

            setProcessing(false);
        });
    };

    const handleTranscriptFormSubmit = async(e) => {
        e.preventDefault();

        if(validateForm()) {
            console.log("Transcript form submitted and valid");

            if(requiresPayment) {
                setStep(2);
            } else {
                // Handle uploading to S3
                console.log("Uploading to S3")
                
                try {
                    alert("Your file is now being uploaded. You will be redirected when this is complete");
                    await uploadFile();
                    // Redirect to home page
                    history.push("/");
                } catch (err) {
                    onError(err);
                    alert("There was an error uploading your files. Please try again.");
                }
            }
        } else {
            console.log("Form submitted but invalid :(")
        }
    }

    const calculatePrice = () => {

        const dollarDisplay = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });

        const mins = Math.floor(fileDuration / 60);
        const chargedMins = mins - 15;
        const cents = Math.max(chargedMins * 10, 50);
        return dollarDisplay.format((cents / 100));
    }

    const renderTranscriptForm = () => {
        return (
          <form className={classes.transcriptForm} onSubmit={handleTranscriptFormSubmit}>
            <TextField
              className={classes.transcriptFormItem}
              fullWidth
              label="Transcript Name"
              value={transcriptName}
              onChange={handleChangeTranscriptName}
            />
            <Input
              className={classes.transcriptFormItem}
              fullWidth
              type="file"
              onChange={handleFileSelect}
            />
            <TextField
              className={classes.transcriptFormItem}
              fullWidth
              label="Maximum Number of Speakers"
              type="number"
              value={numSpeakers}
              onChange={handleChangeNumSpeakers}
            />
            {(fileDuration !== 0) && 
                <>
                    <Typography variant="body1">{`Duration: ${Math.floor(fileDuration / 60)} minutes ${Math.round(fileDuration % 60)} seconds`}</Typography>
                    <Typography variant="body1">{`Price: ${(fileDuration / 60 < 15) ? "Free" : calculatePrice()}`}</Typography>
                </>
            }
            <Button className={classes.transcriptSubmitButton} type="submit" variant="contained" color="primary" disabled={!validateForm() || processing}>
                {(!requiresPayment) ? "Upload" : "Proceed to checkout"}
            </Button>
          </form>
        );
    }

    const renderPaymentForm = () => {
        // Stripe loaded with publishable key
        const promise = loadStripe(config.STRIPE_KEY);
        
        const elementOptions = {
            fonts: [
                {
                    cssSrc: "https://fonts.googleapis.com/css2?family=Mulish&display=swap"
                }
            ]
        };

        return (
            <div>
                <Elements stripe={promise} options={elementOptions}>
                    <PaymentForm fileDuration={fileDuration} uploadFile={uploadFile} />
                </Elements>
            </div>
        );
    }

    return (
        <div className={classes.container}>
            <CustomBreadcrumbs steps={[{url: "/", text: "Wordbose"}]} final="New Transcript" />
            <Typography className={classes.heading} variant="h2">New Transcript</Typography>
            {(step == 1) ? renderTranscriptForm() : renderPaymentForm()}
        </div>
    );
}

export default NewTranscript;