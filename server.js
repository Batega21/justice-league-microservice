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

app.get('/superheroes/search', async (req, res) => {
  const query = req.query.q;
  console.log('Searching for Heroes with query:', query);
  const heroes = heroesLib.HEROES_API.filter((hero) =>
    hero.name.toLowerCase().includes(query.toLowerCase())
  );
  if (heroes.length > 0) {
    res.json(heroes);
  } else {
    res.status(404).json({ error: 'No heroes found' });
  }
});

app.get('/superheroes/pagination', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const heroes = heroesLib.HEROES_API.slice(startIndex, endIndex);
  const totalHeroes = heroesLib.HEROES_API.length;

  if (heroes.length > 0) {
    res.json({ data: heroes, totalHeroes });
  } else {
    res.status(404).json({ error: 'No heroes found' });
  }
});


app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
