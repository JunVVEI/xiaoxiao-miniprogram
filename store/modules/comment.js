const state = {
	// 二级评论的id
	commentId: '',
	// 二级评论的用户名
	commentUserName: '',
	// 三级评论的id
	replyId: '',
	// 三级评论的用户名
	replyName: '',
	// 是否进行子评论（1:不进行评论，2:二级评论，3:三级评论）
	isSubComment: 1,
	//单个评论项列表
	commentDetailList: ''
}
const mutations = {
	setCommentId(state, params) {
		state.commentId = params;
	},
	setCommentUserName(state, params) {
		state.commentUserName = params;
	},
	setReplyId(state, params) {
		state.replyId = params;
	},
	setReplyUserName(state, params) {
		state.replyUserName = params;
	},
	setIsSubComment(state, params) {
		state.isSubComment = params;
	},
	setCommentDetailList(state, params) {
		state.commentDetailList = params
	}
}
const actions = {

}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}