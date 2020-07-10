export default {
  s3: {
    REGION: "us-west-2",
    BUCKET: "wordbose-file-upload-test"
  },
  apiGateway: {
    REGION: "us-west-2",
    URL: "https://z8u5chkmvc.execute-api.us-west-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-west-2",
    USER_POOL_ID: "us-west-2_nESb2pPau",
    APP_CLIENT_ID: "66hop45p3li7l19a35905o3ikt",
    IDENTITY_POOL_ID: "us-west-2:65b1d34e-0d44-4668-96f1-6a639fae1c6b"
  },
  TRANSCRIPT_CARD_TRUNCATION: 160,
  MAX_FILE_DURATION: 600
};