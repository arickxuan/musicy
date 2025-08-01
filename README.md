# Tauri + Vue 3

This template should help get you started developing with Tauri + Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)


https://y.qq.com/musicmac/v6/playlist/detail.html?id=1839459328

https://i.y.qq.com/n2/m/share/details/taoge.html?ADTAG=ryqq.playlist&id=9078754506

2014519842


```
fetch("https://c.y.qq.com/v8/fcg-bin/fcg_v8_playlist_cp.fcg?newsong=1&id=2014519842&format=json&inCharset=GB2312&outCharset=utf-8").then(data => data.json()).then(data => {
    console.log(Array.from(data.data.cdlist).flatMap(u => u.songlist).map(m => m.name + " - " + Array.from(m.singer).map(c => c.name).reduce((s1, s2) => s1 + "," + s2)).reduce((s1, s2) => s1 + '\n' + s2))
})

#昵称
data.cdlist[0].nickname

#哥单名
data.cdlist[0].dissname

data.cdlist[0].logo

#头像
data.cdlist[0].headurl

#歌单
songlist[]

歌名
title
name
#歌手
singer[0].name
singer[0].title
#专辑
album.name
album.title
```