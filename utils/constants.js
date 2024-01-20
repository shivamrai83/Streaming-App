const path = require('path');
const process = require('process');

const CREDENTIALS = {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const TOKEN_PATH = path.join(process.cwd(), 'Credentials/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'Credentials/credentials.json');
const SERVICE_CREDENTIALS_PATH = path.join(process.cwd(), 'Credentials/service_credentials.json');


module.exports = {
    CREDENTIALS,
    SCOPES,
    TOKEN_PATH,
    CREDENTIALS_PATH,
    SERVICE_CREDENTIALS_PATH
};