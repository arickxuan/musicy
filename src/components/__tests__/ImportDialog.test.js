// ImportDialog组件测试
// 注意：这是一个基础测试文件，需要配置测试环境才能运行

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ImportDialog from '../ImportDialog.vue'

describe('ImportDialog', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ImportDialog, {
      props: {
        visible: true
      }
    })
  })

  it('应该正确渲染对话框', () => {
    expect(wrapper.find('.import-dialog-card').exists()).toBe(true)
    expect(wrapper.find('.dialog-header h3').text()).toBe('选择导入来源')
  })

  it('应该显示所有导入源选项', () => {
    const sourceCards = wrapper.findAll('.source-card')
    expect(sourceCards).toHaveLength(3)
    
    const sourceNames = sourceCards.map(card => 
      card.find('.source-name').text()
    )
    expect(sourceNames).toContain('QQ音乐')
    expect(sourceNames).toContain('网易云音乐')
    expect(sourceNames).toContain('链接导入')
  })

  it('应该能够选择导入源', async () => {
    const firstSourceCard = wrapper.find('.source-card')
    await firstSourceCard.trigger('click')
    
    expect(firstSourceCard.classes()).toContain('selected')
  })

  it('应该在选择导入源后启用下一步按钮', async () => {
    const nextButton = wrapper.find('button:contains("下一步")')
    expect(nextButton.attributes('disabled')).toBeDefined()
    
    const firstSourceCard = wrapper.find('.source-card')
    await firstSourceCard.trigger('click')
    
    expect(nextButton.attributes('disabled')).toBeUndefined()
  })

  it('应该能够进入配置步骤', async () => {
    // 选择导入源
    const firstSourceCard = wrapper.find('.source-card')
    await firstSourceCard.trigger('click')
    
    // 点击下一步
    const nextButton = wrapper.find('button:contains("下一步")')
    await nextButton.trigger('click')
    
    expect(wrapper.find('.dialog-header h3').text()).toBe('配置导入参数')
    expect(wrapper.find('.import-config').exists()).toBe(true)
  })

  it('应该根据选择的导入源显示不同的配置界面', async () => {
    // 选择URL导入
    const urlSourceCard = wrapper.findAll('.source-card')[2] // 第三个是链接导入
    await urlSourceCard.trigger('click')
    
    const nextButton = wrapper.find('button:contains("下一步")')
    await nextButton.trigger('click')
    
    expect(wrapper.find('input[placeholder="https://..."]').exists()).toBe(true)
  })

  it('应该验证URL输入格式', async () => {
    // 选择URL导入并进入配置步骤
    const urlSourceCard = wrapper.findAll('.source-card')[2]
    await urlSourceCard.trigger('click')
    
    const nextButton = wrapper.find('button:contains("下一步")')
    await nextButton.trigger('click')
    
    // 输入无效URL
    const urlInput = wrapper.find('input[placeholder="https://..."]')
    await urlInput.setValue('invalid-url')
    
    // 触发验证
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.urlError).toBe('请输入有效的URL地址')
  })

  it('应该验证歌单ID输入格式', async () => {
    // 选择QQ音乐并进入配置步骤
    const qqSourceCard = wrapper.findAll('.source-card')[0]
    await qqSourceCard.trigger('click')
    
    const nextButton = wrapper.find('button:contains("下一步")')
    await nextButton.trigger('click')
    
    // 输入无效ID
    const idInput = wrapper.find('input[placeholder*="1839459328"]')
    await idInput.setValue('invalid-id')
    
    // 触发验证
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.idError).toBe('请输入有效的数字ID')
  })

  it('应该能够返回上一步', async () => {
    // 进入配置步骤
    const firstSourceCard = wrapper.find('.source-card')
    await firstSourceCard.trigger('click')
    
    const nextButton = wrapper.find('button:contains("下一步")')
    await nextButton.trigger('click')
    
    // 点击上一步
    const prevButton = wrapper.find('button:contains("上一步")')
    await prevButton.trigger('click')
    
    expect(wrapper.find('.dialog-header h3').text()).toBe('选择导入来源')
    expect(wrapper.find('.source-selection').exists()).toBe(true)
  })

  it('应该在关闭对话框时重置状态', async () => {
    // 选择导入源
    const firstSourceCard = wrapper.find('.source-card')
    await firstSourceCard.trigger('click')
    
    // 关闭对话框
    const closeButton = wrapper.find('.dialog-header button')
    await closeButton.trigger('click')
    
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('应该在导入过程中禁用关闭按钮', async () => {
    // 设置导入状态
    await wrapper.setData({ isImporting: true })
    
    const closeButton = wrapper.find('.dialog-header button')
    expect(closeButton.attributes('disabled')).toBeDefined()
  })

  it('应该正确计算是否可以开始导入', async () => {
    // 选择URL导入并进入配置步骤
    const urlSourceCard = wrapper.findAll('.source-card')[2]
    await urlSourceCard.trigger('click')
    
    const nextButton = wrapper.find('button:contains("下一步")')
    await nextButton.trigger('click')
    
    // 输入有效URL
    const urlInput = wrapper.find('input[placeholder="https://..."]')
    await urlInput.setValue('https://example.com/playlist')
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.canStartImport).toBe(true)
  })
})