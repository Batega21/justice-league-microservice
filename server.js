const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;
const heroesLib = require('./heroes');

app.use(
  cors({
    origin: 'http://localhost:4200',
  })
);
app.use('/img', express.static('./public/img'));

app.get('/superhero/:id', async (req, res) => {
  const characterId = req.params.id;
  const hero = heroesLib.HEROES_API.find((hero) => hero.id == characterId);
  if (hero) {
    res.json(hero);
  } else {
    res.status(404).json({ error: 'Hero not found' });
  }
});

app.get('/superheroes', async (req, res) => {
  console.log('Fetching all superheroes');
  const heroes = heroesLib.HEROES_API;
  if (heroes) {
    res.json(heroes);
  } else {
    res.status(404).json({ error: 'Heroes not found' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
