import Util from '../util';

let domain = process.env.VUE_APP_DEV_URL;
let instance = Util.finance(domain);

// 水牌/云货架列表查询
export function getList(opts) {
    return instance({
        method: 'post',
        url: 'api/interaction/list.json',
        opts
    });
}
//水牌新建 /api/interaction/create.json
export function createElectronicBrand(opts) {
    return instance({
        method: 'post',
        url: 'api/interaction/create.json',
        opts
    });
}
// 水牌车辆查询 /api/electronic/car/list.json
export function getCarList(opts) {
    return instance({
        method: 'post',
        url: 'api/electronic/car/list.json',
        opts
    });
}
// 水牌编辑 /api/interaction/edit.json
export function edit(opts) {
    return instance({
        method: 'post',
        url: 'api/interaction/edit.json',
        opts
    });
}
//  水牌详情 /api/interaction/detail.json
export function detail(opts) {
    return instance({
        method: 'post',
        url: 'api/interaction/detail.json',
        opts
    });
}
// 交换车辆展示顺序 /api/electronic/car/swap.json
export function swap(opts) {
    return instance({
        method: 'post',
        url: 'api/electronic/car/swap.json',
        opts
    });
}
// 车辆删除  /api/electronic/car/del.json
export function del(opts) {
    return instance({
        method: 'post',
        url: 'api/electronic/car/del.json',
        opts
    });
}
// 设置为展车 /api/electronic/car/exhibition.json
export function exhibition(opts) {
    return instance({
        method: 'post',
        url: 'api/electronic/car/exhibition.json',
        opts
    });
}
// 编辑水牌车辆信息  /api/electronic/car/edit.json
export function carEdit(opts) {
    return instance({
        method: 'post',
        url: 'api/electronic/car/edit.json',
        opts
    });
}
// 水牌车辆新增 /api/electronic/car/create.json
export function carCreate(opts) {
    return instance({
        method: 'post',
        url: 'api/electronic/car/create.json',
        opts
    });
}
// 购车有礼查询
export function marketList(opts) {
    return instance({
        method: 'post',
        url: 'api/market/gift/record/list.json',
        opts
    });
}
//导入 api/electronic/car/import.json
export function carImport(opts) {
    return instance({
        method: 'post',
        url: 'api/electronic/car/import.json',
        opts
    });
}
