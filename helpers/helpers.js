import { fetchSearchHeroById } from "../api/apiRequests.js";
// import { con } from '../config/db.js'
import '../app.js'

export const addFavoriteCharacter = async (req, res) => {
    const characterId = req.body.id;
    const superHero = await fetchSearchHeroById(characterId);
    var userId = global.globalUser.webId;
    if (userId == null) {
        userId = global.globalUser.id;
    }

    con.query('SELECT favorites FROM users WHERE webId = ?', [userId], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Failed to get favorites list' });
        } else {
            let favorites = result[0].favorites;
            if (favorites != null) {
                const isDuplicate = favorites.some(favorite => favorite.id === superHero.id);
                if (isDuplicate) {
                    res.status(400).json({ error: 'The superhero is already on the favorites list' });
                    return;
                } else {
                    //Add the new character to the list
                    favorites.push(superHero);
                }
            } else {
                favorites = [superHero];
            }

            // Updates the list on the database
            con.query('UPDATE users SET favorites = ? WHERE webId = ?', [JSON.stringify(favorites), userId], (updateErr, updateResult) => {
                if (updateErr) {
                    res.status(500).json({ error: 'Error when saving the superhero as a favorite' });
                } else {
                    res.status(200).json({ success: true });
                }
            });
        }
    });
};

export const searchFavorites = (req, res) => {
    let userId = global.globalUser.webId;
    let userImage = global.globalUser.picture;
    let userName = global.globalUser.userName;
    if (userId == null) {
        userId = global.globalUser.id;
        userImage = global.globalUser.photos[0].value;
        userName = global.globalUser.displayName;
    }
    con.query('SELECT favorites FROM users WHERE webId = ?', [userId], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render('../Views/profile.html', { results: result[0].favorites, userName: userName, userImage: userImage });
        }
    });
}

export const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 999999999999999999999);
    return randomNumber.toString();
}	