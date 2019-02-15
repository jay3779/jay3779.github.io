document.querySelector('#menu-bar ul').addEventListener('click', function (evt) {
    let node = evt.target;
    if (document.querySelector('#menu-bar ul').contains(node)) {
        while (node.nodeName !== 'LI') {
            node = node.parentNode;
        }
        document.querySelectorAll('#menu-bar ul>li>a').forEach(node => node.classList.remove('active'));
        node.children[0].classList.add('active');

        let command = node.children[0].dataset && node.children[0].dataset.command;
        loadPage(command.toLowerCase());
    }

});

loadPage('room');

function loadPage(pageName) {
    let mainEle = document.getElementById("content");
    mainEle.innerHTML = '';
    let getContent = (url) => fetch(url).then(res => res.text()).then(res => {
        mainEle.innerHTML = res;
    });
    switch (pageName) {
        case "room":
            $("#content").load('components/room.html');
            break;
        case "user":
            $("#content").load('components/user.html');
            break;
        case "archive":
            $("#content").load('components/archive.html');
            break;
    }
}

document.getElementById('sign-out-button').addEventListener('click', function (evt) {
    window.localStorage.getItem('authorization') && window, localStorage.removeItem('authorization');
    window.localStorage.getItem('room') && window, localStorage.removeItem('room');
    window.localStorage.getItem('userRole') && window, localStorage.removeItem('userRole');
    window.localStorage.getItem('username') && window, localStorage.removeItem('username');
    window.location.href = './login.html';
})