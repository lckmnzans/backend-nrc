require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser')
const { port, hostname, mongoUri } = require('./config/keys');
const { kafkaBroker } = require('./config/brokers');

// creating server
const app = express();
const server = http.createServer(app);

// starting up mongodb connection
require('./utils/MongoUtils').checkAndInsertUser()
.then(() => { require('./middleware/mongoClient')() })
.catch(console.error);

// starting up authenticator
require('./middleware/auth')();

// creating upload folder
require('./utils/FolderUtils').ensureUploadsFolderExists();

// setting up request handler
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({extended: false, limit: '50mb' }));
app.use(cors());

// setting up websocket
const io = require('./middleware/socket')(server);

// setting up passport authentication
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { jwtSecret, tokenAge } = require('./config/jwt');
const User = require('./model/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// setting up sessions store
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: mongoUri+'/test?authSource=admin',
    collection: 'nrcSessions'
});
store.on('error', function(error) {
    console.log(error);
});

// use sessions store and passport
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

// setting kafka consumer
if (kafkaBroker) {
    require('./middleware/kafkaBroker')(brokers)
    .then(async (consumerInstance) => {
        await consumerInstance.runc();
        console.log('\x1b[36m%s\x1b[0m', 'Kafka broker initialized successfully');
    
        process.on('SIGINT', async () => {
            console.log('\nShutting down consumer...');
            await consumerInstance.disconnect();
            process.exit(0);
        })
    })
    .catch(err => {
        console.error('Failed to initialize kafka broker')
    })
}

// starting the server
// const swaggerDocs = require('./swagger');
server.listen(port, hostname, () => {
    console.log('\x1b[36m%s\x1b[0m', `Server running at http://${hostname}:${port}`);
    // swaggerDocs(app, port);
});