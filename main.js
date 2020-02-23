// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const { Menu, MenuItem } = require("electron");
const path = require("path");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true
    }
  });

  let menuTemplate = [
    {
      label: "Menu",
      submenu: [
        {
          label: "New",
          click() {
            mainWindow.webContents.send("add");
          },
          accelerator: "CmdOrCtrl+n"
        },
        {
          label: "Delete",
          click() {
            mainWindow.webContents.send("delete");
          },
          accelerator: "CmdOrCtrl+q"
        },
        { type: "separator" }, // Add this
        {
          label: "Exit",
          click() {
            app.quit();
          }
        }
      ]
    }
  ];

  if (process.env.NODE_ENV !== "production") {
    menuTemplate.push({
      label: "Developer Tools",
      submenu: [
        {
          role: "reload"
        },
        {
          label: "Toggle DevTools",
          accelerator:
            process.platform == "darwin" ? "Command+Shift+I" : "Ctrl+Shift+I",
          click(item, focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        }
      ]
    });
  }

  let menu = Menu.buildFromTemplate(menuTemplate);

  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  mainWindow.maximize(true);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
