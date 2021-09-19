const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const app = express();

cases = {
  CSI: 117,
  VMH: 135,
  ESJ: 103,
  PHY: 84,
  KEY: 149,
  JMP: 25,
  MTH: 238,
  TYD: 138,
  EGR: 193,
  KEB: 44,
  AJC: 56,
  TWS: 167,
  PLS: 12,
  AVW: 38,
  IRB: 127,
  CHE: 66,
  TLF: 66,
  LEF: 15,
  ASY: 5,
  MMH: 3,
  SYM: 8,
  SHM: 8,
  HBK: 19,
  ARM: 39,
  SPH: 5,
  CCC: 5,
  JMZ: 17,
  SQH: 3,
  SOM: 5,
  WDS: 6,
  ATL: 16,
  EGL: 7,
  KNI: 11,
  SKN: 5
}

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', (req, res) => {
  const twiml = new MessagingResponse();

  if (req.body.Body == 'hello') {
    twiml.message('Hi!');
  } else if (req.body.Body == 'bye') {
    twiml.message('Goodbye');
  } else if (Object.keys(cases).includes(req.body.Body)) {
    twiml.message(`${req.body.Body} has ${cases[req.body.Body]} recent COVID cases.`);
  } else {
    twiml.message(
      'No Body param match, Twilio sends this in the request to your server.'
    );
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

// http.createServer(app).listen(1337, () => {
//   console.log('Express server listening on port 1337');
// });

app.listen(1337, () => {
  console.log('Express server listening on port 1337');
})