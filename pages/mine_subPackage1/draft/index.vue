<template>
	<view>
		<scroll-view scroll-y :style="{height:draftContentHeight}" v-show="draftList.length">
			<!-- 草稿内容区域 -->
			<checkbox-group @change="checkboxChange" v-if="pressShow">
				<label class="contentBox" v-for="item in draftList" :key="item.id">
					<!-- 复选框 -->
					<view class="checkbox-cell">
						<checkbox :value="item.id" v-model="item.id" :checked="item.checked" />
					</view>
					<!-- 草稿内容 -->
					<view class="content active">
						<view class="title">
							{{item.title}}
						</view>
						<view class="other-info">
							<view class="type">
								{{item.type}}
							</view>
							<view class="line">
								|
							</view>
							<view class="date">
								{{item.date}}
							</view>
						</view>
					</view>
				</label>
			</checkbox-group>

			<!-- 草稿内容 -->
			<view class="content" @longpress="editList" v-else v-for="item in draftList" :key="item.id">
				<view class="title">
					{{item.title}}
				</view>
				<view class="other-info">
					<view class="type">
						{{item.type}}
					</view>
					<view class="line">
						|
					</view>
					<view class="date">
						{{item.date}}
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 无草稿内容 -->
		<view class="blank" v-show="!draftList.length && !pressShow">
			<!-- <u-empty mode="list" text="暂时没有草稿哦~" icon="http://cdn.uviewui.com/uview/empty/list.png"></u-empty>
			<u-button @click="toCreatePost" size="small" type="primary" text="前往发帖>"></u-button> -->
			<explore :tipsTitle="tips.title" :tipsName="tips.name" :tipsTo="tips.to"></explore>
		</view>

		<!-- 底部固定栏 -->
		<view class="fixedBox" v-show="pressShow">
			<view class="flexBox">
				<!-- 全选框 -->
				<checkbox-group @change="checkAll">
					<label>
						<checkbox value="all" :checked="isAllSelected" :disabled="!draftList.length" /><text>全选</text>
					</label>
				</checkbox-group>

				<view class="btn">
					<view class="deleteBtn">
						<u-button text="删除" shape="circle" :color="disabled?'#ccc':'lightBlue'" :disabled="disabled"
							@click="deleteItem">
						</u-button>
					</view>
					<view>
						<u-button @click="finishList" text="完成" shape="circle" color="lightBlue"></u-button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		diffDays
	} from '@/utils/timestamp.js';
	import explore from '@/UI/explore/explore.vue'
	export default {
		data() {
			return {
				draftList: [
					
				],
				// 长按后显示
				pressShow: false,
				// 全选框信息
				isAllSelected: false,
				// 判断这个全选框是否为我自己点击
				flag:false,
				checkedList: [],
				// 删除按钮的状态
				disabled: true,
				// 空白页显示
				tips:{
					title:'暂无草稿内容',
					name:'还没有编辑过帖子',
					to:'快去发帖子吧'
				}
			}
		},
		components:{
			explore
		},
		onLoad() {
			this.displayDate();
		},
		methods: {
			// 设置状态
			setDraftStatus(status) {
				this.draftList.forEach(item => {
					if (item.checked) item.checked = status;
					this.$set(item, 'checked', status);
				})
			},
			// 时间显示
			displayDate() {
				// date 以秒计
				this.draftList.forEach(item => {
					item.date = diffDays(item.date);
				})
			},
			// 长按进入编辑
			editList() {
				this.setDraftStatus(false);
				this.pressShow = !this.pressShow;
				this.isAllSelected = false;
			},
			// 完成编辑
			finishList() {
				this.pressShow = !this.pressShow;
			},
			// 复选框change事件
			checkboxChange(e) {
				// 选中选项 的 id 数组
				this.checkedList = e.detail.value;
				// 遍历数组，查看选中状态
				this.draftList.forEach(item => {
					item.checked = this.checkedList.includes(item.id) ? true : false;
				})
				// 删除按钮的状态
				this.disabled = this.checkedList.length ? false : true;
			},
			// 删除所选项
			deleteItem() {
				uni.showModal({
					title: "删除浏览历史",
					content: "是否确认删除选中项",
					success: (res) => {
						if (res.confirm) {
							this.draftList = this.draftList.filter(item => !item.checked)
							// 删除按钮的状态
							this.disabled = true;
						}
					}
				})
			},
			// 全选框change事件
			checkAll(e) {
				this.isAllSelected = e.target.value.length ? true : false;
				// 删除按钮的状态
				this.disabled = this.isAllSelected ? false : true;
				// 自己进行点击
				this.flag = true;
			},

			// 点击进入发帖页面
			toCreatePost() {
				uni.navigateTo({
					//保留当前页面，跳转到应用内的某个页面
					url: '/pages/home/createPost/index'
				});
			}
		},
		watch: {
			// 监听isAllSelected;是否实现全选
			isAllSelected: {
				handler(n) {
					if(this.flag){
						this.setDraftStatus(n);
					}
				}
			},
			// 监听checkedList是否全选
			"checkedList.length": {
				handler(n) {
					this.isAllSelected = n === this.draftList.length ? true : false;
					// 不管isAllSelected为何值。都不是自己点击。
					this.flag = false;
				}
			},
			"draftList.length": {
				handler(n) {
					this.isAllSelected = n ? this.isAllSelected : false;
				}
			}
		},
		computed: {
			// 草稿内容所需高度自适应
			draftContentHeight() {
				let systemInfo = wx.getSystemInfoSync();
				return this.pressShow ? systemInfo.windowHeight - 150 / this.RATE + 'px' : systemInfo.windowHeight + 'px';
			}
		}
	}
</script>

<style lang="scss">
	.contentBox {
		display: flex;
		align-items: center;

		.checkbox-cell {
			margin: 0 20rpx;
		}

		.content.active {
			width: 85%;
		}
	}

	.content {
		width: 90%;
		height: 150rpx;
		margin: auto;
		padding: 30rpx 0;
		box-sizing: border-box;
		border-bottom: 2rpx solid #ccc;

		.title {
			font-weight: bold;
			margin-bottom: 16rpx;
			font-size: 32rpx;
		}

		.other-info {
			// width: 35%;
			display: flex;
			justify-content: start;
			font-size: 28rpx;

			.type {
				color: #ff0000;
			}

			.line {
				margin: 0 10rpx;
			}

			.date {
				color: #828282;
			}
		}
	}

	.blank {
		padding-top: 20rpx;
		text-align: center;


		.u-button {
			margin-top: 30rpx;
			width: 160rpx !important;
			height: 70rpx !important;

		}
	}

	.fixedBox {
		position: fixed;
		bottom: 0;
		width: 100%;
		box-sizing: border-box;
		height: 150rpx;
		line-height: 150rpx;
		padding: 0 40rpx 40rpx 20rpx;

		.flexBox {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.btn {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.deleteBtn {
					margin-right: 40rpx;
				}
			}
		}
	}

	.u-button {
		width: 104rpx !important;
		height: 64rpx !important;
		// 不加上width，小程序端会失效
		// width: 100%;
	}
</style>
