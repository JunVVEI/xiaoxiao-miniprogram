<template>
	<view class="container">
		<view class="top">
			<view class="left">
				<Avatar class="picture" :avatarUserId="item.uid" :avatarIdentityId="item.identityId"
					:avatarIsCreator="item.isCreator" :avatarUrl="item.userAvatar" />
				<view class="user">
					<view class="name">
						{{item.userName}}
					</view>
					<view class="date">
						{{time}}
					</view>
				</view>
			</view>
			<view class="bounty" v-if="item.type == 1">
				赏金:{{item.bounty}}￥
			</view>
			<view class="price" v-if="item.type == 2">
				{{item.bounty}}
			</view>
			<view class="right">
				<view class="status">
					<view class="tag">
						<u-tag :text="item.statusName" :type="status" size="mini"></u-tag>
					</view>
				</view>
				<view class="more" @click.stop="clickMore">
					更多
				</view>
			</view>
		</view>
		<u-divider></u-divider>
		<!-- 帖子内容 -->
		<view class="content">

			<p style="white-space: pre-wrap;font-size: 30rpx;line-height: 50rpx;"><text
					user-select="true">{{item.content}}</text></p>
		</view>
		<view class="post-picture" v-if="item.mediaPath.length">
			<u-album :urls="returnImgList(item.mediaPath)" maxCount="6" previewFullImage multipleSize="200rpx" />
		</view>
		<view class="contact">
			<view class="number">
				微信号: {{item.contact}}
			</view>
			<view class="copy">
				<u-button type="primary" shape="circle" text="复制" size="small" @click="copy"></u-button>
			</view>
		</view>
		<u-divider></u-divider>
		<!-- 评论区 -->
		<view class="comment-container">
			<!-- 评论区头部 -->
			<view class="comment-top">
				<p>{{ item.commentCount }}条评论 </p>
			</view>
			<view v-if="commentList.length">
				<view v-for="(item, index) in commentList" :key="item.commentId">
					<commentItem @getComment="getComment" :commentItem="foo(item)" :isCommentDetailPage="true"
						:commentIndex="index" :showReply='false' :showLike="false" />
					<u-divider></u-divider>
				</view>
			</view>
		</view>
		<view style="margin-bottom: 170rpx; height: 200rpx;" v-if="commentList.length">
			<u-loadmore :status="commentStatus" :line='true' />
		</view>
		<view style="position: fixed;bottom: 0;left: 0;">
			<!-- 评论框 -->
			<comment :type="2" :postId="item.id" @pubComment='sendComment' :level='2' :isFocus.sync='isFocus'
				@resetCommentId="resetCommentId" :creatorName='creatorName' :showImg="false"></comment>
		</view>
	</view>
</template>

<script>
	import Avatar from '@/UI/avatar/avatar';
	import {
		getTask,
		getTaskComment,
		addTaskComment,
		removeTaskComment,
		taskAccept,
		taskUnAccept,
		removeTask
	} from '@/api/help/index.js';
	import {
		report
	} from '@/api/bbs/report';
	import comment from '@/UI/comment/comment.vue';
	import commentItem from '@/UI/commentItem/commentItem.vue';
	import {
		diffPostDate
	} from '@/utils/timestamp.js';
	export default {
		components: {
			Avatar,
			comment,
			commentItem
		},
		data() {
			return {
				item: {},
				currentTab: 0,
				// 获取任务评论参数
				commentParams: {
					currentPage: 1,
					pageSize: 10,
					taskId: null
				},
				// 评论列表
				commentList: [],
				// 帖子操作菜单显示
				showSheet: false,
				// 评论操作显示
				showOption: false,
				// 帖子操作弹窗
				postSheetList: [{
					name: '举报帖子',
					id: 1
				}],

				// 评论操作弹窗
				commentSheetList: [],

				// 底部提示
				commentStatus: 'nomore',
				isFocus: false,

				// 选中的评论
				selectComment: {},

				// 回复的评论id
				replyCommentId: '',

				// 回复对象用户名
				creatorName: ""
			}
		},
		computed: {
			// 时间格式转化
			time() {
				return diffPostDate(this.item.createTime);
			},
			status() {
				if (this.item.statusName === '已接单' || this.item.statusName === '已出售') {
					return 'success'
				} else {
					return 'warning'
				}
			}
		},
		onLoad(e) {
			if (e.type == 2) {
				uni.setNavigationBarTitle({
					title: "闲置详情"
				})
			}
			getTask(JSON.parse(e.taskId)).then(res => {
				this.item = res.data.data
				this.commentParams.taskId = this.item.id
				this.getCommentList(true)
			})
		},
		onReachBottom: function() {
			this.commentParams.currentPage++
			this.getCommentList()
		},
		methods: {
			// 点击更多
			// clickMore() {
			// 	this.showSheet = !this.showSheet
			// 	if (this.item.isCreator) {
			// 		if (this.item.status === 1) {
			// 			this.postSheetList = [{
			// 				name: '删除悬赏',
			// 				id: 1
			// 			}, {
			// 				name: '转为已接单',
			// 				id: 2
			// 			}]
			// 		} else {
			// 			this.postSheetList = [{
			// 				name: '删除悬赏',
			// 				id: 1
			// 			}, {
			// 				name: '转为未接单',
			// 				id: 2
			// 			}]
			// 		}
			// 	} else {
			// 		this.$set(this.postSheetList, 0, {
			// 			name: '举报',
			// 			id: 1
			// 		})
			// 	}
			// },
			clickMore() {
				let sheetList = []
				let that = this
				if (this.item.isCreator) {
					if (this.item.type == 1) {
						if (this.item.status == 1) {
							sheetList = ['改为已接单', '删除悬赏']
						} else {
							sheetList = ['改为未接单', '删除悬赏']
						}
					} else {
						if (this.item.status == 1) {
							sheetList = ['改为已出售', '删除闲置']
						} else {
							sheetList = ['改为未出售', '删除闲置']
						}
					}
				} else {
					sheetList = ['举报']
				}
				uni.showActionSheet({
					itemList: sheetList,
					success: function(res) {
						that.selectClick(sheetList[res.tapIndex])
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				})
			},


			foo(item) {
				return {
					avatar: item.userAvatar,
					creatorName: item.userName,
					content: item.content,
					createTime: item.createTime,
					isCreator: item.isCreator,
					commentId: item.commentId,
					identityId: item.identityId,
					uid: item.uid
				}
			},

			returnImgList(str) {
				return str.split(",")
			},

			// 获取评论列表
			async getCommentList(isRefresh = false) {
				let res = await getTaskComment(this.commentParams)
				if (res.data.code === 'SUCCESS') {
					isRefresh ? this.commentList.splice(0, this.commentList.length, ...res.data.data.data) : (this
						.commentList = [...this.commentList, ...res.data.data.data]);
				} else {
					uni.showToast({
						title: '获取评论失败',
						icon: 'error'
					})
				}
			},
			// 复制微信号
			copy() {
				uni.setClipboardData({
					data: this.item.contact,
				})
			},
			//点击更多弹窗框选项
			selectClick(e) {
				if (e === '举报') {
					let param = {
						reportType: '悬赏任务',
						targetId: this.item.id,
						reason: JSON.stringify(this.item)
					};
					report(param).then((res) => {
						if (res.data.code === 'SUCCESS') {
							uni.showToast({
								title: '举报成功',
								icon: 'none'
							});
							setTimeout(() => {
								uni.navigateBack(1)
							}, 500)
						}
					});
				} else if (e === '删除悬赏' || e === '删除闲置') {
					uni.showModal({
						title: '确定删除吗？',
						success: (e) => {
							if (e.confirm) {
								removeTask(this.item.id).then((res) => {
									if (res.data.data) {
										uni.showToast({
											title: '删除成功',
											icon: 'success'
										});

										let pages = getCurrentPages(); // 获取页面实例
										let beforePage = pages[pages.length - 2]; // 前一个页面
										setTimeout(()=>{
											uni.navigateBack({
												delta: 1,
												success: function() {
													beforePage.$vm.getHelpList(
														true);; // 执行前一个页面的刷新 getList()
												}
											})
										}, 500)
									}
								});
							}
						}
					});
				} else if (e === '改为已接单' || e === '改为已出售') {
					if (e === '改为已接单') {
						this.$set(this.item, "statusName", "已接单")
						this.$set(this.item, "status", 2)
						taskAccept(this.item.id).then(res => {
							if (res.data.code === "SUCCESS") {
								uni.showToast({
									title: '任务状态修改为已接单',
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: '操作失败',
									icon: 'none'
								});
							}
						})
					} else {
						this.$set(this.item, "statusName", "已出售")
						this.$set(this.item, "status", 2)
						taskAccept(this.item.id).then(res => {
							if (res.data.code === "SUCCESS") {
								uni.showToast({
									title: '闲置物品修改为已出售',
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: '操作失败',
									icon: 'none'
								});
							}
						})
					}

				} else {
					if (e === '改为未接单') {
						this.$set(this.item, "statusName", "未接单")
						this.$set(this.item, "status", 1)
						taskUnAccept(this.item.id).then(res => {
							if (res.data.code === "SUCCESS") {
								uni.showToast({
									title: '任务状态修改为未接单',
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: '操作失败',
									icon: 'none'
								});
							}
						})
					} else {
						this.$set(this.item, "statusName", "未出售")
						this.$set(this.item, "status", 1)
						taskUnAccept(this.item.id).then(res => {
							if (res.data.code === "SUCCESS") {
								uni.showToast({
									title: '闲置物品修改为未出售',
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: '操作失败',
									icon: 'none'
								});
							}
						})
					}

				}
			},

			// 底部弹出框事件
			actionSheetClick(e) {
				if (e === '删除评论') {
					this.delTaskComment();
				}
				if (e === '举报评论') {
					this.reportComment();
				}
				// if (e.name === '回复评论') {
				// 	this.isFocus = true
				// 	this.replyCommentId = this.selectComment.commentId
				// 	this.creatorName = this.selectComment.creatorName
				// }
			},

			// 举报评论
			reportComment() {
				let param = {
					reportType: '悬赏任务评论',
					targetId: this.selectComment.commentId,
					reason: JSON.stringify(this.selectComment)
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
			},

			// 重置回复的目标评论id
			resetCommentId() {
				this.replyCommentId = " "
				this.creatorName = ''
			},

			//获取comment传来的show值
			getShow(e) {
				if (e.show == true) {
					this.isShow = true;
				}
			},

			// 获取评论组件返回的值
			getComment(e) {
				// if (!this.item.isCreator) {
				// 	if (e.isCreator) {
				// 		this.commentSheetList = [{
				// 			name: '删除评论',
				// 			id: 1
				// 		}]
				// 	} else {
				// 		this.commentSheetList = [{
				// 			name: '举报评论',
				// 			id: 1
				// 		}]
				// 	}

				// } else {
				// 	if (e.isCreator) {
				// 		this.commentSheetList = [{
				// 			name: '删除评论',
				// 			id: 1
				// 		}]
				// 	} else {
				// 		this.commentSheetList = [{
				// 			name: '举报评论',
				// 			id: 1
				// 		}, {
				// 			name: '回复评论',
				// 			id: 2
				// 		}]
				// 	}

				// }
				let sheetList = []
				let that = this
				this.selectComment = e;
				if (this.selectComment.isCreator) {
					sheetList = ['删除评论']
				} else {
					sheetList = ['举报评论']
				}
				uni.showActionSheet({
					itemList: sheetList,
					success: function(res) {
						that.actionSheetClick(sheetList[res.tapIndex])
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				})
			},

			// 发表评论
			sendComment(e) {
				addTaskComment({
					rewardTaskId: e.postId,
					content: e.content,
					identityId: e.identityId,
					parentId: e.parentId
				}).then(res => {
					if (res.data.code === "SUCCESS") {
						this.commentList.push(res.data.data)
						uni.showToast({
							title: '评论成功',
							icon: 'none'
						});
					} else {
						uni.showToast({
							title: res.data.data,
							icon: 'none'
						});
					}
				})
			},

			// 删除评论
			delTaskComment() {
				uni.showModal({
					title: '确认删除评论吗',
					success: (e) => {
						if (e.confirm) {
							removeTaskComment(this.selectComment.commentId).then((res) => {
								if (res.data.data) {
									this.commentList.splice(this.selectComment.commentIndex, 1);
									uni.showToast({
										title: '删除成功',
										icon: 'none'
									});
									this.showOption = false;
								}
							});
						}
					}
				});
			},
		}
	}
</script>

<style scoped lang="scss">
	.container {
		width: 95%;
		margin: 0 auto;

		.top {
			position: relative;
			display: flex;
			justify-content: space-between;
			height: 100rpx;
			background-color: #fff;
			width: 100%;
			padding-top: 20rpx;

			.left {
				height: 100%;
				width: 400rpx;
				display: flex;

				.user {
					margin-left: 18rpx;

					.name {
						font-size: 34rpx;
						line-height: 34rpx;
					}

					.date {
						margin-top: 15rpx;
						font-size: 26rpx;
						color: #878787;
					}
				}
			}

			.right {
				display: flex;
				width: 180rpx;
				justify-content: space-between;

				.more {
					color: #3c9cff;
				}
			}

			.bounty {
				position: absolute;
				right: 0;
				top: 90rpx;
				color: #18b566;
				font-family: 'YouYuan';
				font-size: 30rpx;

			}

			.price {
				position: absolute;
				right: 0;
				top: 90rpx;
				color: #2979ff;
				font-family: 'YouYuan';
				font-size: 38rpx;
			}

			.price::before {
				content: '￥';
				font-size: 34rpx;
			}

		}

		.content {
			width: 100%;
			margin-top: 20rpx;
			min-height: 200rpx;
			white-space: pre-wrap;
			color: #363636;
			letter-spacing: 1rpx;

		}

		.post-picture {
			padding: 20rpx 0 0 0;
		}

		.contact {
			width: 100%;
			height: 60rpx;
			margin-top: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.number {
				color: #363636;
			}
		}

		// 评论区头部
		.comment-container {
			display: flex;
			flex-direction: column;
			height: auto;

			//margin-bottom: 130rpx;
			.comment-top {
				display: flex;
				justify-content: center;
				color: #676767;
				font-size: 28rpx;
			}

			/deep/.u-divider {
				margin: 10px 0;
			}
		}
	}
</style>