const btn_send = $('#btn_send');
const input_url = $('#input_url');
const url = 'http://localhost:3000';

(() => {
    function init() {
        handleComponent();
    }

    function handleComponent() {
        btn_send.on('click', () => {
            if (!input_url.val().indexOf('https') || !input_url.val().indexOf('http')) {
                $.post(url + '/new/', { 'originalURL': input_url.val() }, (data) => {
                    alert(url + '/' + data.shortURL);
                });
            } else {
                alert('url 無效');
            }
        });
    }

    init();
})();
