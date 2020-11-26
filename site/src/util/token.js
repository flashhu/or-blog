export const encode = (jwt) => {
    // 使用 Basic Auth
    // Authorization:Baisc base64(account:password)
    const base64 = window.btoa(jwt + ':');
    return `Basic ${base64}`
}