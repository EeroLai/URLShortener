const baseUrl = window.location.origin;
const inputUrl = document.getElementById('input_url');
const sendBtn = document.getElementById('btn_send');
const copyBtn = document.getElementById('copy_btn');
const message = document.getElementById('form_message');
const resultBox = document.getElementById('result_box');
const resultLink = document.getElementById('result_link');

function setMessage(text, isError = true) {
    message.textContent = text;
    message.style.color = isError ? '#b45309' : '#0f766e';
}

function showResult(url) {
    resultLink.textContent = url;
    resultLink.href = url;
    resultBox.classList.remove('hidden');
}

async function createShortURL() {
    const originalURL = inputUrl.value.trim();
    if (!/^https?:\/\//i.test(originalURL)) {
        setMessage('Please enter a valid URL starting with http:// or https://');
        return;
    }

    setMessage('Creating short URL...', false);
    try {
        const response = await fetch(`${baseUrl}/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ originalURL })
        });

        const data = await response.json();
        if (!response.ok) {
            setMessage(data.error || 'Failed to create short URL');
            return;
        }

        const shortURL = `${baseUrl}/${data.shortURL}`;
        showResult(shortURL);
        setMessage('Short URL created', false);
    } catch (error) {
        setMessage('Cannot connect to server');
    }
}

async function copyResult() {
    if (!resultLink.href) {
        return;
    }

    try {
        await navigator.clipboard.writeText(resultLink.href);
        setMessage('Copied to clipboard', false);
    } catch (error) {
        setMessage('Copy failed');
    }
}

sendBtn.addEventListener('click', createShortURL);
copyBtn.addEventListener('click', copyResult);

inputUrl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        createShortURL();
    }
});
