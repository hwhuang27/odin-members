const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
// const passport = require("passport");
// const session = require("express-session");
// const LocalStrategy = require("passport-local").Strategy;

// Create index page (homepage)
// Display board + pull users & messages data from MongoDB
exports.index = asyncHandler(async (req, res, next) => {
    const messages = [
        {
            text: "Hi there!",
            user: "Amando",
            added: new Date()
        },
        {
            text: "Hello World!",
            user: "Charles",
            added: new Date()
        }
    ];
    
    res.render('index',
        {
            title: 'Message Board',
            messages: messages,
            user: req.user,
        });
})

exports.user_login_get = asyncHandler(async (req, res, next) => {
    res.render('login',
        {
            title: 'Log In',
            heading: 'Log In'
        });
});

exports.user_login_post = [
    body("username")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Username must be specified.")
        .isAlphanumeric()
        .withMessage("Username has non-alphanumeric characters."),
    body("password")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Password must be specified."),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render("login", {
                title: 'Log In',
                heading: 'Log In',
                errors: errors.array(),
            });
            return;
        } else {
            console.log(`authenticating...`);
            passport.authenticate("local", {
                successRedirect: "/",
                failureRedirect: "/board/user/login",
            })
        }
    }),
];

exports.user_signup_get = asyncHandler(async (req, res, next) => {
    res.render('signup',
        {
            title: 'Register',
            heading: 'Sign Up'
        });
});

exports.user_signup_post = [
    // Validate and sanitize fields.
    body("first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified.")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters."),
    body("last_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Last name must be specified.")
        .isAlphanumeric()
        .withMessage("Last name has non-alphanumeric characters."),
    body("username")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Username must be specified.")
        .isAlphanumeric()
        .withMessage("Username has non-alphanumeric characters."),
    body("password")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Password must be specified."),
    body('confirm-password').custom((value, { req }) => {
        return value === req.body.password;
    }),
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("signup", {
                title: 'Register',
                heading: 'Sign Up',
                errors: errors.array(),
            });
            return;
        } else {
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if (err) {
                    throw new Error("Password failed to hash.");
                }
                // Create User object with escaped and trimmed data
                const user = new User({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    username: req.body.username,
                    password: hashedPassword,
                });
                const result = await user.save();
                res.redirect("/");
            });
        }
    }),
];