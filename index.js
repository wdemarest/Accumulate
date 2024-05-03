//cd Code/Accumulation
//nodemon
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const fs = require('fs');


const app = express();
const server = createServer(app);
const io = new Server(server);

let roomNum;
let sim;
let data = {};
let game;

function Main() {
  sim = new Sim();
  InitData();

  roomNum = 0;
  game = new Game();
}

function InitData(){
  data.cards = JSON.parse(fs.readFileSync("data/cards.json"));
}

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});


io.on('connection', (socket) => {
  console.log('user connected');

  socket.join(roomNum+'');
  sendGameState(roomNum);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(25565, () => {
  console.log('server running at http://localhost:25565');
});


function sendGameState (roomNum) {
  io.to(roomNum+'').emit('gameState', game);
}








class Sim {
  constructor() {

  }

  newChoice(options = 2) {
    let choice = []

    for (let i = 0; i < options; i++) {
      choice[i] = {cards: [], effects: [], biome: ""};

      for (let j = 0; j < 3; j++) {
        choice[i].cards.push(this.pickCardForChoice());
      }
    }
  }

  pickCardForChoice() {
    data.cards[Math.floor(Math.random() * data.cards.length)].name;
  }
}

class Game {
  constructor() {
    this.inventory = [];

    this.screen = "choice";
    this.choice = sim.newChoice();
  }
}



Main();