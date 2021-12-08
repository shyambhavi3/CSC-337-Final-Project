// importing modules
const mongoose = require('mongoose');
const express = require('express');
const parser = require('body-parser')
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const app = express();
app.set("view engine","ejs");
app.use(cookieParser());
// authenticate and login functions



app.use(express.static('./public_html'));


TIMEOUT = 500000;
var sessions = {};
function filterSessions() {
  let now = Date.now();
  for (e in sessions) {
    if (sessions[e].time < (now - TIMEOUT)) {
      console.log("logged out");
      delete sessions[e];
    }
  }
}

function loggedOut(username){
  delete sessions[username];
}




setInterval(filterSessions, 2000);

function putSession(username, sessionKey) {
  if (username in sessions) {
    sessions[username] = {'key': sessionKey, 'time': Date.now()};
    return sessionKey;
  } else {
    let sessionKey = Math.floor(Math.random() * 1000);
    sessions[username] = {'key': sessionKey, 'time': Date.now()};
    return sessionKey;
  }
}

function isValidSession(username, sessionKey) {
  if (username in sessions && sessions[username].key == sessionKey) {
    return true;
  }
  return false;
}
function authenticate(req, res, next) {
    if (Object.keys(req.cookies).length > 0) {
      let u = req.cookies.login.username;
      let key = req.cookies.login.key;
      if (isValidSession(u, key)) {
        putSession(u, key);
        res.cookie("login", {username: u, key:key}, {maxAge: TIMEOUT});
        next();
      } else {
        res.redirect('index.html');
      }
    } else {
      res.redirect('index.html');
    }
  }
  app.use('/welcome.html',authenticate);
  /** HASHING CODE **/

function getHash(password, salt) {
  var cryptoHash = crypto.createHash('sha512');
  var toHash = password + salt;
  var hash = cryptoHash.update(toHash, 'utf-8').digest('hex');
  return hash;

}

function isPasswordCorrect(account, password) {
  var hash = getHash(password, account.salt);
  return account.hash == hash;
}

/** END HASHING CODE **/

// all app.use calls go here

app.use(parser.text({type: '*/*'}));

app.use(parser.json())


// Set EJS as templating engine
app.set("view engine", "ejs");

// Create the schema (in other words, the database object structure specification)
var Schema = mongoose.Schema;
var FreelancerSchema = new Schema({
  username: String,
  hash: String,
  salt: Number,
  name: String,
  personName: String,
  bio: String,
  contact: String,
  price: Number,
  class: String,
});


var Freelancer = mongoose.model('Freelancer', FreelancerSchema)

// mongodb code

const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/';
mongoose.connect(mongoDBURL, { useNewUrlParser: true,
  useUnifiedTopology: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// all get requests
app.get('/', (req, res) => { res.redirect('/index.html'); });
app.get('/testcookies', (req, res)=>{res.send(req.cookies);});



app.get('/login/:username/:password/', (req, res) => {
  Freelancer.find({username : req.params.username}).exec(function(error, results) {
    if (results.length == 1) {
      //console.log(results[0]);
      var password = req.params.password;
      var correct = isPasswordCorrect(results[0], password);
      if (correct) {
          var sessionKey = putSession(req.params.username);
          res.cookie("login", {username: req.params.username, key:sessionKey},
          {maxAge: TIMEOUT});
          res.end(req.params.username);
      } else {
        res.end(false);
      }
    } else {
      res.end(false);
    }
  });
});

app.get('/search/services/:keyWord', (req, res) => {
  Freelancer.find({ $or: [{name:{$regex: '.*'+req.params.keyWord+'.*'}},
  {class:{$regex: '.*'+req.params.keyWord+'.*'}}, {personName:{$regex: '.*'+req.params.keyWord+'.*'}}]})
    .exec(function (err, results) {
    if (err) return handleError(err);
    res.end(JSON.stringify(results));
  })
});

app.get('/create/:username/:password/:person/:name/:bio/:contact/:catagory/:price/', (req, res) => {
  Freelancer.find({username : req.params.username}).exec(function(error, results) {
    if (!error && results.length == 0) {

      var salt = Math.floor(Math.random() * 1000000000000);
      var hash = getHash(req.params.password, salt);

      var free = new Freelancer({
        'username': req.params.username,
        'hash': hash,
        'salt': salt,
        'name': req.params.name,
        'personName': req.params.person,
        'bio': req.params.bio,
        'contact': req.params.contact,
        'class':req.params.catagory,
        'price': req.params.price

    });
    console.log(free);

    free.save(function (err) {
      if (err) { res.end('ERROR! Make sure you did not leave any fields empty.'); }
      else { res.end('Account created!')
    };
    });
  } else {
    res.end('Username already taken');
  }

  });
});

app.get('/welcome/', (req, res) => {
  Freelancer.findOne({username : req.cookies.login.username})
    .exec(function (err, results) {
    if (err) return handleError(err);
    res.end(JSON.stringify(results));
  })
});

app.get('/edit/:name/:personName/:catagory/:bio/:contact/:price', (req, res) => {

      Freelancer.findOneAndUpdate({username : req.cookies.login.username}, {
        'name': req.params.name,
        'personName': req.params.personName,
        'bio': req.params.bio,
        'contact': req.params.contact,
        'price': req.params.price,
        'class': req.params.catagory
      }, function (err, docs) {
        if (err){
            console.log(err);
        }
      })
  });
  //implement update document



app.get('/logout/', (req, res) => {
  console.log(req.cookies.login.username);
  loggedOut(req.cookies.login.username)
  res.end("logged out"); });


// Start the server!

app.listen(80, () => { console.log('server has started'); });
//bug: doesnt show full description after creating new user
