<template>
	<view class="container">
		<view class="showItems">
			<view class="item-text">
				<text style="color: #054f74;font-size: 28rpx;">{{roomId}}</text>
				<text style="color:#a4b4cb;font-size: 18rpx;">座位数: {{seatNum}}</text>
			</view>
			<view @touchmove="setSelectedTag" @touchstart="setSelectedTag" class="item-tags">
				<view class="itemTag" v-for="(item, key) in roomStatus" :key="index"
				:style="{'margin-right': (key + 1 == 4 || key + 1 == 7 || key + 1 == 11 ? '17rpx' : '0rpx')}">
					<view v-if="item === '0'" :class="key == selectedTag ? 'freeTag selected' : 'freeTag'" style="background-color: #99dd98"/>
					<view v-if="item === '1'" :class="key == selectedTag ? 'freeTag selected' : 'freeTag'" style="background-color: #c35c6a"/>
					<view class="point" v-show='pointShow == key' :style="{'margin-left' : (preShow == 1 ? '0rpx' : 'auto')}"/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:['roomId','seatNum','buildingName','roomStatus','pointShow','preShow','selectedTag'],

		data() {
			return {
				week: 0,
				day: 0
			}
		},
		methods: {
			setSelectedTag(event) {
				// 获取手指滑动的位置
				const { touches } = event.mp;
				const { clientX, clientY } = touches[0];

				// 获取按钮的位置信息
				uni.createSelectorQuery().in(this).selectAll('.itemTag').boundingClientRect(rects => {
					// 判断手指是否经过了按钮
					const touchedButtons = [];
					rects.forEach((rect, index) => {
						if (
								clientX >= rect.left &&
								clientX <= rect.right &&
								clientY >= rect.top &&
								clientY <= rect.bottom
						) {
							this.$emit("setSelectedTag", index)
						}
					});

					// 更新经过的按钮列表
					this.touchedButtons = touchedButtons;
				}).exec();

			}
		}
	}
</script>
<style>
	.container{
		background-color: white;
		height: 100rpx;
		width: 658rpx;
		position: relative;
		margin: 0rpx 8rpx 0rpx;
		padding: 0rpx 0rpx 10rpx;
		/* top: 10rpx;
		left: 50%;
		transform: translate(-50%,-50%); */
	}
		.showItems {
			margin: auto;
			height: 90rpx;
			width: 98%;
			border-radius: 28rpx;
			background: linear-gradient(to left, white, #E8EAED);
			position: absolute;
		}
		
			.item-text {
				display: flex;
				flex-direction: column;
				width: 73%;
				position:relative;
				top: 50%;
				left: 42%;
				transform: translate(-50%,-50%);
			}
			
			.item-tags {
				display: flex;
				felx-direction: column;
				align-items: flex-start;
				justify-content: start;
				width: 70%;
				position: absolute;
				top: 50%;
				left: 62%;
				transform: translate(-50%,-50%);
			}

				.itemTag {
					/* display: flex;
					felx-direction: row;
					align-items: flex-start;
					justify-content: start; */
				}
					.freeTag {
						margin:0rpx 7rpx 5rpx;
						border-radius: 30rpx;
						width: 16rpx;
						height: 40rpx;
					}

					.selected {
						width: 19rpx;
						height: 43rpx;
						border: black;
						border-style: solid;
						border-width: 5rpx;
						box-sizing: border-box;
					}

					.point {
						background: #4C97E1;
						height: 8rpx;
						width: 8rpx;
						border-radius: 50%;
						margin: auto;
					}
</style>
