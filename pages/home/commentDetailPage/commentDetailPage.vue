<template>
	<view style="overflow: hidden">
		<view class="main">
			<commentItem :commentItem="rootComment" :isCommentDetailPage="true" :rootCommentId='rootComment.commentId'
				:showReply='false'>
			</commentItem>
			<view class="report" @click="reportRootComment">
				<u-icon name="warning-fill" color="#717171" size="22" v-if="!rootComment.isCreator"></u-icon>
			</view>
			<view style="text-align: center; color: #777; padding-top: 30rpx;font-size: 28rpx;"
				v-if="rootComment.subCommentCount > 0">
				共{{ rootComment.subCommentCount }}条回复</view>
		</view>
		<!-- 分隔层 -->
		<u-divider></u-divider>
		<!-- 子评论 -->
		<view v-if="subCommentList.length" class="comment" v-for="(item, index) in subCommentList"
			:key="item.commentId">
			<commentItem @getComment="getComment" :commentItem="item" :isCommentDetailPage="true" :commentIndex='index'
				:rootCommentId='rootComment.commentId' :showReply='true'>
			</commentItem>
			<u-divider></u-divider>
		</view>
		<view style="margin-bottom: 170rpx">
			<u-loadmore :status="commentStatus" />
		</view>
		<!-- 评论框 -->
		<comment :type="1" :commentId="replyCommentId" :postId="rootComment.postId" :isFocus.sync='isFocus'
			@pubSubComment='pubSubComment' @resetCommentId="resetCommentId" :creatorName='creatorName' :level='2'>
		</comment>
	</view>
</template>

<script>
	import comment from '@/UI/comment/comment.vue';
	import commentItem from '@/UI/commentItem/commentItem.vue';
	import {
		getSubComment,
		delPostComment
	} from '@/api/bbs/comment.js';
	import {
		report
	} from '@/api/bbs/report';
	import {
		addPostSubComment
	} from '@/api/bbs/comment.js';
	export default {
		components: {
			comment,
			commentItem
		},

		data() {
			return {
				commentStatus: 'nomore',
				rootComment: {},
				replyCommentId: '',
				subCommentList: [],
				subComentParmas: {
					currentPage: 1,
					pageSize: 10,
					rootCommentId: ''
				},
				isFocus:false,
				creatorName: '',
				selectComment: {},
				onClick: false
			};
		},
		onLoad(option) {
			this.rootComment = JSON.parse(decodeURIComponent(option.rootComment));
			this.replyCommentId = this.rootComment.commentId
			wx.setNavigationBarTitle({
				title: '@' + this.rootComment.creatorName + ' 的评论'
			});
			this.subComentParmas.rootCommentId = this.rootComment.commentId;
			this.getSubComment();
		},

		methods: {
			// 获取子评论
			getSubComment() {
				getSubComment(this.subComentParmas).then((res) => {
					this.subCommentList = res.data.data.data;
				});
			},

			// // 添加评论
			// addSubComment(e) {
			// 	this.subCommentList.unshift(e)
			// 	this.rootComment.subCommentCount += 1
			// },

			// 获取评论组件返回的值
			getComment(e) {
				let sheetList = [];
				let that = this;
				if (e.isCreator) {
					sheetList = ['回复评论', '删除评论'];
				} else {
					sheetList = ['回复评论', '举报评论'];
				}
				this.selectComment = e;
				uni.showActionSheet({
					itemList: sheetList,
					success(res) {
						that.handleCommentAction(sheetList[res.tapIndex]);
					},
					fail(res) {
						console.log(res.errMsg);
					}
				})
			},

			// 点击评论更多弹窗框选项
			handleCommentAction(e) {
				if (e === '举报评论') {
					let param = {
						reportType: '帖子评论',
						targetId: this.selectComment.commentId,
						reason: JSON.stringify(this.selectComment)
					};
					report(param).then((res) => {
						if (res.data.code === 'SUCCESS') {
							uni.showToast({
								title: '举报成功',
								icon: 'none'
							});
						}
					});
				} else if (e === '删除评论') {
					let that = this;
					uni.showModal({
						title: '确认删除评论吗',
						success: (e) => {
							if (e.confirm) {
								delPostComment({
									commentId: that.selectComment.commentId
								}).then((res) => {
									if (res.data.data) {
										that.subCommentList.splice(that.selectComment.commentIndex, 1);
										uni.showToast({
											title: '删除成功',
											icon: 'none'
										});
										that.showOption = false;
									}
								});
							}
						}
					});
				} else if(e === '回复评论'){
					this.isFocus = true
					this.replyCommentId = this.selectComment.commentId
					this.creatorName = this.selectComment.creatorName
				}
			},

			// 举报根评论
			reportRootComment() {
				uni.showModal({
					title: '确认举报该评论？',
					success: (res) => {
						if (res.confirm) {
							let param = {
								reportType: '帖子评论',
								targetId: this.rootComment.commentId,
								reason: JSON.stringify(this.rootComment)
							};
							report(param).then((res) => {
								if (res.data.code === 'SUCCESS') {
									uni.showToast({
										title: '举报成功',
										icon: 'none'
									});
								} else {
									uni.showToast({
										title: '举报失败',
										icon: 'none'
									});
								}
							});
						}
					}
				})

			},
			// 重置回复的目标评论id
			resetCommentId() {
				this.replyCommentId = this.rootComment.commentId
				this.creatorName = ''
			},

			// 发表子评论
			pubSubComment(e) {
				if (this.onClick) {
					return
				}
				this.onClick = true
				addPostSubComment(e).then((res) => {
					if (res.data.code == 'SUCCESS') {
						this.subCommentList.push(res.data.data)
						uni.showToast({
							title: '评论成功',
							icon: 'none'
						});
						this.onClick = false
					} else {
						uni.showToast({
							title: '发表评论失败,请稍后再试',
							icon: 'error'
						});
						this.onClick = false
					}
				});
			}
		},

	};
</script>

<style lang="scss" scoped>
	.main {
		margin: 30rpx auto;
		position: relative;

		.report {
			position: absolute;
			right: 140rpx;
			top: 38rpx;
			font-size: 28rpx;
			color: #6b6b6b;
		}
	}

	/* 分隔层 */
	.interlayer {
		height: 20rpx;
		background-color: gray;
		opacity: 0.1;
		margin-top: 3%;
	}

	/* 子评论 */
	.comment {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-items: flex-start;

		/deep/.u-divider {
			margin: 10px 0;
		}
	}
</style>