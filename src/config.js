const dev = {
  STRIPE_KEY: "pk_test_51HFB3hDCRuX8vF0ZAk8LZZxDyJdaqwGbSS0ugMcIIvAgoZxPu47YN3kOuKgP1ZfFkK7GKt3AbZIHT28oA5HbFocX00HiejHI65",
  s3: {
    REGION: "us-west-2",
    BUCKET: "wordbose-api-dev-uploadsbucket-8oezia2yipgi"
  },
  apiGateway: {
    REGION: "us-west-2",
    URL: "https://gdrxlxrmy1.execute-api.us-west-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-west-2",
    USER_POOL_ID: "us-west-2_QtOUvQEWA",
    APP_CLIENT_ID: "7ph9it37n76jjga3qcn6e8lkqb",
    IDENTITY_POOL_ID: "us-west-2:5ff59f07-fbf1-47f5-8f68-10d238126a81"
  },
  DURATION_FREE_THRESHOLD: (15 * 60),
};

const prod = {
  STRIPE_KEY: "pk_live_51HFB3hDCRuX8vF0ZPSKBVSD451aWfzKwNfMl3VytDgrqJXTwFW1VRTIOYtFRZPU9iiJTNXFUlxe7iWZ7LvpvPa8X003hkYUhIV",
  s3: {
    REGION: "us-west-2",
    BUCKET: "wordbose-api-prod-uploadsbucket-beb5fyvbkc3g"
  },
  apiGateway: {
    REGION: "us-west-2",
    URL: "https://o5qv2uh2jf.execute-api.us-west-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-west-2",
    USER_POOL_ID: "us-west-2_PQVNZPViH",
    APP_CLIENT_ID: "61q2kor0tctsolh175ujsture1",
    IDENTITY_POOL_ID: "us-west-2:52014f31-1a2f-4762-8470-c07b3fb84d91"
  },
  DURATION_FREE_THRESHOLD: (15 * 60), // 15 mins
};

const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Common config values
  TRANSCRIPT_CARD_TRUNCATION: 160,
  MAX_FILE_DURATION: (4 * 60 * 60), // 4 Hours
  ...config
};