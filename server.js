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

app.get('/superheroes/hero/:id', async (req, res) => {
  const heroId = req.params.id;
  const hero = heroesLib.HEROES_API.find((hero) => hero.id == heroId);
  if (hero) {
    res.json(hero);
  } else {
    res.status(404).json({ error: 'Hero not found' });
  }
});

app.get('/superheroes/hero', async (req, res) => {
  const heroName = req.query.name;
  const heroNameDecoded = decodeURIComponent(heroName);
  logger.log(`Fetching hero with name: ${heroNameDecoded}`);
  if (!heroNameDecoded || typeof heroNameDecoded !== 'string') {
    message = 'Invalid hero name';
    logger.error(message);
    return res.status(400).json({ error: message });
  }
  if (heroNameDecoded.length < 3) {
    message = 'Hero name must be at least 3 characters long';
    logger.error(message);
    return res.status(400).json({ error: message });
  }
  if (heroNameDecoded.length > 50) {
    message = 'Hero name must be less than 50 characters long';
    logger.error(message);
    return res.status(400).json({ error: message });
  }
  if (!/^[a-zA-Z0-9 ]+$/.test(heroNameDecoded)) {
    message = 'Hero name can only contain alphanumeric characters and spaces';
    logger.error(message);
    return res.status(400).json({ error: message });
  }

  logger.log(`Searching for hero with name: ${heroNameDecoded}`);

  const hero = heroesLib.HEROES_API.find((hero) => hero.name.toLowerCase() == heroNameDecoded.toLowerCase());
  if (hero) {
    res.json(hero);
  } else {
    message = 'Hero not found';
    logger.error(message);
    res.status(404).json({ error: message });
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
  const query = req.query.name;
  logger.log(query);

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid query parameter' });
  }
  logger.log(`---- Searching for Heroes with query: ${query} -----`);

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
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const heroes = heroesLib.HEROES_API.slice(startIndex, endIndex);
  const totalHeroes = heroesLib.HEROES_API.length;
  let message = '';
  logger.log(`Fetching heroes for page ${page} with limit ${limit}`);

  if (page < 1 || limit < 1) {
    message = 'Invalid page or limit';
    logger.error(message);
    return res.status(400).json({ error: message });
  }
  if (page > Math.ceil(totalHeroes / limit)) {
    message = 'Page not found';
    logger.error(message);
    return res.status(404).json({ error: message });
  }
  if (limit > totalHeroes) {
    message = 'Limit exceeds total heroes';
    logger.error(message);
    return res.status(400).json({ error: message });
  }
  if (startIndex > totalHeroes) {
    message = 'Start index exceeds total heroes';
    logger.error(message);
    return res.status(404).json({ error: message });
  }
  if (heroes.length > 0) {
    logger.log(`Found ${heroes.length} heroes`);
    logger.log(`Total heroes: ${totalHeroes}`);
    return res.json({ data: heroes, totalHeroes });
  } else {
    const message = 'No heroes found';
    logger.error(message);
    return res.status(404).json({ error: message });
  }
});

app.get('/superheroes/by-names', async (req, res) => {
  const namesDecoded = decodeURIComponent(req.query.name);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  let message = '';
  logger.debug(`------------ ${page} ${limit} -------------`);
  logger.log(`Fetching heroes: ${namesDecoded}`);

  if (!namesDecoded || typeof namesDecoded !== 'string') {
    message = 'Invalid names parameter';
    logger.error(message);
    return res.status(400).json({ error: message });
  }
  if (namesDecoded.length < 3) {
    message = 'Team name must be at least 3 characters long';
    logger.error(message);
    return res.status(400).json({ error: message });
  }
  if (namesDecoded.length > 100) {
    message = 'The hero list must be less than 50 characters long';
    logger.error(message);
    return res.status(400).json({ error: message });
  }

  const searchNames = namesDecoded.split(',');
  logger.log(`Searching for heroes with names: ${searchNames}`);
  const heroesMatched = heroesLib.HEROES_API.filter((hero) =>
    searchNames.some((name) => hero.name.toLowerCase() === name.toLowerCase())
  );
  logger.log(`Found ${heroesMatched.length} heroes`);
  const heroes = heroesMatched.slice(startIndex, endIndex);
  logger.log(`Heroes: ${heroes[0].name} ${heroes[1].name}`);
  const totalHeroes = heroesLib.HEROES_API.length;
  logger.log(`Total heroes: ${totalHeroes}`);

  if (heroes.length > 0) {
    return res.json({ data: heroes, totalHeroes });
  } else {
    message = 'No heroes found';
    logger.error(message);
    res.status(404).json({ error: message });
  }
});

app.listen(port, () => {
  logger.debug(`Proxy server listening on port ${port}`);
});
