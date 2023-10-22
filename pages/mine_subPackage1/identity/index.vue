<template>
	<view class="bgColor">
		<!-- 匿名身份内容 -->
		<view class="identityContent">
			<!-- 个人信息 -->
			<view class="info">
				<view class="avatar">
					<u-avatar :src="avatar" shape="circle" size="100rpx"
						default-url="https://img.zcool.cn/community/01460b57e4a6fa0000012e7ed75e83.png@1280w_1l_2o_100sh.png">
					</u-avatar>
					<!-- 编辑图标 -->
					<view class="editIcon" @click="avatarSheetShow = true;">
						<u-icon name="camera-fill" color="#000" size="16"></u-icon>
					</view>
				</view>
				<view class="name">{{ identityInfo.name }}</view>
				<view class="editNickname" @click="editNickname">
					<u-icon name="edit-pen-fill" color="#717171" size="26"></u-icon>
				</view>
			</view>
			<!-- 其他关注信息 -->
			<view class="about">
				<view>
					<view class="num">{{ identityInfo.postCount || '--' }}</view>
					发帖
				</view>
				<view class="line"></view>
				<view>
					<view class="num">{{ identityInfo.likeCount || '--' }}</view>
					被赞
				</view>
				<view class="line"></view>
				<view @click="toFansPage">
					<view class="num">{{ identityInfo.followerCount || '--' }}</view>
					粉丝
				</view>
			</view>
		</view>

		<!-- 帖子详情 -->
		<view class="postDetail" :style="{ height: scrollHeight }">
			<u-list height="100%" @scrolltolower="scrolltolower" v-if="postList.length" scrollable>
				<u-list-item v-for="(item, index) in postList" :key="item.id">
					<post @post="getPostId" :postList="item"></post>
				</u-list-item>
<!--				<view style="height: 80rpx;color: #444; text-align: center;">-->
<!--					没有更多了~-->
<!--				</view>-->
			</u-list>
			<div v-else>
				<explore :tipsTitle="tips.title" :tipsName="tips.name" :tipsTo="tips.to"></explore>
			</div>
		</view>

		<!-- 修改头像弹出框 -->
		<u-action-sheet :show="avatarSheetShow" @close="avatarSheetShow = false" :round="10" cancelText="取消">
			<view class="editAvatarContent">
				<view class="choice" @click="toAvatarLib">从匿名头像库中选择</view>
			</view>
		</u-action-sheet>

		<!-- 修改昵称弹出框 -->
		<u-modal title="昵称修改" :show="modalShow" :showConfirmButton="false" :closeOnClickOverlay="true"
			@close="closeModal" width="650rpx">
			<view class="slot-content">
				<view class="set-name"><input type="text" maxlength="100" placeholder="支持4-20字符的中英文，数字组合"
						v-model="newNickName" /></view>
				<view class="modal-tips">7天内可修改一次</view>

				<u-button slot="confirmButton" text="确定" type="primary" shape="circle" @click="confirmName"></u-button>
			</view>
		</u-modal>
		<!-- 昵称修改提示信息 -->
		<u-toast ref="uToast"></u-toast>
		<!-- 帖子删除操作菜单 -->
		<view>
			<u-action-sheet @select="selectClick" :show="deleteSheetShow" @close="deleteSheetShow = false"
				:actions="deleteSheetList" closeOnClickOverlay closeOnClickAction :round="10" cancelText="取消">
			</u-action-sheet>
		</view>
	</view>
</template>

<script>
	import post from '@/UI/post/post.vue';
	import explore from '@/UI/explore/explore.vue'
	import {
		changeToDate
	} from '@/utils/timestamp.js';
	import {
		updateName,
		updateIdentity
	} from '@/api/user/identity.js';
	import {
		getMyPosts
	} from '@/api/user/user.js'
	import {
		getCurrentUserIdentityInfo
	} from "../../../api/user/identity";
	import {
		delPost
	} from "../../../api/bbs/post";
	export default {
		data() {
			return {
				identityInfo: {},
				avatar: undefined,
				// 头像修改弹出框信息
				avatarSheetShow: false,
				// 三点多选弹出框信息
				deleteSheetShow: false,
				deleteSheetList: [{
					name: '删除帖子',
					id: 1
				}],
				// 昵称修改弹出框信息
				modalShow: false,
				// 新的昵称
				newNickName: '',
				// 帖子详情
				postList: [],
				// 空白页显示
				tips: {
					title: '暂无匿名帖子内容',
					name: '还没有偷偷发布过帖子呢',
					to: '快去使用匿名发表你的想法吧'
				},
				// 使用scroll还是list
				flag: true, // list为true

			};
		},
		computed: {
			// 中间容器高度帖子主体
			scrollHeight() {
				// 使用screenHeight,pH会有类似tabBar的占位
				let systemInfo = wx.getSystemInfoSync();
				return systemInfo.windowHeight - (280 + 20) / this.RATE + 'px';
			},
			// 头像修改框宽度
			screenWidth() {
				return wx.getSystemInfoSync().screenWidth + 'px';
			}
		},
		onLoad() {
			this.getIdentityInfo();
			this.getIdentityPostList();
		},
		methods: {
			// 获取匿名身份信息
			async getIdentityInfo() {
				getCurrentUserIdentityInfo().then(res => {
					this.identityInfo = res.data.data
					this.avatar = this.identityInfo.avatar
				})
			},
			// post触发
			getPostId(e) {
				console.log(e)
				this.postItemId = e.id;
				this.deleteSheetShow = !this.deleteSheetShow;
			},
			// 选中三点操作菜单
			selectClick() {
				delPost(this.postItemId).then(res => {
					this.getIdentityPostList();
				})
			},
			// 修改昵称不符合规范提示信息
			showToast(nameToast) {
				this.$refs.uToast.show({
					type: 'warning',
					message: nameToast,
					position: 'top',
					duration: '2000'
				});
			},
			// 修改昵称
			editNickname() {
				this.modalShow = true;
			},
			// 完成昵称修改
			async confirmName() {
				const lastTime = uni.getStorageSync('updateAlias-time');
				const timeDiff = 60 * 60 * 24 * 30 * 1000; // 一个月的时间戳
				// 昵称规范逻辑
				if (this.newNickName === '') { // 逻辑1：昵称不为空
					this.showToast('昵称不能为空~');
				} else if (this.newNickName.length < 4 || this.newNickName.length > 20) { // 逻辑2：昵称支持4-20个字符
					this.showToast('字符数不符合要求~');
				} else {
					const {
						data
					} = await updateName({
						identityId: this.identityInfo.identityId,
						name: this.newNickName,
						avatar: this.identityInfo.avatar
					});
					// 修改成功
					if (data.data) {
						this.identityInfo.name = this.newNickName;
						uni.setStorage({
							key: 'updateAlias-time',
							data: Date.now(),
							success: function() {
								uni.showToast({
									title: '修改昵称成功',
									icon: 'success',
									duration: 1000
								});
							}
						});
						this.modalShow = false;
						this.getIdentityInfo();
						this.getIdentityPostList();
					} else {
						// 返回false
						if (lastTime && Date.now() - lastTime < timeDiff) { // 逻辑3:30天内修改一次
							let nameToast = '下次可修改时间：' + changeToDate(lastTime + timeDiff);
							this.showToast(nameToast);
						} else { // 逻辑4：昵称已重复
							this.showToast('昵称已重复~');
						}
					}
				}
				this.newNickName = '';
			},
			// 关闭昵称修改框
			closeModal() {
				this.modalShow = false;
				this.newNickName = '';
				this.nameToast = '';
			},
			// 页面接收参数, 修改头像
			getAvatarUrl(avatarUrl) {
				updateIdentity({
					identityId: this.identityInfo.identityId,
					name: this.identityInfo.name,
					avatar: avatarUrl
				}).then(res => {
					if (res.data.data === true) {
						// 滞空才会出发刷新
						this.postList = []
						this.getIdentityInfo();
						this.getIdentityPostList();
						uni.showToast({
							title: '更换头像成功',
							icon: 'success'
						});
					}
				})
			},
			// 跳转粉丝页
			toFansPage() {
				uni.navigateTo({
					url: `/pages/mine_subPackage1/fans/index?identityId=${this.identityInfo.identityId}&&type=${getApp().globalData.identityType}`
				});
			},
			// 随机生成头像
			toAvatarLib() {
				this.avatarSheetShow = false;
				uni.navigateTo({
					url: '/pages/mine_subPackage1/identity/avatarlib/index'
				});
			},
			// 查看匿名身份帖子列表
			getIdentityPostList() {
				let pram = {
					currentPage: 1,
					pageSize: 50,
					orderFlag: 2,
					type: 3
				}
				getMyPosts(pram).then(res => {
					this.postList = res.data.data.data;
				});
			},
			// 监听帖子下拉触底
			scrolltolower() {
				console.log("触发刷新");
				// this.postList = [...this.postList,...this.postList];
			}
		},
		components: {
			post,
			explore
		}
	};
</script>

<style lang="scss">
	.bgColor {
		width: 100%;
		height: 100%;
		background-color: #f2f6fa;
	}

	.postDetail {
		padding: 20rpx 0;
		background-color: #f2f6fa;
	}

	// 匿名身份信息
	.identityContent {
		background-color: #fff;
		margin: 0 auto;
		height: 280rpx;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;

		.info {
			display: flex;
			align-items: center;
			justify-content: start;
			padding: 10rpx 0;

			.avatar {
				padding: 0 20rpx;
				position: relative;

				.editIcon {
					position: absolute;
					right: 12rpx;
					bottom: -5rpx;
					width: 40rpx;
					height: 40rpx;
					background-color: #d7d7d7;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			.name {
				font-weight: bold;
				font-size: 30rpx;
				padding: 0 20rpx 0 10rpx;
			}

			.editNickname image {
				width: 46rpx;
				height: 46rpx;
				padding-top: 10rpx;
			}
		}

		.about {
			display: flex;
			justify-content: space-around;
			align-items: center;
			text-align: center;
			font-size: 26rpx;
			padding: 30rpx 0 20rpx 0;
			color: #828282;

			.line {
				// width: 2rpx;
				height: 40rpx;
				border-left: 1rpx solid #828282;
			}

			.num {
				font-weight: bold;
				color: #000;
				padding-bottom: 8rpx;
			}
		}
	}

	// 修改头像modal
	/deep/.u-modal__content {
		padding: 20rpx !important;
		background-color: #f6f6f6;
	}

	.u-modal__title {
		padding: 40rpx 0 0 !important;
	}

	.u-modal__content {
		background-color: #fff;
	}

	// 修改昵称弹出框
	.slot-content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 20rpx;
		// background-color: #fff;

		.modal-tips {
			padding: 20rpx 0;
			font-size: 28rpx;
			color: #505050;
		}

		.set-name {
			padding: 20rpx 0;

			input {
				padding: 10rpx;
				background-color: #fafafa;
				border-radius: 10rpx;
				width: 550rpx;
				// border-bottom: 1rpx solid #9e9e9e;
			}
		}
	}

	// 修改头像弹出框
	.u-action-sheet {
		.editAvatarContent {
			height: 120rpx;

			.choice:first-child {
				border-bottom: 1rpx solid #cacaca;
				padding: 40rpx 20rpx;
			}

			.choice:last-child {
				border: none;
			}
		}
	}

	/deep/.u-toast__content__text {
		max-width: 250px !important;
		text-align: center;
	}
</style>