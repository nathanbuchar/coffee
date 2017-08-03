const path = require('path');

/**
 * Returns the name of the platform alias used to namespace resources.
 *
 * @returns {string}
 */
function getPlatformAlias() {
  switch (process.platform) {
    case 'darwin': {
      return 'macos';
    }
    case 'win32': {
      return 'win';
    }
    case 'linux': {
      return 'linux';
    }
    default: {
      throw Error(`Unsupported platform "${process.platform}"`);
    }
  }
}

/**
 * Returns the full path to the given resource.
 *
 * @param {string} file
 * @returns {string}
 */
function getResourcePath(file) {
  const platform = getPlatformAlias();

  return path.join(__dirname, `../resources/${platform}`, file);
}

module.exports = {
  getPlatformAlias,
  getResourcePath
};
