<template>
	<view class="container">
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	onLoad() {
		uni.removeTabBarBadge({
			index: 2
		});
	},
	methods: {}
};
</script>

<style scoped>
.container {
	width: 100%;
	margin: 0 auto;
}
.title {
	padding: 20rpx;
	text-align: center;
	font-weight: bold;
}
</style>
