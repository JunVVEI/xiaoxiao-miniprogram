import App from './App'
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
import share from './mixin/share.js'
import store from '@/store/store.js'

let pH = 0;
//px转rpx *Rate   rpx转px /Rate
let RATE = 750 / wx.getSystemInfoSync().screenWidth
pH = uni.getSystemInfoSync().windowHeight * RATE
Vue.prototype.$store = store //全局状态库
Vue.prototype.RATE = RATE    //px to rpx
Vue.prototype.pH = pH        //高度
Vue.use(uView)
Vue.mixin(share)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
