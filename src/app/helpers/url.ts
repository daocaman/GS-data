/**
 * Object to Query String
 *
 * @export
 * @param {*} [params={}]
 * @returns
 */
export function query(params: any = {}) {
    if (params && Object.keys(params).length > 0) {
        return `?${Object.keys(params).filter(key => {
            return (params[key] && params[key] != 'null');
        }).map(key => {
            return [key, encodeURIComponent(params[key])].join('=');
        }).join('&')}`;
    } else {
        return '';
    }
}

/**
 * return url: domain/path/endpoint?query
 *
 * @export
 * @param {*} domain
 * @param {*} path
 * @param {*} endpoint
 * @param {*} [queryParams=null]
 * @returns
 */
export function merge(domain: string, path: string, endpoint: string, queryParams = null) {
    if (path) {
        return `${domain}/${path}/${endpoint}${query(queryParams)}`;
    }
    else {
        return `${domain}/${endpoint}${query(queryParams)}`;
    }

}