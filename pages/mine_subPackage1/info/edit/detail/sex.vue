<template>
	<view class="container">
		<view class="title">
			选择你的性别
		</view>
		<view class="select">
			<view class="select_item" @click="setMan">
				男
				<view v-show="isMan">
					<u-icon name="checkmark" color="#606266" size="20"></u-icon>
				</view>
			</view>
			<u-line color="#909399" />
			<view class="select_item" @click="setWoman">
				女
				<view v-show="isWoman">
					<u-icon name="checkmark" color="#606266" size="20"></u-icon>
				</view>
			</view>
		</view>
		<view class="title">
			是否在个人主页展示
		</view>
		<view class="showTab">
			展示性别标签
			<u-switch v-model="checked"></u-switch>
		</view>
		<view class="save">
			<u-button type="primary" shape="circle" @click="saveSex">保存</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// isMan: true,
				// isWoman:false,
				sex: this.$store.state.user.userInfo.sex === '男' ? 1 : 0,
				checked: false
			};
		},
		computed: {
			// sex: {
			// 	get() {
			// 		// 获取到的就是1或0
			// 		return this.$store.state.user.userInfo.sex === '男' ? 1 : 0;
			// 	},
			// 	set(value) {
			// 		return value;
			// 	}
			// },
			isMan() {
				return this.sex === 1;
			},
			isWoman() {
				return this.sex === 0;
			}
		},
		methods: {
			setMan() {
				this.sex = 1
				// this.isMan = true
				// this.isWoman = false
			},
			setWoman() {
				this.sex = 0
				// this.isMan = false
				// this.isWoman = true
			},
			saveSex() {
				console.log('此时性别为', this.sex);
				let obj = uni.getStorageSync('userInfo');
				// 接口需要
				obj.sex = this.sex;
				this.$store.dispatch('user/updateUserInfo', obj);
			}
		}
	};
</script>

<style scoped>
	.container {
		width: 90%;
		margin: 0 auto;
	}

	.title {
		margin-top: 50rpx;
		color: #909399;
	}

	.select {
		padding: 10rpx 30rpx;
		margin-top: 40rpx;
		background-color: #f3f4f6;
		border-radius: 30rpx;
	}

	.select .select_item {
		margin: 30rpx auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.showTab {
		padding: 0 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 130rpx;
		margin-top: 40rpx;
		background-color: #f3f4f6;
		border-radius: 30rpx;
	}

	.save {
		margin-top: 50rpx;
	}
</style>
