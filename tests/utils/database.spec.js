/* eslint-disable no-undef */
import { Database } from '@/utils/database.js'

describe('IndexedDB', () => {
  beforeEach(async () => {
    const db = new Database()
  })
  test('fn Database()', async () => {
    // await db.getTable('addressBook', { khazix: 'khazix' })
    // await db.addTable('addressBook', {})
    // await db.bulkAddTable('addressBook', [])
    // await db.bulkPutTable('addressBook', [])
    // await db.modifyTable('addressBook', { khazix: 'khazix' }, { khazix: 'khazix' })
    // await db.deleteTable('addressBook', { khazix: 'khazix' })
    // await db.clearTable()
  })
})
