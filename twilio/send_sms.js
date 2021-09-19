
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')('AC586856f6eed1b3ca8daba56c28569ad9', 'replace this with auth token');
const express = require('express')
const app = express()
const port = 3000
const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

let phoneNums=['+1 240 274 6024','+1 240 750 7079','+1 240 498 9761'];

app.get('/', (req, res) => {
    res.send('Sending Message')
   phoneNums.forEach((num) => {
        console.log(`sending to ${num}`)
        sendNotif(num,section,course,risklevel);
        
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

function sendNotif(num,section,course,risklevel){
    client.messages
  .create({
     body: `You may have come in contact with someone with covid in section ${section} in ${course}. Risk level: ${risklevel}. If symptoms show, please do not come to class!`,
     from: '+1 857 273 1909',
     to: num
   })
  .then((message) => console.log(message.sid));
  console.log("created message")

}

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(port, () => {
  console.log('Express server listening on port 1337');
});
