const btnSend = $('#btn_send');
const inputUrl = $('#input_url');
const baseUrl = window.location.origin;

(() => {
    function init() {
        bindActions();
    }

    function bindActions() {
        btnSend.on('click', async () => {
            const originalURL = inputUrl.val().trim();
            if (!/^https?:\/\//i.test(originalURL)) {
                alert('Please enter a valid URL starting with http:// or https://');
                return;
            }

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
                    alert(data.error || 'Failed to create short URL');
                    return;
                }

                alert(`${baseUrl}/${data.shortURL}`);
            } catch (error) {
                alert('Cannot connect to server');
            }
        });
    }

    init();
})();

