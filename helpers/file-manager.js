const fs = require('fs').promises;
const path = require('path');
const heroesFilePath = path.join(__dirname, 'heroes.json');

const readHeroesFromFile = async () => {
  try {
    const data = await fs.readFile(heroesFilePath, 'utf8');
    const heroes = JSON.parse(data);
    if (data.trim() === '') {
      console.warn('Heroes file is empty, returning an empty array');
      return [];
    }
    return heroes;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('Heroes file not found, returning an empty array');
      return [];
    }
    if (error.name === 'SyntaxError') {
      console.error('Heroes file contains invalid JSON, returning an empty array');
      return [];
    }
    console.error('Error reading heroes from file:', error);
    throw error;    
  }
}

const writeHeroesToFile = async (heroes) => {
  try {
    const data = JSON.stringify(heroes, null, 2);
    await fs.writeFile(heroesFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error writing heroes to file:', error);
    throw error;
  }
};

module.exports = {
  readHeroesFromFile,
  writeHeroesToFile
};