<template>
	<view class="container">
		<!-- 关注人列表 -->
		<scroll-view class="followList" v-show="followList.length">
			<view class="user" v-for="(item,index) in followList" :key="index">
				<view class="msg">
					<Avatar :avatarUrl="item.userAvatar ? item.userAvatar : item.identityAvatar"
					:avatarUserId="item.userId" :avatarIdentityId="item.identityId" 
					:avatarIsCreator="item.isCurrentUserSelf" />
					{{ item.userName || item.identityName }}
				</view>
				<view class="follow-btn" v-if="!item.isCurrentUserSelf">
					<follow-btn :relType.sync="item.relType" :unfollowBgColor="'#3c9cff'"
						:query="{uid: item.userId, identityId: item.identityId, type: item.type}" :fromFansPage="true"></follow-btn>
				</view>
			</view>
		</scroll-view>
		<!-- 空白页展示 -->
		<view class="blank" v-show="!followList.length">
			<explore tipsTitle="关注列表为空" tipsName="还没有关注别人呀" tipsTo="快去寻找有趣的灵魂吧"></explore>
		</view>
	</view>
</template>
<script>
	import {
		listAllFollow,
		unfollow
	} from '@/api/user/follow.js';
	import FollowBtn from '../homePage/components/followBtn.vue';
	import explore from '@/UI/explore/explore.vue';
	import { 
		Avatar 
	} from 'UI/avatar/avatar.vue';
	export default {
		data() {
			return {
				followList: [],
				title: '我关注的人',
				query: {
					// uid: this.$store.state.user.userInfo.id,
					// type: 0
				}
			};
		},
		components: {
			FollowBtn,
			explore,
			Avatar
		},
		onLoad(option) {
			if (option.followTitle) {
				uni.setNavigationBarTitle({
					title: option.followTitle
				})
			}
			this.query = {
				uid: +option.uid ,
				type: +option.type ,
				// identityId: + option.identityId || 0
			}
			console.log(this.query)

		},
		onShow() {
			this.getFollowList();
		},
		methods: {
			// 查看用户的关注列表
			async getFollowList() {
				// listAllFollow(this.query).then((res) => {
				// 	console.log(res.data);
				// 	this.followList = res.data.data;
				// })
				const {
					data: {
						data
					}
				} = await listAllFollow(this.query);
				this.followList = data;
			}
		}
	};
</script>

<style scoped>
	.followList {
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