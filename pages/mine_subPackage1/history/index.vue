<template>
	<view class="container">
		<!-- 浏览记录内容 -->
		<view v-if="postList.length">
			<u-list @scrolltolower.stop="scrollToBottom">
				<!--				<error v-if="!isOnline"></error>-->
				<u-list-item v-for="(item, index) in postList" :key="item.id">
					<post @post="getPostId" :postList="item" :postIndex="index" class="post-item"></post>
					<view style="height: 160rpx;" v-if="index === postList.length-1">
					</view>
				</u-list-item>
				<u-loadmore bgColor="#f5f6fa" status="nomore"/>
			</u-list>
			<!-- 帖子操作菜单 -->
			<view>
				<u-action-sheet @select="selectClick" :show="sheetShow" @close="sheetShow = false"
												:actions="sheetList" closeOnClickOverlay closeOnClickAction :round="10"
												cancelText="取消"></u-action-sheet>
			</view>
		</view>

		<!-- 无内容 -->
		<view class="blank" v-if="!postList.length" :style="{height: pageHeight}">
			<explore :tipsTitle="tips.title" :tipsName="tips.name"></explore>
		</view>

		<!-- 底部编辑区域 -->
		<!--		<view class="edit" v-if="postList.length">-->
		<!--			<u-icon name="trash" size="28" color="#3faae2"></u-icon>-->
		<!--			<view @click="cleanList">清空全部</view>-->
		<!--		</view>-->
	</view>
</template>

<script>
import explore from '@/UI/explore/explore.vue'
import { getHistory } from '@/api/user/user.js'
import post from "@/UI/post/post.vue";
import { report } from "@/api/bbs/report";
import { delPost } from "@/api/bbs/post";

export default {
	data() {
		return {
			headerTop: '',
			tips: {
				title: '这个月的浏览地图还是空白呢~',
				name: '还没有浏览的痕迹捏~'
			},
			query: {
				currentPage: 0,
				pageSize: 10
			},
			postList: [],
			// 选中的帖子id
			postItemId: null,
			// 选中的帖子下表
			postIndex: null,
			// 帖子操作弹窗
			sheetShow: false,
			// 帖子操作弹窗
			sheetList: [{
				name: '举报帖子',
				id: 2
			}],
			// 判断是否正在获取列表数据
			isloading: false,
		}
	},
		onLoad() {
			this.getHistory();
		},
		methods: {
			// 滑动到页面底部触发加载
			scrollToBottom() {
				// 如果正在加载则不获取数据
				if (!this.isloading) {
						// 正在加载
						this.isloading = true; 
						// 当前页码 +1
						this.query.currentPage ++;
						// 请求下一页数据
						this.getHistory();
					}
			},
			// 获取浏览历史
			getHistory() {
				getHistory(this.query).then(res => {
					// 追加新页面数据到现有列表
					this.postList = [...this.postList, ...res.data.data.data];
					// 加载完成
					this.isloading = false;
				})
			},
			//获取post传来的show值
			getPostId(e) {
				this.postItemId = e.id;
				this.postIndex = e.postIndex
				if (e.isCreator) {
					this.$set(this.sheetList, 0, {
						name: '删除帖子',
						id: 1
					})
				} else {
					this.$set(this.sheetList, 0, {
						name: '举报帖子',
						id: 2
					})
				}
				this.sheetShow = !this.sheetShow;
			},
			//点击更多弹窗框选项
			selectClick(e) {
				if (e.name === '举报帖子') {
					let param = {
						"reportType": "帖子",
						"targetId": this.postItemId,
						"reason": JSON.stringify(this.postList[this.postIndex])
					}
					report(param).then(res => {
						if (res.data.code === 'SUCCESS') {
							uni.showToast({
								title: '举报成功',
								icon: 'none'
							})
						}
					})
				} else {
					delPost(this.postItemId).then(res => {
						if (res.data.data) {
							this.postList.splice(this.postIndex, 1)
							uni.showToast({
								title: '删除成功',
								icon: 'none'
							})
						}
					})
				}
			},
			// 清空浏览记录
			cleanList() {
				if (this.postList.length) {
					uni.showModal({
						title: '三思而行',
						content: '是否确认删除所有浏览记录？',
						success: (res) => {
							if (res.confirm) {
								this.postList = []
							}
						}
					})
				}
			}
		},
		components: {
			explore,
			post
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #f5f6fa;
		height: 100%;
		.historyContent {
			width: 90%;
			margin: auto;
			box-sizing: border-box;
			padding: 20rpx;

			.title {
				font-size: 32rpx;
				font-weight: bold;
			}

			.content {
				// max-width: 11em;
				// white-space: nowrap;
				// overflow: hidden;
				// text-overflow: ellipsis;

				// word-break: break-all;
				// -webkit-box-orient: vertical;
				// -webkit-box-orient: 1;

				font-size: 28rpx;
				color: #828282;
				padding: 16rpx 0;
			}

			.info {
				display: flex;
				align-items: center;
				justify-content: left;

				.author {
					padding-left: 20rpx;
					font-weight: bold;
					font-size: 28rpx;
					color: #5f5f5f;
				}
			}
		}

		.blank {
			margin-top: 20rpx;
			text-align: center;

			.u-button {
				margin-top: 30rpx;
				width: 160rpx !important;
				height: 70rpx !important;
			}
		}

		.edit {
			padding: 20rpx 0;
			width: 100%;
			height: 130rpx;
			box-sizing: border-box;
			position: fixed;
			bottom: var(--window-bottom);
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>