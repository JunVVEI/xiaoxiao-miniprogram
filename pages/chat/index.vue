<template>
	<view>
		<!-- 顶部选项卡 -->
		<view :style="{ paddingTop: systemBarHeight + 'px' }" class="navBarBox">
			<uni-nav-bar @focus="focus">
				<u-subsection mode="button" :list="list" :current="currentTab" @change="switchTab"></u-subsection>
			</uni-nav-bar>
		</view>
		<view class="chat" v-if="currentTab === 0">
			
			<scroll-view
				:style="{ height: `${windowHeight - keyboardHeight - 110}rpx` }"
				id="scrollview"
				scroll-y="true"
				:scroll-top="scrollTop"
				class="scroll-view"
				scroll-with-animation>
				
				<!-- 聊天主体 -->
				<view id="msglistview" class="chat-body">
					<!-- 聊天记录 -->
					<view v-for="(item, index) in msgList" :key="index">
						<!-- 自己发的消息 -->
						<view class="item self" v-if="item.role === 'user'">
							<!-- 文字内容 -->
							<view class="content right">
								<text :user-select="true" style="line-height: 1.5; font-size: 15px">{{ item.content }}</text>
							</view>
							<!-- 头像 -->
							<view class="avatar">
								<image :src="userInfo.avatar" mode="aspectFit"></image>
							</view>
						</view>
						<!-- 对方发的消息 -->
						<view class="item" v-if="item.role === 'assistant'">
							<!-- 头像 -->
							<view class="avatar">
								<image src="../../static/logo/logo.png" mode="aspectFit"></image>
							</view>
							<!-- 文字内容 -->
							<view class="content left">
								<zero-markdown-view :themeColor="themeColor" :markdown="item.content"></zero-markdown-view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 绘画部分 -->
		<view class="chat" v-if="currentTab === 1">
			<scroll-view
				:style="{ height: `${windowHeight - keyboardHeight - 110}rpx` }"
				id="scrollview_draw"
				scroll-y="true"
				:scroll-top="drawScrollTop"
				class="scroll-view"
				scroll-with-animation
			>
				<!-- 聊天主体 -->
				<view id="msglistview_draw" class="chat-body">
					<!-- 聊天记录 -->
					<view v-for="(item, index) in drawingList" :key="index">
						<!-- 自己发的消息 -->
						<view class="item self" v-if="item.role === 'user'">
							<!-- 文字内容 -->
							<view class="content right">
								<text :user-select="true">{{ item.content }}</text>
							</view>
							<!-- 头像 -->
							<view class="avatar">
								<u-avatar :src="userInfo.avatar" shape="square" size="45"></u-avatar>
							</view>
						</view>
						<!-- 对方发的消息 -->
						<view class="item" v-if="item.role === 'assistant'">
							<!-- 头像 -->
							<view class="avatar">
								<image src="../../static/logo/logo.png" mode="aspectFit"></image>
							</view>
							<!-- 文字内容 -->
							<view class="content left" style="width: 256px; height: 256px">
								<zero-markdown-view :themeColor="themeColor" :markdown="item.content"></zero-markdown-view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 底部消息发送栏 -->
		<!-- 用来占位，防止聊天消息被发送框遮挡 -->
		<view class="chat-bottom" :style="{ height: `${inputHeight}rpx` }">
			<view class="send-msg" :style="{ bottom: `${keyboardHeight}rpx` }">
				<view class="delete" @click="deleteContentList">
					<u-icon name="trash-fill" color="#8d8d8d" size="28"></u-icon>
				</view>
				<view class="uni-textarea">
					<u--textarea
						v-model="content"
						maxlength="3000"
						confirmType="send"
						:disabled="inputDisable"
						:disableDefaultPadding="true"
						@focus="inputFocus"
						:autoHeight="true"
						@blur="inputFocus"
						:showConfirmBar="false"
						:adjustPosition="false"
						:fixed="true"
						border="none"
					></u--textarea>
				</view>
				<u-button @click="handleContent" type="primary">发送</u-button>
			</view>
		</view>
	</view>
</template>
<script>
import { chat, drawing } from '@/api/chat/index.js';
import { getCurrentUserInfo } from '../../api/user/user';
export default {
	data() {
		return {
			//键盘高度
			keyboardHeight: 0,
			//底部消息发送高度
			bottomHeight: 0,
			//滚动距离
			scrollTop: 0,
			// 绘画页滚动距离
			drawScrollTop: 0,
			systemBarHeight: 0, // 顶部状态栏高度
			userId: '',
			msgList: [],
			drawingList: [],
			content: '', // 输入框内容
			themeColor: '#333',
			currentTab: 0,
			drawingImage: '', // 用于展示绘画后的图片
			list: ['对话', '画图'],
			// 用户信息
			userInfo: null,
			// 是否禁用输入
			inputDisable: false,
		};
	},
	updated() {
		//页面更新时调用聊天消息定位到最底部
		if (this.currentTab) {
			this.drawScrollToBottom();
		} else {
			this.$nextTick(() => {
				this.scrollToBottom();
			});
		}
	},
	computed: {
		windowHeight() {
			return (uni.getSystemInfoSync().windowHeight - this.systemBarHeight - 44) * this.RATE;
		},
		// 键盘弹起来的高度+发送框高度
		inputHeight() {
			return this.bottomHeight + this.keyboardHeight;
		}
	},
	onLoad() {
		this.getUserInfo();
		this.keyboardheightchange();
		// 获取手机顶部状态栏高度
		this.systemBarHeight = uni.getSystemInfoSync()['statusBarHeight'];

		if (uni.getStorageSync('msgList')) {
			this.msgList = uni.getStorageSync('msgList');
		}

		if (uni.getStorageSync('drawingList')) {
			this.drawingList = uni.getStorageSync('drawingList');
		}

		this.scrollToBottom();
	},
	onUnload() {
		uni.offKeyboardHeightChange();
	},
	methods: {
		// 键盘事件
		keyboardheightchange() {
			uni.onKeyboardHeightChange((res) => {
				this.keyboardHeight = (res.height - 80) * this.RATE;
				if (this.keyboardHeight < 0) this.keyboardHeight = 0;
			});
		},

		// 监视聊天发送栏高度
		sendHeight() {
			setTimeout(() => {
				let query = uni.createSelectorQuery();
				query.select('.send-msg').boundingClientRect();
				query.exec((res) => {
					this.bottomHeight = res[0].height * this.RATEk;
				});
			}, 10);
		},

		// 切换tab
		switchTab(e) {
			this.currentTab = e;
			if (e) {
				this.drawScrollToBottom();
			} else {
				this.scrollToBottom();
			}
		},
		inputFocus() {
			this.keyboardheightchange();
			if (this.currentTab) {
				this.drawScrollToBottom();
			} else {
				this.scrollToBottom();
			}
		},

		// 获取用户信息
		getUserInfo() {
			getCurrentUserInfo().then((res) => {
				this.userInfo = res.data.data;
			});
		},

		// chat页滚动至聊天底部
		scrollToBottom() {
			setTimeout(() => {
				let query = uni.createSelectorQuery().in(this);
				query.select('#scrollview').boundingClientRect();
				query.select('#msglistview').boundingClientRect();
				query.exec((res) => {
					if (res[1].height > res[0].height) {
						this.scrollTop = (res[1].height - res[0].height) * this.RATE;
					}
				});
			}, 15);
		},

		// 绘画页滚动至底部
		drawScrollToBottom() {
			setTimeout(() => {
				let query = uni.createSelectorQuery().in(this);
				query.select('#scrollview_draw').boundingClientRect();
				query.select('#msglistview_draw').boundingClientRect();
				query.exec((res) => {
					if (res[1].height > res[0].height) {
						this.drawScrollTop = (res[1].height - res[0].height) * this.RATE;
					}
				});
			}, 15);
		},

		// 发送消息
		handleContent() {
			//如果消息不为空
			if (this.content) {
				let obj = {
					role: 'user',
					content: this.content
				};
				if (this.currentTab) {
					// 画图
					this.drawingList.push(obj);
					this.content = '';
					this.inputDisable = true;
					this.drawingList.push({
						role: 'assistant',
						content: '绘画中...'
					});
					this.drawScrollToBottom();
					drawing({
						drawingDescription: obj.content
					})
						.then((res) => {
							if (res.data.code === 'SUCCESS') {
								this.$set(this.drawingList, this.drawingList.length - 1, {
									role: 'assistant',
									content: '![image](' + res.data.data.imageUrl + ')'
								});
								this.drawingDisable = false;
								this.inputDisable = false;
								uni.setStorageSync('drawingList', this.drawingList);
							} else {
								this.drawingList.splice(this.drawingList.length - 1, 1);
								this.$forceUpdate(); // force re-render
								this.drawingDisable = false;
								this.inputDisable = false;
							}
						})
						.catch((error) => {
							this.drawingList.splice(this.drawingList.length - 1, 1);
							this.$forceUpdate(); // force re-render
							this.inputDisable = false;
							uni.showToast({
								title: '请重试',
								icon: 'none'
							});
						});
				} else {
					// 对话
					this.msgList.push(obj);
					this.content = '';
					this.inputDisable = true;
					this.msgList.push({
						role: 'assistant',
						content: '思考中...'
					});
					this.scrollToBottom();
					chat(this.msgList)
						.then((res) => {
							if (res.data.code === 'SUCCESS') {
								this.$set(this.msgList, this.msgList.length - 1, res.data.data);
								this.inputDisable = false;
								uni.setStorageSync('msgList', this.msgList);
							} else {
								this.msgList.splice(this.msgList.length - 1, 1);
								this.$forceUpdate(); // force re-render
								this.inputDisable = false;
							}
						})
						.catch((error) => {
							this.msgList.splice(this.msgList.length - 1, 1);
							this.$forceUpdate(); // force re-render
							this.inputDisable = false;
						});
				}
			} else {
				uni.showToast({
					title: '内容不能为空'
				});
			}
		},

		// 删除聊天记录
		deleteContentList() {
			uni.showModal({
				title: '确定删除聊天记录吗？',
				success: (e) => {
					if (e.confirm) {
						if (this.currentTab) {
							this.drawingList = [];
							uni.removeStorageSync('drawingList');
						} else {
							this.msgList = [];
							uni.removeStorageSync('msgList');
						}
					}
				}
			});
		},

		// 预览图片
		preview() {
			if (this.drawingImage) {
				uni.previewImage({
					urls: [this.drawingImage]
				});
			}
		}
	}
};
</script>
<style lang="scss" scoped>
$chatContentbgc: #c2dcff;
$sendBtnbgc: #4f7df5;

view,
button,
text,
input,
textarea {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.navBarBox {
	position: relative;

	/deep/.u-subsection {
		width: 350rpx;
		margin: 0 auto;
		height: 70rpx;
		margin-top: 10rpx;
	}
}

/* 聊天消息 */
.chat {
	height: 100%;

	.scroll-view {
		::-webkit-scrollbar {
			display: none;
			width: 0 !important;
			height: 0 !important;
			-webkit-appearance: none;
			background: transparent;
			color: transparent;
		}

		background-color: #f2f6fa;

		.chat-body {
			display: flex;
			flex-direction: column;
			padding-top: 23rpx;

			.self {
				justify-content: flex-end;
			}

			.item {
				display: flex;
				padding: 23rpx 30rpx;
				box-sizing: border-box;

				.right {
					background-color: $chatContentbgc;
					padding: 10px;
					color: #333333;
				}

				.left {
					background-color: #ffffff;
					padding: 0;
				}

				// 聊天消息的三角形
				.right::after {
					position: absolute;
					display: inline-block;
					content: '';
					width: 0;
					height: 0;
					left: 100%;
					top: 10px;
					border: 12rpx solid transparent;
					border-left: 12rpx solid $chatContentbgc;
				}

				.left::after {
					position: absolute;
					display: inline-block;
					content: '';
					width: 0;
					height: 0;
					top: 10px;
					right: 100%;
					border: 5rpx solid transparent;
					border-right: 5rpx solid #ffffff;
				}

				.content {
					position: relative;
					max-width: 486rpx;
					border-radius: 8rpx;
					word-wrap: break-word;
					margin: 0 24rpx;
					border-radius: 5px;
					font-size: 32rpx;
					font-family: PingFang SC;
					font-weight: 500;
					line-height: 32rpx;
					max-width: 550rpx;
				}

				.avatar {
					display: flex;
					justify-content: center;
					width: 78rpx;
					height: 78rpx;
					border-radius: 8rpx;
					overflow: hidden;

					image {
						align-self: center;
						width: 78rpx;
						height: 78rpx;
					}
				}
			}
		}
	}
}

/* 底部聊天发送栏 */
.chat-bottom {
	width: 100%;
	background: #f4f5f7;
	transition: all 0.1s ease;

	.send-msg {
		display: flex;
		align-items: center;
		padding: 5rpx 15rpx;
		width: 100%;
		min-height: 110rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		background: #efefef;
		transition: all 0.1s ease;
	}

	.delete {
		width: 60rpx;
		margin-right: 10rpx;
	}

	.uni-textarea {
		/deep/.u-textarea {
			width: 480rpx;
			background: #ffffff;
			border-radius: 8rpx;
			font-size: 40px;
			color: #262626;
			margin-right: 10px;
		}
	}
}
</style>
