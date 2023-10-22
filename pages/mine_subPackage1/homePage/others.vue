<!-- 匿名页 -->
<template>
	<view class="container">
		<!-- 顶部背景图 -->
		<view class="bg-blur">
			<image :src="otherInfo.backgroundImage || otherInfo.avatar" mode="aspectFill"></image>
		</view>

		<view class="mask"></view>

		<!-- 顶部个人信息 -->
		<view class="header">
			<view class="topInfo">
				<!-- 左侧信息区 -->
				<view class="leftInfo">
					<!-- 头像 -->
					<u-avatar :src="otherInfo.avatar" shape="circle" size="120rpx" @click="onAvatarPre"
						default-url="https://img.zcool.cn/community/01460b57e4a6fa0000012e7ed75e83.png@1280w_1l_2o_100sh.png"></u-avatar>
					<!-- 信息 -->
					<view class="msg">
						<view class="userName">{{ otherInfo.name }}</view>
						<!-- 						<view class="schoolName" :class="otherInfo.school?'':'none-school'">
							{{ otherInfo.school ? otherInfo.school : "尚未学校认证"}}
						</view> -->
					</view>
				</view>
				<view class="follow-btn">
					<follow-btn :relType.sync="otherInfo.relType" :unfollowBgColor="'#3c9cff'"
						:query="{ uid: otherInfo.uid, type: otherInfo.type }" :fromFansPage="false"></follow-btn>
				</view>
			</view>
			<!-- 数据区 -->
			<view class="bottomAbout">
				<!-- 				<view class="postCount" v-show="!showOthers">
					<view>发帖</view>
					{{otherInfo.postCount || 0}}
				</view> -->
				<view class="follow" @click="toHisFollow">
					<view class="">关注</view>
					{{ otherInfo.followingCount || 0 }}
				</view>
				<view class="fans" @click="toHisFans">
					<view class="">粉丝</view>
					{{ otherInfo.followerCount || 0 }}
				</view>
			</view>
		</view>

		<!-- 主体内容 -->
		<view class="main">
			<view class="tab" :style="{ width: tabsWidth }">
				<u-tabs ref="uTabs" name="name" :list="tabsList" :is-scroll="false" :current="currentIndex"
					active-color="#2599ff" inactive-color="#606266" font-size="30" height="40px" @change="tabsChange">
					<view slot="right" style="position: relative; right: 30rpx; top: 2rpx" @tap="showToast"></view>
				</u-tabs>
			</view>
			<swiper :current="currentIndex" @change="onChange" :style="{ height: scrollHeight }">
				<swiper-item key="0">
					<scroll-view scroll-y @scrolltolower="getMorePost">
						<u-list v-show="postList.length" v-if="postList.length">
							<u-list-item v-for="(item, index) in postList" :key="item.id">
								<post :postList="item" @post="getPostId"></post>
								<view style="height: 420rpx" v-if="index === postList.length - 1"></view>
							</u-list-item>
						</u-list>
						<view class="hiddenText" v-else>
							<explore tipsTitle="暂没有发帖记录" tipsName="还没有发过帖子呀" tipsTo="快去尝试发表你的想法吧"></explore>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item key="1">
					<scroll-view scroll-y style="width: 100%; height: 100%">
						<view v-if="iconName === 'eye'">
							<u-list v-if="collectList.length">
								<u-list-item v-for="(item, index) in collectList" :key="item.id">
									<post :postList="item" @post="getPostId"></post>
									<view style="height: 470rpx; text-align: center; color: #666"
										v-if="index === postList.length - 1">没有更多了~</view>
								</u-list-item>
							</u-list>
						</view>
						<view class="hiddenText" v-else>
							<explore tipsTitle="对方暂时没有收藏记录" tipsName="这里什么都没有" tipsTo=" "></explore>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
			<view>
				<u-action-sheet @select="selectClick" :show="sheetShow" @close="sheetShow = false" :actions="sheetList"
					closeOnClickOverlay closeOnClickAction :round="10" cancelText="取消"></u-action-sheet>
			</view>
		</view>
	</view>
</template>

<script>
	import post from '@/UI/post/post.vue';
	import FollowBtn from './components/followBtn';
	import {
		getUserPublicInfo
	} from '@/api/user/follow.js';
	import {
		listAll
	} from '../../../api/bbs/post';
	import explore from '../../../UI/explore/explore.vue';

	export default {
		data() {
			return {
				relType: 0,
				// 弹出层
				sheetShow: false,
				// 帖子操作弹窗
				sheetList: [
					// {
					// 	name: '拉黑此用户',
					// 	id: 1
					// },
					{
						name: '举报帖子',
						id: 2
					}
				],
				query: {},
				// 帖子详情
				postList: [],
				collectList: [],
				// 他人的个人信息
				otherInfo: {},
				// 获取帖子参数
				postQuery: {},
				currentIndex: 0,
				swiperCurrent: 0,
				tabsList: [{
						name: '发帖'
					},
					{
						name: '收藏'
					}
				],
				iconName: '',
				queryData: {} //进入页面携带的参数
			};
		},
		computed: {
			scrollHeight() {
				let systemInfo = wx.getSystemInfoSync();
				return systemInfo.windowHeight - (330 + 90) / this.RATE + 'px';
			},
			tabsWidth() {
				return (125 * this.tabsList.length) / this.RATE + 'px';
			}
		},
		onLoad(option) {
			this.queryData = JSON.parse(option.queryData);
			getUserPublicInfo(this.queryData).then((res) => {
				this.otherInfo = Object.assign(res.data.data, this.queryData);
				this.postQuery = {
					currentPage: 1,
					pageSize: 20,
					orderFlag: 2,
					userId: this.queryData.uid
				};
				this.getPost();
				this.query = {
					uid: this.otherInfo.userId,
					type: 0
				};
			});
		},
		onShareAppMessage(res) { //发送给朋友
			return {
				title: this.otherInfo.name + '的主页',
				path: '/pages/mineSubPackage1/homePage/others?' + JSON.stringify(this.queryData) // 路径，传递参数到指定页面。
			}
		},
		onShareTimeline(res) { //分享到朋友圈
			return {
				title: this.otherInfo.name + '的主页',
				path: '/pages/mineSubPackage1/homePage/others?' + JSON.stringify(this.queryData) // 路径，传递参数到指定页面。
			}
		},
		components: {
			FollowBtn,
			post,
			explore
		},
		methods: {
			// 切换tab
			tabsChange(e) {
				this.currentIndex = e.index;
			},
			// swiper通知tab切换
			onChange(e) {
				this.currentIndex = e.detail.current;
			},
			// 头像预览
			onAvatarPre() {
				uni.previewImage({
					urls: [this.otherInfo.avatar]
				});
			},
			// 提示
			showToast() {
				if (this.iconName === 'eye') {
					this.$u.toast('不可操作');
				} else {
					this.$u.toast('作者已隐藏内容');
				}
			},

			// 前往Ta的粉丝页面
			toHisFans() {
				let uid = this.otherInfo.uid;
				let identityId = this.otherInfo.identityId;
				let type = this.otherInfo.type;
				uni.navigateTo({
					url: `/pages/mine_subPackage1/fans/index?fansTitle=Ta的粉丝&uid=${uid}&type=${type}&identityId=${identityId}`
				});
			},
			// 获取用户的帖子
			getPost() {
				listAll(this.postQuery).then((res) => {
					this.postList = res.data.data.data;
				});
			},
			//获取post传来的show值
			getPostId(id) {
				console.log('收到post组件传过来的id', id);
				this.postItemId = id;
				this.sheetShow = !this.sheetShow;
			},
			//点击更多弹窗框选项
			selectClick(e) {
				console.log(e, '点击');
				if (e.id === 2) {
					uni.navigateTo({
						url: '/pages/home/reportPage/report'
					});
				}
			},
			// 判断到底
			getMorePost() {
				uni.showToast({
					title: '到底了'
				});
			},
			// 前往Ta的关注页面
			toHisFollow() {
				let uid = this.otherInfo.uid;
				// let type = this.otherInfo.type;
				// 匿名身份没有关注页面 type为1
				// if(type){
				// 	uni.showToast({
				// 		title: '匿名身份无关注',
				// 		icon: 'error',
				// 		duration: 1000
				// 	});
				// }else{
				uni.navigateTo({
					url: `/pages/mine_subPackage1/follow/index?followTitle=Ta的关注&uid=${uid}&type=${getApp().globalData.userType}`
				});
				// }
			}
			// 查询用户收藏信息
		}
	};
</script>

<style scoped lang="scss">
	.container {
		position: relative;
		width: 100%;
	}

	// 背景图
	.bg-blur {
		height: 350rpx;
		line-height: 350px;
		float: left;
		width: 100%;
		background-repeat: no-repeat;
		background-size: cover;
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

	.mask {
		position: absolute;
		width: 100%;
		height: 350rpx;
		background-color: rgba(0, 0, 0, 0.4);
	}

	// 个人信息
	.header {
		position: absolute;
		box-sizing: border-box;
		height: 350rpx;
		width: 100%;
		padding: 20rpx;

		.topInfo {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 95%;
			height: 120rpx;
			margin: 40rpx auto;

			// 左侧信息区
			.leftInfo {
				width: 66%;
			}

			.leftInfo,
			.rightOperate {
				display: flex;
				align-items: center;
				justify-content: start;

				.msg {
					max-width: 80%;
					margin-left: 20rpx;
					font-weight: bold;
					font-size: 36rpx;
					color: white;

					.userName {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						text-overflow: ellipsis;
						// white-space: nowrap;
					}

					.schoolName {
						margin-top: 5rpx;
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
				}
			}

			.follow-btn {
				position: absolute;
				right: 50rpx;
				top: 94rpx;
			}
		}

		.bottomAbout {
			// position: absolute;
			// bottom: 30rpx;
			// left: 60rpx;
			margin-left: 60rpx;
			width: 160rpx;
			display: flex;
			text-align: center;
			justify-content: space-between;
			font-weight: bold;
			font-size: 28rpx;
			color: #fff;
		}
	}

	/* 主体 */
	.main {
		position: absolute;
		top: 330rpx;
		width: 100%;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		background-color: #f5f6fa;

		.tab {
			height: 90rpx;
			// width: 250rpx;
			margin: 0 auto;
			text-align: center;
		}

		.hiddenText {
			font-size: 40rpx;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 100rpx;
		}
	}
</style>