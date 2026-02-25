const baseUrl = window.location.origin;
const rowsRoot = document.getElementById('url_rows');
const searchInput = document.getElementById('search_input');
const statusLine = document.getElementById('status');
const refreshBtn = document.getElementById('refresh_btn');

let items = [];

function formatDate(timestamp) {
    if (!timestamp) {
        return '-';
    }

    return new Date(timestamp).toLocaleString();
}

function setStatus(text, isError = false) {
    statusLine.textContent = text;
    statusLine.style.color = isError ? '#be123c' : '#64748b';
}

function renderRows() {
    const key = searchInput.value.trim().toLowerCase();
    const filtered = items.filter((item) =>
        item.shortURL.toLowerCase().includes(key) ||
        item.originalURL.toLowerCase().includes(key)
    );

    if (!filtered.length) {
        rowsRoot.innerHTML = '<tr><td colspan="5">No URLs found</td></tr>';
        return;
    }

    rowsRoot.innerHTML = filtered.map((item) => {
        const shortLink = `${baseUrl}/${item.shortURL}`;
        return `
            <tr>
                <td><a href="${shortLink}" target="_blank" rel="noopener noreferrer">${item.shortURL}</a></td>
                <td><a class="truncate" href="${item.originalURL}" target="_blank" rel="noopener noreferrer">${item.originalURL}</a></td>
                <td>${item.clicks}</td>
                <td>${formatDate(item.createdAt)}</td>
                <td>
                    <div class="actions">
                        <button data-copy="${shortLink}">Copy</button>
                        <button class="danger" data-delete="${item.shortURL}">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

async function loadURLs() {
    setStatus('Loading...');
    try {
        const response = await fetch(`${baseUrl}/api/urls`);
        const data = await response.json();
        if (!response.ok) {
            setStatus(data.error || 'Failed to load URLs', true);
            return;
        }

        items = data.items || [];
        renderRows();
        setStatus(`Loaded ${items.length} URL(s)`);
    } catch (error) {
        setStatus('Cannot connect to server', true);
    }
}

async function removeURL(shortURL) {
    try {
        const response = await fetch(`${baseUrl}/api/urls/${shortURL}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const data = await response.json();
            setStatus(data.error || 'Delete failed', true);
            return;
        }

        items = items.filter((item) => item.shortURL !== shortURL);
        renderRows();
        setStatus(`Deleted ${shortURL}`);
    } catch (error) {
        setStatus('Cannot connect to server', true);
    }
}

rowsRoot.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
        return;
    }

    const copyValue = target.dataset.copy;
    if (copyValue) {
        try {
            await navigator.clipboard.writeText(copyValue);
            setStatus('Copied to clipboard');
        } catch (error) {
            setStatus('Copy failed', true);
        }
        return;
    }

    const deleteValue = target.dataset.delete;
    if (deleteValue) {
        if (window.confirm(`Delete short URL "${deleteValue}"?`)) {
            await removeURL(deleteValue);
        }
    }
});

searchInput.addEventListener('input', renderRows);
refreshBtn.addEventListener('click', loadURLs);

loadURLs();
