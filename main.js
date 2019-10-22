// Modules to control application life and create native browser window
const {app, BrowserWindow, Tray, Menu} = require('electron')
const ipc = require('electron').ipcMain;

const path = require('path')
const ip = require('ip');
const os = require('os');
const socket = require('socket.io-client')
const spawn = require('child_process').spawn;
const axios = require('axios').default;

const Storge = require('./helpers/storage');
const localStorge = new Storge();

const token = localStorge.getItem('token')

const io = socket.connect('http://localhost:8090', {
  transports: ['websocket', 'polling'],
  query: {
    token: token
  }
})





const winIcon = path.resolve(__dirname, 'icon.ico');
const macIcon = path.resolve(__dirname, 'icon.png');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let iconApp
let userId

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  mainWindow.webContents.send('test', {token: localStorge.getItem('token')})


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    io.emit('device-status', localStorge.getItem('id'), false);
    mainWindow = null
  })
}

const cliced = () => {
  mainWindow.hide()
  console.log('cliced')
}

const showWind = () => {
  mainWindow.show()
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  iconApp = new Tray(os.platform() === 'darwin' ? macIcon : winIcon);
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Connect', type: 'normal', click: showWind},
    {label: 'Close', type: 'normal', click: cliced},
  ])
  iconApp.setToolTip('Closy app')
  iconApp.setContextMenu(contextMenu)
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})


const data = {
  deviceName: os.userInfo().username,
  deviceType: os.platform() === 'darwin' ? 'Mac OS' : os.platform() === 'win32' ? 'Windows' : 'n/a',
  connected: io.connected ? true : false
}

let userData;


if(io.connected) {
  io.emit('sign-device-id', localStorge.setItem('id'), data);
}


ipc.on('load', (event) => {

  // axios({
  //   method: 'get',
  //   url: 'http://localhost:8090/users/user',
  //   headers: {'auth': token}
  // }).then((res) => {
  //   localStorge.setItem('id', res.data.id)
  //   userData = res.data;
  // }).catch((e) => {
  //   console.log(e);
  // })
})


const loadD = () => {
  axios({
    method: 'get',
    url: 'http://localhost:8090/users/user',
    headers: {'auth': localStorge.getItem('token')}
  }).then((res) => {
    userData = res.data;
    localStorge.setItem('id', res.data.id)
  }).catch((e) => {
    console.log(e);
  })
}


ipc.on('login', event => {
  console.log('login')
  axios({
    method: 'post',
    url: 'http://localhost:8090/users/login',
    headers: {'Content-Type': 'application/json'},
    data: {
      email: 'email',
      password: 'pass'
    }
  }).then((res) => {
    localStorge.setMulti({token: res.data.token, id: ''});
  }).catch((e) => {
    console.log(e);
  }).finally(() => {
    loadD();
  })
})

ipc.on('test', event => {
  io.emit('sign-device-id', localStorge.getItem('id'), data);
  console.log('test event')
})

io.on('called', d => {
  console.log('Connected', d);
  spawn('explorer.exe', ['.'])
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
