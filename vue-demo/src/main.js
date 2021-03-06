import '@souche-ui/lemon';
import SoPhotoGallery from '@souche-ui/so-photo-gallery';
import SoUI from 'so-ui';
import ElementUI from 'element-ui';
import '@souche-ui/so-photo-gallery/lib/index.css';
import 'so-ui/lib/styles/index.css';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import myPlugin from './utils/plugins';
import filters from './utils/filters';
import directives from './utils/directives';
import Common from './utils/helpers/common';

Vue.use(ElementUI);
Vue.use(SoUI);
Vue.use(SoPhotoGallery);
Common.init();
Vue.use(myPlugin);

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
Object.keys(directives).forEach(k => Vue.directive(k, directives[k]));

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
}).$mount('#app');
