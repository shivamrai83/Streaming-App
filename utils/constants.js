const path = require('path');
const process = require('process');

const TOKEN_PATH = path.join(process.cwd(), 'Credentials/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'Credentials/credentials.json');
const SERVICE_CREDENTIALS_PATH = path.join(process.cwd(), 'Credentials/service_credentials.json');

const PORT = 3000;

const CREDENTIALS = {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
};

const SESSION_OPTIONS = {
  secret: 'stream_app_secret_key', // Make sure to keep this secret and secure in production
  resave: false,
  saveUninitialized: true
};
const REDIS_CONFIG = {  redis: 'redis://localhost:6379' };
const PASSPORT_AUTH_SCOPES = { scope: ['profile', 'email'] };
const ADD_QUEUE_OPTIONS = { removeOnComplete: true, removeOnFail: true };
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

module.exports = {
    PORT,
    CREDENTIALS,
    SCOPES,
    TOKEN_PATH,
    CREDENTIALS_PATH,
    SESSION_OPTIONS,
    REDIS_CONFIG,
    PASSPORT_AUTH_SCOPES,
    ADD_QUEUE_OPTIONS,
    SERVICE_CREDENTIALS_PATH
};