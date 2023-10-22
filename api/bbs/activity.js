import {
  request
} from '@/utils/request.js';

// 获取活动列表
export function listAllActivity(data) {
  return request({
    header: {
      "Content-Type": 'application/json',
    },
    url: '/bbs/activity/query',
    method: 'POST',
    data: data,
  })
}

// 发布活动
export function postActivity(data) {
  return request({
    url: '/bbs/activity/add',
    method: 'POST',
    data: data,
  })
}

// 为活动打气
export function cheerActivity(data) {
  return request({
    url: '/bbs/activity/like',
    method: 'POST',
    data: data
  })
}

// 取消活动打气
export function cancelCheerActivity(data) {
  return request({
    url: '/bbs/activity/dislike',
    method: 'POST',
    data: data
  })
}

// 活动评论点赞
export function atyCommentLike(data) {
  return request({
    url: '/bbs/activity/comment/like',
    method: 'POST',
    data: data
  })
}

// 取消活动评论点赞
export function atyCommentUnlike(data) {
  return request({
    url: '/bbs/activity/comment/unlike',
    method: 'POST',
    data: data
  })
}

// 发布评论
export function addComment(data) {
  return request({
    url: '/bbs/activity/comment/add',
    method: 'POST',
    data: data
  })
}

// 发布子评论
export function addSubComment(data) {
  return request({
    url: '/bbs/activity/subComment/add',
    method: 'POST',
    data: data
  })
}

//获取评论列表
export function queryCommentList(data) {
  return request({
    url: '/bbs/activity/comment/query',
    method: 'POST',
    data: data
  })
}

//获取子评论列表
export function querySubCommentList(data) {
  return request({
    url: '/bbs/activity/subComment/query',
    method: 'POST',
    data: data
  })
}
