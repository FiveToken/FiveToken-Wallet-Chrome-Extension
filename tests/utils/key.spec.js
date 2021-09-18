/* eslint-disable no-undef */
import {
  genSalt,
  genKek
} from '@/utils/key.js'

test('fn genSalt()', () => {
  expect(genSalt('Aa123456')).toBe('Ur79Zed0RBWDAU4wz0/00uqdRKFCa0HujGKsqAthGcY=')
})
test('fn genKek()', () => {
  expect(genKek('Aa123456')).toBe('PWYbGFjvrmaeedDQaCrPX26MZ5VWAfTbBr/WHeFEs1k=')
})
