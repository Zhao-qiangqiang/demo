import Util from '../util';

let domain = process.env.VUE_APP_DEV_URL;
let instance = Util.finance(domain);

// 询车价列表API

//分页查询: APP/小程序 询车价列表
export function getPageList(opts) {
    return instance({
        method: 'post',
        url: 'api/behavior/getPageList.json',
        opts
    });
}

//分页查询:水牌 询车价列表
export function getMemberPageList(opts) {
    return instance({
        method: 'post',
        url: 'api/behavior/getMemberPageList.json',
        opts
    });
}

//分页查询:水牌 客户需求列表
export function getRequestPageList(opts) {
    return instance({
        method: 'post',
        url: 'api/behavior/getRequestPageList.json',
        opts
    });
}





