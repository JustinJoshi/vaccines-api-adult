const api = require('./api')
module.exports = function (app, passport, db) {


  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('api').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        messages: result
      })
    })
  });

  app.get('/secondProfile', isLoggedIn, function (req, res) {
    res.render('secondProfile.ejs');
  });

  app.get('/api/:query', isLoggedIn, async function (req, res) {
    //mongoDB rest api tutorial https://www.mongodb.com/resources/languages/express-mongodb-rest-api-tutorial
    const age = req.params.query
    console.log(age)
    if (age < 19) {
      res.json('Invalid Age!').status(200);
    } else if (age >= 19 && age <= 26) {
      let collection = await db.collection('api')
      let results = await collection.find({}).toArray();
      res.send(results[0] ["19 through 26 years"]).status(200);
    } else if (age >= 27 && age < 50) {
      let collection = await db.collection('api')
      let results = await collection.find({}).toArray();
      res.send(results[0] ["27 to 49 years"]).status(200);
    } else if (age >= 50 && age <= 64) {
      let collection = await db.collection('api')
      let results = await collection.find({}).toArray();
      res.send(results[0] ['50 through 64 years']).status(200);
    } else if (age > 60) {
      let collection = await db.collection('api')
      let results = await collection.find({}).toArray();
      res.send(results[0] ['60 years or older']).status(200);
    }else{
      res.json('Invalid input!').status(200);
    }
  });

  // { "_id": { "$oid": "690560fb57ea3ad8622a91d3" }, "19 through 26 years": ["Chickenpox vaccine", "COVID-19 vaccine", "Flu vaccine", "Hepatitis B vaccine", "HPV vaccine", "MMR vaccine", "Td or Tdap vaccine"], "27 to 49 years": ["COVID-19 vaccine", "Flu vaccine", "Hepatitis B vaccine", "MMR vaccine", "Td or Tdap vaccine"], "50 through 64 years": ["COVID-19 vaccine", "Flu vaccine", "Pneumococcal vaccine", "Shingles vaccine", "Td or Tdap vaccine"], "60 years or older": ["Flu vaccine", "Pneumococcal vaccine", "Shingles vaccine", "Respiratory syncytial virus (RSV) vaccine", "Td or Tdap vaccine"] }



  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout(() => {
      console.log('User has logged out!')
    });
    res.redirect('/');
  });

  // message board routes ===============================================================

  app.post('/messages', (req, res) => {
    db.collection('messages').save({ name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown: 0 }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })

  app.put('/messages', (req, res) => {
    let logic = Object.keys(req.body).includes('thumbUp') ? req.body.thumbUp + 1 : req.body.thumbDown - 1
    db.collection('messages')
      .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
        $set: {
          thumbUp: logic
        }
      }, {
        sort: { _id: -1 },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.delete('/messages', (req, res) => {
    db.collection('messages').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });


  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
