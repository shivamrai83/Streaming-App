const { google } = require('googleapis');

// Replace these values with your own
const CLIENT_ID = "349157039103-8mk1l8dqr0c63up4f3p09k189820g1qi.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/auth/google/callback";
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Get the authentication URL
const authUrl = auth.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Authorize this app by visiting this URL:', authUrl);

// After the user grants permission, exchange the authorization code for tokens
const code = 'authorization-code-from-user'; // Replace with the actual code obtained from the user
auth.getToken(code, (err, tokens) => {
  if (err) {
    return console.error('Error getting tokens:', err);
  }

  // Set the credentials for the authenticated client
  auth.setCredentials(tokens);

  // Now you can use the authenticated `auth` object to make API requests
  const sheets = google.sheets({ version: 'v4', auth });

  // Example: Retrieve sheet data
  sheets.spreadsheets.values.get({
    spreadsheetId: '1Oy7vwhEUDyVw6ND_nxKJBZ08sJWZA7j6JjKiEokr6uM',
    range: 'Sheet1',
  }, (err, res) => {
    if (err) {
      return console.error('The API returned an error:', err);
    }

    const rows = res.data.values;
    if (rows.length) {
      console.log('Sheet data:');
      rows.forEach(row => console.log(row.join('\t')));
    } else {
      console.log('No data found.');
    }
  });
});
