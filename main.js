const electron = require("electron");
const { Menu, MenuItem, Tray } = require("electron");
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");

let tray = null;
app.on("ready", () => {
  tray = new Tray("./twitter.png");
  tray.setToolTip("Twitter");
  tray.on("right-click", () => ctxMenu.popup(mainWindow));
  tray.on("click", function(event) {
    toggleWindow();

    // Show devtools when command clicked
    if (mainWindow.isVisible() && process.defaultApp && event.metaKey) {
      mainWindow.openDevTools({ mode: "detach" });
    }
  });

  const ctxMenu = new Menu();
  ctxMenu.append(
    new MenuItem({
      label: "Quit",
      click: () => app.quit()
    })
  );
});

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x: x, y: y };
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  mainWindow.on("blur", () => {
    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
      tray.setHighlightMode("never");
    }
  });
}

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
    tray.setHighlightMode("never");
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const position = getWindowPosition();
  mainWindow.setPosition(position.x, position.y, false);
  mainWindow.show();
  tray.setHighlightMode("always");
  mainWindow.focus();
};

app.on("ready", createWindow);

app.dock.hide();
