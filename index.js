"use strict";

//Modules to read JSON
const fs = require('fs');
const bot = require("./bot")
//Benötigte Module
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

/*let errorCount = 0;

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' });
}*/

//Zertifikat und Schlüssel
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

//Express-App
const app = express();

//Statischer Ordner für öffentliche Dateien
app.use(express.static('public'));

//HTTP-Server mit Express-App
const server = https.createServer(options, app);

//Websocket-Server (Läuft auf dem gleichen HTTP-Server)
const wss = new WebSocket.Server({ server });

/*//Bei Websocket-Verbindung:
wss.on('connection', (ws) => {
  console.log('Client connected')

  const greeting = bot.displayIntentOptions("hallo")

  const botGreeting = {
    type: 'chat',
    content: `<div class="message-container">
                <div class="icon-bot">&#129302;</div>
                <div class="message bot">${greeting}</div>
                <div class="time">${getCurrentTime()}</div>
              </div>`
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
  const responseHTML = `<div class="message-container">
                            <div class="icon-bot">&#129302;</div>
                            <div class="message bot">${answer}</div>
                            <div class="time">${getCurrentTime()}</div>
                          </div>`;;

  return {
    type: 'chat',
    content: responseHTML
  }
}*/

//HTTP-Server starten und Portzuweisung (Chat-GPT zeigte mit process.env.PORT)
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})
