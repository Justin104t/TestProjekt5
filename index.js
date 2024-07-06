"use strict";

//Modules to read JSON
const fs = require('fs');
const bot = require("./bot")
//Benötigte Module
const express = require('express');
const http = require('http');  /*s weg*/
const WebSocket = require('ws');

let errorCount = 0;

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' });
}

//Zertifikat und Schlüssel
/*const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};*/

//Express-App
const app = express();

//Statischer Ordner für öffentliche Dateien
app.use(express.static('public'));

//HTTP-Server mit Express-App
const server = http.createServer(options, app); /*s weg*/

//Websocket-Server (Läuft auf dem gleichen HTTP-Server)
const wss = new WebSocket.Server({ server });

//Bei Websocket-Verbindung:
wss.on('connection', (ws) => {
  console.log('Client connected')

  const greeting = bot.displayIntentOptions("hallo")

  const botGreeting = {
    type: 'chat',
    content:  `<li class="message" style="width:100%;">
                <div class="msj-rta macro">
                  <div class="text text-r">
                    <p>${greeting}</p> 
                    <p><small>${getCurrentTime()}</small></p>
                  </div> 
                <div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="https://img.freepik.com/vektoren-premium/laechelnder-chef-zeichentrickfigur-der-eine-pizza-haelt-und-mit-ok-gestimmt_20412-4739.jpg?w=1380"/></div>                                
              </li>`
  }
  ws.send(JSON.stringify(botGreeting));

  //Wenn eine Nachricht ankommt
  ws.on('message', (data) => {
    const message = JSON.parse(data);

    //Überprüfen des Nachrichtentyps
    switch (message.type) {
      case 'chat':
        console.log('Chat message received:', message.content)

        //Standard answer
        let answer

        try {
          answer = bot.displayIntentOptions(message.content.toString().toLowerCase());
          errorCount = 0; // Counter wird restarted, wenn es erfolgreich ist
        } catch (error) {
          errorCount++;
          if (errorCount >= 3) {
            answer = "Entschuldigung, ich verstehe Sie nicht, ich bin nur ein Bot. Bitte verwenden Sie einer der oben genannten Schlüsselwörter um fortzufahren.";
            errorCount = 0; // Counter wird restarted, wenn der ^ Nachricht angezeigt wird
          } else {
            answer = "Tut mir leid, das habe ich nicht verstanden. Probieren Sie nochmal.";
          }
        }

        answer = answer.split("||").map(processResponse)

        ws.send(JSON.stringify(answer));
        break;

      //Theoretisch andere Nachrichtentypen
      default:
        break;

    }
  })

  ws.on('close', () => {
    console.log('Client disconnected');
  })
})

function processResponse(answer) {
  const responseHTML = `<li class="message" style="width:100%;">
                          <div class="msj-rta macro">
                            <div class="text text-r">
                              <p>${answer}</p> 
                              <p><small>${getCurrentTime()}</small></p>
                            </div> 
                          <div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="https://img.freepik.com/vektoren-premium/laechelnder-chef-zeichentrickfigur-der-eine-pizza-haelt-und-mit-ok-gestimmt_20412-4739.jpg?w=1380"/></div>                                
                        </li>`

  return {
    type: 'chat',
    content: responseHTML
  }
}

//HTTP-Server starten und Portzuweisung (Chat-GPT zeigte mit process.env.PORT)
const port = process.env.PORT || 443;  /*8080*/
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})
