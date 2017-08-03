const { Menu, Tray, app, powerSaveBlocker } = require('electron');
const { argv } = require('yargs');

const settings = require('./settings');

function App() {

  /**
   * A reference to the Tray instance.
   *
   * @type {Tray}
   * @private
   */
  let tray;

  /**
   * The blocker ID that is assigned to the power blocker,
   * if it is running.
   *
   * @type {?number}
   * @private
   */
  let powerSaveBlockerId;

  /**
   * Initializes the App instance.
   *
   * @private
   */
  function init() {
    setupDock();
    setupTray();
  }

  /**
   * Sets up the dock icon.
   *
   * @private
   */
  function setupDock() {
    app.dock.setIcon(settings.Icons.DOCK);

    if (!argv.debug) {
      app.dock.hide();
    }
  }

  /**
   * Sets up the tray.
   *
   * @private
   */
  function setupTray() {
    const icon = getTrayIcon();

    tray = new Tray(icon);

    updateTray();
  }

  /**
   * Gets the path to the appropriate tray icon.
   *
   * @returns {string}
   * @private
   */
  function getTrayIcon() {
    return powerSaveBlockerId === undefined ?
      settings.Icons.DISABLED :
      settings.Icons.ENABLED;
  }

  /**
   * Builds the tray menu.
   *
   * @returns {Menu}
   * @private
   */
  function buildMenu() {
    return Menu.buildFromTemplate([
      {
        label: powerSaveBlockerId !== undefined ?
          'Deactivate' :
          'Activate',
        click() {
          toggle();
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Open at Login',
        type: 'checkbox',
        checked: app.getLoginItemSettings().openAtLogin,
        click(menuItem) {
          app.setLoginItemSettings({
            openAtLogin: menuItem.checked
          });
        }
      },
      {
        label: 'Quit',
        click() {
          app.quit();
        }
      }
    ]);
  }

  /**
   * Updates the tray.
   *
   * @private
   */
  function updateTray() {
    const icon = getTrayIcon();
    const menu = buildMenu();

    tray.setImage(icon);
    tray.setContextMenu(menu);
    tray.setToolTip(`Coffee v${app.getVersion()}\nBy Nathan Buchar`);
  }

  /**
   * Toggles coffee.
   *
   * @private
   */
  function toggle() {
    if (powerSaveBlockerId === undefined) {
      powerSaveBlockerId = powerSaveBlocker.start('prevent-display-sleep');
    } else {
      powerSaveBlocker.stop(powerSaveBlockerId);

      // Ensure that the powerSaveBlocker has been stopped.
      if (!powerSaveBlocker.isStarted(powerSaveBlockerId)) {
        powerSaveBlockerId = undefined;
      }
    }

    updateTray();
  }

  init();
}

module.exports = App;
