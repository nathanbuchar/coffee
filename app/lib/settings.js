const { getResourcePath } = require('./utils');

const settings = Object.freeze({
  Icons: {

    /**
     * The path to the dock icon.
     *
     * @type {string}
     */
    DOCK: getResourcePath('Coffee-Icon.png'),

    /**
     * The path to the enabled tray icon template.
     *
     * @type {string}
     */
    ENABLED: getResourcePath('Coffee-Enabled-Template.png'),

    /**
     * The path to the disabled tray icon template.
     *
     * @type {string}
     */
    DISABLED: getResourcePath('Coffee-Disabled-Template.png')
  }
});

module.exports = settings;
