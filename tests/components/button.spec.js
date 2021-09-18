/* eslint-disable no-undef */
import { mount } from '@vue/test-utils'
import kyButton from '@/components/button'
describe('button component', () => {
  test('button-test', () => {
    const wrapper = mount(kyButton, {
      propsData: {
        text: 'button-test',
        type: 'default', // default "primary"
        active: true,
        loading: true
      }
    })
    expect(wrapper.html()).toContain('button-wrap')
    const button = wrapper.find('.button')
    button.trigger('click')
  })
})
