// PlaylistActionList组件测试
// 注意：这是一个基础测试文件，需要配置测试环境才能运行

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PlaylistActionList from '../PlaylistActionList.vue'
import PlaylistActionItem from '../PlaylistActionItem.vue'

const mockActions = [
  {
    id: 'import',
    title: '导入歌单',
    icon: 'mdi-import',
    iconBg: '#2d2d2d',
    description: '从其他平台导入歌单'
  },
  {
    id: 'create',
    title: '新建歌单',
    icon: 'mdi-plus',
    iconBg: '#2d2d2d',
    description: '创建一个新的歌单'
  },
  {
    id: 'favorites',
    title: '我喜欢',
    icon: 'mdi-heart',
    iconBg: '#FF6B6B',
    description: '我收藏的音乐'
  }
]

describe('PlaylistActionList', () => {
  it('应该正确渲染操作项列表', () => {
    const wrapper = mount(PlaylistActionList, {
      props: {
        actions: mockActions
      }
    })

    const actionItems = wrapper.findAllComponents(PlaylistActionItem)
    expect(actionItems).toHaveLength(3)
    
    // 验证第一个操作项的props
    expect(actionItems[0].props('action')).toEqual(mockActions[0])
  })

  it('应该在有标题时显示标题', () => {
    const wrapper = mount(PlaylistActionList, {
      props: {
        actions: mockActions,
        title: '歌单操作'
      }
    })

    expect(wrapper.find('.list-title h3').text()).toBe('歌单操作')
  })

  it('应该在没有标题时隐藏标题区域', () => {
    const wrapper = mount(PlaylistActionList, {
      props: {
        actions: mockActions
      }
    })

    expect(wrapper.find('.list-title').exists()).toBe(false)
  })

  it('应该在操作列表为空时显示空状态', () => {
    const wrapper = mount(PlaylistActionList, {
      props: {
        actions: []
      }
    })

    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-state p').text()).toBe('暂无歌单操作')
  })

  it('应该支持自定义空状态文本', () => {
    const customEmptyText = '没有可用的操作'
    const wrapper = mount(PlaylistActionList, {
      props: {
        actions: [],
        emptyText: customEmptyText
      }
    })

    expect(wrapper.find('.empty-state p').text()).toBe(customEmptyText)
  })

  it('应该将showMore属性传递给子组件', () => {
    const wrapper = mount(PlaylistActionList, {
      props: {
        actions: mockActions,
        showMore: false
      }
    })

    const actionItems = wrapper.findAllComponents(PlaylistActionItem)
    actionItems.forEach(item => {
      expect(item.props('showMore')).toBe(false)
    })
  })

  it('应该正确处理操作项点击事件', async () => {
    const wrapper = mount(PlaylistActionList, {
      props: {
        actions: mockActions
      }
    })

    const firstActionItem = wrapper.findAllComponents(PlaylistActionItem)[0]
    await firstActionItem.vm.$emit('click', mockActions[0])

    expect(wrapper.emitted('action-click')).toBeTruthy()
    expect(wrapper.emitted('action-click')[0][0]).toEqual(mockActions[0])
  })

  it('应该正确处理更多操作点击事件', async () => {
    const wrapper = mount(PlaylistActionList, {
      props: {
        actions: mockActions
      }
    })

    const firstActionItem = wrapper.findAllComponents(PlaylistActionItem)[0]
    await firstActionItem.vm.$emit('more-click', mockActions[0])

    expect(wrapper.emitted('more-click')).toBeTruthy()
    expect(wrapper.emitted('more-click')[0][0]).toEqual(mockActions[0])
  })

  it('应该为每个操作项应用正确的CSS类', () => {
    const wrapper = mount(PlaylistActionList, {
      props: {
        actions: mockActions
      }
    })

    const actionItems = wrapper.findAll('.action-item')
    expect(actionItems).toHaveLength(3)
    
    actionItems.forEach(item => {
      expect(item.classes()).toContain('action-item')
    })
  })

  it('应该在操作列表不为空时隐藏空状态', () => {
    const wrapper = mount(PlaylistActionList, {
      props: {
        actions: mockActions
      }
    })

    expect(wrapper.find('.empty-state').exists()).toBe(false)
    expect(wrapper.findAllComponents(PlaylistActionItem)).toHaveLength(3)
  })
})