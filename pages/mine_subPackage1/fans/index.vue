<template>
	<view class="container">
		<!-- 粉丝列表 -->
		<scroll-view class="fansList" v-show="fansList.length">
			<view class="user" v-for="(item,index) in fansList" :key="index">
				<view class="msg">
					<Avatar class="picture" :avatarUrl="item.userAvatar" :avatarUserId="item.userId" 
					:avatarIdentityId="item.identityId" :avatarIsCreator="item.isCurrentUserSelf" />
					{{ item.userName || ''}}
				</view>
				<view class="follow-btn" v-if="!item.isCurrentUserSelf" >
					<follow-btn pages="fans" :relType.sync="item.relType" unfollowBgColor="#3c9cff"
						:query="{uid: item.userId, identityId: item.identityId, type: item.type}"></follow-btn>
				</view>
			</view>
		</scroll-view>

		<view class="blank" v-show="!fansList.length">
			<explore tipsTitle="粉丝列表为空" tipsName="还没有人关注你呀" tipsTo="快去尝试发表你的想法吧"></explore>
		</view>
	</view>
</template>
<script>
	import { listAllFans } from '@/api/user/follow.js';
	import FollowBtn from '../homePage/components/followBtn.vue';
	import explore from '@/UI/explore/explore.vue';
	import { Avatar } from 'UI/avatar/avatar.vue';
	export default {
		data() {
			return {
				fansList: [],
				title: '我的粉丝',
				// 查看我的粉丝的参数暂时变为5 为了检验他人页面 this.$store.state.user.userInfo.id
				query: {}
			};
		},
		components: {
			FollowBtn,
			explore,
			Avatar
		},
		onLoad(option) {
			console.log(option, 99999)
			if (option.fansTitle) {
				uni.setNavigationBarTitle({
					title: option.fansTitle
				})
			}

			if (option.type == getApp().globalData.userType) {
				this.query = {
					type: +option.type,
					uid: +option.uid,
				}
			} else if (option.type == getApp().globalData.identityType) {
				this.query = {
					type: +option.type,
					identityId: +option.identityId
				}
			}
		},
		onShow() {
			this.getListFans();
		},
		methods: {
			// 获取粉丝数据
			async getListFans() {
				uni.showLoading({
					title: '数据加载中'
				})
				const {
					data: {
						data
					}
				} = await listAllFans(this.query);
				this.fansList = data;
				uni.hideLoading();
			}
		}
	};
</script>

<style scoped>
	.fansList {
		width: 90%;
		margin: 0 auto;
	}

	.user {
		height: 130rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #e5e5e5;
	}

	.msg {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #303133;
	}

	.picture {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.picture img {
		width: 100%;
		height: 100%;
	}

	.blank {
		padding-top: 20rpx;
	}
</style>