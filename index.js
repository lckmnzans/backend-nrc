const express = require('express');
const app = express();

const hostname = "localhost";
const port = 8080;

const router = require('./router/route');
app.use('/api', router);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
})