import VueValidator from '@souche-vue/vue-validator';
import OSSImage from '@souche-ui/oss-image';
import VueSentry from '@souche-vue/vue-sentry';
import Innovation from '@souche-vue/Innovation';
import Vue from 'vue';

// 调试小工具初始化
const InnovationInit = () => {
    Vue.use(Innovation, {
        env: process.env.VUE_APP_ENV
    });
};

const sentryInit = () => {
    let packageJson = require('../../../package.json');
    Vue.use(VueSentry, {
        dsn: 'https://cb6fc679600d43b1afd941320fa89bbf@sentry.souche.com/914',
        env: process.env.VUE_APP_ENV,
        version: packageJson.version
    });
};

// 图片懒加载初始化
const OSSImageInit = () => {
    Vue.use(OSSImage.component.vue, {
        lazy: {
            // 延迟加载相关配置
            attempt: 1,
            loading: '//img.souche.com/f2e/ee752ad58e61f80999eb1355a514493d.png',
            error: '//img.souche.com/f2e/ee752ad58e61f80999eb1355a514493d.png'
        }
    });
};

// 初始化表单验证插件
const validatorInit = () => {
    Vue.use(VueValidator, {
        validators: {},
        /* eslint-disable-next-line */
        controller: (msg) => {
            // todo
            // 根据项目自定义报错方法
        }
    });
};

export default () => {
    InnovationInit();
    sentryInit();
    OSSImageInit();
    validatorInit();
};
