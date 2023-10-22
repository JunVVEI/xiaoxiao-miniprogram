<template>
	<view class="container">
		<!-- 帖子主体 -->
		<view class="card">
			<!-- 头像 -->
			<view class="portrait">
				<view class="portrait-img">
					<u-avatar :src="atvList.portrait" shape="circle" size="80rpx"
						default-url="https://img.zcool.cn/community/01460b57e4a6fa0000012e7ed75e83.png@1280w_1l_2o_100sh.png">
					</u-avatar>
				</view>
			</view>
			<!-- 内容 -->
			<view class="content">
				<view class="title">
					<!-- 活动标题 -->
					<h1 style="font-size: 38rpx;color: #303133;font-weight: bold;">{{ atvList.text }}</h1>
					<!-- 活动形式 -->
					<p style="font-size: 26rpx;color: #ff9900;">{{ atvList.way }}</p>
					<!-- 点赞 -->
					<view>
						<image style="width:30px" mode="widthFix" :src="atvList.cheerUrl" @click="cheer"></image>
						<p style="font-size: 24rpx;color:#606266;text-align: center;">{{ atvList.likeNum }}</p>
					</view>
				</view>
				<!-- 活动计划 -->
				<view class="plan">
					<p>活动时间：{{ atvList.date }}</p>
					<p>活动地点：{{ atvList.place }}</p>


					<p>活动人数：{{ atvList.num }}人</p>
					<p>活动须知：{{ atvList.notice }}</p>
					<p>活动详情：{{ atvList.detail }}</p>
				</view>
				<view class="time">
					<!-- 创建时间 -->
					<p style="font-size: 24rpx;color: #606266;">{{ atvList.createTime }}</p>
					<!-- 图片 -->
				</view>
				<view class="img-warpper">
					<u-album :urls="atvList.imgList" multipleSize="150rpx" previewFullImage maxCount="3" space="20rpx">
					</u-album>
				</view>
			</view>
		</view>
		<!-- 评论区 -->
		<view class="comment">
			<!-- 评论区头部 -->
			<view class="comment-top">

				<view>
					<text>评论区</text>
					<!--
          <u-icon size="30" name="chat" @click="goToCreateComment" customStyle=" marginLeft:10rpx"></u-icon>
          -->
				</view>
				<view class="sort">
					<span @click="commentOrder">推荐</span>
					<span>|</span>
					<span @click="commentOrder">最热</span>
					<span>|</span>
					<span @click="commentOrder">最新</span>
				</view>
			</view>
			<!-- 评论 -->
			<view v-for="(item, index) in commentList" :key="index">
				<!-- 评论用户信息 -->
				<view class="user">
					<view class="user-avatar">
						<u-avatar :src="item.portrait" shape="circle" size="60rpx"
							default-url="https://img.zcool.cn/community/01460b57e4a6fa0000012e7ed75e83.png@1280w_1l_2o_100sh.png">
						</u-avatar>
					</view>
					<view class="comment-text">
						<text>{{ item.nickName }}</text>
						<text style="font-size:25rpx">{{ item.time }}</text>
					</view>
					<view class="like()">
						<span>{{ item.likeCount }}</span>
						<view>
							<image style="width:25px" mode="widthFix" :src="item.likeUrl" @click="like(e)"></image>
							<!--
              <u-icon :name="item.likeIcon" color="#606266" size="25" @click="like(item)"></u-icon>
              -->
						</view>

					</view>
				</view>
				<!-- 评论内容 -->
				<view style="margin-left: 13%;">
					<p style="margin-top:1%;" @click="commentOperate">{{ item.content }}</p>
					<p style="font-size:14px;margin:2% 0% 2% 0%;color: #1296db;" @click="goToCommment">10条回复</p>
				</view>
			</view>
		</view>
		<!-- 评论框 -->
		<view>
			<comment></comment>
		</view>
	</view>
</template>

<script>
	import {
		atyCommentLike,
		atyCommentUnlike,
		cheerActivity,
		cancelCheerActivity,
		queryCommentList,
		querySubCommentList,
		addSubComment
	} from '@/api/bbs/activity.js';

	import comment from '../../../UI/comment/comment.vue';
	export default {
		components: {
			comment
		},
		data() {
			return {
				//未打气图标
				cheerIcon: '../../../static/cheers.png',
				//已打气图标
				cheeronIcon: '../../../static/cheers_on.png',
				//爱心图标
				likeIcon: '../../../static/heart.png',
				likeFillIcon: '../../../static/heart-like.png',

				// 评论点赞参数
				query: {
					commentId: 4
				},

				//活动打气参数
				atvquery: {
					activityId: 50
				},

				//获取评论列表参数
				commentParams: {
					activityId: 1,
					order: 1
				},

				//获取子评论参数
				subComParams: {
					commentId: 1,
					order: 1
				},

				//活动列表
				atvList: {
					id: '1',
					portrait: 'https://tupian.qqw21.com/article/UploadPic/2020-7/2020791951792930.jpg',
					text: '周六下午东区踢世界杯',
					way: '线下',
					likeNum: 66,
					date: '2023-1-1',
					place: '东区运动场',
					slogan: '加油国足！',
					num: 100,
					notice: '请不要乱扔垃圾',
					detail: '音乐节',
					createTime: '2022-11-31 10:30',
					cheerUrl: '../../../static/cheers.png',
					likeUrl: '../../../static/heart.png',
					imgList: ['https://th.bing.com/th/id/OIP.00zvwMLgVpTWvGUBG8uphQHaEo?pid=ImgDet&rs=1',
						'https://th.bing.com/th/id/OIP.00zvwMLgVpTWvGUBG8uphQHaEo?pid=ImgDet&rs=1'
					]
				},
				//评论列表
				commentList: [{
						portrait: 'https://tupian.qqw21.com/article/UploadPic/2020-7/2020791951792930.jpg',
						nickName: '疯狂的南瓜',
						content: '希望今年的草地音乐节能听到华农张敬轩',
						time: '10-24 13:38',
						likeCount: 30,
						likeIcon: '../../../static/heart.png',
						likeUrl: '../../../static/heart.png',
					},
					{
						portrait: 'https://tupian.qqw21.com/article/UploadPic/2020-7/2020791951792930.jpg',
						nickName: '疯狂的南瓜',
						content: '希望今年的草地音乐节能听到华农张敬轩',
						time: '10-24 13:38',
						likeCount: 30,
						likeIcon: '../../../static/heart.png',
						likeUrl: '../../../static/heart.png',
					}
				],
				//评论框value
				commentContent: '',
				//评论焦点
				focus: ''
			};
		},
		onLoad() {
			// 预加载活动详情页
			uni.preloadPage({
				url: '/pages/home/activityDetailPage/activityDetailPage'
			});

		},
		onReady() {
			this.getCommentList();
			this.getSubCommentList();
		},

		methods: {
			//活动帖子打气
			cheer() {
				//打气

				if (this.atvList.cheerUrl == this.cheerIcon) {
					cheerActivity(this.atvquery).then((res) => {
						console.log(res);
						console.log('点赞活动成功');

						this.atvList.cheerUrl = this.cheeronIcon;
						this.atvList.likeNum++;
					})
				} //取消打气
				else if (this.atvList.cheerUrl == this.cheeronIcon) {
					// 取消打气
					cancelCheerActivity(this.atvquery).then((res) => {
						console.log(res);
						console.log('取消点赞成功');

						this.atvList.cheerUrl = this.cheerIcon;
						this.atvList.likeNum--;
					})

				}


			},

			//评论点赞与取消点赞
			like(e) {
				//评论点赞
				for (let i in this.commentList) {
					// console.log(this.commentList[i]);
					if (this.commentList[i].likeUrl == this.likeIcon) {
						atyCommentLike(this.query).then((res) => {
							console.log(res);
							console.log('点赞评论成功');

							this.commentList[i].likeUrl = this.likeFillIcon;
						})
					} else if (this.commentList[i].likeUrl == this.likeFillIcon) {
						atyCommentUnlike(this.query).then((res) => {
							console.log(res);
							console.log('取消点赞评论成功');

							this.commentList[i].likeUrl = this.likeIcon;
							// this.atvList.likeNum++;
						})
					}


					/*
        
        if (this.commentList[0].likeUrl == this.likeIcon) {
          atyCommentLike(this.query).then((res) => {
            console.log(res);
            console.log('点赞评论成功');

            this.commentList[0].likeUrl = this.likeFillIcon;
            // this.atvList.likeNum++;
          })
        }
        // 取消评论点赞
        else if (this.commentList[0].likeUrl == this.likeFillIcon) {
          atyCommentUnlike(this.query).then((res) => {
            console.log(res);
            console.log('取消点赞评论成功');
          
            this.commentList[0].likeUrl = this.likeIcon;
            // this.atvList.likeNum++;
          })
        }
       */
				}
			},

			// 查看评论列表
			getCommentList() {
				queryCommentList(this.commentParams).then(res => {
					console.log(res.data);
					console.log('获取评论列表成功');
					const arr = res.data.data;
					this.commentList = [...this.commentList, ...arr];
					// console.log(res.data);
					// console.log('获取评论列表成功');
				})
			},

			// 获取子评论列表
			getSubCommentList() {
				querySubCommentList(this.subComParams).then(res => {
					console.log(res.data);
					console.log('获取子评论列表成功');
					// const arr = res.data.data;
					//  this.commentList = [...this.commentList, ...arr];
					// console.log(res.data);
					// console.log('获取评论列表成功');
				})
			},


			//设置发送的评论内容
			setCommentContent(e) {
				(this.commentContent = e.detail.value), (this.focus = true);
			},
			//跳转到评论详细页
			goToCommment() {
				uni.navigateTo({
					url: '/pages/home/commentDetailPage/commentDetailPage'
				})
			},

			//跳转到发布评论页
			goToCreateComment() {
				uni.navigateTo({
					url: '/pages/home/createComment/createComment'
				})
			},

			//监听下拉刷新
			onPullDownRefresh() {
				console.log('下拉刷新');
				setTimeout(() => {
					uni.stopPullDownRefresh(); //停止下拉刷新
				}, 1000);
			},
			//排序评论
			commentOrder() {
				console.log(this.commentList);
			},

			//对评论进行操作
			commentOperate() {
				uni.showActionSheet({
					title: this.commentList[0].nickName + ':' + this.commentList[0].content,
					itemList: [
						'回复',
						'复制',
						'投诉'
					],
					success: (res) => {
						this.title = this.commentList[0].content
						console.log(this.title)
						if (res.tapIndex === 0) {
							console.log('选中了第1个按钮');
						} else if (res.tapIndex === 1) {
							console.log('选中了第2个按钮');
						} else if (res.tapIndex === 2) {
							console.log('选中了第3个按钮');
						}

					}
				});
			}

		},

	}
</script>

<style lang="less" scoped>
	.container {
		width: 100%;
		margin-top: 20rpx;
		overflow-y: auto;

		.card {
			display: flex;
			width: 95%;
			height: 500rpx;
			margin: 0 auto;
			background-color: #bfecf7;
			border-radius: 20rpx;

			.portrait {
				height: 80rpx;
				flex: 1;

				.portrait-img {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					overflow: hidden;
				}
			}

			.content {
				flex: 7;
				height: 500rpx;
				padding: 20rpx;

				.title {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.plan {
					font-size: 26rpx;
					color: 303133;
				}

				.img-warpper {
					display: flex;
					margin-top: 10rpx;
				}

				.time {
					display: flex;
					justify-content: space-between;
					font-size: 24rpx;
					color: skyblue;
				}
			}
		}

		.comment {
			display: flex;
			flex-direction: column;
			height: 1000rpx;
			margin: 0 auto;
			margin-top: 40rpx;
			// marigin-right: 20rpx;

			.comment-top {
				display: flex;
				width: 95%;
				margin: 20rpx auto;
				justify-content: space-between;


				.sort {
					width: 300rpx;
					display: flex;
					flex-direction: row;
					justify-content: space-around;
					color: #434343;
					// margin: 10rpx;
				}
			}

			.comment-title {
				display: flex;
				flex-direction: row;
				justify-content: space-around;
			}

			.user {
				width: 95%;
				display: flex;
				margin: 0 auto;
				flex-direction: row;
				justify-items: flex-start;
				align-items: center;


				.comment-text {
					display: flex;
					flex-direction: column;
					width: 80%;
					padding-left: 1%;
				}

				.like {
					display: flex;
				}
			}
		}

		/* 评论框 */
		.sendCommentPlace {
			background-color: white;
			display: flex;
			width: 100%;
			height: 6%;
			border: 2rpx solid gainsboro;
			bottom: 0;
			position: fixed;
			padding: 2%;

			.comment_input {
				border: 1rpx solid #dbdbdb;
				border-radius: 20rpx;
				width: 75%;
				height: 90%;
				margin-top: 2%;
				margin-bottom: 2%;
				padding-left: 3%;
				font-size: 30rpx;
				background-color: rgb(250, 250, 250);
			}

			.user-avatar {
				padding: 2%;
			}
		}
	}
</style>
