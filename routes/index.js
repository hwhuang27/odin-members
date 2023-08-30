var express = require('express');
var router = express.Router();

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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', 
  { 
    title: 'Message Board',
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
