<template>
	<view style="padding: 10rpx 10rpx;background-color: #f2f6fa;">
		<!-- 帖子容器 -->
		<view class="post">
			<!-- 顶部 -->
			<view class="user" @click.stop="goToDetail">
				<Avatar class="picture" :avatarUserId="postItem.userId" :avatarIdentityId="postItem.identityId"
					:avatarIsCreator="postItem.isCreator" :avatarUrl="postItem.avatar" />
				<view class="intro">
					<h1 class="creatorName">{{ creatorName }}</h1>
					<view class="date">{{ time }}</view>
				</view>

				<view class="more" @click.stop="showSelect">
					<u-icon name="more-dot-fill" color="#909399" size="18"></u-icon>
				</view>
			</view>
			<!-- 帖子内容 -->
			<view class="content" @click.stop="goToDetail">
				<p class="content-p">{{ postItem.content }}</p>
			</view>
			<!-- 帖子图片 -->
			<view class="post-picture" v-if="albumList.length" @click="goToDetail">
				<u-album :urls="albumList" maxCount="3" showMore multipleSize="200rpx" />
			</view>
			<!-- 帖子状态 -->
			<view class="post_state" @click.stop="goToDetail">
				<view class="share">
					<u-icon name="share" color="#606266" size="23"></u-icon>
					<span style="margin-left: 5rpx;color: #606266; font-size: 18px;">{{ postItem.shareCount }}</span>
				</view>
				<view class="comment">
					<u-icon name="chat" color="#606266" size="23"></u-icon>
					<span style="margin-left: 5rpx;color: #606266; font-size: 18px;">{{ postItem.commentCount }}</span>
				</view>
				<view class="like" @click.stop="like">
					<image :src="likeUrl" style="width:20px; height: 18px;" mode="widthFix"></image>
					<span style="margin-left: 7rpx;color: #606266; font-size: 18px;">{{ postItem.likeCount }}</span>
				</view>
			</view>
		</view>
		<!-- <u-gap height="10" bg-color="gray"></u-gap> -->
		<view class="interlayer"></view>
	</view>
</template>

<script>
	import {
		diffPostDate
	} from '@/utils/timestamp.js';
	import {
		likePost,
		unlikePost
	} from "../../api/bbs/post";
	import {
		Avatar
	} from 'UI/avatar/avatar.vue';
	export default {
		data() {
			return {
				//点赞图标
				likeIcon: '../../static/like.png',
				likeOnIcon: '../../static/like_on.png',
				likeUrl: '',
				//帖子列表
				postItem: this.postList,
			};
		},
		watch: {
			//点赞图标切换
			'postItem.isLike': {
				immediate: true,
				handler(newValue) {
					newValue ? (this.likeUrl = this.likeOnIcon) : (this.likeUrl = this.likeIcon);
				}
			}
		},
		props: ['postList', 'postIndex'],
		computed: {
			// 帖子的媒体路径是string类型
			albumList() {
				let arr = [];
				if ('mediaPath' in this.postItem && this.postItem.mediaPath !== "") {
					arr = this.postItem.mediaPath.split(',');
				}
				return arr;
			},
			// 时间格式转化
			time() {
				return diffPostDate(this.postItem.createTime);
			},
			// 用户名适配
			creatorName() {
				if (this.postItem.creatorName === undefined) {
					return '匿名用户';
				} else {
					return this.postItem.creatorName;
				}
			}
		},
		methods: {
			//点击更多按钮
			showSelect() {
				// 触发帖子操作菜单
				this.$emit('post', {
					id: this.postItem.id,
					isCreator: this.postItem.isCreator,
					postIndex: this.postIndex
				});
			},
			//点赞
			like() {
				if (this.postItem.isLike === undefined || this.postItem.isLike === false) {
					this.postItem.isLike = true;
					this.postItem.likeCount++;
					likePost(this.postItem.id).then(res => {
						if (res.data.data === true) {
							return true
						}
					})
				} else if (this.postItem.isLike === true) {
					this.postItem.isLike = false;
					this.postItem.likeCount--;
					unlikePost(this.postItem.id).then(res => {
						if (res.data.data === true) {
							return true
						}
					})
				}
			},
			//跳转到详细页
			goToDetail() {
				uni.navigateTo({
					url: `/pages/home/detailPage/detailPage?id=${this.postItem.postId}`
				});
			}
		},
		components: {
			Avatar
		}
	};
</script>

<style scoped lang="scss">
	.post {
		width: 93%;
		margin: 0 auto;
		background-color: #ffffff;
		border-radius: 15rpx;
		padding-left: 20rpx;
		padding-top: 20rpx;
		padding-bottom: 15rpx;

		.user {
			display: flex;
			height: 100rpx;
			position: relative;
		}

		.picture {
			margin-right: 25rpx;
			margin-left: 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.intro {
			position: relative;
			padding-top: 8rpx;

			.creatorName {
				color: #303133;
				font-size: 28rpx;
				font-weight: 600;
			}

			.date {
				font-size: 24rpx;
				color: #203133;
				margin-top: 10rpx;
			}
		}

		.content {
			font-size: 30rpx;
			font-family: inherit;
			color: #203133;
			padding-top: 10rpx;
			padding-right: 40rpx;

			.content-p {
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				word-break: break-all; // 注意这个文字多行很重要
				-webkit-box-orient: vertical;
				white-space: pre-wrap;
			}
		}

		.more {
			position: absolute;
			width: 5rpx;
			height: 40rpx;
			right: 30rpx;
			transform: rotateZ(90deg);
		}

		.select {
			width: 300rpx;
			position: absolute;
			z-index: 99;
			//height:140rpx;
			right: 0;
			top: 70rpx;
			background-color: #fff;
			font-size: 24rpx;
			box-shadow: 0 0 8rpx 1rpx #eee;
			border-radius: 10rpx;

			.select_item {
				display: flex;
				padding: 10rpx;
				align-items: center;
				height: 50rpx;
			}
		}

		.report {
			width: 550rpx;
			position: absolute;
			z-index: 99;
			//margin: 5% 0% 0% 5%;
			right: 0;
			top: 70rpx;
			height: 350rpx;
			background-color: #fff;
			font-size: 24rpx;
			box-shadow: 0 0 8rpx 1rpx #eee;
			border-radius: 10rpx;

			.report_item {
				display: flex;
				padding: 10rpx;
				align-items: center;
				height: 50rpx;
				border-bottom: 0.5px solid #303133;
			}
		}

		// 删除帖子
		.deleteItem {
			padding: 40rpx 20rpx;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.post-picture {
			padding: 20rpx 0;
		
		}

		.post_state {
			width: 100%;
			display: flex;
			margin: 0 auto;
			margin-top: 10rpx;
			height: 80rpx;
			justify-content: space-between;
			align-items: center;

			.share {
				display: flex;
				flex: 1;
				align-items: center;
				justify-content: center;
				background-color: white;
			}

			//取消button的边框
			button[plain] {
				border: 0;
			}

			.like {
				display: flex;
				flex: 1;
				align-items: center;
				justify-content: center;
			}

			.comment {
				display: flex;
				flex: 2;
				align-items: center;
				justify-content: center;
			}
		}
	}

	/* 分隔层 */
	.interlayer {
		height: 5rpx;
		background-color: #f5f6fa;
		opacity: 0.1;
	}
</style>