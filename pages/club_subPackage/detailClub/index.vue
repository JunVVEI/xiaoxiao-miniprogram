<template>
	<view class="container">
		<view class="top">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="bg-blur">
				<image :src="clubDetail.clubAvatar"
							 mode="aspectFill"></image>
			</view>
			<view class="avatar">
				<u-avatar :src="clubDetail.clubAvatar" size='100'></u-avatar>
			</view>
			<view class="clubName">
				{{ clubDetail.clubName }}
			</view>
			<view class="edit" @click="ToEdit" v-if="clubDetail.isCreator">
				编辑
			</view>
			<view class="remove" @click="remove" v-if="clubDetail.isCreator">
				删除
			</view>
		</view>
		<view class="main">
			<view style="color: #6a6a6a; margin-bottom: 20rpx;font-size: 36rpx;">
				社团类型
			</view>
			<view class="type">
				{{clubDetail.clubType}}
			</view>
			<view style="color: #6a6a6a; margin-bottom: 20rpx;font-size: 36rpx;">
				社团级别
			</view>
			<view class="level">
				{{clubDetail.clubLevel}}
			</view>
			<view style="color: #6a6a6a; margin-bottom: 20rpx;font-size: 36rpx;">
				联系邮箱
			</view>
			<view class="contact">
				{{clubDetail.clubContact}}
			</view>
			<view style="color: #6a6a6a; margin-bottom: 20rpx;font-size: 36rpx;">
				社团简介
			</view>
			<view class="intro">
				{{clubDetail.clubIntro}}
			</view>
		</view>
		<view class="code">
			<view style="text-align: center; color: #2a2a2a; font-size: 38rpx; font-weight: bold;">
				招新与风采
			</view>
			<view class="code-img">
				 <u-album :urls="clubDetail.clubImgs" multipleSize='110' space='10'></u-album>
			</view>
		</view>
	</view>
</template>

<script>
	import {getClub, removeClub} from '@/api/club/index.js'
	export default {
		data() {
			return {
				clubDetail: {},
				clubId: '',
			}
		},
		onLoad(option) {
			this.clubId = option.id
			this.getDetail({id: this.clubId})
		},
		onShow() {
			this.getDetail({id: this.clubId})
		},
		methods: {
			ToEdit() {
				uni.navigateTo({
					url: '/pages/club_subPackage/addOrEditClub/index?id=' + this.clubId
				})
			},
			remove() {
				uni.showModal({
					title: '确认删除吗？',
					success: (res) => {
						if(res.confirm){
							removeClub({id: this.clubId}).then(res => {
								let pages = getCurrentPages(); // 当前页面
								let beforePage = pages[pages.length - 2]; // 上一页
								beforePage.onLoad();
							})
							uni.showToast({
								title:'删除成功',
								icon:'none'
							})
							setTimeout(()=>{
								uni.navigateBack(1)
							},1000)
						}
					}
				})
			},
			getDetail(parmas){
				getClub(parmas).then(res => {
					this.clubDetail = res.data.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		box-sizing: border-box;
		width: 100%;
		padding: 20rpx;
		padding-bottom: 60rpx;
		background-color: #f5f6fa;

		.top {
			position: relative;
			box-sizing: border-box;
			width: 100%;
			height: 300rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20rpx;
			border-radius: 20rpx;

			.avatar {
				z-index: 99;
			}

			.bg-blur {
				top: 0;
				position: absolute;
				z-index: 0;
				height: 300rpx;
				line-height: 300px;
				width: 100%;
				-webkit-filter: blur(3px);
				-moz-filter: blur(3px);
				-o-filter: blur(3px);
				-ms-filter: blur(3px);
				filter: blur(2px);
				border-radius: 20rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.mask {
				position: absolute;
				width: 100%;
				top: 0;
				height: 300rpx;
				border-radius: 20rpx;
				background-color: rgba(0, 0, 0, 0.2);
				z-index: 10;
			}

			.clubName {
				z-index: 99;
				color: #fff;
				font-size: 38rpx;
				font-weight: bold;
				margin-top: 20rpx;
			}

			.edit {
				position: absolute;
				z-index: 99;
				right: 30rpx;
				top: 20rpx;
				color: #3d87ff;
			}
			
			.remove{
				position: absolute;
				z-index: 99;
				left: 30rpx;
				top: 20rpx;
				color: #e45656;
			}
		}

		.main {
			margin-top: 20rpx;
			box-sizing: border-box;
			width: 100%;
			background-color: #fff;
			padding: 30rpx;
			border-radius: 20rpx;

			.type,
			.level,
			.contact,
			.intro {
				margin-bottom: 30rpx;
				font-size: 28rpx;
				word-break:break-all;
				white-space: pre-wrap;
			}
		}

		.code {
			margin-top: 20rpx;
			box-sizing: border-box;
			width: 100%;
			border-radius: 20rpx;
			background-color: #fff;
			padding: 30rpx;
		}

		.code-img {
			display: flex;
			margin-top: 40rpx;
			justify-content: center;

			.u-image {
				width: 300rpx;
				height: 300rpx;
			}
		}
	}
</style>