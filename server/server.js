var express = require('express');
var bodyParser = require('body-parser')

var app = express();

var users = [
  {id: 1, email: 'test@test.com', password: 'test', name: 'John Test'}
];

// CORS hell
app.use('/', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
 });

app.use( bodyParser.json() ); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
})); 


// Check if given login details are correct
app.post('/login', function (req, res) {
  var response = {"error": "User not found"};
  var status = 404;

  if (req.body.email && req.body.password) {
    var result = users.filter( function(x) {
      return x.email===req.body.email && x.password===req.body.password;
    });

    console.log('result', result);
    if (result.length === 1) {
      response = result[0];
      status = 200;
    }
  }

  res.status(status).send(response);
});

// Register a new user
app.post('/register', function (req, res) {
  var response = {"error": "Some field is missing."};
  var status = 400;

  if (req.body.email && req.body.password && req.body.name) {
    var user = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name
    };

    var result = users.filter( function(x) {
      return x.email===req.body.email;
    });

    if (result.length === 1) {
      response = {"error": "User already exists."};
      status = 400;
    } else {
      user['id'] = users.length+1;
      users.push(user);
      response = user;
      status = 200;
    }
  }

  res.status(status).send(response);
});


// Edit user
app.post('/user/:id/edit', function (req, res) {
  var response = {"error": "Some field is missing."};
  var status = 400;

  if (req.body.email && req.body.password && req.body.name) {
    var id = parseInt(req.params.id,10);
    var result = users.filter( function(x) {
      return x.id===id;
    });

    if (result.length === 1) {
      var user = {
        id: id,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
      };
      users = users.map(function(x) { if (x.id==id) { x = user; } return x; });
      console.log('Edited:', users);
      response = user;
      status = 200;
    } else {
      response = {"error": "User does not exists."};
      status = 404;
    }
  }

  res.status(status).send(response);
});

// Get user by ID
app.get('/user/:id', function (req, res) {
  var response = {"error": "User not found"};
  var status = 404;

  if (req.params.id) {
    var id = parseInt(req.params.id,10);

    var result = users.filter( function(x) {
      return x.id===id;
    });

    console.log('GET user '+req.params.id, result);
    if (result.length === 1) {
      response = result[0];
      status = 200;
    }
  }

  res.status(status).send(response);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});