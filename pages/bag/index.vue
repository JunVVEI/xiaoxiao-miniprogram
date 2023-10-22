<template>
	<view class="container">
		<view class="warpper">
			<view class="class_box" @click="enterClass">
				<u-icon name="calendar" color="#fff" size="45"></u-icon>
				<view style="font-size: 55rpx; color: #fff; font-weight: bold;">校校课表</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	onLoad() {},
	methods: {
		enterClass() {
			uni.getStorage({
				key:'studentNo',
				success: () => {
					uni.navigateTo({
						url: '/pages/bag/class/index'
					});
				},
				fail: () => {
					console.log('error')
					uni.navigateTo({
						url: '/pages/bag/class/login/index'
					});
				}
				
			})
			
		}
	}
};
</script>

<style scoped>
.container {
	width: 100%;
	height: 100%;
	position: absolute;
}

.warpper {
	margin-top: 50rpx;
}
.class_box {
	display: flex;
	flex-direction: column;
	height: 250rpx;
	width: 90%;
	margin: 0 auto;
	border-radius: 20rpx;
	align-items: center;
	justify-content: center;
	background-image: linear-gradient(120deg, #35a7dc 0%,  #85d5ff 100%);
}
</style>
