/* eslint-disable no-undef */
import { mount } from '@vue/test-utils'
import kyInput from '@/components/input'
describe('input component', () => {
  test('input-text', () => {
    const wrapper = mount(kyInput, {
      data () {
        return {
          eye: false
        }
      },
      propsData: {
        value: 'input-test',
        error: true,
        suffix: true
      },
      stubs: {
        'el-input': true
      }
    })
    wrapper.setData({
      currentValue: 'new Value'
    })
    expect(wrapper.html()).toContain('input-component')
    const eye = wrapper.find('.el-icon-view')
    eye.trigger('click')
    expect(wrapper.html()).toContain('eye')
  })
})
