const express = require('express')
const app = express()
const fetch = require("node-fetch");
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const {
    writeData,
    authorize
  } = require('./sheets');

// const client = require('./db')
app.set('view engine', 'ejs');

//Postgres db config and data setting.
// app.get('/', function (req, res) {
//   res.send('Hello World')
// })

// async function getData(){
//   const data = await fetch('https://jsonplaceholder.typicode.com/users')
//   .then((response) => response.json())
//   .then((json) => { return json; });
//   return data;
// }


// async function pushDataToDb(){
//   const data = await getData();
//   data.map(async (user) => {
//     const res = await client.query(
//       `INSERT INTO STUDENT (name, age, email) 
//        VALUES ($1, $2, $3)`, [user.name, user.id*5, user.email]);
//     if (res){
//       console.log('sucessfully inserted', user.name, res.command);
//     } else {
//       console.log('not able to inserted', user.name, res.command);
//     }
    
//   })
// }
// pushDataToDb();

// Google OAuth configuration

// app.get('/auth/google', passport.authenticate('google', {
app.get('/auth/google', async (req, res) => {
    authorize().then(writeData).catch(console.error);
    // await authorize();
    // res.render('index');
});
    

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});


// app.use(session({
//   secret: 'your_secret_key', // Make sure to keep this secret and secure in production
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


