// PlaylistActionItem组件测试
// 注意：这是一个基础测试文件，需要配置测试环境才能运行

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PlaylistActionItem from '../PlaylistActionItem.vue'

const mockAction = {
  id: 'import',
  title: '导入歌单',
  icon: 'mdi-import',
  iconBg: '#2d2d2d',
  description: '从其他平台导入歌单'
}

describe('PlaylistActionItem', () => {
  it('应该正确渲染操作项的基本信息', () => {
    const wrapper = mount(PlaylistActionItem, {
      props: {
        action: mockAction
      }
    })

    expect(wrapper.find('.action-title').text()).toBe('导入歌单')
    expect(wrapper.find('.action-description').text()).toBe('从其他平台导入歌单')
    expect(wrapper.find('.v-icon').attributes('class')).toContain('mdi-import')
  })

  it('应该在没有描述时隐藏描述元素', () => {
    const actionWithoutDesc = {
      id: 'test',
      title: '测试操作',
      icon: 'mdi-test'
    }

    const wrapper = mount(PlaylistActionItem, {
      props: {
        action: actionWithoutDesc
      }
    })

    expect(wrapper.find('.action-description').exists()).toBe(false)
  })

  it('应该根据showMore prop显示或隐藏更多按钮', () => {
    const wrapperWithMore = mount(PlaylistActionItem, {
      props: {
        action: mockAction,
        showMore: true
      }
    })

    const wrapperWithoutMore = mount(PlaylistActionItem, {
      props: {
        action: mockAction,
        showMore: false
      }
    })

    expect(wrapperWithMore.find('.action-more').exists()).toBe(true)
    expect(wrapperWithoutMore.find('.action-more').exists()).toBe(false)
  })

  it('应该在点击时触发click事件', async () => {
    const wrapper = mount(PlaylistActionItem, {
      props: {
        action: mockAction
      }
    })

    await wrapper.find('.playlist-action-item').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')[0][0]).toEqual(mockAction)
  })

  it('应该在点击更多按钮时触发more-click事件', async () => {
    const wrapper = mount(PlaylistActionItem, {
      props: {
        action: mockAction,
        showMore: true
      }
    })

    await wrapper.find('.action-more button').trigger('click')
    expect(wrapper.emitted('more-click')).toBeTruthy()
    expect(wrapper.emitted('more-click')[0][0]).toEqual(mockAction)
  })

  it('应该阻止更多按钮的点击事件冒泡', async () => {
    const wrapper = mount(PlaylistActionItem, {
      props: {
        action: mockAction,
        showMore: true
      }
    })

    await wrapper.find('.action-more button').trigger('click')
    
    // 点击更多按钮不应该触发主要的click事件
    expect(wrapper.emitted('click')).toBeFalsy()
    expect(wrapper.emitted('more-click')).toBeTruthy()
  })

  it('应该验证action prop的必需字段', () => {
    const invalidAction = {
      title: '无效操作' // 缺少id和icon
    }

    // 这个测试验证validator函数
    const validator = PlaylistActionItem.props.action.validator
    expect(validator(mockAction)).toBe(true)
    expect(validator(invalidAction)).toBe(false)
  })

  it('应该为不同的操作类型返回正确的图标颜色', () => {
    const wrapper = mount(PlaylistActionItem, {
      props: {
        action: { ...mockAction, id: 'favorites' }
      }
    })

    // 测试getIconColor方法的逻辑
    const vm = wrapper.vm
    expect(vm.getIconColor()).toBe('white')
  })
})