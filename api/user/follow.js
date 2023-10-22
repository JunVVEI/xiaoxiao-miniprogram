import {
	request
} from '@/utils/request.js';


// 查询用户关注列表
export function listAllFollow(query) {
	return request({
		url: '/user/biz/getUserFollowing',
		method: 'GET',
		data: query
	})
}
// 查询用户的粉丝列表
export function listAllFans(query) {
	return request({
		url: '/user/biz/getUserFollowers',
		method: 'GET',
		data: query
	})
}
// 取消关注
export function unfollow(data) {
	return request({
		url: '/user/biz/unfollow',

		method: 'POST',
		data: data
	})
}
// 新增关注
export function follow(data) {
	return request({
		url: '/user/biz/follow',
		method: 'POST',
		data: data
	})
}

// 查询用户基础公开信息
export function getUserPublicInfo(query) {
	return request({
		url: '/user/biz/getUserPublicInfo',
		method: 'POST',
		data: query
	})
}
