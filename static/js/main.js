const btn_send = $('#btn_send');
const input_url = $('#input_url');
const url = 'http://localhost:3000/new/';

(() => {
    function init(){
        handleComponent();
    }

    function handleComponent() {
        btn_send.on('click', () => {
            if(input_url.val().indexOf('https') || input_url.val().indexOf('http')){
                $.post(url,{'originalURL': input_url.val()});
            }else{
                alert('url 無效');
            }
        });
    }

    init();
})();
