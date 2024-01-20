require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Bull = require('bull');

const { 
  CREDENTIALS,
  SESSION_OPTIONS,
  REDIS_CONFIG,
  PASSPORT_AUTH_SCOPES,
  ADD_QUEUE_OPTIONS 
} = require('./utils/constants');
const { getUser } = require('./DB/db');
const { InsertDataToSheets } = require('./Auth/sheets');

app.set('view engine', 'ejs');

app.use(session(SESSION_OPTIONS));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
  
const sheetsQueue = new Bull("google", REDIS_CONFIG);

// REGISTER PROCESSER
sheetsQueue.process(async (payload, done) => {
    try {
      const { user } = payload.data;
      await InsertDataToSheets(user);
      done();
    } catch (error) {
      console.log('Error inside sheetsQueue.process consumer:->', err);
    }
});

app.get('/', (req, res) => {
  res.render('index');
});


//1st hit Google OAuth routes
app.get('/auth/google', passport.authenticate('google', PASSPORT_AUTH_SCOPES));

// 2nd
passport.use(new GoogleStrategy(CREDENTIALS, (accessToken, refreshToken, profile, done) => {
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
  res.render('profile', { user: req.user });
});

app.get('/stream', async (req, res) => {
  try {
    const user = await getUser();
     sheetsQueue.add({ user }, ADD_QUEUE_OPTIONS);
     res.status(400).json('Successfully Streamed Data Threw Queue');
  } catch (error) {
    res.send(error);
  }
 
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
