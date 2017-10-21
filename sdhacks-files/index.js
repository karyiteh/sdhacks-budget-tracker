const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const PouchDB = require('pouchdb');
const methodOverride = require('method-override');

// Set the port to listen to requests on
const PORT = process.env.PORT || 8080;

// Create the app
const app = express();

// Create the database
const db = new PouchDB('transactions_db');

// =========================
// App Configs
// =========================
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// =======================================================================
// RESTful Routes
// HTTP Verbs: GET, POST, PUT, DELETE
//
// Name     |   Path      |   HTTP Verb |   Purpose
// =======================================================================
// Index    |   /         |   GET       | List all the posts
// New      |   /new      |   GET       | Show a form to create new posts
// Create   |   /         |   POST      | Create a new post
// Show     |   /:id      |   GET       | Show a single post
// Edit     |   /:id/edit |   GET       | Show a form to edit a post
// Update   |   /:id      |   PUT       | Update a particular post
// Destroy  |   /:id      |   DELETE    | Delete a particular post
// =======================================================================




//javascript objects
// const transactions = [
//   //{
//  //  title: 'Transaction1',
//  //  amount: 30,
//  //  sign: 0,
//  //  date:new Date('Mar 25 2017'),
//  //  category:'Groceries',
//  //  description:'Broccoli and cauliflower from Ralphs'
//  //  },
//  // {
//  //   title: 'Transaction2',
//  //   amount: 50,
//  //   sign: 0,
//  //   date:new Date('Mar 27 2017'),
//  //   category:'Food',
//  //   description:'Tasty Noodle House'
//  // },
//   {
//    title: 'Transaction2',
//    amount: 10,
//    sign: 1,
//    date:new Date('Apr 01 2017'),
//    category:'Shopping',
//    description:'Sold old clothes'
//   }
// ];

//database functions

//pass in data to post for rendering into view to allow dynamically changing data
app.get('/', function(req, res) {
  db.allDocs({
    include_docs: true,
    attachments: true
  }, function(error, result) {
    if(error) {
      console.log(error);
    } else {
      res.render('transactions', { transactions: result.rows });
      console.log(result.rows);
    }
  });
});

app.get('/new', function(req,res) {
  res.render('new-transaction', {})
})

//to post a request for data
app.post('/new', function(req,res) {
  //res.send('You sent the transaction "' + req.body.title +'".');
  // Create a transaction object to store into the database.
  var newTransaction = {
    title: req.body.title,
    amount: req.body.amount,
    sign: req.body.sign,
    date: req.body.date,
    category: req.body.category,
    description: req.body.description,

  }

  // Add the transaction object into the database.
  db.post(newTransaction, function(error, posted) {
    if(error) {
      console.log(error);
    } else {
      console.log(posted);
    }
    res.redirect('/');
  });
})
// Listen for requests
app.listen(PORT, () => {
  console.log('Server running on Port:', PORT);
});
