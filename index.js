require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const { port, hostname, mongoUri } = require('./config/keys');

// starting up mongodb connection
require('./middleware/mongoClient')();

// starting up authenticator
require('./middleware/auth')();

// creating upload folder
require('./utils/FolderCreation')();

// setting up request handler
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// setting up passport authentication
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: mongoUri+'/test?authSource=admin',
    collection: 'nrcSessions'
});
store.on('error', function(error) {
    console.log(error);
});
const { jwtSecret, tokenAge } = require('./config/jwt');
const User = require('./model/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(session({
    secret: jwtSecret,
    cookie: {
        maxAge: tokenAge
    },
    store: store,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

// setting up routing
const router = require('./router/route');
app.use(express.static('public'));
app.use('/', router);

// starting the server
const swaggerDocs = require('./swagger');
app.listen(port, hostname, () => {
    console.log('\x1b[36m%s\x1b[0m', `Server running at http://${hostname}:${port}`);
    swaggerDocs(app, port);
});