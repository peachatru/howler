const express = require('express');
const frontendRouter = express.Router();


const html_dir = __dirname + '/templates/';

frontendRouter.get('/', (req, res) => {
  res.sendFile(`${html_dir}index.html`);
});

frontendRouter.get('/profile', (req, res) => {
    res.sendFile(`${html_dir}profile.html`);
  });

  frontendRouter.get('/homepage', (req, res) => {
    res.sendFile(`${html_dir}homepage.html`);
  });



module.exports = frontendRouter;