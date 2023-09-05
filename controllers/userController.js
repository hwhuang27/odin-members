const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;

// authentication functions
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            };
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                // passwords do not match
                return done(null, false, { message: "Incorrect password" });
            };
            return done(null, user);
        } catch (err) {
            return done(err);
        };
    })
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    };
});

// Create index page (homepage)
// Display board + pull users & messages data from MongoDB
exports.index = asyncHandler(async (req, res, next) => {
    const messages = await Message.find()
        .sort({timestamp: 1})
        .populate("author")
        .exec();
        
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
    // sanitize & validate
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
    // handle validation errors
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
            // console.log(`logging in..`);
            next();
        }
    }),
    // authenticate with passport middleware
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/board/user/login",
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
                    admin_status: req.body.admin_status,
                });
                const result = await user.save();
                res.redirect("/");
            });
        }
    }),
];

exports.user_logout_get = asyncHandler(async (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

exports.user_membership_get = asyncHandler(async (req, res, next) => {
    // Render "You are already a member" page if user is already a member
    res.render('membership',
        {
            title: 'Membership',
            heading: 'Apply for Membership',
            user: req.user,
        });
});

exports.user_membership_post = [
    body('secret')
        .escape()
        .custom((value, { req }) => {
            return value === 'secretvalue';
        })
        .withMessage("Wrong value, try again."),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('membership',
                {
                    title: 'Membership',
                    heading: 'Apply for Membership',
                    user: req.user,
                    errors: errors.array(),
                });
            return;
        } else {    
            // update user + redirect to homepage
            await User.findOneAndUpdate({_id: req.params.id}, {membership_status: "Member"});
            res.redirect("/");
        }
    }),
];

exports.user_message_get = asyncHandler(async (req, res, next) => {
    res.render('message',
        {
            title: 'New Message',
            heading: 'Create a new Message',
            user: req.user,
        });
});

exports.user_message_post = [
    body('message')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Please enter a valid message."),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('message',
                {
                    title: 'New Message',
                    heading: 'Create a new Message',
                    user: req.user,
                    errors: errors.array(),
                });
            return;
        } else {
            // add new Message and redirect
            const message = new Message({
                author: req.params.id,
                title: req.body.title,
                text: req.body.message,
            });
            await message.save();
            res.redirect("/");
        }
    }),
];

exports.user_message_delete_post = asyncHandler(async (req, res, next) => {
    await Message.findByIdAndRemove({_id: req.params.id});
    res.redirect("/board");
});