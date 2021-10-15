/**
 * Get cookie by key
 *
 * @export
 * @param {*} key
 * @returns
 */
export function get(key) {
    let cookies = document.cookie;
    let array = cookies
        .split(';')
        .filter(str => {
            let arr = str.trim().split('=');
            return arr[0] == key;
        });
    if (!array || array.length <= 0) {
        return '';
    }
    return decodeURIComponent(array[0].trim().split('=')[1]);

}

/**
 * Set cookie with key = value;expires=times
 *
 * @export
 * @param {*} name
 * @param {*} value
 * @param {number} [seconds=0]
 */
export function set(name, value, seconds = 0) {
    let cookie = `${name}=${encodeURIComponent(value)}`;
    let expires = (seconds) ? `; expires=${seconds.toString()}` : '';
    let path = `; path =/`;
    document.cookie = (`${cookie}${expires}${path}`);
}

/**
 * Remove cookie by key
 *
 * @export
 * @param {*} key
 */
export function remove(key) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}