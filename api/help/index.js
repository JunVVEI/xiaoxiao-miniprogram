import {
	request
} from '@/utils/request.js';

// 获取我发布的任务
export function getMyTask(data){
	return request({
		url: '/taskCourier/rewardTask/myTasks',
		method: 'POST',
		data: data
	})
}

// 获取任务列表
export function getTaskList(data){
	return request({
		url: '/taskCourier/rewardTask/listQuery',
		method: 'POST',
		data: data
	})
}

// 获取任务详情
export function getTask(data){
	return request({
		header: {
		    "Content-Type": 'application/x-www-form-urlencoded'
		},
		url: '/taskCourier/rewardTask/getTask',
		method: 'POST',
		data: {
			taskId: data
		}
	})
}

// 获取任务评论
export function getTaskComment(data){
	return request({
		url:'/taskCourier/rewardTask/commentListQuery',
		method: 'POST',
		data: data
	})
}

// 发表评论
export function addTaskComment(data){
	return request({
		url:'/taskCourier/rewardTask/addComment',
		method: 'POST',
		data: data
	})
}

// 删除任务评论
export function removeTaskComment(data){
	return request({
		header: {
		    "Content-Type": 'application/x-www-form-urlencoded'
		},
		url: '/taskCourier/rewardTask/delComment',
		method: 'POST',
		data: {
			commentId: data
		}
	})
}

// 删除悬赏任务
export function removeTask(data){
	return request({
		header: {
		    "Content-Type": 'application/x-www-form-urlencoded'
		},
		url:'/taskCourier/rewardTask/delTask',
		method: 'POST',
		data: {
			taskId: data
		}
	})
}

// 发布任务
export function addTask(data){
	return request({
		url:'/taskCourier/rewardTask/postTask',
		method: 'POST',
		data: data
	})
}

// 设置任务为已接单
export function taskAccept(data){
	return request({
		header: {
		    "Content-Type": 'application/x-www-form-urlencoded'
		},
		url:'/taskCourier/rewardTask/accept',
		method: 'POST',
		data: {
			taskId: data
		}
	})
}

// 设置任务为未接单
export function taskUnAccept(data){
	return request({
		header: {
		    "Content-Type": 'application/x-www-form-urlencoded'
		},
		url:'/taskCourier/rewardTask/unAccept',
		method: 'POST',
		data: {
			taskId: data
		}
	})
}
