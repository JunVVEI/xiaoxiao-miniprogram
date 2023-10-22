<template>
	<view class="container">
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">生日</view>
				<view class="uni-list-cell-db">
					<picker mode="date" :value="birth" @change="bindDateChange">
						<view class="uni-input">{{ birth }}</view>
					</picker>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		changeToDate
	} from '@/utils/timestamp.js'
	export default {
		data() {
			return {
				show: false,
				startDate: ',',
				endDate: '',
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				// birth: changeToDate(Date.now())
			};
		},
		computed: {
			birth: {
				get() {
					const birth = this.$store.state.user.userInfo.birth;
					return birth ? changeToDate(birth) : changeToDate(Date.now());
				},
				set(value) {
					return value;
				}
			}
		},
		methods: {
			bindDateChange(e) {
				// 页面显示
				this.birth = e.detail.value;
				let obj = uni.getStorageSync('userInfo');
				// 接口需要
				obj.birth = e.detail.value;
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

	.uni-list .uni-list-cell {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #f3f4f6;
		border-radius: 30rpx;
		margin-top: 40rpx;
		height: 70rpx;
		padding: 20rpx;
	}
</style>
