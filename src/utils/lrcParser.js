/**
 * LRC歌词解析工具
 */

/**
 * 解析LRC格式的歌词
 * @param {string} lrcText - LRC格式的歌词文本
 * @returns {Object} 解析后的歌词对象
 */
export function parseLrc(lrcText) {
  const lines = lrcText.split('\n')
  const lyrics = []
  const info = {}
  
  // 时间标签正则表达式
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g
  // 信息标签正则表达式
  const infoRegex = /\[(\w+):(.*)\]/
  
  lines.forEach(line => {
    line = line.trim()
    if (!line) return
    
    // 检查是否是信息标签
    const infoMatch = line.match(infoRegex)
    if (infoMatch && !timeRegex.test(line)) {
      const [, key, value] = infoMatch
      info[key] = value
      return
    }
    
    // 解析时间标签和歌词
    const matches = [...line.matchAll(timeRegex)]
    if (matches.length === 0) return
    
    // 获取歌词文本（移除所有时间标签）
    const text = line.replace(timeRegex, '').trim()
    
    // 为每个时间标签创建歌词条目
    matches.forEach(match => {
      const [, minutes, seconds, milliseconds] = match
      const time = parseInt(minutes) * 60 + parseInt(seconds) + parseInt(milliseconds.padEnd(3, '0')) / 1000
      
      lyrics.push({
        time,
        text: text || '♪',
        originalLine: line
      })
    })
  })
  
  // 按时间排序
  lyrics.sort((a, b) => a.time - b.time)
  
  return {
    info,
    lyrics
  }
}

/**
 * 根据当前播放时间获取当前歌词索引
 * @param {Array} lyrics - 歌词数组
 * @param {number} currentTime - 当前播放时间（秒）
 * @returns {number} 当前歌词索引
 */
export function getCurrentLyricIndex(lyrics, currentTime) {
  if (!lyrics || lyrics.length === 0) return -1
  
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics[i].time) {
      return i
    }
  }
  
  return -1
}

/**
 * 格式化时间显示
 * @param {number} time - 时间（秒）
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(time) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * 示例LRC歌词数据
 */
export const sampleLrcData = {
  '远走高飞': `[ti:远走高飞]
[ar:金志文]
[al:远走高飞]
[by:金志文]
[offset:0]

[00:00.00]远走高飞 - 金志文
[00:01.50]词：金志文
[00:03.00]曲：金志文
[00:04.50]
[00:15.20]我知道 你有许多 你想要保护的东西
[00:22.80]就像我 保护着你 义无反顾 不求回报
[00:30.40]我知道 你有许多 无法言喻的失落
[00:38.00]就像我 无法给你 我想要给你的生活
[00:45.60]如果有一天 我悄然离去
[00:49.40]请把我埋在 这春天里
[00:53.20]如果有一天 我悄然离去
[00:57.00]请把我埋在 在春天里
[01:00.80]远走高飞 去更高的地方
[01:04.60]远走高飞 像鸟儿一样
[01:08.40]远走高飞 去更高的地方
[01:12.20]远走高飞 像鸟儿一样
[01:16.00]我知道 你有许多 你想要保护的东西
[01:23.60]就像我 保护着你 义无反顾 不求回报
[01:31.20]我知道 你有许多 无法言喻的失落
[01:38.80]就像我 无法给你 我想要给你的生活
[01:46.40]如果有一天 我悄然离去
[01:50.20]请把我埋在 这春天里
[01:54.00]如果有一天 我悄然离去
[01:57.80]请把我埋在 在春天里
[02:01.60]远走高飞 去更高的地方
[02:05.40]远走高飞 像鸟儿一样
[02:09.20]远走高飞 去更高的地方
[02:13.00]远走高飞 像鸟儿一样
[02:16.80]远走高飞 去更高的地方
[02:20.60]远走高飞 像鸟儿一样
[02:24.40]远走高飞 去更高的地方
[02:28.20]远走高飞 像鸟儿一样`,

  '等你下课': `[ti:等你下课]
[ar:周杰伦]
[al:等你下课]
[by:周杰伦]
[offset:0]

[00:00.00]等你下课 - 周杰伦
[00:02.00]词：周杰伦
[00:04.00]曲：周杰伦
[00:06.00]
[00:18.20]你住的 巷子里 我租了一间公寓
[00:22.40]为了就是想与你不期而遇
[00:26.60]高中三年 我为什么 为什么不好好读书
[00:30.80]没考上跟你一样的大学
[00:35.00]我找了份工作 离你宿舍很近
[00:39.20]当我开始学会做蛋饼 才发现你不吃早餐
[00:43.40]喔 你又擦肩而过
[00:47.60]你耳机听什么 能不能告诉我
[00:51.80]躺在你学校的操场看星空
[00:56.00]教室里的灯还亮着你没走
[01:00.20]记得我写给你的情书
[01:04.40]都什么年代了 到现在我还在写着
[01:08.60]总有一天总有一年会发现
[01:12.80]有人默默的陪在你的身边
[01:17.00]也许 我不该在你的世界
[01:21.20]当你收到爱的卡片
[01:25.40]也代表我已经走远
[01:29.60]等你下课 等你下课
[01:33.80]等你下课 等你下课
[01:38.00]等你下课 等你下课
[01:42.20]等你下课 等你下课`
}