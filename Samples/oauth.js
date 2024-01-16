
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
