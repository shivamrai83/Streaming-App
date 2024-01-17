const fs = require('fs').promises;
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

const {SCOPES, TOKEN_PATH, CREDENTIALS_PATH} = require('../utils/constants');

// Get OAuthClient with refresh token
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    console.log('Error inside loadSavedCredentialsIfExist:->', err);
    return null;
  }
}

//Get Google OAuthClient with Account Creds
async function getGoogleSheetClient(path) {
  try {
    const credentialsContent = await fs.readFile(path, 'utf-8');
    const credentials = JSON.parse(credentialsContent);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });
    client = await auth.getClient();
    return authClient;  
  } catch (error) {
    console.log('Error inside getGoogleSheetClient:->', err);
    return error;
  }
 
}

//list all the sheet counts filled
async function getRowsCount(auth){
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'Sheet1',
      })
      const values = result.data.values ? result.data.values : [];
      const nonEmptyRows = values.filter(row => row.some(cell => cell !== null && cell !== ''));
  
      const nextRow = nonEmptyRows.length + 1;
      return nextRow;
  } catch (error) {
    console.log('Error inside getRowsCount:->', err);
    return error;
  }
 
}

// Writes data to the Sheet
async function writeData(data, i, auth) {

  const sheets = google.sheets({ version: 'v4', auth });
  let arr = [];
  for (const obj of data){
    arr.push([obj.name, obj.age, obj.email])
  }
  const resource = {
    values: arr,
  };

  sheets.spreadsheets.values.append(
    {
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `A1`,
      valueInputOption: 'RAW',
      resource: resource,
    },
    (err, result) => {
      if (err) {
        // Handle error
        console.log('Error inside WriteData:->', err);
      } else {
        console.log(
          '%d cells updated on range: %s',
          result.data.updates.updatedCells,
          result.data.updates.updatedRange
        );
        return result.data.updates.updatedCells;
      }
    }
  );

}

module.exports = {
  writeData,
  loadSavedCredentialsIfExist,
  getRowsCount,
  getGoogleSheetClient
}