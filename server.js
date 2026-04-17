require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const AppID = require('ibmcloud-appid');
const path = require('path');

const WebAppStrategy = AppID.WebAppStrategy;

const app = express();

// ✅ Session
app.use(session({
    secret: 'appid-secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        sameSite: 'lax'
    }
}));

// ✅ Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ IBM App ID Strategy
passport.use(WebAppStrategy.STRATEGY_NAME, new WebAppStrategy({
    tenantId: process.env.APPID_TENANT_ID,
    clientId: process.env.APPID_CLIENT_ID,
    secret: process.env.APPID_SECRET,
    oauthServerUrl: process.env.APPID_OAUTH_SERVER_URL,
    redirectUri: process.env.APPID_REDIRECT_URI
}));

// ✅ Serialize
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ✅ Static files (serves index.html automatically)
app.use(express.static('public'));

// ✅ Login
app.get('/login',
    passport.authenticate(WebAppStrategy.STRATEGY_NAME)
);

// ✅ Callback (🔥 FIXED: redirect to home)
app.get('/callback', (req, res, next) => {

    passport.authenticate(WebAppStrategy.STRATEGY_NAME, (err, user, info) => {

        if (err) {
            console.log("❌ Error:", err);
            return res.redirect('/dashboard.html'); // 🔥 FIXED: redirect to dashboard.html
        }

        if (!user) {
            console.log("❌ No user returned");
            return res.redirect('/dashboard.html'); // 🔥 FIXED: redirect to dashboard.html
        }

        req.logIn(user, (err) => {
            if (err) {
                console.log("❌ Login error:", err);
                return res.redirect('/dashboard.html'); // 🔥 FIXED: redirect to dashboard.html
            }

            console.log("✅ LOGIN SUCCESS");

            req.session.save(() => {
                res.redirect('/dashboard.html'); // ✅ back to dashboard.html
            });
        });

    })(req, res, next);
});

// ✅ Protected route
app.get('/protected', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/dashboard.html'); // 🔥 FIXED: redirect to dashboard.html
    }

    res.send("✅ You are logged in and accessing secure data");
});

// ✅ Logout
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/index.html'); // 🔥 FIXED: redirect to index.html
    });
});

// ✅ Debug (optional)
app.get('/debug', (req, res) => {
    res.json({
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
});

// ✅ Start server (PORT 5000)
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});