// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const ipc = window.require('electron').ipcRenderer;


const login = document.getElementById('login');
const load = document.getElementById('pringit');
const test = document.getElementById('test');


login.addEventListener('click', () => {
    ipc.send('login');
}, false)

load.addEventListener('click', () => {
    ipc.send('load');
}, false)

test.addEventListener('click', () => {
    ipc.send('test');
}, false)

