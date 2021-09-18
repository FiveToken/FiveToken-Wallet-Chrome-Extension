/* eslint-disable no-undef */
import { mount } from '@vue/test-utils'
import kyBack from '@/components/back'
describe('back component', () => {
  test('back-test', () => {
    const wrapper = mount(kyBack, {
      propsData: {
        name: 'back-test',
        close: true
      }
    })
    expect(wrapper.html()).toContain('back-component')
    const back = wrapper.find('.back')
    back.trigger('click')
    const close = wrapper.find('.close')
    close.trigger('click')
    expect(wrapper.find('.back').exists()).toBe(true)
    expect(wrapper.find('.name').exists()).toBe(true)
    expect(wrapper.find('.close').exists()).toBe(true)
  })
})
