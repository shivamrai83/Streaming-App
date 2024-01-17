
// // Google OAuth configuration
    
//     app.use(session({
//           secret: 'your_secret_key', // Make sure to keep this secret and secure in production
//   resave: false,
//   saveUninitialized: true
// }));
// // 2nd
// passport.use(new GoogleStrategy({
//     clientID: '349157039103-8mk1l8dqr0c63up4f3p09k189820g1qi.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL: 'http://localhost:3000/auth/google/callback'
// }, (accessToken, refreshToken, profile, done) => {
//     console.log('***tokens****', accessToken, refreshToken);
//     return done(null, profile);
// }));

// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser((user, done) => {
//     done(null, user);
// });

// app.use(passport.initialize());
// app.use(passport.session());




// //1hit Google OAuth routes
// app.get('/auth/google', passport.authenticate('google', {
   
//     scope: ['profile', 'email']
// }));
// // 3rd
// app.get('/auth/google/callback', 
//     passport.authenticate('google', { failureRedirect: '/' }),
//     (req, res) => {
//         // Redirect to profile after setting user session data
//         console.log('******auth/google/callback******')
//         req.session.user = req.user;
//         res.redirect('/profile');
//     }
// );

// //4th
// app.get('/profile', (req, res) => {
//     console.log('user', req.user);
//     res.render('profile', { user: req.user });
// });

// const fs = require('fs').promises;
// const {authenticate} = require('@google-cloud/local-auth');
// const {google} = require('googleapis');

// const {SCOPES, TOKEN_PATH, CREDENTIALS_PATH} = require('../utils/constants');

// /**
//  * Reads previously authorized credentials from the save file.
//  *
//  * @return {Promise<OAuth2Client|null>}
//  */
// async function loadSavedCredentialsIfExist() {
//   try {
//     const content = await fs.readFile(TOKEN_PATH);
//     const credentials = JSON.parse(content);
//     return google.auth.fromJSON(credentials);
//   } catch (err) {
//     return null;
//   }
// }

// /**
//  * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
//  *
//  * @param {OAuth2Client} client
//  * @return {Promise<void>}
//  */
// async function saveCredentials(client) {
//   const content = await fs.readFile(CREDENTIALS_PATH);
//   const keys = JSON.parse(content);
//   const key = keys.installed || keys.web;
//   console.log("****CLIENT*****",client);
//   const payload = JSON.stringify({
//     type: 'authorized_user',
//     client_id: key.client_id,
//     client_secret: key.client_secret,
//     refresh_token: client.credentials.refresh_token,
//   });
//   console.log("****PAYLOAD*****",payload);
//   await fs.writeFile(TOKEN_PATH, payload);
// }

// /**
//  * Load or request or authorization to call APIs.
//  *
//  */
// async function authorize() {
//   //if exist in token.js
//   let client = await loadSavedCredentialsIfExist();
//   if (client) {
//     return client;
//   }
//   //from credential.json file
//   client = await authenticate({
//     scopes: SCOPES,
//     keyfilePath: CREDENTIALS_PATH,
//   });
//   console.log("client::::::", client);
//   if (client.credentials) {
//     await saveCredentials(client);
//   }
//   return client;
// }

// //list all the sheet data
// /**
//  * Prints the names and majors of students in a sample spreadsheet:
//  * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
//  * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
//  */

// async function getRows(auth){
//   const sheets = google.sheets({ version: 'v4', auth });
//   const result = await sheets.spreadsheets.values.get({
//     spreadsheetId: process.env.SPREADSHEET_ID,
//       range: 'Sheet1',
//     })
//     const values = result.data.values ? result.data.values : [];
//     const nonEmptyRows = values.filter(row => row.some(cell => cell !== null && cell !== ''));

//     const nextRow = nonEmptyRows.length + 1;
//     // const range = `A${nextRow}`;
//     console.log('**RANGE**', nextRow, result.data.values);
//     return nextRow;
// }

// // Writes data to the Sheet
// async function writeData(data, i, auth) {
//   // console.log('writhdata auth', auth)
//   const sheets = google.sheets({ version: 'v4', auth });

//   let arr = [];
//   for (const obj of data){
//     arr.push([obj.name, obj.age, obj.email])
//   }
//   const resource = {
//     values: arr,
//   };

//   sheets.spreadsheets.values.append(
//     {
//       spreadsheetId: process.env.SPREADSHEET_ID,
//       range: `A1`,
//       valueInputOption: 'RAW',
//       resource: resource,
//     },
//     (err, result) => {
//       if (err) {
//         // Handle error
//         console.log(err);
//       } else {
//         console.log(
//           '%d cells updated on range: %s',
//           result.data.updates.updatedCells,
//           result.data.updates.updatedRange
//         );
//         return result.data.updates.updatedCells;
//       }
//     }
//   );

// }

// async function getClientWithAuthToken(){
//   const client = await authenticate({
//     scopes: SCOPES,
//     keyfilePath: CREDENTIALS_PATH,
//   });
//   console.log("***client**", client);
//   return client;
// }

// async function getGoogleSheetClient(path) {
//   const credentialsContent = await fs.readFile(path, 'utf-8');
//       const credentials = JSON.parse(credentialsContent);
//       console.log("PATH",credentials, CREDENTIALS_PATH, typeof(CREDENTIALS_PATH))
//       const auth = new google.auth.GoogleAuth({
//         credentials,
//         scopes: SCOPES,
//       });
//       client = await auth.getClient();
//   return authClient
// }

// // authorize().then(console.log('done')).catch(console.error);
// module.exports = {
//   writeData,
//   loadSavedCredentialsIfExist,
//   getRows,
//   getClientWithAuthToken,
//   authorize,
//   getGoogleSheetClient
// }

 // if(!client){
    //     // client = await getClientWithAuthToken();
    //   client = new OAuth2Client('349157039103-8mk1l8dqr0c63up4f3p09k189820g1qi.apps.googleusercontent.com',
    //   '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',  'http://localhost:3000/auth/google/callback');
    //   obj.access_token = accessToken

    //   client.setCredentials(obj);
    //   console.log("**********CLINET****", client)

    //   // client = accessToken;
    // }

     // if(!client){
    //   const credentialsContent = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
    // const credentials = JSON.parse(credentialsContent);
    //   console.log("PATH",credentials, CREDENTIALS_PATH, typeof(CREDENTIALS_PATH))
    //   const auth = new google.auth.GoogleAuth({
    //     credentials,
    //     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    //   });
    //   client = await auth.getClient();
    // }