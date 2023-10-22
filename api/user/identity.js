import {
	request
} from '@/utils/request.js';


// 新增用户匿名身份
export function addIdentity(data) {
	return request({
		url: '/user/identity/addIdentity',
		method: 'POST',

		data: data
	})
}
// 查询用户匿名身份信息
export function getIdentity(identityId) {
	return request({
		url: `/user/identity/getIdentity?identityId=${identityId}`,
		method: 'GET'
	})
}
// 修改匿名身份的昵称
export function updateName(data) {
	return request({
		url: '/user/identity/updateName',
		method: 'POST',
		data: data
	})
}
// 修改匿名头像
export function updateIdentity(data) {
	return request({
		url: '/user/identity/updateIdentity',
		method: 'POST',
		data: data
	})
}

// 查询用户匿名身份列表
export function listIdentity() {
	return request({
		url: '/user/identity/listIdentity',
		method: 'GET'
	})
}

// 查询用户匿名身份列表
export function getCurrentUserIdentityInfo() {
	return request({
		url: '/user/identity/getCurrentUserIdentityInfo',
		method: 'GET'
	})
}

// 匿名头像资源库
export function getIdentityAvatarLibrary() {
	return request({
		url: '/user/identity/getIdentityAvatarLibrary',
		method: 'GET'
	})
}