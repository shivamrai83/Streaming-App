const express = require('express')
const app = express()
const fetch = require("node-fetch");
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Bull = require('bull');

const { pushDataToDb } = require('./DB/db');
const { getUser } = require('./DB/db')
const {
    writeData,
    loadSavedCredentialsIfExist,
    getRows,
    getGoogleSheetClient
  } = require('./Auth/sheets');

const CREDENTIALS_PATH = path.join(process.cwd(), 'Credentials/service_credentials.json');

app.set('view engine', 'ejs');

app.use(session({
  secret: 'your_secret_key', // Make sure to keep this secret and secure in production
resave: false,
saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


const sheetsQueue = new Bull("google", {  redis: 'redis://localhost:6379' });

  // REGISTER PROCESSER
  sheetsQueue.process(async (payload, done) => {
    const {user} = payload.data;
    let client;
    client = await loadSavedCredentialsIfExist();
    if(!client){
      client = await getGoogleSheetClient(CREDENTIALS_PATH);
    }
    const rows = await getRows(client);
    await writeData(user, rows+1, client);
    done();
  });

app.get('/', (req, res) => {
  res.render('index');
});


//1hit Google OAuth routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// 2nd
passport.use(new GoogleStrategy({
  clientID: '349157039103-8mk1l8dqr0c63up4f3p09k189820g1qi.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
  console.log('***tokens****', accessToken, refreshToken);
  console.log("profile******", profile);
  profile.accessToken = accessToken;
  return done(null, profile);
  }));

// 3rd
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Redirect to profile after setting user session data
  req.session.user = req.user;
  req.session.accessToken = req.user.accessToken;
  res.redirect('/profile');
});

//4th
app.get('/profile', (req, res) => {
console.log('user', req.user);
console.log('user token',req.session.accessToken);
res.render('profile', { user: req.user });
});

app.get('/stream', async (req, res) => {
  try {
    const user = await getUser();
    const accessToken = req.session.accessToken;
     console.log('usaccessToken**er*****', accessToken);
     sheetsQueue.add({ user, accessToken }, { removeOnComplete: true, removeOnFail: true },);
     res.status(400).json('done');
  } catch (error) {
    console.log('err*******',error);
    res.send(error);

  }
 
});

passport.serializeUser((user, done) => {
done(null, user);
});

passport.deserializeUser((user, done) => {
done(null, user);
});


app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
