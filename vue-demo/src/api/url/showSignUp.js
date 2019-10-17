import Util from '../util';

let domain = process.env.VUE_APP_DEV_URL;
let instance = Util.finance(domain);

// 移动车展报名API

//分页查询
export function getPageList(opts) {
    return instance({
        method: 'post',
        url: 'api/showSignUp/getPageList.json',
        opts
    });
}
