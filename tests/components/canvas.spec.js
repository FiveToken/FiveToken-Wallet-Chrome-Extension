/* eslint-disable no-undef */
import { mount } from '@vue/test-utils'
import kyCanvas from '@/components/canvas'
describe('canvas component', () => {
  test('canvas-test', () => {
    const wrapper = mount(kyCanvas, {
      propsData: {
        contract: '0x740542fb3a6ca5ab1dcd067a7e08af9ab9c16886'
      }
    })
    expect(wrapper.html()).toContain('token-logo')
  })
})
