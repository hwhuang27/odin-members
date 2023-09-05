var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");

// GET message board home page.
router.get("/", user_controller.index);

// GET request for creating a User
router.get("/user/signup", user_controller.user_signup_get);

// POST request for creating a User
router.post("/user/signup", user_controller.user_signup_post);

// GET request for User login
router.get("/user/login", user_controller.user_login_get);

// POST request for User login
router.post("/user/login", user_controller.user_login_post);

// GET request for User logout
router.get("/user/logout", user_controller.user_logout_get);

// GET request for adding User membership
router.get("/user/:id/membership", user_controller.user_membership_get);

// POST request for adding User membership
router.post("/user/:id/membership", user_controller.user_membership_post);

// GET request for adding new message from User
router.get("/user/:id/new", user_controller.user_message_get);

// POST request for adding new message from User
router.post("/user/:id/new", user_controller.user_message_post);

// POST request for deleting a message by admin
router.post("/message/:id/delete", user_controller.user_message_delete_post);

module.exports = router;