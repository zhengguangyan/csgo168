import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'//图片懒加载
import VueClipboard from 'vue-clipboard2';//复制文本
// import '@/assets/fonts/SansSerif.css';
import echarts from 'echarts'  //引入echarts
// import 'echarts-liquidfill'

import Rem from '@/utils/rem.js'//px转rem文件
//element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//vant
import Vant from 'vant';
import 'vant/lib/index.css';
import MySocket from './network/socket';
Vue.use(MySocket)

Rem(1920,1920,325)


Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

//element
Vue.use(ElementUI);
// console.log(process.env.VUE_APP_BASE_URL)

//vant
Vue.use(Vant);


//复制文本
Vue.use(VueClipboard)

Vue.use(VueLazyload,{
  loading:require('@/assets/images/loading-svg/loading-bars.svg'),
  error:require('@/assets/images/none.jpg'),
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
