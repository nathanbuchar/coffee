const { Menu, Tray, app, powerSaveBlocker } = require('electron');
const debug = require('debug')('coffee:app');
const path = require('path');

class App {

  /**
   * Creates a new App instance.
   *
   * @constructor
   */
  constructor() {

    /**
     * A reference to the Tray instance.
     *
     * @type {Tray}
     * @private
     */
    this._tray = null;

    /**
     * The blocker ID that is assigned to this power blocker,
     * if it is running.
     *
     * @default null
     * @type {string|null}
     * @private
     */
    this._powerSaveBlockerId = null;

    this._init();
  }

  /**
   *
   *
   * @private
   */
  _init() {
    debug('initializing...');

    this._initDock();
    this._initTray();
  }

  /**
   * Initializes the dock.
   *
   * @private
   */
  _initDock() {
    debug('initializing dock...');

    app.dock.hide();
  }

  /**
   * Initializes the Tray instance.
   *
   * @private
   */
  _initTray() {
    debug('initializing tray...');

    this._tray = new Tray(App.Icons.DISABLED);

    this._updateTray();
  }

  /**
   * Builds the app's Tray's menu.
   *
   * @returns {Menu}
   * @private
   */
  _buildMenu() {
    debug('building menu...');

    return Menu.buildFromTemplate([
      {
        label: (this._powerSaveBlockerId !== null ? 'Deactivate' : 'Activate'),
        click: () => {
          this._toggle();
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Open at Login',
        type: 'checkbox',
        checked: app.getLoginItemSettings().openAtLogin,
        click: menuItem => {
          app.setLoginItemSettings({
            openAtLogin: menuItem.checked
          });
        }
      },
      {
        label: 'Quit',
        click: () => {
          this._quit();
        }
      }
    ]);
  }

  /**
   * Updates the Tray.
   *
   * @private
   */
  _updateTray() {
    debug('updating tray...');

    const menu = this._buildMenu();

    if (this._powerSaveBlockerId !== null) {
      this._tray.setImage(App.Icons.ENABLED);
      this._tray.setPressedImage(App.Icons.ENABLED_PRESSED);
    } else {
      this._tray.setImage(App.Icons.DISABLED);
      this._tray.setPressedImage(App.Icons.DISABLED_PRESSED);
    }

    this._tray.setContextMenu(menu);
    this._tray.setToolTip(`Coffee v${app.getVersion()}\nBy Nathan Buchar`);
  }

  /**
   * Toggles coffee.
   *
   * @private
   */
  _toggle() {
    if (this._powerSaveBlockerId !== null) {
      this._deactivate();
    } else {
      this._activate();
    }
  }

  /**
   * Activates coffee.
   *
   * @private
   */
  _activate() {
    debug('activating coffee...');

    this._powerSaveBlockerId = powerSaveBlocker.start('prevent-display-sleep');

    this._updateTray();
  }

  /**
   * Deactivates coffee.
   *
   * @private
   */
  _deactivate() {
    debug('deactivating coffee...');

    powerSaveBlocker.stop(this._powerSaveBlockerId);
    this._powerSaveBlockerId = null;

    this._updateTray();
  }

  /**
   * Quits the app.
   *
   * @public
   */
  _quit() {
    debug('quitting app...');

    app.quit();
  }
}

/**
 * AppTray icon paths.
 *
 * @enum {string}
 * @static
 */
App.Icons = {
  DISABLED:
    path.join(
      __dirname, '../resources/osx/Coffee-Disabled-Template.png'),
  DISABLED_PRESSED:
    path.join(
      __dirname, '../resources/osx/Coffee-Disabled-Pressed-Template.png'),
  ENABLED:
    path.join(
      __dirname, '../resources/osx/Coffee-Enabled-Template.png'),
  ENABLED_PRESSED:
    path.join(
      __dirname, '../resources/osx/Coffee-Enabled-Pressed-Template.png')
};

module.exports = new App();
