import * as Sentry from "@sentry/react";
//import { Integrations } from "@sentry/tracing";

const isLocal = process.env.NODE_ENV === "development";

export function initSentry() {
    if(isLocal) {
        return;
    }

    Sentry.init({
        dsn: "https://cf0934f3ed5448d0a59acaa5a0d65e18@o438643.ingest.sentry.io/5403726",
        /*integrations: [
            new Integrations.BrowserTracing(),
        ],
        tracesSampleRate: 1.0,*/
    });
}

export function onError(error) {
    let errorInfo = {};
    let message = error.toString();

    // Auth errors do not create Error objects, just objects with several properties
    if(!(error instanceof Error) && error.message) {
        errorInfo = error;
        message = error.message;
        error = new Error(message);
    // API errors have a config with the requested url
    } else if(error.config && error.config.url) {
        errorInfo.url = error.config.url;
    }

    logError(error, errorInfo);
}

export function logError(error, errorInfo = null) {
    if(isLocal) {
        return;
    }

    Sentry.withScope((scope) => {
        errorInfo && scope.setExtras(errorInfo);
        Sentry.captureException(error);
    });
}