<template>
	<view class="container">
		<view class="top">
			<image src="../../static/wifi_off.png"  style="width:35rpx;height: auto;" mode="widthFix"></image>
			<p>网络请求失败，请检查您的网络设置</p>
		</view>
		<view class="main">
			<view class="icon">
				<image src="../../static/wifi_off.png"  style="width:250rpx;height: auto" mode="widthFix"></image>
			</view>
			<view class="tips">
				<p>网络请求失败</p>
				<p>请检查您的网络</p>
				<p>重新加载吧</p>
			</view>
			<u-button type="info" shape="circle" ripple="true" size="medium" >重新加载</u-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	}
};
</script>

<style scoped>
.container {
	width: 90%;
	height: 100%;
	margin: 0 auto;
}
.top {
	display: flex;
	background-color: #f4f4f5;
	color: #dd6161;
	border-radius: 30rpx;
	align-items: center;
	justify-content: center;
}
.main {
	margin: 0 auto;
	text-align: center;
	margin-top:100rpx;
}
.icon{
	display: flex;
	justify-content: center;
	text-align: center;
	margin: 0 auto;
}
.tips{
	text-align: center;
	font-weight: bold;
	color: #606266;
	font-size: 30rpx;
}
.tips p{
	margin: 10rpx auto;
}
</style>
