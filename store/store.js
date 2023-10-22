import Vue from 'vue'
import Vuex from 'vuex'
import comment from './modules/comment.js'
import user from './modules/user.js'
Vue.use(Vuex)
const store = new Vuex.Store({
	modules: {
		comment,
		user
	},
	state: {
		// 上传所用参数
		uploadParams: {},
	},
	mutations: {
		// 给参数赋值
		setUploadParams(state, paramsObj) {
			state.uploadParams = paramsObj;
		},
	},
	actions: {

	},

})

export default store