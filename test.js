const {
    getAuthToken,
    getSpreadSheet,
    getSpreadSheetValues
  } = require('./googleSheetsService.js');
  
  const spreadsheetId = '1Oy7vwhEUDyVw6ND_nxKJBZ08sJWZA7j6JjKiEokr6uM';
  const sheetName = 'stream-app-sheet';
  
  async function testGetSpreadSheet() {
    try {
      const auth = await getAuthToken();
      const response = await getSpreadSheet({
        spreadsheetId,
        auth
      })
      console.log('output for getSpreadSheet', JSON.stringify(response.data, null, 2));
    } catch(error) {
      console.log(error.message, error.stack);
    }
  }
//   streaming-app-1704878428222
  async function testGetSpreadSheetValues() {
    try {
      const auth = await getAuthToken();
      const response = await getSpreadSheetValues({
        spreadsheetId,
        sheetName,
        auth
      })
      console.log('output for getSpreadSheetValues', JSON.stringify(response.data, null, 2));
    } catch(error) {
      console.log(error.message, error.stack);
    }
  }
  
  function main() {
    testGetSpreadSheet();
    testGetSpreadSheetValues();
  }
  
  main()