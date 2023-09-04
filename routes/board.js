var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");
// const message_controller = require("../controllers/messageController");

/// USER ROUTES ///

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

/// MESSAGES ROUTES ///


module.exports = router;