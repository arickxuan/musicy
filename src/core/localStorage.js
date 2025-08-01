export class StorageUtil {
    // localStorage 操作
    static setLocal(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('localStorage 写入失败:', e);
        }
    }

    static getLocal(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error('localStorage 读取失败:', e);
            return null;
        }
    }

    // sessionStorage 操作
    static setSession(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('sessionStorage 写入失败:', e);
        }
    }

    static getSession(key) {
        try {
            const value = sessionStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error('sessionStorage 读取失败:', e);
            return null;
        }
    }

    // Cookie 操作
    static setCookie(name, value, days = 7) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
    }

    static getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
}

// 使用示例
// StorageUtil.setLocal('user', { name: 'John', age: 25 });
// const user = StorageUtil.getLocal('user');
