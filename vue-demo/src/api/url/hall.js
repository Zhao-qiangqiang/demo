import Util from '../util';

let domain = process.env.VUE_APP_DEV_URL;
let instance = Util.finance(domain);

// 门店管理API

// 获取城市
export function getCityList(opts) {
    return instance({
        method: 'get',
        url: 'api/hall/city.json',
        opts
    });
}

//同步门店信息
export function init(opts) {
    return instance({
        method: 'get',
        url: 'api/hall/init.json',
        opts
    });
};

//分页查询
export function getPageList(opts) {
    return instance({
        method: 'post',
        url: 'api/hall/list.json',
        opts
    });
}

//查看
export function get(opts) {
    return instance({
        method: 'post',
        url: 'api/hall/info.json',
        opts
    });
}

//编辑
export function update(opts) {
    return instance({
        method: 'post',
        url: 'api/hall/edit.json',
        opts
    });
}





