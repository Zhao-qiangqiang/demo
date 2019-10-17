/**
 * @file finance模块下的接口方法
 */
import Util from '../util';

let domain = process.env.VUE_APP_FINSNCE_URL;
let domainone = process.env.VUE_APP_DEV_URL;
// let domaincx = process.env.VUE_APP_DEV_CX_URL;
let instance = Util.finance(domain);
let instanceOne = Util.finance(domainone);
// let instanceCx = Util.finance(domaincx);
/* eslint-disable */
export function v2_homePageApiV2_getAdPositionidConfig(opts) {
    return instance({
        method: 'post',
        url: 'v2/homePageApiV2/getAdPositionidConfig.json',
        opts
    });
};

// 获取品牌
export function brand(opts) {
    return instanceOne({
        method: 'get',
        url: 'api/hall/car/brand.json',
        opts
    });
};
// 获取车系
export function series(opts) {
    return instanceOne({
        method: 'post',
        url: 'api/hall/car/series.json',
        opts
    });
};
// 获取车型
export function model(opts) {
    return instanceOne({
        method: 'post',
        url: 'api/hall/car/model.json',
        opts
    });
};

// 汽车管理查询
export function intro(opts) {
    return instanceOne({
        method: 'post',
        url: 'api/hall/car/intro.json',
        opts
    });
}
// 门店车辆查询
export function Carlist(opts) {
    return instanceOne({
        method: 'post',
        url: 'api/hall/car/list.json',
        opts
    });
}
// 获取供应商  
export function purchaser(opts) {
    return instanceOne({
        method: 'post',
        url: 'api/hall/car/purchaser.json',
        opts
    });
}
// 编辑车辆 /api/hall/car/edit.json
export function Caredit(opts) {
    return instanceOne({
        method: 'post',
        url: 'api/hall/car/edit.json',
        opts
    });
}


// 获取商品兑换明细列表
export function exChangeList(opts) {
    return instance({
        method: 'get',
        url: 'api/manage/mall/queryOrder.json',
        opts
    });
}
// 获取商品库存列表
export function inventoryList(opts) {
    return instance({
        method: 'get',
        url: 'api/manage/mall/queryCommodity.json',
        opts
    });
}
// 获取完成任务列表
export function completeList(opts) {
    return instance({
        method: 'get',
        url: 'api/member/queryTaskPage.json',
        opts
    });
}
// 图片上传
export function upload(opts) {
    return instance({
        method: 'post',
        url: 'api/upload.json',
        opts
    });
}
// 库存新增
export function inventoryAdd(opts) {
    return instance({
        method: 'post',
        url: 'api/manage/mall/commodity/create.json',
        opts
    });
}
// 库存修改
export function inventoryUpdate(opts) {
    return instance({
        method: 'post',
        url: 'api/manage/mall/commodity/update.json',
        opts
    });
}
// 下架修改
export function offShel(opts) {
    return instance({
        method: 'post',
        url: 'api/manage/mall/offShelfCommodity.json',
        opts
    });
}
// 上架修改
export function upShelf(opts) {
    return instance({
        method: 'post',
        url: 'api/manage/mall/upShelfCommodity.json',
        opts
    });
}
// 库存商品查询
export function getCommodity(opts) {
    return instance({
        method: 'get',
        url: '/api/manage/mall/getCommodity.json',
        opts
    });
}

/////////////////////已经移到其他文件/////////////////////////////////////


// 门店管理-分页查询
export function getPageList(opts) {
    return instance({
        method: 'post',
        url: 'api/hall/list.json',
        opts
    });
};

// 门店管理详情
export function info(opts) {
    return instanceOne({
        method: 'post',
        url: 'api/hall/info.json',
        opts
    });
};

// 门店管理修改
export function edit(opts) {
    return instanceOne({
        method: 'post',
        url: 'api/hall/edit.json',
        opts
    });
};

// 获取城市
export function city(opts) {
    return instanceOne({
        method: 'get',
        url: 'api/hall/city.json',
        opts
    });
};

// 门店管理同步信息
export function init(opts) {
    return instanceOne({
        method: 'get',
        url: 'api/hall/init.json',
        opts
    });
};
