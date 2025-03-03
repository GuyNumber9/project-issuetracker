'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');
const helmet    = require('helmet');
var MongoClient = require('mongodb');
const mongoose  = require('mongoose');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

const dotenv = require('dotenv');
dotenv.config()
//dotenv.load();

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
mongoose.connect(CONNECTION_STRING, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var app = express();

app.use(helmet());

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

const db = mongoose.connection;

db.on('error', (err) => {
  console.log("Database error: " + err);
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  //Routing for API
  apiRoutes(app, db);  
db.once('open', () => {
  console.log("Successful database connection");
  
      
  //404 Not Found Middleware
  app.use(function(req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
  });

  
    console.log("Listening on port " + (process.env.PORT || 3000));
    if(process.env.NODE_ENV==='test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch(e) {
          var error = e;
            console.log('Tests are not valid:');
            console.log(error);
        }
      }, 3500);
    }
  });
});

module.exports = {
  app,
  db
}; //for testing
