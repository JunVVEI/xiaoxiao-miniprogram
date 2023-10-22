<template>
	<view class="container" @click="toHelpDetail">
		<view class="warpper">
			<view class="avatar">
				<u-avatar :src="helpItem.userAvatar" shape="circle" size="120rpx" v-if="helpItem.type !== 2" />
				<u-avatar :src="helpItem.userAvatar" shape="circle" size="80rpx" v-else />
			</view>
			<view class="info">
				<view class="name">
					{{helpItem.userName}}
				</view>
				<view class="date">
					{{time}}
				</view>
				<view class="content" v-if="helpItem.type !== 2">
					{{helpItem.content}}
				</view>
				<view class="leftContent" v-else>
					{{helpItem.content}}
				</view>
			</view>
			<view class=" bounty" v-if="helpItem.type !== 2">
				赏金:￥{{helpItem.bounty}}
			</view>
			<view class="price" v-else>
				{{helpItem.bounty}}
			</view>
			<view class="tag">
				<u-tag :text="helpItem.statusName" :type="status" size="mini"></u-tag>
			</view>
			<view style="color: #3c9cff;position: absolute;right: 20rpx;top: 25rpx" @click.stop="clickMore">
				更多
			</view>
		</view>
		<view class="post-picture" v-if="albumList.length && type == 2">
			<u-album :urls="albumList" maxCount="3" showMore multipleSize="200rpx" />
		</view>
	</view>
</template>

<script>
	import {
		diffPostDate
	} from '@/utils/timestamp.js';
	export default {
		props: ['helpItem', 'helpIndex', 'type'],
		computed: {
			// 时间格式转化
			time() {
				return diffPostDate(this.helpItem.createTime);
			},
			status() {
				if (this.helpItem.statusName === '已接单' || this.helpItem.statusName === '已出售') {
					return 'success'
				} else {
					return 'warning'
				}
			},
			albumList() {
				let arr = [];
				if (this.helpItem.mediaPath !== "") {
					arr = this.helpItem.mediaPath.split(',');
				}
				return arr;
			},

		},
		methods: {
			toHelpDetail() {
				uni.navigateTo({
					url: `/pages/help/index?taskId=${this.helpItem.id}&type=${this.helpItem.type}`
				})
			},
			clickMore() {
				this.$emit('help', {
					id: this.helpItem.id,
					isCreator: this.helpItem.isCreator,
					helpIndex: this.helpIndex,
					statusName: this.helpItem.statusName
				})
			}

		}
	}
</script>

<style scoped lang="scss">
	.container {
		box-sizing: border-box;
		padding: 10rpx 10rpx 20rpx 10rpx;
		background-color: #fff;
		width: 95%;
		margin: 10rpx auto;
		border-radius: 15rpx;

		.warpper {
			box-sizing: border-box;
			display: flex;
			min-height: 190rpx;
			padding: 10rpx 20rpx;
			margin: 0 auto;
			position: relative;

			.avatar {
				height: 100%;
				padding-top: 10rpx;
			}

			.info {
				position: relative;
				height: 100%;
				margin-left: 20rpx;
				margin-top: 10rpx;

				.name {
					font-size: 32rpx;
					color: #222;
				}

				.date {
					font-size: 24rpx;
					color: #878787;
					margin-top: 10rpx;
				}

				.content {
					color: #4d4d4d;
					margin-top: 30rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					word-break: break-all; // 注意这个文字多行很重要
					-webkit-box-orient: vertical;
					white-space: pre-wrap;
					font-size: 28rpx;
					letter-spacing: 1rpx;
				}
				
				.leftContent{
					position: relative;
					width: 550rpx;
					left: -90rpx;
					color: #4d4d4d;
					margin-top: 30rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					word-break: break-all; // 注意这个文字多行很重要
					-webkit-box-orient: vertical;
					white-space: pre-wrap;
					font-size: 28rpx;
					letter-spacing: 1rpx;
				}
			}

			.bounty {
				position: absolute;
				right: 20rpx;
				top: 80rpx;
				color: #18b566;
				font-family: 'YouYuan';
			}

			.price {
				position: absolute;
				right: 20rpx;
				top: 90rpx;
				color: #2979ff;
				font-family: 'YouYuan';
				font-size: 34rpx;
			}

			.price::before {
				content: '￥';
				font-size: 30rpx;
			}

			.tag {
				position: absolute;
				top: 25rpx;
				right: 100rpx;
			}
		}

		.post-picture {
			padding: 0 20rpx;
		}


	}
</style>