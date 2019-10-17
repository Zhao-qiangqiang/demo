import Util from '../util';

let domain = process.env.VUE_APP_DEV_URL;
let instance = Util.finance(domain);

// 车辆审批单API

//创建
export function create(opts) {
    return instance({
        method: 'post',
        url: 'api/carRequest/create.json',
        opts
    });
}

//编辑
export function update(opts) {
    return instance({
        method: 'post',
        url: 'api/carRequest/update.json',
        opts
    });
}

//查询单个
export function getByUuid(opts) {
    return instance({
        method: 'post',
        url: 'api/carRequest/getByUuid.json',
        opts
    });
}

//分页查询
export function getPageList(opts) {
    return instance({
        method: 'post',
        url: 'api/carRequest/getPageList.json',
        opts
    });
}

//分页查询-历史展车
export function getHistoryPageList(opts) {
    return instance({
        method: 'post',
        url: 'api/carRequest/getHistoryPageList.json',
        opts
    });
}

//审批
export function approval(opts) {
    return instance({
        method: 'post',
        url: 'api/carRequest/approval.json',
        opts
    });
}

//关闭
export function close(opts) {
    return instance({
        method: 'post',
        url: 'api/carRequest/close.json',
        opts
    });
}

//入库
export function input(opts) {
    return instance({
        method: 'post',
        url: 'api/carRequest/input.json',
        opts
    });
}

//出库
export function output(opts) {
    return instance({
        method: 'post',
        url: 'api/carRequest/output.json',
        opts
    });
}
