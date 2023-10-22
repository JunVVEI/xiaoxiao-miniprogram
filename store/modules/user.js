import { updateUserInfo, getUserInfo } from '@/api/user/user.js';
import { getUserPublicInfo } from "@/api/user/follow.js"
import { changeToDate } from '@/utils/timestamp.js'
import { listIdentity } from '@/api/user/identity.js';
const state = {
	// 匿名身份信息
	identityMsg: {},
	// 用户信息
	userInfo: {
		id: 0,
		userName: '',
		birth: '',
		backgroundImage: '',
		sex: null,
		avatar: '',
		realName: '',
		email: '',
	},
	school: '',
	// 用户基础信息
	basicInfo: {}
}
const mutations = {
	setUserInfo(state, data){
		// 登录时 只有id avatar userName需要赋值  data是一个对象
		Object.keys(data).forEach(key => {
			if(key === 'birth'){
				state.userInfo[key] = changeToDate(data[key]);
			}else if(key === 'sex' && data[key] !== null){
				// if(){
					state.userInfo[key] = data[key] == 1 ? '男' : '女';
				// }
			}else{
				state.userInfo[key] = data[key];
			}
		})
		uni.setStorageSync('userInfo', state.userInfo);
	},
	setBasicInfo(state, data){
		state.basicInfo = data;
		uni.setStorageSync('basicInfo', state.basicInfo);
	},
	// 匿名身份主页存储信息
	setIdentityMsg(state, data) {
		state.identityMsg = data;
		uni.setStorageSync('identityInfo', state.identityMsg);
	},

}
const actions = {
	// 获取当前用户信息
	async getUserInfo(context) {
		const {
			data: {
				data
			}
		} = await getUserInfo();  // 获取到的birth是时间戳 sex是int
		console.log(data);
		context.commit('setUserInfo', data);
	},
	// 获取当前用户的基础信息
	async getUserPublicInfo(context){
		let query = { uid: context.state.userInfo.id, type: 0};
		const { data: { data }} = await getUserPublicInfo(query);
		console.log(data);
		context.commit('setBasicInfo', data);
	},
	// 修改用户信息
	async updateUserInfo(context, newInfo){
		// 接口需要格式
		if(newInfo.birth !== null){
			newInfo.birth += " 00:00:00";
		}
		if(newInfo.sex !== null){
			newInfo.sex = newInfo.sex  === '男' ?  1 : 0;
		}
		const { data: { data } } = await updateUserInfo(newInfo);
		if(data){
			context.commit('setUserInfo', data);
			uni.showToast({
				title: '操作成功',
				icon: 'success'
			})
		}else{
			uni.showToast({
				title: '操作失败',
				icon: 'error'
			})
		}
	},
	// 获取匿名身份信息
	async getIdentityInfo(context) {
		const { data: { data } } = await listIdentity();
		context.commit('setIdentityMsg', data[0]);
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}