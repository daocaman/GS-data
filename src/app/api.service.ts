import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import * as url from "./helpers/url";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiServer = 'https://script.google.com/macros/s';

  constructor(private http: HttpClient) { }

  /**
  * REQUEST API
  * METHOD POST
  *
  * @param {string} path
  * @param {string} endpoint
  * @param {*} [data={}]
  * @returns {Observable<any>}
  * @memberof ApiService
  */
  get(path: string, endpoint: string, data: any = {}) {
    return this.http.get(url.merge(this.apiServer, path, endpoint, data));
  }
  /**
  * 
  * REQUEST API
  * METHOD DELETE
  * 
  * @param {string} path
  * @param {string} endpoint
  * @param {*} [data={}]
  * @returns {Observable<any>}
  * @memberof ApiService
  * 
  * 
  */

  delete(path: string, endpoint: string, data: any = {}) {
    return this.http.delete(url.merge(this.apiServer, path, endpoint, data));
  }
  /**
  * REQUEST API
  * METHOD POST
   *
   * @param {string} path
   * @param {string} endpoint
   * @param {*} [data={}]
    * @param {*} [options={}]
   * @returns
   * @memberof ApiService
   */
  post(path: string, endpoint: string, data: any = {}, options: any = null): Observable<any> {
    let httpOptions = {}
    if (!options || options.type != 'multipart/form-data') {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': (options && options.type) ? options.type : 'application/json'
        }),
        responseType: 'json'
      };
    } else {
      httpOptions = {
        headers: new HttpHeaders({}),
        responseType: 'json'
      };
    }
    return this.http.post(url.merge(this.apiServer, path, endpoint), data, httpOptions);
  }
  /**
  * REQUEST API
  * METHOD PUT
  * @param {string} path
  * @param {string} endpoint
  * @param {*} data
  * @param {*} [options]
  * @returns {Observable<any>}
  * @memberof ApiService
  */
  put(path: string, endpoint: string, data: any, options?: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': (options && options.type) ? options.type : 'application/json',
      })
    };
    return this.http.put(url.merge(this.apiServer, path, endpoint), data, httpOptions);
  }
  /**
  * REQUEST API FOR FILE DATA
  * METHOD POST
  * @param {string} path
  * @param {string} endpoint
  * @param {*} data
  * @param {*} options
  * @returns {Observable<any>}
  * @memberof ApiService
  */
  file(path: string, endpoint: string, data: any, options: any): Observable<any> {
    return this.http.post(url.merge(this.apiServer, path, endpoint), data, options);
  }
  /**
  * Convert json to urlencoded
  * 
  * @static
  * @param {*} data
  * @returns
  * @memberof ApiService
  */
  public static convertToFormUrlencoded(data: any) {
    return Object.keys(data).map(key => {
      return key + '=' + encodeURIComponent(data[key]);
    }).join('&');
  }
  /**
  * Convert json to query string
  *
  * @static
  * @param {string} url
  * @param {*} data
  * @returns
  * @memberof ApiService
  */
  public static convertToQueryString(url: string, data: any) {
    const query = Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');
    return url + '?' + query;
  }
}
