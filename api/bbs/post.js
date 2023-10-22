import {request} from '@/utils/request.js';
/* 帖子模块接口 */

//分页查询
export function listAll(data) {
	if(data.orderFlag == 1){
		return request({
			url: '/bbs/post/hotpost/queryList',
			method: 'POST',
			data: data
		})
	}else{
		return request({
		    url: '/bbs/post/query',
		    method: 'POST',
		    data: data
		})
	}
}

//热榜查询
export function listHot(data) {
    return request({
        url: '/bbs/post/hotpost/queryList',
        method: 'POST',
        data: data
    })
}

//查看关注的人的帖子列表
export function getPostsByFollow(data) {
    return request({
        url: '/bbs/post/getPostsByFollow',
        method: 'POST',
        data: data
    })
}

//查询帖子详情
export function postDetail(data) {
    return request({
        url: `/bbs/post/post`,
        method: 'POST',
        data: data
    })
}

//发布新帖子
export function createPost(data) {
    return request({
        url: '/bbs/post/createPost',
        method: 'POST',
        data: data
    })
}

//删除帖子
export function delPost(postId) {
    return request({
        header: {
            "Content-Type": 'application/x-www-form-urlencoded',
        },
        url: '/bbs/post/delPost',
        method: 'POST',
        data: {
            id: postId
        }
    })
}

//分享量增加
export function shareCount(postId) {
    return request({
        header: {
            "Content-Type": 'application/x-www-form-urlencoded'
        },
        url: '/bbs/post/shareCount',
        method: 'POST',
        data: {
            id: postId
        }
    })
}

// 点赞
export function likePost(postId) {
    return request({
        header: {
            "Content-Type": 'application/x-www-form-urlencoded'
        },
        url: '/bbs/post/like',
        method: 'POST',
        data: {
            postId: postId
        }
    })
}

// 取消点赞
export function unlikePost(postId) {
    return request({
        header: {
            "Content-Type": 'application/x-www-form-urlencoded'
        },
        url: '/bbs/post/unlike',
        method: 'POST',
        data: {
            postId: postId
        }
    })
}


// 搜索
export function search(query){
    return request({
        url: `/bbs/search?currentPage=${query.currentPage}&&pageSize=${query.pageSize}&&keyword=${query.keyword}&&type=1` ,
        method: 'GET',
    })
}

// 列表tag
export function listTags(){
    return request({
        url: `/bbs/post/listTags` ,
        method: 'GET',
    })
}

// 列表置顶帖子
export function listPin(){
    return request({
        url: `/bbs/post/listPin` ,
        method: 'GET',
    })
}

// 帖子点赞历史
export function getLikeHistory(query){
	return request({
		url: `/bbs/post/likeHistory?currentPage=${query.currentPage}&&pageSize=${query.pageSize}`,
		method: 'GET'
	})
}
