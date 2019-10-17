import Util from '../util';

let domain = process.env.VUE_APP_DEV_URL;
let instance = Util.finance(domain);

// 移动车展API

//创建
export function create(opts) {
    return instance({
        method: 'post',
        url: 'api/mobileShow/create.json',
        opts
    });
}

//编辑
export function update(opts) {
    return instance({
        method: 'post',
        url: 'api/mobileShow/update.json',
        opts
    });
}

//编辑状态
export function updateStatus(opts) {
    return instance({
        method: 'post',
        url: 'api/mobileShow/updateStatus.json',
        opts
    });
}

//查询单个
export function getById(opts) {
    return instance({
        method: 'post',
        url: 'api/mobileShow/getById.json',
        opts
    });
}

//分页查询
export function getPageList(opts) {
    return instance({
        method: 'post',
        url: 'api/mobileShow/getPageList.json',
        opts
    });
}
