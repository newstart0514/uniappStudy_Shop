
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from '@/store/store.js'

// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'
uni.$http = $http
$http.beforeRequest = function() {
	uni.showLoading({
		title: '数据加载中...'
	})
}
$http.afterRequest = function(options) {
	uni.hideLoading()
}
// 请求的根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 封装一个错误消息模板  带有默认值
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif