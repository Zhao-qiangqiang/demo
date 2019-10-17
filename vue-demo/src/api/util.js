/**
 * @file 封装请求
 */
import Http from '@souche-f2e/http-request';
import CacheUtils from '@souche-f2e/souche-util/lib/cache';

const token = CacheUtils.getCookie('_security_token_inc');
const ajax = (url, params = {}) => {
    params.url = url;
    return Http(params);
};

export default {
    finance(baseURL) {
        let host = typeof baseURL === 'function' ? baseURL() : baseURL;
        return function (params) {
            params.opts = params.opts || {};
            //去除字符串首尾空格
            for (const key of Object.keys(params.opts)) {
                const value = params.opts[key];
                if (typeof (value) === 'string') {
                    params.opts[key] = value.trim();
                }
            }

            params.opts._security_token = token;
            return ajax(host + params.url, {
                data: params.opts,
                method: params.method,
                withCredentials: true
            });
        };
    }
};
