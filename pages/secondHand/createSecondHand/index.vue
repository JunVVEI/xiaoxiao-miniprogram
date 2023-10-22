<template>
	<view class="container">
		<view class="top">
			<!-- 取消按钮 -->
			<view class="canel" @click="cancelPost">取消</view>
			<!-- 发表按钮 -->
			<view style="flex: 1;"><u-button shape="circle" type="primary" size="small"
					@click="submitHelp">发布</u-button></view>
		</view>
		<!-- 主体 -->
		<view class="main">
			<!-- 帖子内容 -->
			<view class="content">
				<u--textarea v-model="taskInfo.content" placeholder="请描述任务详情" :showConfirmBar='false'
					:auto-height='true' adjustPosition border="none" maxlength="2048"
					confirmType="return"></u--textarea>
			</view>
			<view class="contact">
				<u-input placeholder="请输入微信号" border="none" clearable v-model="taskInfo.contact">
					<u-text text="微信号:" slot="prefix" margin="0 3px 0 0" type="tips" size="16"></u-text>
				</u-input>
			</view>

			<!-- 帖子图片 -->
			<view class="img-warpper">
				<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" multiple width="200rpx"
					height="200rpx" uploadIcon="photo" maxCount="6" deletable previewImage
					:sizeType="['original']"></u-upload>
			</view>
		</view>
		<view class="moneyInput">
			<u-input placeholder="设置金额" border="none" clearable fontSize="22" type="digit" margin="0 3px 0 0"
				v-model="taskInfo.bounty"><u-text text="悬赏金额:" slot="prefix" margin="0 3px 0 0" size="16"
					type="tips"></u-text>
			</u-input>

		</view>
	</view>
</template>

<script>
	import {
		addTask
	} from '@/api/help/index.js';
	import upload from '@/mixin/upload.js';
	export default {
		mixins: [upload],
		data() {
			return {
				// 任务内容
				taskInfo: {
					// 文本内容
					content: '',
					//媒体存放路径（字符串）
					mediaPath: '',
					//用户id
					contact: "",
					bounty: null,
				},
			};
		},

		onLoad() {},
		methods: {
			// 发布前检查
			checkIsPostValid() {
				if (!this.taskInfo.content) {
					uni.showModal({
						title: '请描述任务详情',
						showCancel: false
					});
					return false;
				}
				if (!this.taskInfo.contact) {
					uni.showModal({
						title: '请输入联系方式',
						showCancel: false
					});
					return false;
				}
				return true;
			},

			// 用户发布悬赏
			submitHelp() {
				// 发起请求
				this.taskInfo.mediaPath = this.uploadFileList.join(); //将图片拼接成字符串
				if (!this.taskInfo.content) {
					uni.showToast({
						icon: 'none',
						title: "请输入任务详情"
					});
					return
				}
				if (!this.taskInfo.contact) {
					uni.showToast({
						icon: 'none',
						title: "请输入微信号"
					});
					return
				}
				if (!this.taskInfo.bounty) {
					uni.showToast({
						icon: 'none',
						title: "请输入悬赏金额"
					});
					return
				}
				//调用接口
				addTask(this.taskInfo)
					.then((res) => {
						uni.showToast({
							title: '发布任务成功',
							duration: 1000,
							mask: true
						});
						let pages = getCurrentPages(); // 获取页面实例
						let beforePage = pages[pages.length - 2]; // 前一个页面
						uni.navigateBack({
							delta: 1,
							success: function() {
								beforePage.$vm.getHelpList(true);; // 执行前一个页面的刷新 getList()
							}
						})
					})
					.catch((err) => {
						uni.showToast({
							icon: 'none',
							title: err.data.message
						});
						//发帖失败，询问是否存草稿
						// this.cancelPost();
					});
			},
			// 取消发帖
			cancelPost() {
				uni.navigateBack({
					delta: 1
				});
			},
		}
	};
</script>

<style lang="less">
	.container {
		width: 95%;
		margin: 0 auto;
		height: 95%;
		overflow-y: scroll;

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

		.main {
			.title {
				margin: 20rpx 0;
			}

			.img-warpper {
				width: 100%;
				margin: 20rpx 0;
			}

			.content {
				min-height: 400rpx;

			}

			.contact {
				margin: 22px 0;
			}
		}

		.moneyInput {
			box-sizing: border-box;
			position: fixed;
			height: 150rpx;
			width: 100%;
			bottom: 0;
			box-shadow: 0px -4px 3px 0px #e3e3e3;
			left: 0;
			right: 0;
			padding: 20rpx;
			background-color: #FFF;
		}
	}
</style>