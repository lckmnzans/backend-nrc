const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const hostname = "localhost";
const port = 8080;

const dbConnect = require('./middleware/mongoClient');
dbConnect();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const router = require('./router/route');
app.use(express.static('public'));
app.use('/api', router);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
})