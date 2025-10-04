const { app, BrowserWindow, screen, ipcMain, Tray, Menu } = require('electron')
const path = require('path')
const fs = require('fs')

let win

app.whenReady().then(() => {
  const { width } = screen.getPrimaryDisplay().workAreaSize
  const winWidth = 480
  const winHeight = 678

  win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: width - winWidth - 20,
    y: 20,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    focusable: false,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.platform === 'darwin') {
    win.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true,
    })
  }

  win.loadFile('./html/index.html')

  win.setIgnoreMouseEvents(true, { forward: true })

  const iconPath = path.join(__dirname, '..', 'taskbar.png')
  const tray = new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Salir',
      click: () => {
        app.quit()
      },
    },
  ])

  tray.setToolTip('Killfeed Overlay')
  tray.setContextMenu(contextMenu)

  ipcMain.on('log', (event, msg) => {
    console.log('Log desde renderer:', msg)
  })

  win.webContents.once('did-finish-load', () => {
    const weaponsDir = path.join(__dirname, '..', 'assets', 'weapons')

    const files = fs.readdirSync(weaponsDir)

    const weaponImages = {}
    files.forEach((file) => {
      const ext = path.extname(file).toLowerCase()
      if (['.webp', '.png', '.jpg', '.jpeg'].includes(ext)) {
        const name = path.parse(file).name
        weaponImages[name] = path.join(__dirname, '..', 'assets', 'weapons', file)
      }
    })

    win.webContents.send('weapons-data', weaponImages)
  })
})
