const { ref, set, get } = require('firebase/database');
const db = require('../utility/firebase');
const { nanoid } = require('nanoid');

const INVALID_KEY_PATTERN = /[#$\[\].]/;
const URL_PATTERN = /^https?:\/\/.+/i;

function isValidOriginalURL(url) {
    if (typeof url !== 'string' || !URL_PATTERN.test(url)) {
        return false;
    }

    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (error) {
        return false;
    }
}

async function generateUniqueShortURL() {
    for (let i = 0; i < 5; i += 1) {
        const candidate = nanoid(10);
        const snapshot = await get(ref(db, `urls/${candidate}`));
        if (!snapshot.exists()) {
            return candidate;
        }
    }

    throw new Error('Unable to generate unique short URL');
}

function storeURL(shortURL, originalURL) {
    return set(ref(db, `urls/${shortURL}`), {
        originalURL
    });
}

const shortURL = async (req, res) => {
    const shortURL = req.params.shortURL;

    if (INVALID_KEY_PATTERN.test(shortURL)) {
        return res.status(400).json({ error: 'Invalid short URL format' });
    }

    try {
        const snapshot = await get(ref(db, `urls/${shortURL}`));
        if (!snapshot.exists()) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        const originalURL = snapshot.val().originalURL;
        if (!isValidOriginalURL(originalURL)) {
            return res.status(500).json({ error: 'Stored URL is invalid' });
        }

        return res.redirect(originalURL);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to resolve short URL' });
    }
};

const newShortURL = async (req, res) => {
    const originalURL = req.body.originalURL;

    if (!isValidOriginalURL(originalURL)) {
        return res.status(400).json({ error: 'Invalid URL. Must start with http:// or https://' });
    }

    try {
        const shortURL = await generateUniqueShortURL();
        await storeURL(shortURL, originalURL);
        return res.status(201).json({ shortURL });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create short URL' });
    }
};

module.exports = {
    shortURL,
    newShortURL
};
