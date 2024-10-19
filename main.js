// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
//挂载全局插件
//引用uView插件
import uViewPlus from '@/uni_modules/uview-plus';
//引用手机调试工具插件
import {HFdebugging} from '@/uni_modules/HF-HF_debugging/common/next.js'
export function createApp() {
  const app = createSSRApp(App)
  //只在调试模式下的挂载
  if(process.env.NODE_ENV === 'development'){//测试development-生产production
	  new HFdebugging({app})
  }
  //全局挂载
  app.use(uViewPlus)
  return {
    app
  }
}
// #endif

//挂载全局方法
// Vue.prototype.touchStart = function(){
	
// },
