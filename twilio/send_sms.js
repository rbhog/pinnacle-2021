
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')('AC586856f6eed1b3ca8daba56c28569ad9', 'c2abd50b50186f765747c4faa3594fe7');
const express = require('express')
const app = express()
const port = 3000
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