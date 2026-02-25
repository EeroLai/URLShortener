const { ref, set, get, update, remove } = require('firebase/database');
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
        originalURL,
        clicks: 0,
        createdAt: Date.now()
    });
}

const shortURL = async (req, res) => {
    const shortURL = req.params.shortURL;

    if (INVALID_KEY_PATTERN.test(shortURL)) {
        return res.status(400).json({ error: 'Invalid short URL format' });
    }

    try {
        const urlRef = ref(db, `urls/${shortURL}`);
        const snapshot = await get(urlRef);
        if (!snapshot.exists()) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        const row = snapshot.val();
        const originalURL = row.originalURL;
        if (!isValidOriginalURL(originalURL)) {
            return res.status(500).json({ error: 'Stored URL is invalid' });
        }

        await update(urlRef, {
            clicks: Number(row.clicks || 0) + 1,
            lastAccessedAt: Date.now()
        });

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

const listURLs = async (req, res) => {
    try {
        const snapshot = await get(ref(db, 'urls'));
        if (!snapshot.exists()) {
            return res.json({ items: [] });
        }

        const urls = snapshot.val();
        const items = Object.entries(urls).map(([shortURL, value]) => ({
            shortURL,
            originalURL: value.originalURL || '',
            clicks: Number(value.clicks || 0),
            createdAt: Number(value.createdAt || 0),
            lastAccessedAt: Number(value.lastAccessedAt || 0)
        }));

        items.sort((a, b) => b.createdAt - a.createdAt);
        return res.json({ items });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to list URLs' });
    }
};

const deleteURL = async (req, res) => {
    const shortURL = req.params.shortURL;
    if (INVALID_KEY_PATTERN.test(shortURL)) {
        return res.status(400).json({ error: 'Invalid short URL format' });
    }

    try {
        const urlRef = ref(db, `urls/${shortURL}`);
        const snapshot = await get(urlRef);
        if (!snapshot.exists()) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        await remove(urlRef);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete short URL' });
    }
};

module.exports = {
    shortURL,
    newShortURL,
    listURLs,
    deleteURL
};
