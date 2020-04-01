import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/vuex'
import Fabric from 'fabric';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import mybtn from './components/myBtn'
import localForage from 'localforage/src/localforage';
import '@/icons'
Vue.config.productionTip = false
window.localForage = localForage;
Vue.use(Fabric);
Vue.use(ElementUI);
Vue.component('mybtn', mybtn)
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
