const express = require('express');

const app = express();
const PORT = 80;

const path = require('path');
// Designate the public folder as serving static resources
app.use(express.static('static'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const html_dir = path.join(__dirname ,'/templates/');

const routes = require('./src/routes');

app.use(routes);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
