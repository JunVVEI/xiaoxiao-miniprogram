<template>
	<view class="container">
		<view class="top">
			<!-- 取消按钮 -->
			<view class="canel" @click="back">取消</view>
			<!-- 上方标题 -->
			<view class="title">发布评论</view>
			<!-- 发表按钮 -->
			<view style="flex: 1;"><u-button shape="circle" type="primary" :customStyle="sendStyle" size="small" @click="createPost()">发表</u-button>
			</view>
		</view>
		<!-- 主体 -->
		<view class="main">
			<!-- 帖子内容 -->
			<view class="content">
				<u--textarea v-model="commentContent" placeholder="说点儿什么吧..." count height="300" showConfirmBar
					adjustPosition border="none"></u--textarea>
			</view>
			<!-- 帖子图片 -->
			<view class="img-warpper">
				<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" multiple width="200rpx"
					height="200rpx" uploadIcon="photo" maxCount="9" deletable previewImage></u-upload>
			</view>
		</view>
	</view>
</template>

<script>
	import upload from '../../../mixin/upload.js';
	import {
		addPostComment
	} from '@/api/bbs/comment.js';
	export default {
		mixins: [upload],
		onLoad(e) {
			//如果有传递过来图片
			if (e.hasOwnProperty('fileList')) {
				let fileList = decodeURI(e.fileList);
				let uploadFileList = decodeURI(e.uploadFileList);
				this.fileList = JSON.parse(fileList);
				this.uploadFileList = JSON.parse(uploadFileList);
			}
			this.commentContent = e.commentContent; //获取传过来的文本
			this.postId = e.postId;
			//console.log(this.fileList)
		},
		data() {
			return {
				//发表按钮点击状态
				btnEnable: false,
				// 文本内容
				commentContent: '',
				// 帖子id
				postId: '',
				onclick: false,

			};
		},
		computed: {
			// 发表帖子数据
			commentParams() {
				return {
					postId: this.postId,
					content: this.commentContent,
					identityId: '',
					mediaPath: this.uploadFileList.join() || ''
				};
			},
			//发表按钮大小
			sendStyle() {
				let systemInfo = wx.getSystemInfoSync();
				//适配小屏手机和平板
				if (systemInfo.screenWidth < 350) {
					return {
						height: '60rpx',
						width: '120rpx',
						fontSize: '24rpx'
					};
				} else if (systemInfo.screenWidth < 400) {
					return {
						height: '60rpx',
						width: '100rpx',
						fontSize: '24rpx'
					};
				} else if (systemInfo.screenWidth < 500) {
					return {
						height: '60rpx',
						width: '100rpx'
					};
				} else {
					return {
						height: '40rpx',
						width: '100rpx',
						fontSize: '20rpx'
					};
				}
			}
		},
		methods: {
			//发表
			createPost() {
				if (this.onClick) {
					return
				}
				if (!this.commentContent) {
					uni.showToast({
						title: '请输入内容',
						icon: 'none',
						duration: 500
					});
					return;
				}
				this.onClick = true
				addPostComment(this.commentParams).then(res => {
					if (res.data.code == 'SUCCESS') {
						uni.showToast({
							title: '评论成功',
							duration: 1000
						});
						this.onClick = false
						setTimeout(function() {
							uni.navigateBack({
								delta: 1 //返回层数，2则上上页
							});
						}, 1000);
					} else {
						uni.showToast({
							title: '发表评论失败,请稍后再试',
							icon: 'error'
						});
						this.onClick = false
					}
				});
			},
			//返回
			back() {
				uni.navigateBack({
					delta: 1 //返回层数，2则上上页
				});
			}
		},
		onUnload() {
			this.fileList = []
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		width: 95%;
		margin: 0 auto;


		.top {
			/* margin-top: 50rpx; */
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0% 1%;

			.canel {
				flex: 1;
			}

			.title {
				flex: 1;
				margin: 20rpx 0;
				text-align: center;
			}

			/deep/.u-button {
				width: 130rpx;
				font-size: 30rpx;
				float: right;
			}
		}

		.img-warpper {
			width: 100%;
			margin: 20rpx 0;
		}

		.content {
			padding: 10rpx 0;
		}
	}
</style>
