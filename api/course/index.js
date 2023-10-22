import {
	request
} from '@/utils/request.js';

// 获取验证码
export const getCode = () => {
	return request({
		url: '/tb/course/code',
		method: 'GET'
	})
}
// 登录拉取课表
export const login = (data) => {
	return request({
		url: '/tb/course/pullCourse',
		method: 'POST',
		data: data
	})
}
// 获取某学期课程表
export const getCourse = (data) => {
	let value = uni.getStorageSync('courseList')
	if (value && data.termIndex === 0) {
		return new Promise((resolve, reject) => {
			resolve({
				data: {
					termCourses: uni.getStorageSync('courseList'),
					notes: uni.getStorageSync('courseNotes')
				}
			})
		})
	} else {
		return request({
			url: '/tb/course/getCourse',
			method: 'POST',
			data: data
		})
	}
}

// export const getCourse = (data) => {
// 	return request({
// 		url: '/tb/course/getCourse',
// 		method: 'POST',
// 		data: data
// 	})
// }

// 获取本学期当前周次
export const getWeek = () => {
	return request({
		url: '/tb/course/getWeek',
		method: 'GET'
	})
}
// 获取学期数组
export const getTerm = (data) => {
	return request({
		url: '/tb/course/getTerm',
		method: 'POST',
		data: data
	})
}
