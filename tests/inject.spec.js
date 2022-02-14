/* eslint-disable no-undef */
import inject from '@/inject'

test('fn inject version ', () => {
  console.log(inject)
  const { version, request, on } = window.FiveToken
  request('post', 'hello')
  on('accountsChanged', () => {})
  expect(version).toBe('1.2.2')
})
