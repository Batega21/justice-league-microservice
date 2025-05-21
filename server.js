const express = require('express');
const cors = require('cors');
const logger = require('./logger')

const app = express();
const port = 3000;
const heroesLib = require('./heroes');

app.use(
  cors({ origin: 'http://localhost:4200' })
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
  logger.log('Fetching all superheroes');
  const heroes = heroesLib.HEROES_API;
  if (heroes) {
    res.json(heroes);
  } else {
    const message = 'Heroes not found';
    logger.error(message);
    res.status(404).json({ error: message });
  }
});

app.get('/superheroes/search', async (req, res) => {
  const query = req.query.q;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid query parameter' });
  }
  logger.log('Searching for Heroes with query:', query);

  const heroes = heroesLib.HEROES_API.filter((hero) =>
    hero.name.toLowerCase().includes(query.toLowerCase())
  );
  if (heroes.length > 0) {
    res.json(heroes);
  } else {
    const message = 'No heroes found';
    logger.error(message);
    res.status(404).json({ error: message });
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
    const message = 'No heroes found';
    logger.error(message);
    res.status(404).json({ error: message });
  }
});

app.listen(port, () => {
  logger.debug(`Proxy server listening on port ${port}`);
});
