import extension from 'extensionizer'
import log from 'loglevel'

/**
 * A wrapper around the extension's storage local API
 */
export default class ExtensionStore {
  /**
   * @constructor
   */
  constructor () {
    this.isSupported = extension.storage !== null ? Boolean(extension.storage.local) : false
    if (!this.isSupported) {
      log.error('Storage local API not available.')
    }
  }

  /**
   * Returns the keys currently saved
   * @returns {Promise<*>}
   */
  async get (key) {
    if (!this.isSupported) {
      return undefined
    }
    const result = await this._get(key)
    // extension.storage.local always returns an obj
    // if the object is empty, treat it as undefined
    if (isEmpty(result)) {
      return undefined
    } else {
      if (key) {
        return result[key]
      } else {
        return result
      }
    }
  }

  /**
   * Sets the key in local state
   * @param {Object} state - The state to set
   * @returns {Promise<void>}
   */
  async set (state) {
    return this._set(state)
  }

  /**
   * remove the key in local state
   * @param {Object} state - The state to set
   * @returns {Promise<void>}
   */
  async remove (state) {
    return this._remove(state)
  }

  /**
   * clear the local state
   * @returns {Promise<void>}
   */
  async clear () {
    return this._clear()
  }

  /**
   * Returns the keys currently saved
   * @private
   * @returns {Object} the key-value map from local storage
   */
  _get (key) {
    const { local } = extension.storage
    return new Promise((resolve, reject) => {
      local.get(key, (/** @type {any} */ result) => {
        const err = checkForError()
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  /**
   * Sets the key in local state
   * @param {Object} obj - The key to set
   * @returns {Promise<void>}
   * @private
   */
  _set (obj) {
    const { local } = extension.storage
    return new Promise((resolve, reject) => {
      local.set(obj, () => {
        const err = checkForError()
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * remove the key in local state
   * @param {Object} obj - The key to remove
   * @returns {Promise<void>}
   * @private
   */
  _remove (obj) {
    const { local } = extension.storage
    return new Promise((resolve, reject) => {
      local.remove(obj, () => {
        const err = checkForError()
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * clear the local state
   * @returns {Promise<void>}
   * @private
   */
  _clear () {
    const { local } = extension.storage
    local.clear()
  }
}

/**
 * Returns whether or not the given object contains no keys
 * @param {Object} obj - The object to check
 * @returns {boolean}
 */
function isEmpty (obj) {
  return Object.keys(obj).length === 0
}

/**
 * Returns an Error if extension.runtime.lastError is present
 * this is a workaround for the non-standard error object that's used
 * @returns {Error|undefined}
 */
function checkForError () {
  const { lastError } = extension.runtime
  if (!lastError) {
    return undefined
  }
  // if it quacks like an Error, its an Error
  if (lastError.stack && lastError.message) {
    return lastError
  }
  // repair incomplete error object (eg chromium v77)
  return new Error(lastError.message)
}
