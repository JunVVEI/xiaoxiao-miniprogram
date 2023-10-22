<template>
	<view class="container">
		<view class="top">
			<!-- 取消按钮 -->
			<view class="canel" @click="cancelPost">取消</view>
			<!-- 上方标题 -->
			<view class="title">发布帖子</view>
			<!-- 发表按钮 -->
			<view style="flex: 1;"><u-button shape="circle" type="primary" size="small" @click="send">发表</u-button></view>
		</view>
		<!-- 主体 -->
		<view class="main">
			<!-- 帖子内容 -->
			<view class="content">
				<u--textarea
					v-model="postInfo.content"
					placeholder="在这里开始分享"
					:showConfirmBar='false'
					:auto-height='true'
					adjustPosition
					border="none"
					maxlength="2048"
					confirmType="return"
				></u--textarea>
			</view>

			<!-- 帖子图片 -->
			<view class="img-warpper">
				<u-upload
					:fileList="fileList"
					@afterRead="afterRead"
					@delete="deletePic"
					multiple
					width="200rpx"
					height="200rpx"
					uploadIcon="photo"
					maxCount="9"
					deletable
					previewImage
					:sizeType="['original']"
				></u-upload>
			</view>

			<view class="img-warpper">
				<uni-section title="标签（非必选）" type="line" padding>
					<uni-tag v-for="(tag, index) in tags" :key="index" :inverted="!tag.isSelected" :text="tag.name" type="primary" style="margin: 10rpx" @click="selectTag(tag)" />
				</uni-section>
			</view>

			<view class="img-warpper">
				<view style="opacity: 0.5; font-size: 13px">点击"我的"->"接收微信消息通知"，即知晓帖子新动态!</view>
			</view>
		</view>
		<!-- 身份弹出窗(版本3)  -->
		<view>
			<u-action-sheet
				:actions="postOption.optionList"
				:title="postOption.title"
				:show="postOption.popup"
				@close="postOption.popup = false"
				@select="selectClick"
			></u-action-sheet>
		</view>
	</view>
</template>

<script>
import { createPost, listTags } from '@/api/bbs/post.js';
import { getUserPostOptions } from '@/api/user/user.js';
import upload from '@/mixin/upload.js';
export default {
	mixins: [upload],
	data() {
		return {
			// 发帖内容
			postInfo: {
				// 文本内容
				content: '',
				//媒体存放路径（字符串）
				mediaPath: '',
				// 标签id
				tagId: undefined,
				//用户id
				userId: undefined,
				//匿名id
				identityId: undefined
			},
			// 标签
			tags: [
				{
					tagId: 0,
					name: '默认',
					isSelected: false
				}
			],
			// 身份选择相关
			postOption: {
				popup: false,
				title: '选择发布身份',
				optionList: []
			}
		};
	},

	onLoad() {},
	onShow() {
		listTags().then((res) => {
			this.tags = [];
			res.data.data.forEach((item) => {
				this.tags.push({
					tagId: item.tagId,
					name: item.name,
					isSelected: false
				});
			});
		});
	},
	methods: {
		//顶部发表按钮
		send() {
			if (this.checkIsPostValid()) {
				getUserPostOptions().then((res) => {
					if (res.data.code === 'SUCCESS') {
						this.postOption.optionList = [];
						res.data.data.postOptionList.forEach((item) => {
							let option = {
								type: item.type,
								name: item.value,
								uid: item.uid,
								identityId: item.identityId,
								fontSize: '15'
							};

							this.postOption.optionList.push(option);
							this.postOption.popup = true; //显示身份选择框
						});
					}
				});
			}
		},
		// 发布前检查
		checkIsPostValid() {
			if (this.postInfo.content.length < 8) {
				uni.showModal({
					title: '正文字数不能少于8个字',
					showCancel: false
				});
				return false;
			}
			return true;
		},
		//选择身份
		selectClick(e) {
			this.postInfo.userId = e.uid;
			// 匿名发布需要加上匿名id
			if (e.type === 2) {
				this.postInfo.identityId = e.identityId;
			}
			this.postOption.popup = false;
			this.submitPost();
		},
		// 用户发帖
		submitPost() {
			// 发起请求
			this.postInfo.mediaPath = this.uploadFileList.join(); //将图片拼接成字符串
			//调用接口
			createPost(this.postInfo)
				.then((res) => {
					uni.showToast({
						title: '发帖成功',
						duration: 1000,
						mask: true
					});
					this.postOption.popup = false;
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/home/index'
						});
					}, 1000);
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
			// uni.showActionSheet({
			// 	title: '是否保存草稿',
			// 	itemList: ['保存', '不保存'],
			// 	success: function(res) {
			// 		uni.switchTab({
			// 			url: '/pages/home/index'
			// 		});
			// 	},
			// 	fail: function(res) {
			// 		uni.switchTab({
			// 			url: '/pages/home/index'
			// 		});
			// 	}
			// });
		},
		// 选择标签
		selectTag(tag) {
			// 取消选择
			if (tag.isSelected) {
				this.postInfo.tagId = undefined;
				tag.isSelected = false;
			} else {
				for (let i = 0; i < this.tags.length; ++i) {
					this.tags[i].isSelected = false;
				}
				this.postInfo.tagId = tag.tagId;
				tag.isSelected = true;
			}
		}
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
		.canel{
			flex: 1;
		}
		.title {
			flex: 1;
			margin: 20rpx 0;
			text-align: center;
		}
		/deep/.u-button{
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

		/* .tagLine {
			margin-top: 10rpx;
			margin-bottom: 10rpx;
			height: 50rpx;
		} */
		.tag {
			margin-top: 50rpx;
			margin-bottom: 20rpx;
			height: 120rpx;
			width: 100%;
			// display: flex;
			// justify-content: space-around;
		}
	}

	.popup {
		display: flex;
		flex-direction: column;
		width: 600rpx;
		height: 20%;

		.popup-top {
			text-align: center;
			font-size: 30rpx;
			font-weight: 700;
			padding: 2% 0%;
			//background-color: #87CEFA;
			color: black;
		}

		.scroll {
			margin: 0% 2%;
			width: 95%;
			border: 1rpx dashed gray;

			.popup-item {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin: 2% 2%;

				.popup-avatar {
					flex: 1;
				}

				.popup-item-nickName {
					padding-left: 4%;
					flex: 2;
				}
			}
		}

		.popup-button {
			margin: 2%;
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			align-items: center;
		}
	}
}
</style>
