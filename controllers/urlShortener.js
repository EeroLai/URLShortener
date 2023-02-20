const { ref, set, onValue } = require("firebase/database");
const db = require('../utility/firebase');
const { nanoid }  = require('nanoid');

// Generate a short URL
function generateShortURL() {
    // Your implementation to generate a short URL
    let uuid = nanoid(10);
    return uuid;
}

// Store the short URL and the original URL in the database
function storeURL(shortURL, originalURL) {
    set(ref(db, 'urls/' + shortURL), {
        originalURL: originalURL
    });
}

const shortURL = async (req, res) => {
    const shortURL = req.params.shortURL;
    onValue(ref(db, 'urls/' + shortURL), (snapshot) => {
        const originalURL = (snapshot.val()) ? snapshot.val().originalURL : null;
        (originalURL) ? res.redirect(originalURL) : console.log('false');
    });
}

const newShortURL = async (req, res) => {
    const originalURL = req.params.originalURL;
    const shortURL = await generateShortURL();
    console.log(shortURL);
    storeURL(shortURL, originalURL);
    res.send({ shortURL: shortURL });
}

module.exports = {
    shortURL,
    newShortURL
}