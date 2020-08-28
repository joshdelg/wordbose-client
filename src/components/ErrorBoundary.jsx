import React from "react";
import { logError } from "../libs/errorLib";
import { Typography, withStyles } from "@material-ui/core";

const styles = {
    errorBoundary: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center"
    }
};

class ErrorBoundary extends React.Component {
    state = {
        hasError: false
    };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        logError(error, errorInfo);
    }

    render() {
        const { classes } = this.props;
        return this.state.hasError ? (
            <div className={classes.errorBoundary}>
                <Typography variant="h3">Sorry, there was an error loading this page.</Typography>
            </div>
        ) : (
            this.props.children
        );
    }
};

export default withStyles(styles)(ErrorBoundary);