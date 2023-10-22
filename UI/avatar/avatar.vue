<template>
	<view @click.prevent="goToHisPage">
		<!-- 		<u-avatar @click.stop="goToHisPage" :src="avatarUrl" :shape="avatarShape" :size="avatarSize"
			:default-url="defaultUrl" /> -->
		<ImageCache :src="avatarUrl" :showMenuByLongpress='true' :show-menu-by-longpress='true' :lazy-load ="true" mode="aspectFill" class="img"></ImageCache>
	</view>
</template>

<script>
	import {
		ImageCache
	} from "@/uni_modules/w-image-cache/components/w-image-cache/image-cache.vue"
	export default {
		components: {
			ImageCache
		},
		props: {
			avatarUrl: {
				default: ''
			},
			avatarShape: {
				default: 'circle'
			},
			avatarSize: {
				default: '75rpx'
			},
			defaultUrl: {
				default: 'https://img.zcool.cn/community/01460b57e4a6fa0000012e7ed75e83.png@1280w_1l_2o_100sh.png'
			},
			avatarIsCreator: {
				default: false
			},
			avatarUserId: {},
			avatarIdentityId: {}
		},
		data() {
			return {
				imgStyle: {
					height: '75rpx',
					width: '75rpx'
				}
			}
		},
		// 引用 props 应使用 this. 前缀
		methods: {
			goToHisPage() {
				if (this.avatarIsCreator) {
					if (this.avatarIdentityId) {
						uni.navigateTo({
							url: '/pages/mine_subPackage1/identity/index'
						})
						return
					} else {
						uni.navigateTo({
							url: '/pages/mine_subPackage1/info/index'
						})
						return
					}
				}
				if (this.avatarUserId) {
					let queryData = {
						type: getApp().globalData.userType,
						uid: this.avatarUserId,
					}
					uni.navigateTo({
						url: `/pages/mine_subPackage1/homePage/others?queryData=${JSON.stringify(queryData)}`
					})
				} else if (this.avatarIdentityId) {
					let queryData = {
						type: getApp().globalData.identityType,
						identityId: this.avatarIdentityId,
					}
					uni.navigateTo({
						url: `/pages/mine_subPackage1/homePage/anonymity?queryData=${JSON.stringify(queryData)}`
					})
				}
			}
		}
	}
</script>

<style scoped>
	.img /deep/ image {
		height: 75rpx;
		width: 75rpx;
		border-radius: 50%;
	}
</style>