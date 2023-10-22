<template>
	<view class="bgColor">
		<!-- 顶部 -->
		<view class="header">
			<!-- 头像信息等 -->
			<view class="user" @click="toInfoPage">
				<view class="left">
					<!-- 头像 -->
					<view class="avatar">
						<u-avatar :src="userInfo.avatar" shape="circle" size='120rpx'
							default-url="https://img.zcool.cn/community/01460b57e4a6fa0000012e7ed75e83.png@1280w_1l_2o_100sh.png">
						</u-avatar>
					</view>
					<!-- 信息 -->
					<view class="userInfo">
						<view class="userName">{{ userInfo.userName }}</view>
					</view>
				</view>
				<!-- 进入个人主页图标 -->
				<view class="right">
					<view>
						<u-icon name="arrow-right" color="#797979" size="22"></u-icon>
					</view>
				</view>
			</view>

			<!-- 发帖，关注等 -->
			<view class="about">
				<view class="article" @click="toInfoPage">
					{{ userInfo.postCount || '--'}}
					<view>发帖</view>
				</view>
				<view class="line"></view>
				<view class="follow" @click="toFollowPage">
					{{ userInfo.followingCount || '--'}}
					<view>关注</view>
				</view>
				<view class="line"></view>
				<view class="fans" @click.stop="toFansPage">
					{{ userInfo.followerCount || '--'}}
					<view>被关注</view>
				</view>
			</view>
		</view>
		<!-- 功能区 -->
		<view class="function-section">
			<view @click="toHistoryPage">
				<image src="@/static/mine/history.png"></image>
				<view>我的浏览</view>
			</view>
			<view @click="toLikeHistoryPage">
				<image src="@/static/mine/like.png" class="followImage"></image>
				<view>我的点赞</view>
			</view>
<!--			<view @click="toDraftPage">-->
<!--				<image src="@/static/mine/draft.png"></image>-->
<!--				<view>草稿箱</view>-->
<!--			</view>-->
			<view @click="toMyHelp">
				<image src="@/static/mine/coin.png"></image>
				<view>我的悬赏</view>
			</view>
			<view @click="toIdentityPage">
				<image src="@/static/mine/identity.png"></image>
				<view>匿名身份</view>
			</view>
		</view>

		<scroll-view scroll-y class="blank" :style="{height: blankHeight}">
			<view class="other-item" @click="shareToFriends">
				<view class="item-left">
					<u-icon name="share-square" color="#ffaa00" size="26"></u-icon>
					推荐给朋友
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" color="#9daab1" size="16"></u-icon>
				</view>
			</view>
			<view class="other-item" @click="notice">
				<view class="item-left">
					<u-icon name="weixin-fill" color="#55557f" size="26"></u-icon>
					接收消息通知
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" color="#9daab1" size="16"></u-icon>
				</view>
			</view>
			<view class="other-item" @click="contactUs">
				<view class="item-left">
					<u-icon name="chat-fill" color="#ff8349" size="26"></u-icon>
					联系客服
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" color="#9daab1" size="16"></u-icon>
				</view>
			</view>
<!--			<view class="other-item" @click="joinGroup">-->
<!--				<view class="item-left">-->
<!--					<u-icon name="qq-fill" color="#ff8349" size="26"></u-icon>-->
<!--					加入用户交流群-->
<!--				</view>-->
<!--				<view class="item-right">-->
<!--					<u-icon name="arrow-right" color="#9daab1" size="16"></u-icon>-->
<!--				</view>-->
<!--			</view>-->
<!--			<view class="other-item" @click="feedback">-->
<!--				<view class="item-left">-->
<!--					<u-icon name="file-text" color="#00aa00" size="26"></u-icon>-->
<!--					意见反馈-->
<!--				</view>-->
<!--				<view class="item-right">-->
<!--					<u-icon name="arrow-right" color="#9daab1" size="16"></u-icon>-->
<!--				</view>-->
<!--			</view>-->
			<view class="other-item" @click="aboutUs">
				<view class="item-left">
					<u-icon name="star-fill" color="#009ab1" size="26"></u-icon>
					加入校校
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" color="#9daab1" size="16"></u-icon>
				</view>
			</view>
		</scroll-view>

		<login :show="loginPopupShow" :timer="timer"></login>
	</view>
</template>

<script>
	import {
		policy
	} from "@/api/bs/file.js";
	import login from "@/UI/login/login.vue";
	import {
		getCurrentUserInfo
	} from "@/api/user/user";
	export default {
		data() {
			return {
				// 用户信息
				userInfo: {},
				logined: false, // 未登录状态
				loginPopupShow: false, // 登录弹窗的显示
				timer: 0,
				qrShow: false
			}
		},
		components: {
			login
		},
		computed: {
			// 亟待开发部分的高度
			blankHeight() {
				// 70为各盒模型的上下margin之和
				return (this.pH - 300 - 150 - 50) / this.RATE + 'px';
			}
		},
		onLoad() {
			// this.isLogined();
			// this.getLocation();
			//获取上传图片的参数
			policy().then(res => {
				this.$store.commit("setUploadParams", res.data.data);
			});
		},
		onShow() {
			this.getUserInfo()
		},
		methods: {
			// 获取用户信息
			getUserInfo() {
				getCurrentUserInfo().then(res => {
					this.userInfo = res.data.data
				})
			},
			// 进入个人主页
			toInfoPage() {
				uni.navigateTo({
					url: '/pages/mine_subPackage1/info/index'
				})
			},
			// 进入点赞部分
			toLikeHistoryPage() {
				uni.navigateTo({
					url: '/pages/mine_subPackage1/likeHistory/index'
				})	
			},
			// 进入关注列表
			toFollowPage() {
				uni.navigateTo({
					url: `/pages/mine_subPackage1/follow/index?uid=${this.userInfo.id}&&type=${getApp().globalData.userType}`
				})
			},
			// 进入粉丝列表
			toFansPage() {
				// type为0 真实身份
				uni.navigateTo({
					url: `/pages/mine_subPackage1/fans/index?uid=${this.userInfo.id}&&type=${getApp().globalData.userType}`
				})
			},
			// 进入浏览记录页面
			toHistoryPage() {
				uni.navigateTo({
					url: '/pages/mine_subPackage1/history/index'
				})
			},
			// 进入草稿箱页面
			toDraftPage() {
				uni.showToast({
					title: '敬请期待',
					duration: 2000,
					icon: 'none'
				})
			},
			// 进入浏览记录页面
			toMyHelp() {
				uni.navigateTo({
					url: '/pages/mine_subPackage1/myHelp/index'
				})
			},
			// 进入社区身份页面
			toIdentityPage() {
				uni.navigateTo({
					url: '/pages/mine_subPackage1/identity/index'
				})
			},
			// 进入学校认证页
			recogizeSchool() {
				if (!this.userInfo.school) {
					uni.navigateTo({
						url: '/pages/mine_subPackage1/info/edit/detail/school'
					})
				}
			},
			shareToFriends() {
				uni.showToast({
					title: '点击小程序右上角即可分享',
					duration: 2000,
					icon: 'none'
				})
			},
			joinGroup() {
				uni.navigateTo({
					url: '/pages/doc/index?key=join_group'
				})
			},
			contactUs() {
				uni.navigateTo({
					url: '/pages/doc/index?key=contactUs'
				})
			},
			feedback() {
				uni.navigateTo({
					url: '/pages/mine_subPackage1/feedback/index'
				})
			},
			// 关于我们页
			aboutUs() {
				uni.navigateTo({
					url: '/pages/doc/index?key=about_us'
				})
			},
			notice() {
				uni.navigateTo({
					url: '/pages/doc/index?key=receiveNotice'
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.bgColor {
		background-color: #f2f6fa;
		padding: 10rpx 0 0;
	}

	.header {
		box-sizing: border-box;
		height: 300rpx;
		width: 95%;
		padding: 0 10rpx 10rpx;
		background-color: #fff;
		margin: auto;
		margin-bottom: 20rpx;
		border-radius: 20rpx;

		.user {
			display: flex;
			width: 92%;
			height: 120rpx;
			margin: auto;
			align-items: center;
			justify-content: space-between;
			padding-top: 50rpx;

			.left {
				width: 90%;
				display: flex;
				align-items: center;
				justify-content: start;

				.userInfo {
					width: 80%;
					margin-left: 20rpx;
					font-weight: bold;

					.userName {
						font-size: 36rpx;
						margin-bottom: 10rpx;
						// font-size: 36rpx;
						overflow: hidden;
						// word-break: keep-all;
						// white-space: nowrap;  本来就只有一行
						text-overflow: ellipsis;
					}

					.schoolName {
						width: 160rpx;
						text-align: center;
						border: 2rpx solid #2aa0de;
						font-size: 24rpx;
						color: #2aa0de;
						border-radius: 10rpx;
					}
				}

				.loginBtn {
					font-size: 36rpx;
					font-weight: bold;
					margin-left: 40rpx;
				}

			}
		}

		.about {
			padding: 30rpx 40rpx;
			margin: auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			text-align: center;
			color: #828282;
			font-size: 26rpx;
			font-weight: bold;

			.line {
				width: 4rpx;
				height: 50rpx;
				border-left: 4rpx solid #ccc;
			}
		}
	}

	.function-section {
		width: 95%;
		height: 150rpx;
		margin: auto;
		padding: 20rpx;
		box-sizing: border-box;
		background-color: #fff;
		border: 1rpx solid #f3f3f3;
		border-radius: 20rpx;

		display: flex;
		justify-content: space-between;
		align-items: center;
		text-align: center;
		color: #828282;
		font-weight: bold;
		font-size: 26rpx;

		image {
			width: 48rpx;
			height: 48rpx;
			margin-bottom: 10rpx;
		}
	}

	.blank {
		width: 95%;
		margin: 20rpx auto 0;
		padding-bottom: 10rpx;
		box-sizing: border-box;
		position: relative;

		.other-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 36rpx 26rpx;
			background-color: #fff;
			color: #5e5e5e;
			font-size: 32rpx;
			border-bottom: 2rpx solid #dedede;
			border-radius: 20rpx;

			.item-left {
				display: flex;

				.u-icon {
					margin-right: 20rpx;
				}
			}
		}

		.other-item:last-child {
			border: none;
		}

		.more {
			color: #000;
			font-weight: bold;
			font-size: 34rpx;
			background-color: #f3f3f3;
			z-index: 10;
			padding: 0 0 10rpx 20rpx;
			margin: 0;
			height: 60rpx;
			position: sticky;
			left: 0;
			top: 0;
			border: none;
		}
	}

	button[plain] {
		border: none
	}

	button::after {
		border: 0 solid rgba(0, 0, 0, 0.2);
	}

	.transition {
		z-index: 9999;
	}
</style>
