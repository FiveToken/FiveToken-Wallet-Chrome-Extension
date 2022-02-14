/* eslint-disable no-undef */
import component from '@/components/index.js'
import { createLocalVue } from '@vue/test-utils'
const localVue = createLocalVue()
test('fn install ', () => {
  component.install(localVue)
})
