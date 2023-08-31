var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

/// USER ROUTES ///

// GET message board home page.
router.get("/", user_controller.index);

// GET request for creating a User
router.get("/user/create", user_controller.user_create_get);

// POST request for creating a User
router.post("/user/create", user_controller.user_create_post);

/// MESSAGES ROUTES ///

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', 
  { 
    title: 'Members Board',
    messages: messages
  });
});

/* GET new user. */
router.get('/new', function (req, res, next) {
  res.render('form',
    {
      title: 'Form',
      heading: 'Add a new post'
    });
});

router.post('/new', function (req, res, next) {
  const name = req.body.name;
  const message = req.body.message;
  
  if(name && message){
    messages.push(
      {
        text: message,
        user: name,
        added: new Date()
      }
    )
  }

  res.redirect('/');
});

module.exports = router;

/*
const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: new Date()
  },
  {
    text: "Hello world!",
    user: "Charles",
    added: new Date()
  }
]
*/