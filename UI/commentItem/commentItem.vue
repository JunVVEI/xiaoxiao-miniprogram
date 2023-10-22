<template>
	<view >
		<!-- 评论用户信息 -->
		<view class="user">
			<Avatar class="user-avatar" :avatarSize="avatarSize" :avatarUrl="comment.avatar"
			:avatarUserId="comment.uid" :avatarIdentityId="comment.identityId" :avatarIsCreator="comment.isCreator" />
			<view class="user-text" @click.stop.prevent="clickContainer">
				<text>{{ comment.creatorName }}</text>
				<text style="font-size: 23rpx;color: #4f4f4f;margin-top: 6rpx;">{{ time }}</text>
			</view>
			<!-- 点赞按钮 -->
			<view class="comment_icon" @click.stop="commentLike" v-if="showLike">
				<image :src="likeUrl" style="width:20px; height: 18px;" mode="widthFix"></image>
				<span style="padding-left: 7rpx">{{ comment.likeCount }}</span>
			</view>
		</view>
		<!-- 评论内容 -->
		<view style="margin-left: 106rpx; margin-top: 1%; word-break:break-all;" @click.stop.prevent="clickContainer" >
			<view style="color: #272727; padding-right: 40rpx;letter-spacing: 2rpx;">
				<text v-if="showReply && rootCommentId !== comment.parentId" style="color: #888;">回复:@{{ comment.parentCreatorName }}: {{ ' ' }}</text>
				<text user-select="true" @longpress.prevent="()=>{}" style="line-height: 48rpx;">{{comment.content}}</text>
			</view>
			<view style="margin: 2% 0" v-if="!comment.mediaPath ? false : true" @click.stop="clickImg">
				<u-album :urls="albumList" maxCount="9" showMore previewFullImage multipleSize="200rpx" />
			</view>
		</view>
		<!-- 帖子详情页中的子评论区域 -->
		<view class="children-comment-block" v-if="!isCommentDetailPage && (comment.subCommentCount === 0 ? false : true)" @click.stop="goToDetail">
			<view class="children-comment">
				<span class="subContent">{{ comment.subCommentList[0].creatorName + ' : ' + comment.subCommentList[0].content }}</span>
			</view>
			<view style="font-size: 28rpx; margin: 2% 0% 1% 0%; color: #4f4f4f" v-if="comment.subCommentCount > 1">
				查看{{ comment.subCommentCount }}条评论
			</view>
		</view>
	</view>
</template>

<script>
	import {
		commentLike,
		commentUnlike
	} from '@/api/bbs/comment.js';
	import {
		diffPostDate
	} from '@/utils/timestamp.js';
	import {
		Avatar
	} from 'UI/avatar/avatar.vue';
	export default {
		// isCommentDetailPage:判断是否是评论详情页
		// rootCommentId 子评论页的楼主评论id
		// showReply是否显示“回复xxx”
		// commentIndex 评论在评论列表的下标
		// commentItem传递的评论对象
		props:{
			'commentItem':{
				type: Object
			},
			'isCommentDetailPage':{
				type: Boolean
			},
			'commentIndex':{
			},
			'rootCommentId':{

			},
			'showReply':{
				type: Boolean
			},
			'showLike':{
				type: Boolean,
				default: true
			}

		},
		data() {
			return {
				//点赞图标
				likeIcon: '/static/like.png',
				likeOnIcon: '/static/like_on.png',
				likeUrl: '',
				// 评论详情
				comment: {},
				// 头像
				avatarSize: "60rpx"
			};
		},
		computed: {
			// 帖子的媒体路径是string类型
			albumList() {
				let arr = [];
				if (this.comment.mediaPath !== undefined) {
					arr = this.comment.mediaPath.split(',');
				}
				return arr;
			},
			// 时间格式转化
			time() {
				return diffPostDate(this.comment.createTime);
			}
		},
		watch: {
			'comment.isLiked': {
				immediate: true,
				handler(newVal) {
					newVal ? (this.likeUrl = this.likeOnIcon) : (this.likeUrl = this.likeIcon);
				}
			},
			commentItem: {
			    handler(newVal, oldVal) {
			     this.comment = newVal;
			    },
				immediate: true
			  }
		},
		methods: {
			//点击图片
			clickImg() {},
			// 禁止遮罩层下方滑动
			moveHandle() {},

			clickContainer() {
				let commentDetail = Object.assign(this.comment, {
					commentIndex: this.commentIndex
				});
				this.$emit('getComment', commentDetail);
			},
			// 评论点赞
			commentLike() {
				if (!this.comment.isLiked) {
					this.comment.likeCount++;
					this.comment.isLiked = true;
					commentLike({
						commentId: this.comment.commentId
					}).then((res) => {
						// 点赞
						if (res.data.code === 'SUCCESS' && res.data.data === true) {
							return true
						}
					});
				} else if (this.comment.isLiked) {
					this.comment.likeCount--;
					if (this.comment.likeCount < 0) {
						this.comment.likeCount = 0;
					}
					this.comment.isLiked = false;
					commentUnlike({
						commentId: this.comment.commentId
					}).then((res) => {
						//取消点赞
						if (res.data.code === 'SUCCESS' && res.data.data === true) {
							return true
						}
					});
				}
			},
			//跳转到评论详细页
			goToDetail() {
				uni.navigateTo({
					url: `../commentDetailPage/commentDetailPage?rootComment=${encodeURIComponent(JSON.stringify(this.comment))}`
				});
			}
		},components: {
			Avatar
		}
	};
</script>

<style lang="less" scoped>
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

	//子评论
	.children-comment-block {
		background-color: #f4f4f4;
		border-radius: 20rpx;
		width: 580rpx;
		margin: 15rpx 0 15rpx 90rpx;
		padding: 15rpx;

		.children-comment {
			height: 50rpx;

			.subContent {
				line-height: 50rpx;
				font-size: 28rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				color: #555;
				-webkit-line-clamp: 1;
				word-break: break-all; // 注意这个文字多行很重要
				-webkit-box-orient: vertical;
				white-space: nowrap;
			}
		}
	}
</style>
