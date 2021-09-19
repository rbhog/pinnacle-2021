const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const app = express();


http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
