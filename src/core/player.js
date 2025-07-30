
export class HeadlessAudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.eventListeners = {};
        this.setupEventListeners();
    }

    setupEventListeners() {
        const events = ['loadstart', 'loadeddata', 'loadedmetadata', 'canplay', 'playing',
            'pause', 'ended', 'error', 'timeupdate', 'volumechange'];

        events.forEach(event => {
            this.audio.addEventListener(event, (e) => {
                this.emit(event, e);
            });
        });
    }

    // 加载音频文件
    load(url) {
        if (!url) {
            throw new Error('音频URL不能为空');
        }

        // 检查浏览器对格式的支持
        const extension = url.split('.').pop().toLowerCase();
        const mimeTypes = {
            'mp3': 'audio/mpeg',
            'm4a': 'audio/mp4',
            '3gp': 'audio/3gpp',
            'ogg': 'audio/ogg',
            'webm': 'audio/webm',
            'wav': 'audio/wav',
            'aac': 'audio/aac',
            'flac': 'audio/flac'
        };

        const mimeType = mimeTypes[extension];
        if (mimeType && !this.audio.canPlayType(mimeType)) {
            console.warn(`浏览器可能不支持 ${extension.toUpperCase()} 格式`);
        }

        this.audio.src = url;
        this.audio.load();
        return this;
    }

    // 播放
    play() {
        return this.audio.play().catch(error => {
            console.error('播放失败:', error);
            throw error;
        });
    }

    // 暂停
    pause() {
        this.audio.pause();
        return this;
    }

    // 停止
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        return this;
    }

    // 设置音量 (0-1)
    setVolume(volume) {
        this.audio.volume = Math.max(0, Math.min(1, volume));
        return this;
    }

    // 获取音量
    getVolume() {
        return this.audio.volume;
    }

    // 设置当前播放时间
    setCurrentTime(time) {
        if (this.audio.duration) {
            this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, time));
        }
        return this;
    }

    // 获取当前播放时间
    getCurrentTime() {
        return this.audio.currentTime;
    }

    // 获取总时长
    getDuration() {
        return this.audio.duration;
    }

    // 静音/取消静音
    toggleMute() {
        this.audio.muted = !this.audio.muted;
        return this;
    }

    // 检查是否静音
    isMuted() {
        return this.audio.muted;
    }

    // 检查是否正在播放
    isPlaying() {
        return !this.audio.paused && !this.audio.ended && this.audio.currentTime > 0;
    }

    // 事件监听
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
        return this;
    }

    // 移除事件监听
    off(event, callback) {
        if (this.eventListeners[event]) {
            const index = this.eventListeners[event].indexOf(callback);
            if (index > -1) {
                this.eventListeners[event].splice(index, 1);
            }
        }
        return this;
    }

    // 触发事件
    emit(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => callback(data));
        }
    }

    // 销毁播放器
    destroy() {
        this.audio.pause();
        this.audio.src = '';
        this.eventListeners = {};
        return this;
    }
}