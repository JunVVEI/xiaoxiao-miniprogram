<template>
	<view style="position: fixed; bottom: 0; width: 100%">
		<u-popup :show="show.anonymous" @close="show.anonymous = false" mode="center" closeOnClickOverlay :round="10"
			:customStyle="{ width: '550rpx', display: 'flex', flexDrection: 'column', justifyContent: 'space-around', padding: '20rpx' }">
			<view
				style="width: 100%; text-align: center; padding: 10rpx 0; font-size: 32rpx; border-bottom: 1rpx #999 solid">
				选择评论身份</view>
			<view class="anonymous_item" v-for="(item, index) in nickNameList" :key="index"
				@click="selectNickname(item, index)">
				<view class="anonymous_item_view">
					<u-avatar :src="item.avatarUrl" shape="circle" size="50rpx"
						default-url="https://img.zcool.cn/community/01460b57e4a6fa0000012e7ed75e83.png@1280w_1l_2o_100sh.png"></u-avatar>
					<p class="anonymous_item_nickName">{{ item.nickName }}</p>
				</view>
				<image v-show="activeIndex == index" src="../../static/check.png" mode="widthFix"
					style="width: 40rpx; height: 40rpx"></image>
			</view>
		</u-popup>
		<!-- 遮罩层 -->
		<view @touchmove.stop.prevent="moveHandle"><u-overlay z-index="85" :show="overlayShow"
				@click.prevent="overlayEvent" duration="200"></u-overlay></view>
		<!-- 评论框 -->
		<view class="comment-input-container">
			<view class="comment-input">
				<view style="padding: 10rpx 10rpx 5rpx 0; position: relative;flex: 1;" @click="showAnonymous">
					<Avatar class="avatar" :avatarUrl="avatarUrl" />
					<uni-icons type="forward" size="19"
						style="position: absolute; transform: rotate(-45deg); top: -12rpx; right: -15rpx"
						color="#666"></uni-icons>
				</view>
				<view
					style="background-color: #f3f3f3; padding: 15rpx; border-radius: 30rpx; color: #3d3d3d; flex:9;margin: 0 20rpx;">
					<textarea :auto-height="true" :placeholder="placeholder" :focus="isFocus" cursor-spacing="140"
						:disable-default-padding="true" v-model="commentContent" :show-confirm-bar="false" @focus="
							showBottom = true;
							overlayShow = true;
						" style="padding: 5rpx 10rpx; width: 100%"></textarea>
				</view>
				<view style="flex:1" v-if="showImg">
					<image src="/static/full-screen.png" mode="widthFix" style="width: 40rpx; height: 40rpx"
						@click="goToComment"></image>
				</view>
			</view>
			<!-- 评论框底部 -->
			<view class="comment-bottom" v-if="showBottom">
				<view class="comment-icon">
					<!-- 					<view @click.prevent="
							show.emoji = !show.emoji;
							show.anonymous = false;
							$emit('show', true);
						" style="width: 60rpx; height: 60rpx">
						<image src="../../static/face.png" mode="widthFix" style="height: 100%; width: 100%"></image>
					</view> -->
					<view v-show="showImg" @click="getPolicy">
						<u-upload @afterRead="afterRead" multiple :maxCount="9" width="30" height="30">
							<image src="../../static/img.png" mode="widthFix" style="width: 45rpx; height: 45rpx">
							</image>
						</u-upload>
					</view>
				</view>
				<view @click="publish" style="color: #2979ff">发表</view>
			</view>
			<!-- 表情弹窗 -->
			<!-- <view class="emoji" v-if="show.emoji">
				<swiper class="slider" :current="0" :indicator-dot="false" :circular="false" acceleration>
					<swiper-item v-for="(item, key) in emojiData" :key="key" class="slider-emoji"
						:class="[key == emojiData.length - 1 ? 'lastbox' : '']">
						<text v-for="(emoji, index) in item" :key="index" @click.stop="selemoji(emoji)"
							class="slider-emoji-icon">{{ emoji }}</text>
					</swiper-item>
				</swiper>
			</view> -->
		</view>
	</view>
</template>

<script>
	// import emoji from '@/js_sdk/m-emoji/m-emoji_2.0.0/emoji.js';
	import {Avatar} from '@/UI/avatar/avatar.vue'
	import {
		policy
	} from '@/api/bs/file.js';
	import {
		addPostComment,
		addPostSubComment
	} from '@/api/bbs/comment.js';
	import {
		getUserPostOptions
	} from '@/api/user/user';
	export default {
		// type：1为帖子，2为悬赏
		// level：1为根评论，2为子评论，3为其他回复评论
		// postId: 帖子id
		components:{Avatar},
		props: {
			"type": {
				type: Number,
				default: 1
			},
			"postId": {
				type: String,
				default: ''
			},
			"commentId": {
				type: String,
				default: ''
			},
			"isFocus": {
				type: Boolean,
				default: false
			},
			"level": {
				type: Number,
				default: 1
			},
			"creatorName":{
				type: String,
				default: ''
			},
			"showImg": {
				type: Boolean,
				default: true
			}
		},

		data() {
			return {
				// 遮罩层
				overlayShow: false,
				show: {
					//匿名选择框
					anonymous: false,
					//表情弹框
					emoji: false
				},
				// 显示评论框底部功能
				showBottom: false,
				//评论框value
				commentContent: '',
				//评论框placeholder
				placeholder: '我来聊两句',
				//昵称列表
				nickNameList: [{
					avatarUrl: '',
					nickName: ''
				}],
				//当前输入框头像
				avatarUrl: '',
				activeIndex: 0, //匿名框默认选择,
				fileList: [], //上传图片数组
				//上传服务器图片地址
				uploadFileList: [],
				//上传图片所需参数
				upload: {
					accessKeyId: '',
					policy: '',
					signature: '',
					host: '',
					dir: ''
				},
				//表情包
				emojiData: [],

				// 三级评论
				replyId: '',
				replyName: '',
				// 匿名id，如果用户选择了匿名发布则有值
				identityId: undefined,
				onClick: false,
			};
		},
		computed: {
			// 发表根评论数据
			commentParams() {
				return {
					postId: this.postId,
					content: this.commentContent,
					identityId: this.identityId
				};
			},
			// 发表子评论参数
			subCommentParams() {
				return {
					postId: this.postId,
					parentId: this.commentId,
					content: this.commentContent,
					identityId: this.identityId
				};
			},
		},
		watch: {
			creatorName(newVal) {
				if (newVal !== '') {
					this.placeholder = '回复@' + this.creatorName
				} else {
					this.placeholder = '我来聊两句'
				}
			}
		},


		methods: {

			// 获取签名
			getPolicy(){
				policy().then((res) => {
					//console.log('请求参数', res);
					const {
						accessKeyId,
						policy,
						signature,
						host,
						dir
					} = res.data.data;
					this.upload.accessKeyId = accessKeyId;
					this.upload.policy = policy;
					this.upload.signature = signature;
					this.upload.host = host;
					this.upload.dir = dir;
				});
			},
			// 禁止遮罩层下层页面滑动（空函数）
			moveHandle() {},
			//选择匿名
			selectNickname(item, index) {
				this.avatarUrl = item.avatarUrl;
				if (item.type === 2) {
					this.identityId = item.identityId;
				} else if (item.type === 1) {
					this.identityId = undefined;
				}
				this.activeIndex = index;
				this.show.anonymous = false;
				this.overlayShow = false;
			},
			// 点击头像事件
			showAnonymous() {
				console.log(111)
				this.show.anonymous = !this.show.anonymous;
			},

			// 点击遮罩层事件
			overlayEvent() {
				this.overlayShow = false;
				this.showBottom = false;
				// this.show.emoji = false;
				this.show.anonymous = false;
				this.$emit('update:isFocus', false);
				this.placeholder = '我来聊两句'
				this.$emit('resetCommentId')
			},

			//跳转到评论详细页
			goToComment() {
				uni.navigateTo({
					url: `/pages/home/createComment/createComment?commentContent=${this.commentContent}&postId=${this.postId}`
				});
				this.commentContent = '';
				this.overlayEvent();
			},


			//发表评论
			publish() {
				if (this.onClick) {
					return
				}
				this.onClick = true
				if (!this.commentContent) {
					uni.showToast({
						title: '请输入内容',
						icon: 'none',
						duration: 500
					});
					return;
				}
				// 帖子回复
				if (this.type === 1) {
					switch (this.level) {
						case 1:
							this.$emit('pubComment', this.commentParams);
							this.overlayEvent();
							this.commentContent = '';
							this.placeholder = `我来聊两句`;
							this.onClick = false;
						case 2:
							this.$emit('pubSubComment', this.subCommentParams);
							this.overlayEvent();
							this.commentContent = '';
							this.placeholder = `我来聊两句`;
							this.onClick = false;
					}
				} else if (this.type === 2) {
					this.$emit('pubComment', this.subCommentParams);
					this.overlayEvent();
					this.commentContent = '';
					this.placeholder = `我来聊两句`;
					this.onClick = false;
				}
			},

			// 新增图片
			afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file);
				let fileListLen = this[`fileList${event.name}`].length; //目前fileList的长度
				//给每个图片加上状态信息
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					});
				});
				for (let i = 0; i < lists.length; i++) {
					//console.log('上传到服务器')
					const fileName = this.upload.dir + lists[i].url.slice(12);
					//上传图片到服务器
					uni.uploadFile({
						url: this.upload.host, // 接口地址
						filePath: lists[i].url,
						name: 'file',
						formData: {
							key: fileName, //存放图片命名格式 ,自定义不重复就行,在上面的准备数据
							policy: this.upload.policy, //包含失效时间和文件上传大小限制等信息
							OSSAccessKeyId: this.upload.accessKeyId, //AccessKey ID用于标识用户（后台接口提供）
							signature: this.upload.signature //accessKeySecret加密秘钥(后台接口提供)
						},
						success: (res) => {
							if (res.statusCode == 204) {
								this.uploadFileList.push(this.upload.host + '/' + fileName);
								this[`fileList${event.name}`][fileListLen + i].status = 'success';
								this[`fileList${event.name}`][fileListLen + i].message = '上传成功';
								var fileList = JSON.stringify(this.fileList); //将对象转成json字符串
								var uploadFileList = JSON.stringify(this.uploadFileList);
								fileList = encodeURI(fileList); //将字符串作为 URI 进行编码
								uploadFileList = encodeURI(uploadFileList);
								uni.navigateTo({
									url: `/pages/home/createComment/createComment?fileList=${fileList}&uploadFileList=${uploadFileList}&commentContent=${this.commentContent}&postId=${this.postId}`
								});
								this.fileList = [];
								this.uploadFile = [];
								this.commentContent = '';
								this.overlayEvent();
							} else {
								console.log('上传失败');
								uni.showToast({
									title: '上传失败',
									icon: 'error'
								});
								this[`fileList${event.name}`].splice(event.index, 1);
							}
						}
					});
				}
			},
			// //选择表情
			// selemoji(m) {
			// 	this.commentContent += m;
			// }
		},
		created() {

			// 获取用户匿名信息
			getUserPostOptions().then((res) => {
				if (res.data.code === 'SUCCESS') {
					this.nickNameList = [];
					res.data.data.postOptionList.forEach((item) => {
						let option = {
							type: item.type,
							uid: item.uid,
							identityId: item.identityId,
							avatarUrl: item.avatar,
							nickName: item.value
						};

						this.nickNameList.push(option);
					});
					this.avatarUrl = this.nickNameList[0].avatarUrl;
				}
			});
		},
		// mounted() {
		// 	this.avatarUrl = this.nickNameList[0].avatarUrl; //头像框默认值
		// 	//表情库划分
		// 	var page = Math.ceil(emoji.length / 35); //页数
		// 	for (let i = 0; i < page; i++) {
		// 		this.emojiData[i] = [];
		// 		for (let k = 0; k < 35; k++) {
		// 			emoji[i * 35 + k] ? this.emojiData[i].push(emoji[i * 35 + k]) : '';
		// 		}
		// 	}
		// 	//console.log(this.emojiData);
		// }
	};
</script>

<style lang="less" scoped>
	/* 评论框 */
	.comment-input-container {
		display: flex;
		flex-direction: column;
		height: auto;
		width: 100%;
		background-color: #fff;
		border: 2rpx solid gainsboro;
		bottom: 0;
		padding-bottom: 30rpx;
		position: fixed;
		z-index: 99;

		.comment-input {
			display: flex;
			align-items: center;
			padding: 10rpx 20rpx 0;
			justify-content: space-around;
			height: 6%;
			
			.avatar{
				.img /deep/ image {
					height: 60rpx;
					width: 60rpx;
					border-radius: 50%;
				}
				
			}
			.replyUser {
				font-size: 28rpx;
				background: none
			}
		}

		.comment-bottom {
			width: 90%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 0 auto;
			padding: 0 10rpx;
			padding-top: 10rpx;
			height: 50rpx;

			.comment-icon {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 20%;
				height: 90%;
			}
		}
	}

	// 匿名选择框
	.anonymous_item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0 0 0;
		font-size: 30rpx;

		.anonymous_item_view {
			width: 500rpx;
			display: flex;
			align-items: center;

			.anonymous_item_nickName {
				padding-left: 4%;
				width: 400rpx;
			}
		}
	}

	//表情弹窗
	.emoji {
		background-color: #fff;
		width: 100%;
		height: 240rpx;
		padding: 10rpx;

		.slider {
			height: 100%;
			background-color: #fff;

			&-emoji {
				&-icon {
					font-size: 60rpx;
					text-align: center;
					padding: 0rpx 10rpx;
				}
			}
		}

		//设置最后一列左靠齐
		.lastbox {
			justify-content: flex-start;
		}
	}
</style>
