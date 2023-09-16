import { fetchAllSuperHero, fetchSearchHeroById } from "../api/apiRequests.js";
import"../app.js";

export const searchSuperHero = async (req, res) => {
  const nameOfHero = req.query.name;
  console.log('NAME OF HERO: ' + nameOfHero);
  try {
    let results = await fetchAllSuperHero(nameOfHero);
    if (results.length > 1) {
      res.json({ results: results });
    } else {
      results = results[0];
      res.json({ results: results });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error when searching for superheroes' });
  }
};

export const searchSuperHeroById = async (req, res) => {
  const id = req.query.id;
  try {
    const results = await fetchSearchHeroById(id);
    res.render('../Views/character.html', { results: results });
  } catch (error) {
    res.status(500).json({ message: 'Error when searching for superheroes' });
  }
};


