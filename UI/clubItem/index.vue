<template>
	<view class="club-item" @click="toDetail">
		<view class="img">
			<u--image :src="club.clubAvatar" width="150rpx" height="150rpx" shape="circle"></u--image>
		</view>
		<view class="info">
			<view class="name">{{club.clubName}}</view>
			<view class="faculty" v-if="club.clubType">{{club.clubType}}</view>
			<text class="introduction">简介：{{club.clubIntro}}</text>
		</view>
		<view style="position: relative; right: 60rpx;">
			<u-icon name="arrow-right" size='30px'></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['club'],
		data() {
			return {

			}
		},

		methods:{
			toDetail(){
				uni.navigateTo({
					url:'/pages/club_subPackage/detailClub/index?id=' + this.club.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.club-item {
		width: 90%;
		height: 200rpx;
		display: flex;
		align-items: center;
		background-color: #fff;
		margin: 15rpx auto;
		padding: 15rpx;
		border-radius: 15rpx;
	}

	.img {
		width: 150rpx;
	}

	.info {
		height: 90%;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.name {
			font-size: 35rpx;
			font-weight: bold;
		}

		.faculty {
			color: #333;
		}

		.introduction {
			width: 500rpx;
			height: 40rpx;
			color: #666;
			font-size: 28rpx;
			line-height: 40rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
</style>