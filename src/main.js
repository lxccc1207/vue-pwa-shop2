// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import vueResource from 'vue-resource'
import vueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Base64 from 'js-base64'
import 'babel-polyfill'
Vue.use(ElementUI)
Vue.use(vueResource)
Vue.use(vueLazyLoad,{
	loading:"./static/loading-svg/loading-bars.svg"  // 设置图片懒加载
})
Vue.use(infiniteScroll)
Vue.use(Base64)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#myapp',
  router,
  store,
  template: '<App/>',  //<app></app>另一种写法，用app组件替换首页的div元素
  components: { App }
})
