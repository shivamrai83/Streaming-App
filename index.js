require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Bull = require('bull');

const { CREDENTIALS } = require('./utils/constants')
const { getUser } = require('./DB/db')
const { InsertDataToSheets } = require('./Auth/sheets');

app.set('view engine', 'ejs');

app.use(session({
  secret: 'stream_app_secret_key', // Make sure to keep this secret and secure in production
resave: false,
saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
  


const sheetsQueue = new Bull("google", {  redis: 'redis://localhost:6379' });

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


//1hit Google OAuth routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

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
     sheetsQueue.add({ user }, { removeOnComplete: true, removeOnFail: true },);
     res.status(400).json('Successfully Streamed Data Threw Queue');
  } catch (error) {
    res.send(error);
  }
 
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
