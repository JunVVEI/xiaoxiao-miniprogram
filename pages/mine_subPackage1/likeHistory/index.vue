<template>
	<view class="container">
		<!-- 点赞历史内容 -->
		<view v-if="postList.length">
			<u-list @scrolltolower.stop="scrollToBottom">
				<u-list-item v-for="(item, index) in postList" :key="item.id">
					<post @post="getPostId" :postList="item" :postIndex="index" class="post-item" />
					<view style="height: 160rpx;" v-if="index === postList.length - 1" />
				</u-list-item>
				<u-loadmore bgColor="#f5f6fa" status="nomore" />
			</u-list>
			<!-- 帖子操作菜单 -->
			<view>
				<u-action-sheet @select="selectClick" :show="sheetShow" @close="sheetShow = false" :actions="sheetList"
					closeOnClickOverlay closeOnClickAction :round="10" cancelText="取消" />
			</view>
		</view>
		<!-- 无内容 -->
		<view class="blank" v-if="!postList.length" :style="{ height: pageHeight }">
			<explore :tipsTitle="tips.title" :tipsName="tips.name"></explore>
		</view>
	</view>
</template>

<script>
import explore from '@/UI/explore/explore.vue';
import post from "@/UI/post/post.vue";
import { report } from "@/api/bbs/report";
import { getLikeHistory, delPost } from "@/api/bbs/post";

export default {
	data() {
		return {
			headerTop: '',
			tips: {
				title: '这个月还没有小星星捏~',
				name: '暂时没有点赞足迹鸭~'
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
		this.getLikeHistory();
	},
	methods: {
		// 滑动到页面底部触发加载
		scrollToBottom() {
			// 如果正在加载则不获取数据
			if (!this.isloading) {
				// 正在加载
				this.isloading = true;
				// 当前页码 +1
				this.query.currentPage++;
				// 请求下一页数据
				this.getLikeHistory();
			}
		},
		// 获取点赞历史
		getLikeHistory() {
			getLikeHistory(this.query).then(res => {
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