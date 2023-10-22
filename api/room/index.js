import {
	request
} from '@/utils/request.js';

// 获取教学楼信息
export const getBuildings = () => {
	return request({
		url:'/tb/freeRoom/getData',
		method:'GET'
	})
}

// 获取空教室
export const getFreeRoom = (data) => {
	return request({
		url:'/tb/freeRoom/getFreeRoom',
		method:'POST',
		data: data
	})
}