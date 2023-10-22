<template>
	<view class="container">
		<!-- 顶部背景图 -->
		<view class="bg-blur">
			<image :src="userInfo.backgroundImage || userInfo.avatar" mode="aspectFill"></image>
		</view>
		<!-- 遮罩层 -->
		<view class="mask"></view>
		<!-- 顶部 -->
		<view class="header">
			<view class="user">
				<!-- 头像 -->
				<view class="picture">
					<u-avatar
						:src="userInfo.avatar"
						shape="circle"
						size="120rpx"
						@click="onAvatarPre"
						default-url="https://img.zcool.cn/community/01460b57e4a6fa0000012e7ed75e83.png@1280w_1l_2o_100sh.png"
					></u-avatar>
				</view>
				<!-- 信息 -->
				<view class="msg">
					<view class="userName">
						{{ userInfo.userName }}
						<!-- <text class="sexMark">
						   男
						</text> -->
					</view>
					<!-- 					<view class="schoolName" :class="userInfo.school?'':'none-school'" @click="recogizeSchool">
						{{ userInfo.school ? userInfo.school : "尚未学校认证"}}
					</view> -->
				</view>
				<!-- 编辑icon  -->
				<view class="edit" @click="toEditPage">
					<u-icon name="edit-pen" color="#ffffff" size="30"></u-icon>
				</view>
			</view>
			<!-- 被赞，关注，粉丝 -->
			<view class="about">
				<!--				<view class="like">-->
				<!--					<view>被赞</view>-->
				<!--					{{ userInfo.beLiked || 0 }}-->
				<!--				</view>-->
				<view class="like">
					<view>发帖</view>
					{{ userInfo.postCount || '--' }}
				</view>
				<view class="follow" @click="toFollowPage">
					<view>关注</view>
					{{ userInfo.followingCount || '--' }}
				</view>
				<view class="fans" @click="toFansPage">
					<view>粉丝</view>
					{{ userInfo.followerCount || '--' }}
				</view>
			</view>
		</view>

		<!-- 主体 -->
		<view class="main" style="top: 330rpx; background-color: #f5f6fa">
			<view class="tab">
				<u-tabs
					ref="uTabs"
					name="name"
					:list="list"
					:is-scroll="false"
					:current="current"
					active-color="#2599ff"
					inactive-color="#606266"
					font-size="30"
					height="40px"
					@change="tabsChange"
				>
					<!-- <view slot="right" @tap="hideCollect" style="position: relative; right: 30rpx; top: 2rpx">
						<u-icon :name="iconName" size="16" bold></u-icon>
					</view> -->
				</u-tabs>
			</view>
			<swiper :current="current" @change="onChange" :style="{ height: scrollHeight }" class="post">
				<!-- 个人帖子页 -->
				<swiper-item key="0">
					<scroll-view scroll-y>
						<u-list v-if="postList.length">
							<u-list-item v-for="(item, index) in postList" :key="item.id">
								<post @post="getPostId" :postList="item" :postIndex="index"></post>
								<view style="height: 530rpx; text-align: center; color: #666" v-if="index === postList.length - 1">
									<u-loadmore :status="postStatus" />
								</view>
							</u-list-item>
						</u-list>
						<view class="blank" v-if="!postList.length">
							<explore tipsTitle="暂没有发帖记录" tipsName="还没有发过帖子呀" tipsTo="快去发表吧"></explore>
						</view>
					</scroll-view>
				</swiper-item>
				<!-- 收藏页 -->
				<swiper-item key="1">
					<scroll-view scroll-y style="width: 100%; height: 100%">
						<view v-show="collectList.length">
							<u-list>
								<u-list-item v-for="(item, index) in collectList" :key="item.id" scrollable>
									<post @post="getPostId" :postList="item"></post>
									<view style="height: 530rpx" v-if="index === collectList.length - 1">
										<u-loadmore :status="postStatus" />
									</view>
								</u-list-item>
							</u-list>
						</view>
						<!-- <view v-show="iconName!=='eye'" :style="{ height: scrollHeight }">
							<view class="hiddenText">
								<u-icon name="eye-off" size="30" bold></u-icon>你已设置隐藏
							</view>
						</view> -->
						<view class="blank" v-show="!collectList.length">
							<explore :tipsTitle="tips.title" :tipsName="tips.name" :tipsTo="tips.to"></explore>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 帖子删除操作菜单 -->
		<view>
			<u-action-sheet
				@select="selectClick"
				:show="sheetShow"
				@close="sheetShow = false"
				:actions="sheetList"
				closeOnClickOverlay
				closeOnClickAction
				:round="10"
				cancelText="取消"
			></u-action-sheet>
		</view>
	</view>
</template>

<script>
import explore from '@/UI/explore/explore.vue';
import post from '@/UI/post/post';
import { getMyPosts } from '@/api/user/user.js';
import { getCurrentUserInfo } from '@/api/user/user';
import { delPost } from '@/api/bbs/post';

export default {
	data() {
		return {
			// 用户信息
			userInfo: {},
			// tab
			list: [
				{
					name: '个人'
				},
				{
					name: '收藏'
				}
			],
			current: 0,
			iconName: 'eye',
			// 个人发帖帖子详情
			postList: [],
			// 收藏帖子详情
			collectList: [],
			// post组件的遮罩层
			sheetShow: false,
			sheetList: [
				{
					name: '删除帖子',
					id: 1
				}
			],
			// 删除帖子id
			postItemId: 0,
			// 删除帖子的下标
			postIndex: null,
			// 空白页显示
			tips: {
				title: '',
				name: '加班加点研发中...',
				to: ''
			}
		};
	},
	computed: {
		// 获取主体高度,330+90 = top和tabs的高度
		scrollHeight() {
			let systemInfo = wx.getSystemInfoSync();
			return systemInfo.windowHeight - (330 + 90) / this.RATE + 'px';
		}
	},
	onLoad: function (option) {
		// 点击收藏跳转携带的参数
		this.current = option.current;
		// 帖子信息
		this.getUserPostList();
	},
	onShow() {
		this.getUserInfo();
	},
	methods: {
		// 获取用户信息
		getUserInfo() {
			getCurrentUserInfo().then((res) => {
				this.userInfo = res.data.data;
			});
		},

		// post触发
		getPostId(e) {
			this.postItemId = e.id;
			this.postIndex = e.postIndex;
			this.sheetShow = !this.sheetShow;
		},

		// 获取个人发帖信息
		getUserPostList() {
			const params = {
				currentPage: 1,
				pageSize: 100,
				orderFlag: 1,
				type: 2
			};
			getMyPosts(params).then((res) => {
				this.postList = res.data.data.data;
			});
		},

		selectClick(item) {
			if (item.id === 1) {
				uni.showModal({
					title: '确认删除该帖子吗？',
					success: (e) => {
						if (e.confirm) {
							this.deletePost();
						}
					}
				});
			}
		},

		// 删除帖子
		deletePost() {
			delPost(this.postItemId).then((res) => {
				if (res.data.data) {
					this.postList = []
					this.getUserPostList()
					uni.showToast({
						title: '删除成功',
						icon: 'none'
					});
				}
			});
		},

		// 切换tab
		tabsChange(e) {
			this.current = e.index;
		},

		// 隐藏
		hideCollect() {
			if (this.iconName === 'eye') {
				// this.$u.toast("隐藏内容");
				uni.showModal({
					content: '确定隐藏你的收藏内容吗？',
					success: (res) => {
						if (res.confirm) {
							// 发送隐藏收藏内容的接口
							this.iconName = 'eye-off';
						}
					}
				});
			} else {
				uni.showModal({
					content: '确定展示你的收藏内容吗？',
					success: (res) => {
						if (res.confirm) {
							this.iconName = 'eye';
						}
					}
				});
			}
		},

		// 进入学校认证页
		recogizeSchool() {
			if (!this.userInfo.school) {
				uni.navigateTo({
					url: '/pages/mine_subPackage1/info/edit/detail/school'
				});
			}
		},
		onChange(e) {
			let current = e.detail.current;
			if (current === 0) {
				this.sheetList = [
					{
						name: '删除帖子',
						id: 1
					}
				];
			} else {
				this.sheetList = [
					// {
					// 	name: '拉黑此用户',
					// 	id: 1
					// },
					{
						name: '举报帖子',
						id: 2
					}
				];
			}
			this.current = current;
		},
		// 进入个人编辑页
		toEditPage() {
			uni.navigateTo({
				url: '/pages/mine_subPackage1/info/edit/index'
			});
		},

		// 进入关注列表
		toFollowPage() {
			uni.navigateTo({
				url: `/pages/mine_subPackage1/follow/index?uid=${this.userInfo.id}&&type=${getApp().globalData.userType}`
			});
		},

		// 进入粉丝列表
		toFansPage() {
			uni.navigateTo({
				url: `/pages/mine_subPackage1/fans/index?uid=${this.userInfo.id}&&type=${getApp().globalData.userType}`
			});
		},

		// 头像预览
		onAvatarPre() {
			uni.previewImage({
				urls: [this.userInfo.avatar]
			});
		}
	},
	components: {
		post,
		explore
	}
};
</script>

<style scoped lang="scss">
.container {
	position: relative;
	width: 100%;
}

.bg-blur {
	height: 350rpx;
	line-height: 350px;
	float: left;
	width: 100%;
	-webkit-filter: blur(3px);
	-moz-filter: blur(3px);
	-o-filter: blur(3px);
	-ms-filter: blur(3px);
	filter: blur(3px);

	image {
		width: 100%;
		height: 100%;
	}
}

.icon-change {
	display: inline-block;
	position: absolute;
	right: 20rpx;
	bottom: 20rpx;
	line-height: 24rpx;

	// 居中
	display: flex;
	flex-direction: column;
	justify-items: center;
	align-items: center;
	font-size: 26rpx;
	color: #606266;
}

.mask {
	position: absolute;
	width: 100%;
	height: 350rpx;
	background-color: rgba(0, 0, 0, 0.4);
}

.header {
	box-sizing: border-box;
	position: absolute;
	height: 350rpx;
	width: 100%;
	padding: 20rpx;
}

.user {
	display: flex;
	width: 90%;
	height: 120rpx;
	margin: 40rpx auto;
}

.picture {
	margin-left: -10rpx;
}

.msg {
	margin: 14rpx 20rpx;
	font-weight: bolder;
	font-size: 36rpx;
	color: white;
	display: flex;
	flex-direction: column;
	width: 70%;
}

.userName {
	line-height: 100rpx;
	overflow: hidden;
	text-overflow: ellipsis;
}

.schoolName {
	flex: 2;
	width: 160rpx;
	background-color: #949494;
	border-radius: 10rpx;
	font-size: 26rpx;
	text-align: center;
	padding: 0 4rpx;
}

.schoolName.none-school {
	border: 1rpx solid #2aa0de;
	color: #2aa0de;
	font-weight: bold;
	background: #f2f2f2;
}

.edit {
	position: absolute;
	right: 40rpx;
	top: 100rpx;
	background-color: #7a7a7a;
	border-radius: 40%;
}

.about {
	margin-left: 40rpx;
	width: 240rpx;
	display: flex;
	text-align: center;
	justify-content: space-between;
	font-weight: bold;
	font-size: 28rpx;
	color: #fff;
}

.main {
	position: absolute;
	top: 330rpx;
	width: 100%;
	border-top-left-radius: 30rpx;
	border-top-right-radius: 30rpx;
	background-color: #fff;
}

.tab {
	height: 90rpx;
	width: 250rpx;
	margin: 0 auto;
}

.hiddenText {
	font-size: 40rpx;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	padding-top: 100rpx;
}

// 删除帖子
.deleteItem {
	padding: 40rpx 20rpx;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
