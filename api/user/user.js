import {
	request
} from '@/utils/request.js';

export function weChatLogin(data) {
	return request({
		url: '/user/user/weChatLogin',
		method: 'POST',
		data: data
	})
}

export function weChatRegister(data) {
	return request({
		url: '/user/user/weChatRegister',
		method: 'POST',
		data: data
	})
}

// 修改用户身份信息
export function updateUserInfo(data) {
	return request({
		url: '/user/biz/updateUserInfo',
		method: 'POST',
		data: data
	})
}
// 学校认证
export function identitySchool(data) {
	return request({
		url: '/user/biz/getSchoolIdentification',
		method: 'POST',
		data: data
	})
}
// 查看我的发帖列表
export function getMyPosts(data) {
	return request({
		url: '/bbs/post/getMyPosts',
		method: 'POST',
		data: data
	})
}


// 用户发布时的可使用身份选项
export function getUserPostOptions() {
	return request({
		url: '/user/biz/getUserPostOptions',
		method: 'POST'
	})
}

// 查询用户的基础公开信息
export function getUserPublicInfo(data) {
	return request({
		url: '/user/biz/getUserPublicInfo',
		method: 'POST',
		data: data
	})
}

// 查询当前用户信息
export function getCurrentUserInfo() {
	return request({
		url: '/user/biz/getCurrentUserInfo',
		method: 'GET'
	})
}

// 浏览历史
export function getHistory(query){
	return request({
		url: `/bbs/browsingHistory?currentPage=${query.currentPage}&&pageSize=${query.pageSize}`,
		method: 'GET'
	})
}