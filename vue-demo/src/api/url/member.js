import Util from '../util';

let domain = process.env.VUE_APP_DEV_URL;
let instance = Util.finance(domain);

// 车辆审批单API

//编辑
export function updateType(opts) {
    return instance({
        method: 'post',
        url: 'api/member/updateType.json',
        opts
    });
}

//获取线索列表
export function getClueList(opts) {
    return instance({
        method: 'post',
        url: 'api/member/getClueList.json',
        opts
    });
}

//分页查询
export function getPageList(opts) {
    return instance({
        method: 'post',
        url: 'api/member/getPageList.json',
        opts
    });
}

