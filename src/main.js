import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store'
import 'common/sass/index.sass'
import 'common/sass/swiper-3.4.2.min.css'
import vueSeamlessScroll from 'vue-seamless-scroll'
/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole'
// // 初始化
// var objVConsole = new vConsole()
// 
// document.querySelector('body').addEventListener('touchmove', function(ev) {
//     event.preventDefault();
// });

fastclick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('common/image/default_header.png')
})
Vue.use(vueSeamlessScroll)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
