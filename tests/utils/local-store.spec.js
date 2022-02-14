/* eslint-disable no-undef */
import ExtensionStore from '@/utils/local-store'

jest.mock('extensionizer', () => {
  return {
    storage: {
      local: {
        set: (obj) => {
          jest.fn()
        },
        get: jest.fn()
      }
    },
    runtime: null
  }
})
test('local-store', async () => {
  const store = new ExtensionStore()
  store.set({ key: 1 })
  // store.get('key')
  // store.remove('key')
  // store.clear()
})
