<template>
	<view>
		<u-list @scrolltolower.stop="loadMoreComment(isloadMoreComment)">
		<explore v-if="error" tipsTitle="似乎出现了一点意外" tipsName="似乎出现了一点意外" tipsTo="也许你可以看看别的"></explore>
		<view v-if="!error" style="overflow: hidden" @click="clickContainer()">
			<!-- 帖子主体 -->
			<view class="main">
				<!-- 用户信息 -->
				<view class="user">
					<Avatar class="user-avatar" :avatarUrl="post.avatar"
					:avatarUserId="post.userId" :avatarIdentityId="post.identityId" :avatarIsCreator="post.isCreator"/>
					<view class="user-text">
						<text style="font-weight: 600">{{ post.creatorName }}</text>
						<text style="font-size: 25rpx">{{ post.createTime }}</text>
					</view>
					<view class="attention" v-if="isAttention" @click="unFollowing">已关注</view>
					<view class="attention active" v-else-if="!isAttention" v-show="!post.isCreator" @click="following">
						关注</view>
					<view class="more" @click.stop="handlePostAction">
						<u-icon name="more-dot-fill" color="#909399" size="26"
							style="transform: rotate(90deg)"></u-icon>
					</view>
				</view>

				<!-- 帖子内容 -->
				<view class="content">
					<p style="white-space: pre-wrap"><text user-select="true">{{ post.content }}</text></p>
					<view class="post-picture" v-if="post.fileList">
						<u-album :urls="post.fileList" maxCount="9" showMore previewFullImage multipleSize="200rpx" />
					</view>
				</view>

				<!-- 帖子状态 -->
				<view class="state">
					<p class="readCount">点击量{{ post.viewCount }}</p>
					<view class="icon">
						<view class="icon-item">
							<button class="share" type="default" size="60px" plain="true" open-type="share">
								<u-icon name="share" color="#606266" size="24"></u-icon>
								<span
									style="margin-left: 5rpx; color: #606266; font-size: 16px">{{ post.shareCount }}</span>
							</button>
						</view>
						<view class="icon-item">
							<u-icon name="chat" color="#606266" size="24"></u-icon>
							<span style="margin-left: 5rpx; color: #606266">{{ post.commentCount }}</span>
						</view>
						<view class="icon-item" @click.stop="like">
							<image :src="likeUrl" style="width: 21px; height: 20px; line-height: 50px" mode="widthFix">
							</image>
							<span style="margin-left: 7rpx; color: #606266">{{ post.likeCount }}</span>
						</view>
					</view>
				</view>
			</view>
			<!-- 分隔层 -->
			<u-divider></u-divider>
			<!-- 评论区 -->
			<view class="comment-container">
				<!-- 评论区头部 -->
				<view class="comment-top">
					<p>评论{{ post.commentCount }}</p>
					<view class="sort">
						<!-- 排序弹出框 -->
						<view style="display: flex; align-items: center">
							<u-subsection bold activeColor="#333" inactiveColor="#767676" mode="button" :list="sortList"
								:current="currentTab" @change="switchTab"></u-subsection>
						</view>
					</view>
				</view>
				<view> 
					<view v-for="(item, index) in commentList" :key="item.commentId">
						<commentItem @getComment="getComment" :commentItem="item" :isCommentDetailPage="false"
							:commentIndex="index" :showReply = 'false' />
						<u-divider></u-divider>
					</view>
				</view>
			</view>
			<view style="margin-bottom: 170rpx">
				<u-loadmore :status="commentStatus" />
			</view>
			<!-- 评论框 -->
			<!-- <comment @show="getShow" :type="1" :postId="postId" @success="getCondition" @pubComment='sendComment' :level='1'></comment> -->
			<comment  :type="1" :postId="postId" @pubComment='sendComment' :level='1'></comment>
		</view>
		</u-list>
	</view>
</template>

<script>
	import comment from '@/UI/comment/comment.vue';
	import commentItem from '@/UI/commentItem/commentItem.vue';
	import {
		postDetail,
		delPost,
		likePost,
		unlikePost
	} from '@/api/bbs/post.js';
	import {
		listPostComment,
		delPostComment,
		addPostComment
	} from '@/api/bbs/comment.js';
	import {
		diffPostDate
	} from '@/utils/timestamp.js';
	import {
		getUserPublicInfo
	} from '@/api/user/user';
	import {
		follow,
		unfollow
	} from '@/api/user/follow';
	import {
		report
	} from '@/api/bbs/report';
	import explore from '@/UI/explore/explore.vue';
	import {
		Avatar
	} from 'UI/avatar/avatar.vue';

	export default {
		name: 'detailPage',
		components: {
			explore,
			comment,
			commentItem,
			Avatar
		},
		onLoad(ev) {
			// 接受列表页传递过来的列表id
			this.postId = ev.id;
			this.buttonShare.postId = ev.id;
			this.share.postId = ev.id;
		},
		onShow() {
			this.error = false;
			//获取列表信息
			this.getCommentList(true);
		},
		onReady() {
			this.getPostList();
		},
		data() {
			return {
				// 帖子详情是否请求异常
				error: false,
				/* 帖子主体 */
				//获取帖子数据
				postId: '', //帖子id
				//帖子
				post: {},
				//是否关注
				isAttention: false,
				//收藏图标
				collectIcon: '/static/collect.png',
				collectIconOn: '/static/collect_on.png',
				collectUrl: '/static/collect.png',
				//点赞图标
				likeIcon: '/static/like.png',
				likeOnIcon: '/static/like_on.png',
				likeUrl: '',
				/* 弹窗 */
				show: {
					//更多弹出框
					more: false,
					//排序弹出框
					option: ''
				},
				// 帖子操作弹窗
				postSheetList: [
					// {
					// 	name: '收藏帖子',
					// 	id: 1
					// },
					{
						name: '举报帖子',
						id: 2
					}
				],
				/* 评论区 */
				optionVal: 1, // 选中排序列表的值
				// 评论弹窗
				commentShow: false,
				//textarea焦点
				focus: false,
				// 排序
				sortList: ['综合', '新回复'],
				currentTab: 0,

				// 禁止u-list组件滑动
				scrollable: false,
				// status
				commentStatus: 'nomore',
				//评论列表
				commentList: [],
				// 选中的评论
				selectComment: {},
				isloading: false, //判断是否正在加载数据
				isFixd: '', //判断是否固定评论区导航栏
				// 评论区状态
				commentListState: {
      				currentPage: 1,
      				pageSize: 10,
      				order: 1
    			},
				// 是否加载更多评论
				isloadMoreComment: true
			};
		},
		computed: {
			//获取帖子参数
			postParams() {
				return {
					postId: this.postId, //帖子id
					userId: undefined,
					identityId: undefined
				};
			},
			//获取帖子评论参数
			commentListParams() {
				return {
					// 计算属性在此种情况下无法直接修改
					...this.commentListState,
					postId: this.postId
				};
			}
		},
		watch: {
			//点赞图标切换
			'post.isLike': {
				immediate: true,
				handler(newValue) {
					newValue ? (this.likeUrl = this.likeOnIcon) : (this.likeUrl = this.likeIcon);
				}
			},
		},
		methods: {
			//点击最外层
			clickContainer() {
				//将所有show都变为false
				for (let index in this.show) {
					this.show[index] = false;
				}
			},
			//点击关注
			following() {
				let data;
				if (this.post.userId !== undefined) {
					data = {
						uid: this.post.userId,
						type: getApp().globalData.userType
					};
				} else if (this.post.identityId !== undefined) {
					data = {
						identityId: this.post.identityId,
						type: getApp().globalData.identityType
					};
				} else {
					return;
				}
				follow(data).then((res) => {
					this.isAttention = true;
				});
			},
			//取消关注
			unFollowing() {
				let data;
				if (this.post.userId !== undefined) {
					data = {
						uid: this.post.userId,
						type: getApp().globalData.userType
					};
				} else if (this.post.identityId !== undefined) {
					data = {
						identityId: this.post.identityId,
						type: getApp().globalData.identityType
					};
				} else {
					return;
				}
				uni.showModal({
					title: '确定取消关注吗？',
					success: (res) => {
						if (res.confirm) {
							unfollow(data).then((res) => {
								this.isAttention = false;
							});
						}
					}
				});
			},
			// 获取帖子详情
			getPostList() {
				postDetail(this.postParams)
					.then((res) => {
						if (!res.data.data) {
							this.error = true;
							return;
						}
						let data = res.data.data;
						if (data.mediaPath) {
							data.fileList = data.mediaPath.split(',');
							// 有图片就修改分享图片
							this.share.imageUrl = data.fileList[0];
							this.buttonShare.imageUrl = data.fileList[0];
						}

						this.share.content = data.content;
						this.buttonShare.content = data.content;

						if (data.creatorName === undefined) {
							data.creatorName = '匿名用户';
						}
						data.createTime = diffPostDate(data.createTime);
						//修改分享数据
						// this.share.title = data.title;
						// this.buttonShare.title = data.title;
						this.post = data;

						// 这里获取用户间关系，后面得修改一下，太屎了
						this.getUserInfo();

						if (this.post.isCreator) {
							this.$set(this.postSheetList, 0, {
								name: '删除帖子',
								id: 1
							});
						} else {
							this.$set(this.postSheetList, 0, {
								name: '举报帖子',
								id: 2
							});
						}
					})
					.catch((e) => {
						this.error = true;
					});
			},

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
								delPostComment({commentId: that.selectComment.commentId}).then((res) => {
									if (res.data.data) {
										that.commentList.splice(that.selectComment.commentIndex, 1);
										uni.showToast({
											title: '删除成功',
											icon: 'none'
										});
									}
								});
							}
						}
					});
				} else {
				// 前往评论详情页
					uni.navigateTo({
						url: `../commentDetailPage/commentDetailPage?rootComment=${encodeURIComponent(JSON.stringify(this.selectComment))}`
					});
				}
			},

			// 获取用户信息
			getUserInfo() {
				let data;
				if (this.post.userId !== undefined && this.post.identityId === undefined) {
					data = {
						uid: this.post.userId,
						type: getApp().globalData.userType
					};
				} else if (this.post.identityId !== undefined) {
					data = {
						identityId: this.post.identityId,
						type: getApp().globalData.identityType
					};
				} else {
					return;
				}
				getUserPublicInfo(data).then((res) => {
					this.isAttention = res.data.data.isFollowing;
				});
			},

			//获取评论列表
			async getCommentList(isRefresh = false) {
				let res = await listPostComment(this.commentListParams);
				if (res.data.code === 'SUCCESS') {
					if(res.data.data.data.length){
						if(isRefresh) {
							this.commentList.splice(0, this.commentList.length, ...res.data.data.data);
						} else {
							this.commentList = [...this.commentList, ...res.data.data.data];
							this.isloadMoreComment = true
						}
					}else{
						this.isloadMoreComment = false
					}
				} else {
					uni.showToast({
						title: '获取评论失败',
						icon: 'error'
					})
				}
			},

			// 触底加载更多评论
			loadMoreComment(isloadMoreComment) {
				if(isloadMoreComment){
					this.commentListParams.currentPage++;
					this.getCommentList();
				}
			},

			// 点击帖子更多弹窗框选项
			handlePostAction() {
				let sheetList = [];
				let that = this;
				if(this.post.isCreator) {
					sheetList = ['删除帖子'];
				} else {
					sheetList = ['举报帖子'];
				}
				uni.showActionSheet({
					itemList: sheetList,
					success(res) {
						that.postAction(sheetList[res.tapIndex]);
					},
					fail(res) {
						console.log(res.errMsg);
					}
				})
			},

			postAction(e) {
				if(e === '举报帖子') {
					let param = {
						reportType: '帖子',
						targetId: this.post.id,
						reason: JSON.stringify(this.post)
					};
					report(param).then((res) => {
						if (res.data.code === 'SUCCESS') {
							uni.showToast({
								title: '举报成功',
								icon: 'none'
							});
						}
					});
				} else if(e === '删除帖子') {
					uni.showModal({
						title: '确定删除吗？',
						success: (e) => {
							if (e.confirm) {
								delPost(this.post.id).then((res) => {
									if (res.data.data) {
										uni.showToast({
											title: '删除成功',
											icon: 'success'
										});
										uni.navigateBack(1);
									}
								});
							}
						}
					});
				}
			},

			//帖子点赞
			like() {
				if (this.likeUrl === this.likeIcon) {
					this.likeUrl = this.likeOnIcon;
					this.post.likeCount++;
					likePost(this.postId).then((res) => {
						if (res.data.code === 'SUCCESS' && res.data.data === true) {

						}
					});
				} else {
					this.likeUrl = this.likeIcon;
					this.post.likeCount--;
					unlikePost(this.postId).then((res) => {
						if (res.data.code === 'SUCCESS' && res.data.data === true) {

						}
					});
				}
			},

			// 选择评论排序
			switchTab(e) {
				if (this.currentTab === e) return;
				this.currentTab = e;
				//更改排序规则 1-综合，2-新发布，3-新回复
				this.commentListParams.order = e + 1;
				//重置列表数据
				// this.commentList = [];
				this.getCommentList(true); //重新请求数据
			},

			//获取comment传来的show值
			getShow(e) {
				if (e.show == true) {
					this.isShow = true;
				}
			},

			// 获取评论框传递的对象并且发表评论
			sendComment(e) {
				addPostComment(e).then(res => {
					uni.showToast({
						title:'评论成功',
						icon:'none'
					})
					this.commentList.unshift(res.data.data)
				})
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			setTimeout(() => {
				this.getCommentList(true);
				uni.stopPullDownRefresh();
			}, 1000);
		},

		// // 监听页面滚动
		// onPageScroll() {
		// 	const query = uni.createSelectorQuery().in(this);
		// 	query
		// 		.select('.main')
		// 		.boundingClientRect((data) => {
		// 			//console.log(data)
		// 			const mainTop = data.top;
		// 			const mainHeight = data.height;
		// 			if (Math.abs(parseInt(mainTop)) > parseInt(mainHeight)) {
		// 				this.isFixd = true;
		// 			} else {
		// 				this.isFixd = false;
		// 			}
		// 		})
		// 		.exec();
		// }
	};
</script>

<style lang="scss" scoped>
	/* 用户信息栏 */
	.user {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-items: flex-start;
		align-items: center;

		.user-avatar {
			padding: 2%;
		}

		.user-text {
			display: flex;
			flex-direction: column;
			width: 73%;
		}

		.comment_icon {
			display: flex;
			flex-direction: row;
			align-items: center;

			span {
				padding-left: 1%;
			}
		}
	}

	/* 帖子主体 */
	.main {
		display: flex;
		flex-direction: column;
		width: 100%;

		// 关注按钮
		.attention {
			border-radius: 30rpx;
			width: 17%;
			height: 48rpx;
			font-size: 28rpx;
			text-align: center;
			margin-right: 3%;
			padding-top: 1%;
			background-color: lightgrey;
		}

		.active {
			background-color: crimson;
			color: white;
		}

		.more {
			//transform: rotateZ(90deg);
			margin-right: 3%;
			transform: rotate(90deg);
		}
	}

	/* 帖子内容区 */
	.content {
		width: 95%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		padding: 10rpx;
		letter-spacing: 1rpx;
		font-size: 34rpx;
		color: #2f2f2f;
		line-height: 48rpx;

		.post-picture {
			padding: 20rpx 0 0 0;
		}
	}

	/* 帖子状态 */
	.state {
		display: flex;
		width: 95%;
		align-items: center;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		height: 50px;

		.readCount {
			width: 55%;
			font-size: 28rpx;
			color: #7e7e7e;
		}

		.icon {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 16px;
			width: 420rpx;

			.icon-item {
				display: flex;
				flex: 1;
				width: 90rpx;
				justify-content: center;
				align-items: center;
			}

			.share {
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: white;
				flex: 1;
			}

			//取消button的边框
			button[plain] {
				border: 0;
			}
		}
	}

	/* 分隔层 */
	.interlayer-comment {
		height: 20rpx;
		background-color: gray;
		opacity: 0.1;
		margin-top: 1%;
	}

	// 评论区头部
	.comment-container {
		display: flex;
		flex-direction: column;
		height: auto;

		//margin-bottom: 130rpx;
		.comment-top {
			display: flex;
			flex-direction: row;
			padding: 3%;
			justify-content: space-between;

			.sort {
				width: 180rpx;

				/deep/.u-subsection {
					border-radius: 40rpx;
					width: 180rpx;
					font-size: 28rpx;

					&__bar {
						border-radius: 40rpx;
					}
				}
			}
		}
		/deep/.u-divider{
			margin: 10px 0;
		}
	}

	.fixed {
		position: fixed;
		top: 0;
		width: 95%;
		background-color: white;
		z-index: 99;
	}
</style>
