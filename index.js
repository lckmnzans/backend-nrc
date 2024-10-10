const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const { port, hostname } = require('./config/keys');

require('./middleware/mongoClient')();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const router = require('./router/route');
app.use(express.static('public'));
app.use('/api', router);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
})