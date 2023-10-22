<template>
	<view class="container">
		<!-- <view class="main">
			<view class="title">
				校校
			</view>
			<u-button type="primary" text="一键登录" @click="showLoginPopup" size="large"></u-button>
		</view> -->
		<login :show="showPopup" :timer="timer"></login>
	</view>
</template>

<script>
	import login from '@/UI/login/login.vue';
	export default {
		components: {
			login
		},
		data() {
			return {
				showPopup: false,
				timer: 0,
				beforeRoute: ''
			}
		},
		onLoad(e) {
			this.beforeRoute = e.beforeRoute
		},
		onShow() {
			this.showLoginPopup()
		},
		methods: {
			showLoginPopup() {
				this.showPopup = true
				this.timer += 1;
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		position: relative;
		height: 100%;
		width: 100%;

		.main {
			width: 90%;
			margin: 300rpx auto 0;

			.title {
				width: 100%;
				text-align: center;
				color: $uni-color-title;
				font-weight: bold;
				font-size: 30px;
				margin: 20px 0;
			}
		}
	}
</style>
