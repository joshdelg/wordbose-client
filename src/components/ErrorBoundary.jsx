import React from "react";
import { logError } from "../libs/errorLib";
import { Typography } from "@material-ui/core";

export default class ErrorBoundary extends React.Component {
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
        return this.state.hasError ? (
            <div className="error-boundary">
                <Typography variant="h1">Sorry, there was an error loading this page.</Typography>
            </div>
        ) : (
            this.props.children
        );
    }
}