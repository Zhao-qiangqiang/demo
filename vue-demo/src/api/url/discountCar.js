import Util from '../util';

let domain = process.env.VUE_APP_DEV_URL;
let instance = Util.finance(domain);

// 特价车API



//分页查询门店
export function getHallPageList(opts) {
    return instance({
        method: 'post',
        url: 'api/discountCar/getHallPageList.json',
        opts
    });
}

//获取特价车列表
export function selectList(opts) {
    return instance({
        method: 'post',
        url: 'api/discountCar/selectList.json',
        opts
    });
}

//获取特价车
export function getById(opts) {
    return instance({
        method: 'post',
        url: 'api/discountCar/getById.json',
        opts
    });
}

//新增特价车
export function create(opts) {
    return instance({
        method: 'post',
        url: 'api/discountCar/create.json',
        opts
    });
}

//编辑特价车
export function update(opts) {
    return instance({
        method: 'post',
        url: 'api/discountCar/update.json',
        opts
    });
}

//删除特价车
export function deleteCar(opts) {
    return instance({
        method: 'post',
        url: 'api/discountCar/delete.json',
        opts
    });
}


