require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser')
const { port, hostname, mongoUri } = require('./config/keys');

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
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// setting up websocket
const io = require('./middleware/socket')(server);
// const UserSocket = require('./model/UserSocket');
// app.post("/webhook", async (req,res) => {
//     const { userId, message } = req.body;

//     try {
//         const userSocket = await UserSocket.findOne({ userId });

//         if (userSocket) {
//             io.to(userSocket.socketId).emit("webhook_event", { message, userId });
//             console.log(`Sent event to user ${userId}`);
//         } else {
//             console.log(`User ${userId} not found`);
//         }

//         res.status(200).json({ success: true });
//     } catch(err) {
//         console.error("Error sending webhook:", err);
//         res.status(500).json({ success: false, message: err.message });
//     } 
// })

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
const brokers = [process.env.BROKERS];
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

// starting the server
// const swaggerDocs = require('./swagger');
server.listen(port, hostname, () => {
    console.log('\x1b[36m%s\x1b[0m', `Server running at http://${hostname}:${port}`);
    // swaggerDocs(app, port);
});