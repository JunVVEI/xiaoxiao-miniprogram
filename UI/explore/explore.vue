<template>
	<view class="container">
<!--		<view class="top">-->
<!--			<p>{{tipsTitle}}</p>-->
<!--		</view>-->
		<view class="main">
			<view class="icon">
				<image src="../../static/explore.png"  style="width:250rpx;height:auto;" mode="widthFix"></image>
			</view>
			<view class="tips">
				<p>{{tipsName}}</p>
				<p>{{tipsTo}}</p>
			</view>
			<!-- <u-button type="info" shape="circle" ripple="true" size="medium" >重新加载</u-button> -->
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	// 在个人模块各页面定制不同空白页
	props:{
		tipsTitle: {
			type: String,
			default:'关注的列表为空'
		},
		tipsName:{
			type: String,
			default: '还没有关注的人'
		},
		tipsTo:{
			type: String,
			default: '快去看看社区吧'
		}
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
	margin: 20rpx auto;
	text-align: center;
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
