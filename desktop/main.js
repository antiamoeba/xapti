const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

let uploadWindow;

function createUploadWindow () {
  uploadWindow = new BrowserWindow({width: 400, height: 500});

  uploadWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'upload.html'),
    protocol: 'file:',
    slashes: true
  }));

  uploadWindow.on('closed', function () {
    uploadWindow = null
  });
}

app.on('ready', createUploadWindow)

app.on('window-all-closed', function () {
  app.quit();
});

app.on('activate', function () {
  if (uploadWindow === null) {
    createUploadWindow();
  }
});
