const {google} = require('googleapis');
const fs = require('fs');
const readline = require('readline');

const creds = {
    client_id: '349157039103-8mk1l8dqr0c63up4f3p09k189820g1qi.apps.googleusercontent.com',
    client_secret: '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',
    redirect_uris: '/auth/google/callback'
}

function appendData(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    const spreadsheetId = '1Oy7vwhEUDyVw6ND_nxKJBZ08sJWZA7j6JjKiEokr6uM';
    const range = 'Sheet1!A1:C1';  // Update the range based on where you want to insert data
    const valueInputOption = 'RAW';
    const values = [
      ['Shivam RAi', '40', 'shivam@gmail.com'],  // Sample data to append
    ];
    
    const request = {
      spreadsheetId,
      range,
      valueInputOption,
      resource: { values },
    };
    
    sheets.spreadsheets.values.append(request, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('Data appended successfully:', result.data);
    });
  }
  

function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/spreadsheets']
    });
    console.log('Authorize this app by visiting this URL:', authUrl);
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        console.log('****token****RL***', token);
        oAuth2Client.setCredentials(token);
        fs.writeFileSync('token.json', JSON.stringify(token));
        callback(oAuth2Client);
      });
    });
  }
  

function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token
    fs.readFile('token.json', (err, token) => {
      if (err || token) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }


// Load client secrets from a file
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
  
//   // Authorize with credentials
 
// });
authorize(creds, appendData);