// PageHeader组件测试
// 注意：这是一个基础测试文件，需要配置测试环境才能运行

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import PageHeader from '../PageHeader.vue'

// 创建模拟路由
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } }
  ]
})

describe('PageHeader', () => {
  it('应该正确渲染默认标题', async () => {
    const wrapper = mount(PageHeader, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.header-title h2').text()).toBe('歌单导入')
  })

  it('应该正确渲染自定义标题', async () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: '自定义标题'
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.header-title h2').text()).toBe('自定义标题')
  })

  it('应该根据props显示或隐藏返回按钮', async () => {
    const wrapperWithBack = mount(PageHeader, {
      props: {
        showBack: true
      },
      global: {
        plugins: [router]
      }
    })

    const wrapperWithoutBack = mount(PageHeader, {
      props: {
        showBack: false
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapperWithBack.find('.back-button').exists()).toBe(true)
    expect(wrapperWithoutBack.find('.back-button').exists()).toBe(false)
  })

  it('应该根据props显示或隐藏搜索按钮', async () => {
    const wrapperWithSearch = mount(PageHeader, {
      props: {
        showSearch: true
      },
      global: {
        plugins: [router]
      }
    })

    const wrapperWithoutSearch = mount(PageHeader, {
      props: {
        showSearch: false
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapperWithSearch.find('.search-button').exists()).toBe(true)
    expect(wrapperWithoutSearch.find('.search-button').exists()).toBe(false)
  })

  it('应该在点击返回按钮时触发back-click事件', async () => {
    const wrapper = mount(PageHeader, {
      props: {
        showBack: true
      },
      global: {
        plugins: [router]
      }
    })

    await wrapper.find('.back-button').trigger('click')
    expect(wrapper.emitted('back-click')).toBeTruthy()
  })

  it('应该在点击搜索按钮时触发search-click事件', async () => {
    const wrapper = mount(PageHeader, {
      props: {
        showSearch: true
      },
      global: {
        plugins: [router]
      }
    })

    await wrapper.find('.search-button').trigger('click')
    expect(wrapper.emitted('search-click')).toBeTruthy()
  })
})