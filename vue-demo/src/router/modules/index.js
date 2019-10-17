/**
 * @file 路由配置文件入口
 */

export default {
    '/': {
        path: 'views/index',
        name: 'index'
    },
    '/BasicData': {
        path: 'views/BasicData/index',
        name: 'BasicData'
    },
    '/Inventory': {
        path: 'views/IntegralMall/inventory/inventory',
        name: 'inventory'
    },
    '/Exchange': {
        path: 'views/IntegralMall/exchange',
        name: 'exchange'
    },
    '/TaskComplete': {
        path: 'views/IntegralMall/taskComplete',
        name: 'taskComplete'
    },
    '/Inventory/add': {
        path: 'views/IntegralMall/inventory/add',
        name: 'inventoryAdd'
    },
    '/Plate': {
        path: 'views/plate/index',
        name: 'plate'
    },
    '/storage': {
        path: 'views/storage/index',
        name: 'storage'
    },
    '/activity': {
        path: 'views/activity/index',
        name: 'activity'
    },
    //门店管理
    '/hall': {
        path: 'views/hall/HallManage',
        name: 'hall'
    },
    //线上询车价
    '/behavior': {
        path: 'views/behavior/BehaviorManage',
        name: 'behavior'
    },
    //水牌询车价
    '/memberbehavior': {
        path: 'views/memberBehavior/MemberBehaviorManage',
        name: 'memberbehavior'
    },
    //客户需求列表
    '/customerRequest': {
        path: 'views/customerRequest/CustomerRequestManage',
        name: 'customerRequest'
    },
    //车辆审批单
    '/carRequest': {
        path: 'views/carRequest/CarRequestManage',
        name: 'carRequest'
    },
    //车辆管理
    '/CarManage': {
        path: 'views/CarManage/index',
        name: 'CarManage'
    },
    //历史展车
    '/historyCar': {
        path: 'views/historyCar/HistoryCarManage',
        name: 'historyCar'
    },
    //CRM
    '/member': {
        path: 'views/member/MemberManage',
        name: 'member'
    },
    //移动车展
    '/mobileShow': {
        path: 'views/mobileShow/MobileShowManage',
        name: 'mobileShow'
    },
    //移动车展报名
    '/showSignUp': {
        path: 'views/showSignUp/ShowSignUpManage',
        name: 'showSignUp'
    },
    //特价车
    '/discountCar': {
        path: 'views/discountCar/DiscountCarManage',
        name: 'discountCar'
    },
    //本地车商
    '/localDealer': {
        path: 'views/localDealer/LocalDealerManage',
        name: 'localDealer'
    }
};
