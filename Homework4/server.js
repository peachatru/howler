const express = require('express');

const app = express();
const PORT = 80;

const path = require('path');
// Designate the public folder as serving static resources
app.use(express.static('static'));
app.use(express.urlencoded({extended: true}));

const html_dir = path.join(__dirname ,'/templates/');

// app.get('/', (req, res) => {
//   res.sendFile(`${html_dir}index.html`);
// });


const routes = require('./src/routes');

app.use(routes);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
