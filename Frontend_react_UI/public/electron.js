const electron = require('electron');
const { Menu } = require('electron');
const { dialog } = require('electron');
const isMac = process.platform === 'darwin'
const isLinux = process.platform === 'linux'
const isWindows = process.platform === 'win32'
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const fs = require('fs');

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Print to PDF',
                click ()
                {
                    var options = {
                        marginsType: 0,
                        pargeSize: 'A4',
                        printBackground: true,
                        printSelectionOnly: false,
                        landscape: false
                    }
                    let win = BrowserWindow.getFocusedWindow();

                    pdfpath = dialog.showSaveDialog({filters: [{name: "pdf", extensions: ['pdf']}]},win).then (result => {

                        pdfpath = result.filePath;

                        win.webContents.printToPDF(options).then(data => {
                            fs.writeFile(pdfpath, data, function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    options = {
                                        message: 'PDF successfully written to: ' + pdfpath
                                    }
                                    const response = dialog.showMessageBox(null, options);
                                    console.log(response);
                                }
                            });
                        }).catch(error => {
                            console.log(error)
                        });
                    });
                }
            },
            isMac ? { role: 'close' } : { role: 'quit'}
        ]
    }
]

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 1280, height: 720});
    mainWindow.loadURL('https://cis4250-10.socs.uoguelph.ca/static/index.html');

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});
