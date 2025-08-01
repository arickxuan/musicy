
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
    state: () => {
        return { count: 0 }
    },
    // 也可以这样定义
    // state: () => ({ count: 0 })
    getters: {
        doubleCount: (state) => state.count * 2,
    },
    actions: {
        increment() {
            this.count++
        },
    },
})

export const useCounterStore2 = defineStore('counter2', () => {
    const count = ref(0)
    const name = ref('Eduardo')
    const doubleCount = computed(() => count.value * 2)
    function increment() {
        count.value++
    }

    return { count, name, doubleCount, increment }
})

export const useConfigStore = defineStore('config', () => {
    const name = ref('default')
    const configs = ref([])
    const show = computed(() => {
        return configs.value.length > 0
    })
    function Add(item) {
        configs.push(item)
    }

    return { name, configs, show, Add }
})

export const useSongListStore = defineStore('song_list', () => {
    const name = ref('default')
    const list = ref([])
    const show = computed(() => {
        return configs.value.length > 0
    })
    const itemCount = computed(() => items.value.length)
    const getItemById = computed(() => {
        return (id) => list.value.find(item => item.id === id)
    })
    const lastItem = computed(() => {
        return list.value[list.value.length - 1] || null
    })
    const addItem = (item) => {
        list.value.push(item)
    }

    const addItems = (itemsArray) => {
        list.value.push(...itemsArray)
    }

    const removeItem = (index) => {
        if (index >= 0 && index < list.value.length) {
            const removed = list.value.splice(index, 1)
            console.log('删除元素:', removed[0])
            return removed[0]
        }
    }

    const removeItemById = (id) => {
        const index = list.value.findIndex(item => item.id === id)
        if (index !== -1) {
            return removeItem(index)
        }
    }

    const clearItems = () => {
        list.value = []
    }

    return { name, list, itemCount, lastItem,getItemById, addItem, addItems, removeItem, removeItemById, clearItems }
})