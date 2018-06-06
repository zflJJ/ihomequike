export default {
    //本地缓存与清除
    setStorage(name, item) {
        localStorage.setItem(name, JSON.stringify(item));
        setTimeout(() => {
            localStorage.removeItem(name);
        }, 604800000);
    },
    getStorage(name) {
        return JSON.parse(localStorage.getItem(name));
    },
    removeStorage(name) {
        localStorage.removeItem(name);
    },
}