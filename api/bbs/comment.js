import {request} from '@/utils/request.js';
/* 帖子评论接口 */

//查看评论列表
export function listPostComment(data) {
	return request({
		url: '/bbs/postComment/queryPostCommentPage',
		method: 'POST',
		data: data
	})
}

//发表评论
export function addPostComment(data) {
	return request({
		url: '/bbs/postComment/addPostComment',
		method: 'POST',
		data: data
	})
}

// 发表子评论
export function addPostSubComment(data) {
	return request({
		url: '/bbs/postComment/addPostSubComment',
		method: 'POST',
		data: data
	})
}

// 评论点赞
export function commentLike(data) {
	return request({
		header: {
			"Content-Type": 'application/x-www-form-urlencoded'
		},
		url: '/bbs/postComment/like',
		method: 'POST',
		data: data
	})
}

// 评论取消点赞
export function commentUnlike(data) {
	return request({
		header: {
			"Content-Type": 'application/x-www-form-urlencoded'
		},
		url: '/bbs/postComment/unlike',
		method: 'POST',
		data: data
	})
}

// 删除评论
export function delPostComment(data) {
	return request({
		header: {
			"Content-Type": 'application/x-www-form-urlencoded'
		},
		url: '/bbs/postComment/del',
		method: 'POST',
		data: data
	})
}

// 获取子评论
export function getSubComment(data){
	return request({
		url: '/bbs/postComment/queryPostSubCommentPage',
		method: 'POST',
		data: data
	})
}