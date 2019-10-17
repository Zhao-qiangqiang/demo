import Util from '../util';

let domain = process.env.VUE_APP_DEV_URL;
let instance = Util.finance(domain);

// 本地车商API



//分页查询门店
export function getHallPageList(opts) {
    return instance({
        method: 'post',
        url: 'api/localDealer/getHallPageList.json',
        opts
    });
}

//获取车商列表
export function selectList(opts) {
    return instance({
        method: 'post',
        url: 'api/localDealer/selectList.json',
        opts
    });
}

//获取车商
export function getById(opts) {
    return instance({
        method: 'post',
        url: 'api/localDealer/getById.json',
        opts
    });
}

//新增车商
export function create(opts) {
    return instance({
        method: 'post',
        url: 'api/localDealer/create.json',
        opts
    });
}

//编辑车商
export function update(opts) {
    return instance({
        method: 'post',
        url: 'api/localDealer/update.json',
        opts
    });
}

//删除车商
export function deleteDealer(opts) {
    return instance({
        method: 'post',
        url: 'api/localDealer/delete.json',
        opts
    });
}


